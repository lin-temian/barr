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

function pickVoice(lang) {
  if (!supported) return null
  const voices = window.speechSynthesis.getVoices()
  return voices.find(v => v.lang === lang)
      || voices.find(v => v.lang && v.lang.startsWith(lang.split('-')[0]))
      || null
}

export function useSpeech() {
  const speaking = ref(false)

  function speak(text, lang = ARM_LANG) {
    if (!supported || !text) return
    window.speechSynthesis.cancel()
    const utter = new SpeechSynthesisUtterance(text)
    const voice = pickVoice(lang) || (lang === ARM_LANG ? pickVoice('ru-RU') : null)
    if (voice) utter.voice = voice
    utter.lang = voice ? voice.lang : lang
    utter.rate = 0.85
    utter.onstart = () => { speaking.value = true }
    utter.onend   = () => { speaking.value = false }
    utter.onerror = () => { speaking.value = false }
    window.speechSynthesis.speak(utter)
  }

  return { speak, speaking, supported, hasArmenianVoice }
}
