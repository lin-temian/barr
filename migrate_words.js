// migrate_words.js
// Запускать: node migrate_words.js
// Один раз загружает все слова из words.json в Firestore

import { initializeApp } from 'firebase/app'
import { getFirestore, collection, writeBatch, doc } from 'firebase/firestore'
import { readFileSync } from 'fs'

const firebaseConfig = {
  apiKey: "AIzaSyA8u0Cuy57I31Yi3i7gnBpfK7U3PvNQizE",
  authDomain: "barr-8f75d.firebaseapp.com",
  projectId: "barr-8f75d",
  storageBucket: "barr-8f75d.firebasestorage.app",
  messagingSenderId: "212851006412",
  appId: "1:212851006412:web:a2ff696ff7145fd39ddb69"
}

const app = initializeApp(firebaseConfig)
const db  = getFirestore(app)

const words = JSON.parse(readFileSync('./src/data/words.json', 'utf-8'))
console.log(`Загружаем ${words.length} слов в Firestore...`)

// Firestore batch — максимум 500 операций за раз
const BATCH_SIZE = 400

async function migrate() {
  let total = 0
  for (let i = 0; i < words.length; i += BATCH_SIZE) {
    const batch = writeBatch(db)
    const chunk = words.slice(i, i + BATCH_SIZE)
    
    for (const w of chunk) {
      const ref = doc(collection(db, 'words'))
      batch.set(ref, {
        id:       w.id,
        arm:      w.arm,
        translit: w.translit || w.tr || '',
        ru:       w.ru,
        cat:      w.cat || 'разное'
      })
    }
    
    await batch.commit()
    total += chunk.length
    console.log(`✓ Загружено ${total}/${words.length}`)
  }
  console.log('✅ Миграция завершена!')
  process.exit(0)
}

migrate().catch(e => {
  console.error('Ошибка:', e.message)
  process.exit(1)
})
