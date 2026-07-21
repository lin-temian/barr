// generate_examples.js
// Запускать: node --env-file=.env generate_examples.js [--collection=words] [--limit=N] [--ids=1,2,3] [--set=alphabet]
//
// Генерирует короткие предложения-примеры (A1-A2) для слов без exampleAm через обычную
// текстовую генерацию Gemini (НЕ TTS). Пишет exampleAm/exampleRu в Firestore через
// Admin SDK (нужен serviceAccountKey.json — см. README ниже). Идемпотентен: пропускает
// слова, у которых exampleAm уже есть.
//
// Ключ сервисного аккаунта: Firebase Console → Настройки проекта → Service accounts →
// Generate new private key → сохранить как serviceAccountKey.json в корне проекта
// (уже в .gitignore, в репозиторий не попадёт).

import { readFileSync } from 'fs'
import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

const GEMINI_KEY = process.env.GEMINI_API_KEY
if (!GEMINI_KEY) {
  console.error('Нет GEMINI_API_KEY. Запускай так: node --env-file=.env generate_examples.js')
  process.exit(1)
}

const KEY_PATH = process.env.FIREBASE_SERVICE_ACCOUNT || './serviceAccountKey.json'
let serviceAccount
try {
  serviceAccount = JSON.parse(readFileSync(KEY_PATH, 'utf-8'))
} catch (e) {
  console.error(`Не нашёл ключ сервисного аккаунта (${KEY_PATH}). См. инструкцию в шапке файла.`)
  process.exit(1)
}

const args = Object.fromEntries(process.argv.slice(2).map(a => {
  const [k, v] = a.replace(/^--/, '').split('=')
  return [k, v ?? true]
}))
const TARGET_COLLECTION = args.collection || 'words'
const LIMIT = args.limit ? Number(args.limit) : Infinity
const MODEL = 'gemini-flash-latest'

// то же множество id, что и в generate_audio.js — слова-примеры из карточек Алфавита
const ALPHABET_WORD_IDS = [
  600,128,17,45,81,165,153,55,326,41,66,16,313,15,430,22,110,355,588,47,
  174,741,418,719,95,5,680,102,68,218,40,152,310,23,34,156
]
const ID_FILTER = args.ids ? new Set(String(args.ids).split(',').map(Number))
  : (args.set === 'alphabet' ? new Set(ALPHABET_WORD_IDS) : null)

const app = initializeApp({ credential: cert(serviceAccount) })
const db  = getFirestore(app)

async function generateExample(word, attempt = 1) {
  const prompt = `Придумай одно короткое простое предложение уровня A1-A2 на армянском языке, ` +
    `обязательно содержащее слово «${word.arm}» (транслит: ${word.translit}, по-русски «${word.ru}») ` +
    `ровно в этой форме, без изменений. Дай точный перевод предложения на русский. ` +
    `Ответь строго JSON без markdown: {"exampleAm": "...", "exampleRu": "..."}`

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_KEY}`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: 'application/json' }
    })
  })
  if ((res.status === 429 || res.status === 503) && attempt <= 4) {
    const wait = 5000 * attempt
    console.log(`  ⏳ ${res.status}, жду ${wait}мс...`)
    await new Promise(r => setTimeout(r, wait))
    return generateExample(word, attempt + 1)
  }
  if (!res.ok) throw new Error(`Gemini ${res.status}: ${await res.text()}`)
  const data = await res.json()
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) throw new Error('Пустой ответ (finishReason: ' + (data.candidates?.[0]?.finishReason || '?') + ')')
  const match = text.match(/\{[\s\S]*\}/)
  if (!match) throw new Error('Не нашли JSON в ответе: ' + text.slice(0, 200))
  const parsed = JSON.parse(match[0])
  if (!parsed.exampleAm || !parsed.exampleRu) throw new Error('Ответ без exampleAm/exampleRu: ' + text)
  if (!parsed.exampleAm.includes(word.arm)) throw new Error(`Слово «${word.arm}» не встречается в сгенерированном предложении`)
  return parsed
}

async function run() {
  console.log(`Коллекция: ${TARGET_COLLECTION} · лимит: ${LIMIT === Infinity ? 'без ограничений' : LIMIT}${ID_FILTER ? ` · фильтр по id: ${ID_FILTER.size} шт.` : ''}`)
  const snap = await db.collection(TARGET_COLLECTION).get()
  let todo = snap.docs.filter(d => !d.data().exampleAm)
  if (ID_FILTER) todo = todo.filter(d => ID_FILTER.has(d.data().id))
  console.log(`Всего в базе: ${snap.docs.length}, без примера: ${todo.length}`)

  let done = 0
  for (const d of todo) {
    if (done >= LIMIT) break
    const w = d.data()
    if (!w.arm) continue
    try {
      const { exampleAm, exampleRu } = await generateExample(w)
      await d.ref.update({ exampleAm, exampleRu })
      done++
      console.log(`✓ [${done}/${Math.min(todo.length, LIMIT)}] ${w.arm}: ${exampleAm}`)
      if (done < Math.min(todo.length, LIMIT)) await new Promise(r => setTimeout(r, 1500))
    } catch (e) {
      console.error(`✗ ${w.arm}: ${e.message}`)
    }
  }
  console.log(`Готово. Заполнено примеров: ${done}`)
  process.exit(0)
}

run().catch(e => { console.error('Фатальная ошибка:', e); process.exit(1) })
