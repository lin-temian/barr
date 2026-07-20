<template>
  <div class="pc">
    <div class="pc-label">✦ Проверь произношение</div>

    <div v-if="!supported" class="pc-unsupported">
      Распознавание речи не поддерживается в этом браузере. Попробуй Chrome на компьютере или телефоне.
    </div>

    <template v-else>
      <div class="pc-target">
        <span class="pc-arm">{{ word.arm }}</span>
        <button class="pc-play" v-if="word.audioUrl" @click="playWord(word)">▶</button>
      </div>
      <div class="pc-tr">{{ word.translit }}</div>

      <button class="pc-mic" :class="{listening}" @click="toggleListen">
        {{ listening ? '● Слушаю…' : '🎤 Говорить' }}
      </button>

      <transition name="pc-fade">
        <div v-if="result" class="pc-result" :class="result.ok ? 'ok' : 'bad'">
          <div class="pc-result-title">{{ result.ok ? 'Похоже, верно!' : 'Не совсем совпало' }}</div>
          <div class="pc-heard">Услышано: «{{ result.heard || '—' }}»</div>
        </div>
      </transition>
    </template>
  </div>
</template>

<script setup>
import { ref, onBeforeUnmount } from 'vue'
import { useSpeech } from '../composables/useSpeech.js'

const props = defineProps({ word: Object })
const emit  = defineEmits(['result'])
const { playWord } = useSpeech()

const SR = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition)
const supported = !!SR

const listening = ref(false)
const result    = ref(null)
let recognition = null

function normalize(s) {
  return (s || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-zա-ֆ]/gi, '')
}

// Левенштейн для нечёткого сравнения услышанного с транслитерацией
function similarity(a, b) {
  a = normalize(a); b = normalize(b)
  if (!a || !b) return 0
  const dp = Array.from({length: a.length+1}, (_, i) => [i, ...Array(b.length).fill(0)])
  for (let j = 0; j <= b.length; j++) dp[0][j] = j
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = a[i-1] === b[j-1]
        ? dp[i-1][j-1]
        : 1 + Math.min(dp[i-1][j-1], dp[i-1][j], dp[i][j-1])
    }
  }
  const dist = dp[a.length][b.length]
  return 1 - dist / Math.max(a.length, b.length)
}

function toggleListen() {
  if (listening.value) { recognition?.stop(); return }
  if (!supported) return

  recognition = new SR()
  recognition.lang = 'hy-AM'
  recognition.interimResults = false
  recognition.maxAlternatives = 1

  recognition.onstart = () => { listening.value = true; result.value = null }
  recognition.onerror  = () => { listening.value = false }
  recognition.onend    = () => { listening.value = false }
  recognition.onresult = (e) => {
    const heard = e.results[0]?.[0]?.transcript || ''
    const score = Math.max(similarity(heard, props.word.translit), similarity(heard, props.word.arm))
    const ok = score >= 0.55
    result.value = { heard, ok, score }
    emit('result', ok)
  }

  recognition.start()
}

onBeforeUnmount(() => recognition?.stop())
</script>

<style scoped>
.pc {
  background:var(--glass-bg); border:1px solid var(--line); border-radius:16px;
  padding:20px; margin-top:16px; text-align:center;
  border-color:var(--glass-border);
}
.pc-label { font-family:var(--m); font-size:9px; letter-spacing:2px; text-transform:uppercase; color:var(--blue); margin-bottom:14px; }
.pc-unsupported { font-family:var(--s); font-size:13px; color:var(--muted); line-height:1.5; }
.pc-target { display:flex; align-items:center; justify-content:center; gap:10px; }
.pc-arm { font-family:var(--d); font-size:32px; font-style:italic; color:var(--red); }
.pc-play {
  width:30px; height:30px; border-radius:50%; flex-shrink:0;
  border:1px solid var(--line); background:transparent;
  font-size:11px; color:var(--muted); cursor:pointer;
  display:flex; align-items:center; justify-content:center; padding-left:2px;
}
.pc-play:hover { border-color:var(--gold); color:var(--gold); }
.pc-tr { font-family:var(--m); font-size:12px; color:var(--muted); margin-top:4px; }
.pc-mic {
  margin-top:16px; padding:12px 24px; border-radius:20px; border:1px solid var(--line);
  background:var(--bg2); font-family:var(--s); font-size:14px; font-weight:600; color:var(--ink);
  cursor:pointer; transition:.15s var(--spring);
}
.pc-mic:hover { border-color:var(--gold); }
.pc-mic.listening { background:var(--red); border-color:var(--red); color:var(--on-accent); animation:pcPulse 1.2s ease-in-out infinite; }
@keyframes pcPulse { 0%,100%{opacity:1} 50%{opacity:.7} }
.pc-result { margin-top:14px; padding:12px; border-radius:12px; }
.pc-result.ok  { background:rgba(42,94,58,.1); }
.pc-result.bad { background:rgba(128,6,19,.08); }
.pc-result-title { font-family:var(--s); font-size:14px; font-weight:600; }
.pc-result.ok .pc-result-title  { color:var(--ok); }
.pc-result.bad .pc-result-title { color:var(--red); }
.pc-heard { font-family:var(--m); font-size:11px; color:var(--muted); margin-top:4px; }
.pc-fade-enter-active { transition:opacity .2s; }
.pc-fade-enter-from { opacity:0; }

[data-theme=dark] .pc,
[data-theme=amoled] .pc { background:rgba(24,16,8,.94) !important; border-color:rgba(246,140,54,.2) !important; }
</style>
