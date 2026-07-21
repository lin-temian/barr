// generate_audio.js
// Запускать: node --env-file=.env generate_audio.js [--collection=words|phrases] [--limit=N] [--voice=Kore] [--ids=1,2,3] [--set=alphabet]
//
// Озвучивает армянские слова/фразы через Gemini TTS, заливает wav в Firebase Storage
// и проставляет audioUrl в соответствующем документе Firestore через Admin SDK (нужен
// serviceAccountKey.json — см. README ниже). Пропускает записи, у которых audioUrl уже
// есть — скрипт можно безопасно перезапускать частями.
//
// Бесплатный тариф gemini-2.5-flash-preview-tts даёт всего 3 запроса/минуту и 10/день,
// поэтому для полного словаря рассчитывай на запуск порциями по дням.
//
// Ключ сервисного аккаунта: Firebase Console → Настройки проекта → Service accounts →
// Generate new private key → сохранить как serviceAccountKey.json в корне проекта
// (уже в .gitignore, в репозиторий не попадёт).

import { readFileSync } from 'fs'
import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { getStorage } from 'firebase-admin/storage'

const GEMINI_KEY = process.env.GEMINI_API_KEY
if (!GEMINI_KEY) {
  console.error('Нет GEMINI_API_KEY. Запускай так: node --env-file=.env generate_audio.js')
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
const VOICE = args.voice || 'Kore'
const MODEL = 'gemini-2.5-flash-preview-tts'

// Слова-примеры из карточек Алфавита (AlphabetTab.vue) — тот самый "ключевой набор"
const ALPHABET_WORD_IDS = [
  600,128,17,45,81,165,153,55,326,41,66,16,313,15,430,22,110,355,588,47,
  174,741,418,719,95,5,680,102,68,218,40,152,310,23,34,156
]
const ID_FILTER = args.ids ? new Set(String(args.ids).split(',').map(Number))
  : (args.set === 'alphabet' ? new Set(ALPHABET_WORD_IDS) : null)
const REQUEST_GAP_MS = 21000 // бесплатный тариф: 3 запроса/минуту

const BUCKET_NAME = 'barr-8f75d.firebasestorage.app'
const app     = initializeApp({ credential: cert(serviceAccount), storageBucket: BUCKET_NAME })
const db      = getFirestore(app)
const bucket  = getStorage(app).bucket()

function pcmToWav(pcmBuffer, sampleRate = 24000, numChannels = 1, bitsPerSample = 16) {
  const byteRate = sampleRate * numChannels * bitsPerSample / 8
  const blockAlign = numChannels * bitsPerSample / 8
  const dataSize = pcmBuffer.length
  const buf = Buffer.alloc(44 + dataSize)
  buf.write('RIFF', 0)
  buf.writeUInt32LE(36 + dataSize, 4)
  buf.write('WAVE', 8)
  buf.write('fmt ', 12)
  buf.writeUInt32LE(16, 16)
  buf.writeUInt16LE(1, 20)
  buf.writeUInt16LE(numChannels, 22)
  buf.writeUInt32LE(sampleRate, 24)
  buf.writeUInt32LE(byteRate, 28)
  buf.writeUInt16LE(blockAlign, 32)
  buf.writeUInt16LE(bitsPerSample, 34)
  buf.write('data', 36)
  buf.writeUInt32LE(dataSize, 40)
  pcmBuffer.copy(buf, 44)
  return buf
}

async function synth(word, attempt = 1) {
  // Голое слово без контекста модель часто "проглатывает" (finishReason: OTHER, без звука) —
  // формулировка-инструкция заставляет её реально произнести слово, а не решать, что сказать.
  const promptText = `Скажи это армянское слово вслух чётко и естественно: ${word}`
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_KEY}`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: promptText }] }],
      generationConfig: {
        responseModalities: ['AUDIO'],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: VOICE } } }
      }
    })
  })
  if ((res.status === 429 || res.status === 503) && attempt <= 4) {
    const wait = 15000 * attempt
    console.log(`  ⏳ ${res.status}, жду ${wait}мс...`)
    await new Promise(r => setTimeout(r, wait))
    return synth(word, attempt + 1)
  }
  if (!res.ok) throw new Error(`Gemini TTS ${res.status}: ${await res.text()}`)
  const data = await res.json()
  const b64 = data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data
  if (!b64) throw new Error('Пустой ответ TTS (finishReason: ' + (data.candidates?.[0]?.finishReason || '?') + ')')
  return pcmToWav(Buffer.from(b64, 'base64'))
}

async function uploadAudio(collectionName, safeId, wavBuffer) {
  const filePath = `audio/${collectionName}/${safeId}.wav`
  const file = bucket.file(filePath)
  await file.save(wavBuffer, { contentType: 'audio/wav' })
  await file.makePublic()
  return `https://storage.googleapis.com/${bucket.name}/${filePath}`
}

function slug(s) {
  return s.replace(/[^\p{L}\p{N}]+/gu, '_').slice(0, 40)
}

async function run() {
  console.log(`Коллекция: ${TARGET_COLLECTION} · голос: ${VOICE} · лимит: ${LIMIT === Infinity ? 'без ограничений' : LIMIT}${ID_FILTER ? ` · фильтр по id: ${ID_FILTER.size} шт.` : ''}`)
  const snap = await db.collection(TARGET_COLLECTION).get()
  let todo = snap.docs.filter(d => !d.data().audioUrl)
  if (ID_FILTER) todo = todo.filter(d => ID_FILTER.has(d.data().id))
  console.log(`Всего в базе: ${snap.docs.length}, к озвучке: ${todo.length}`)

  let done = 0
  for (const d of todo) {
    if (done >= LIMIT) break
    const w = d.data()
    const text = w.arm
    if (!text) continue
    try {
      const wav = await synth(text)
      const url = await uploadAudio(TARGET_COLLECTION, `${d.id}_${slug(text)}`, wav)
      await d.ref.update({ audioUrl: url })
      done++
      console.log(`✓ [${done}/${Math.min(todo.length, LIMIT)}] ${text} → ${url}`)
      if (done < Math.min(todo.length, LIMIT)) await new Promise(r => setTimeout(r, REQUEST_GAP_MS))
    } catch (e) {
      console.error(`✗ ${text}: ${e.message}`)
    }
  }
  console.log(`Готово. Озвучено: ${done}`)
  process.exit(0)
}

run().catch(e => { console.error('Фатальная ошибка:', e); process.exit(1) })
