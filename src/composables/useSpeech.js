import { ref } from 'vue'

const ARM_LANG = 'hy-AM'

const supported = typeof window !== 'undefined' && 'speechSynthesis' in window
const hasArmenianVoice = ref(false)

function refreshVoices() {
  if (!supported) return
  const voices = window.speechSynthesis.getVoices()
  hasArmenianVoice.value = voices.some(v => v.lang === ARM_LANG)
}

if (supported) {
  refreshVoices()
  window.speechSynthesis.onvoiceschanged = refreshVoices
}

export function useSpeech() {
  const speaking = ref(false)

  function speak(text, lang = ARM_LANG) {
    if (!supported || !text) return

    const doSpeak = () => {
      const utter = new SpeechSynthesisUtterance(text)
      utter.lang = lang
      utter.rate = 0.85
      utter.volume = 1
      utter.onstart = () => { speaking.value = true }
      utter.onend   = () => { speaking.value = false }
      utter.onerror = () => { speaking.value = false }
      window.speechSynthesis.speak(utter)
    }

    // cancel() сразу перед speak() в Chrome часто "проглатывает" саму озвучку —
    // даём очереди синтеза время обработать отмену перед новым вызовом
    if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
      window.speechSynthesis.cancel()
      setTimeout(doSpeak, 60)
    } else {
      doSpeak()
    }
  }

  // Без армянского голоса читать армянский текст бесполезно — голос его просто
  // не произносит (проверено: та же фраза кириллицей звучит, армянским текстом — тишина).
  // Поэтому без hy-AM озвучиваем транслитерацию латиницей, а не сам армянский текст.
  function speakWord(word) {
    if (!word) return
    if (hasArmenianVoice.value) speak(word.arm, ARM_LANG)
    else speak(word.translit || word.arm, 'ru-RU')
  }

  // Слово с записанным audioUrl (mp3) проигрывается напрямую, иначе — синтез речи
  function playWord(word) {
    if (!word) return
    if (word.audioUrl) {
      speaking.value = true
      const audio = new Audio(word.audioUrl)
      audio.onended = () => { speaking.value = false }
      audio.onerror = () => { speaking.value = false; speakWord(word) }
      audio.play().catch(() => { speaking.value = false; speakWord(word) })
    } else {
      speakWord(word)
    }
  }

  return { speak, playWord, speaking, supported, hasArmenianVoice }
}
