<template>
  <div class="review">
    <button class="rv-back" @click="$emit('go-tab','home')">← На главную</button>

    <div v-if="queue.length === 0" class="rv-empty">
      <div class="rv-empty-icon">✓</div>
      <div class="rv-empty-title">{{ mode==='weak' ? 'Слабых мест нет' : 'Нечего повторять' }}</div>
      <div class="rv-empty-text">{{ mode==='weak' ? 'Пока нет слов, которые даются тяжело — так держать.' : 'Все выученные слова ещё свежи в памяти. Загляни попозже.' }}</div>
    </div>

    <!-- ВЫБОР ДЛИТЕЛЬНОСТИ -->
    <div v-else-if="sessionState==='setup'" class="rv-setup">
      <div class="rv-setup-icon">{{ mode==='weak' ? '🎯' : '⏱️' }}</div>
      <div class="rv-setup-title">{{ mode==='weak' ? 'Повторить сложное' : 'Быстрая сессия' }}</div>
      <div class="rv-setup-text">{{ queue.length }} {{ wordForm(queue.length) }} в очереди. Сколько времени есть?</div>
      <div class="rv-dur-row">
        <button v-for="d in DURATIONS" :key="d" class="rv-dur-btn" :class="{on: duration===d}" @click="duration=d">{{ d }} мин</button>
      </div>
      <button class="rv-done-btn" @click="startSession">Начать →</button>
    </div>

    <div v-else-if="sessionState==='done'" class="rv-done">
      <div class="rv-done-icon">{{ timedOut ? '⏰' : '🎉' }}</div>
      <div class="rv-done-title">{{ timedOut ? 'Время вышло' : 'Готово!' }}</div>
      <div class="rv-done-text">
        Повторено: {{ answeredCount }} · верно: {{ correctCount }}
      </div>
      <div class="rv-done-sub">Следующие слова появятся здесь, когда придёт их время по графику повторений.</div>
      <button class="rv-done-btn" @click="$emit('go-tab','home')">На главную</button>
    </div>

    <div v-else class="rv-session">
      <div class="rv-progress">
        <span class="rv-progress-lbl">{{ idx+1 }} из {{ queue.length }}</span>
        <span class="rv-timer" v-if="timeLeftSec !== null">{{ formatTime(timeLeftSec) }}</span>
      </div>
      <div class="rv-bar"><div class="rv-fill" :style="{width: (idx/queue.length*100)+'%'}"></div></div>

      <div class="rv-card" @click="!revealed && (revealed = true)">
        <div class="rv-cat">{{ current.cat }}</div>
        <div class="rv-arm">{{ current.arm }}
          <button class="rv-play" v-if="current.audioUrl" title="Прослушать произношение" @click.stop="playWord(current)">▶</button>
        </div>
        <div class="rv-tr">{{ current.translit }}</div>

        <button v-if="hint && !hintShown" class="rv-hint-btn" @click.stop="hintShown=true">💡 Показать подсказку</button>
        <div v-if="hintShown" class="rv-hint-text" @click.stop>{{ hint }}</div>

        <transition name="rv-fade" mode="out-in">
          <div v-if="revealed" key="ru" class="rv-ru">{{ current.ru }}</div>
          <div v-else key="tap" class="rv-tap">нажми — узнай перевод</div>
        </transition>
      </div>

      <div class="rv-actions" :class="{visible: revealed}">
        <button class="rv-btn rv-no" @click="mark(false)">Не помню</button>
        <button class="rv-btn rv-yes" @click="mark(true)">Помню</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onActivated, onDeactivated } from 'vue'
import { useSpeech } from '../../composables/useSpeech.js'

const props = defineProps({ words: Array, mode: { type: String, default: 'due' }, mnemonics: { type: Object, default: () => ({}) } })
const emit  = defineEmits(['review', 'go-tab'])
const { playWord } = useSpeech()

const DURATIONS = [5, 10, 15]
const duration  = ref(5)

const queue    = ref([])
const idx      = ref(0)
const revealed = ref(false)
const hintShown = ref(false)

const sessionState = ref('setup') // 'setup' | 'active' | 'done'
const answeredCount = ref(0)
const correctCount  = ref(0)
const timedOut       = ref(false)
const timeLeftSec    = ref(null)
let timerInterval = null

onActivated(() => {
  queue.value = [...props.words]
  idx.value = 0
  revealed.value = false
  hintShown.value = false
  sessionState.value = 'setup'
  answeredCount.value = 0
  correctCount.value  = 0
  timedOut.value = false
  timeLeftSec.value = null
})
onDeactivated(stopTimer)

const current = computed(() => queue.value[idx.value])
const hint    = computed(() => current.value && props.mnemonics?.[current.value.id])

function wordForm(n) {
  const mod10 = n % 10, mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return 'слово'
  if ([2,3,4].includes(mod10) && ![12,13,14].includes(mod100)) return 'слова'
  return 'слов'
}
function formatTime(sec) {
  const m = Math.floor(sec / 60), s = sec % 60
  return `${m}:${String(s).padStart(2,'0')}`
}

function startSession() {
  sessionState.value = 'active'
  timeLeftSec.value = duration.value * 60
  timerInterval = setInterval(() => {
    timeLeftSec.value--
    if (timeLeftSec.value <= 0) {
      timedOut.value = true
      finishSession()
    }
  }, 1000)
}
function stopTimer() {
  clearInterval(timerInterval)
  timerInterval = null
}
function finishSession() {
  stopTimer()
  sessionState.value = 'done'
}

function mark(remembered) {
  emit('review', current.value.id, remembered)
  answeredCount.value++
  if (remembered) correctCount.value++
  revealed.value  = false
  hintShown.value = false
  idx.value++
  if (idx.value >= queue.value.length) finishSession()
}
</script>

<style scoped>
.review { padding: 16px; display: flex; flex-direction: column; gap: 14px; min-height: 70vh; }

.rv-back {
  background:var(--glass-bg); border: 1px solid var(--line); border-radius: 20px;
  font-family: var(--m); font-size: 10px;
  letter-spacing: 1px; text-transform: uppercase; color: var(--muted);
  cursor: pointer; padding: 8px 14px; align-self: flex-start; transition:.15s var(--spring);
  border-color:var(--glass-border);box-shadow:inset 0 1px 0 var(--glass-shine),0 4px 16px var(--glass-shadow);
}
.rv-back:hover { color: var(--red); border-color: var(--gold); }

/* ── ВЫБОР ДЛИТЕЛЬНОСТИ ── */
.rv-setup {
  flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center;
  text-align:center; gap:10px; padding:40px 20px;
}
.rv-setup-icon { font-size:44px; }
.rv-setup-title { font-family:var(--d); font-size:26px; font-style:italic; color:var(--red); }
.rv-setup-text { font-family:var(--s); font-size:14px; color:var(--muted); max-width:280px; }
.rv-dur-row { display:flex; gap:10px; margin:14px 0 6px; }
.rv-dur-btn {
  padding:12px 20px; border-radius:14px; border:1.5px solid var(--line);
  background:var(--glass-bg); font-family:var(--s); font-size:15px; font-weight:600; color:var(--ink);
  cursor:pointer; transition:.15s var(--spring); border-color:var(--glass-border);
}
.rv-dur-btn.on { background:var(--red); border-color:var(--red); color:var(--on-accent); }
.rv-dur-btn:hover:not(.on) { border-color:var(--gold); }

.rv-progress { display:flex; align-items:center; justify-content:space-between; }
.rv-progress-lbl { font-family:var(--m); font-size:10px; letter-spacing:1px; text-transform:uppercase; color:var(--muted); }
.rv-timer { font-family:var(--m); font-size:12px; font-weight:700; color:var(--gold); }
.rv-bar { height:6px; background:rgba(128,6,19,.15); border-radius:3px; }
.rv-fill { height:100%; background:var(--red); border-radius:3px; transition:width .3s var(--spring-soft); }

.rv-card {
  flex:1; min-height:260px;
  background:var(--glass-bg); border:1px solid var(--line); border-radius:20px;
  padding:32px 24px; cursor:pointer;
  display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; gap:6px;
  border-color:var(--glass-border);box-shadow:inset 0 1px 0 var(--glass-shine),0 4px 16px var(--glass-shadow);
}
.rv-cat { font-family:var(--m); font-size:9px; letter-spacing:2px; text-transform:uppercase; color:var(--gold); margin-bottom:10px; }
.rv-arm { font-family:var(--d); font-size:56px; font-style:italic; color:var(--red); line-height:1; display:flex; align-items:center; justify-content:center; gap:12px; }
.rv-play {
  width:34px; height:34px; border-radius:50%; flex-shrink:0;
  border:1px solid var(--line); background:transparent;
  font-size:13px; color:var(--muted); cursor:pointer;
  display:flex; align-items:center; justify-content:center; padding-left:2px;
  transition:.15s var(--spring);
}
.rv-play:hover { border-color:var(--gold); color:var(--gold); }
.rv-tr  { font-family:var(--m); font-size:13px; color:var(--muted); margin-top:6px; }
.rv-tap { font-family:var(--s); font-size:12px; color:var(--muted); margin-top:14px; font-style:italic; opacity:.7; }
.rv-ru  { font-family:var(--d); font-size:32px; font-weight:700; color:var(--ink); margin-top:14px; }
.rv-fade-enter-active, .rv-fade-leave-active { transition: opacity .18s; }
.rv-fade-enter-from, .rv-fade-leave-to { opacity:0; }

.rv-hint-btn {
  margin-top:12px; background:none; border:1px dashed rgba(246,140,54,.5); border-radius:20px;
  font-family:var(--m); font-size:10px; letter-spacing:1px; color:var(--gold);
  cursor:pointer; padding:6px 14px; transition:.15s var(--spring);
}
.rv-hint-btn:hover { background:rgba(246,140,54,.1); }
.rv-hint-text {
  margin-top:12px; padding:10px 14px; border-radius:12px;
  background:rgba(246,140,54,.08); font-family:var(--s); font-size:13px; color:var(--ink); font-style:italic;
  max-width:100%;
}

.rv-actions { display:grid; grid-template-columns:1fr 1fr; gap:12px; opacity:0; pointer-events:none; transition:opacity .2s; }
.rv-actions.visible { opacity:1; pointer-events:auto; }
.rv-btn {
  padding:16px; border-radius:14px; border:1px solid var(--line);
  font-family:var(--s); font-size:15px; font-weight:600; cursor:pointer; transition:.15s var(--spring);
  background:var(--glass-bg); border-color:var(--glass-border);
}
.rv-no { color:var(--red); }
.rv-no:hover { border-color:var(--red); }
.rv-yes { color:var(--ok); }
.rv-yes:hover { border-color:var(--ok); }

.rv-empty, .rv-done {
  flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center;
  text-align:center; gap:8px; padding:40px 20px;
}
.rv-empty-icon, .rv-done-icon { font-size:44px; margin-bottom:8px; }
.rv-empty-title, .rv-done-title { font-family:var(--d); font-size:24px; font-style:italic; color:var(--red); }
.rv-empty-text, .rv-done-text { font-family:var(--s); font-size:14px; color:var(--muted); max-width:280px; }
.rv-done-sub { font-family:var(--s); font-size:12px; color:var(--muted); opacity:.75; max-width:260px; margin-top:-4px; }
.rv-done-btn {
  margin-top:16px; padding:12px 28px; border-radius:14px; border:none;
  background:var(--ink); color:var(--bg); font-family:var(--s); font-size:14px; font-weight:600;
  cursor:pointer; transition:opacity .2s;
}
.rv-done-btn:hover { opacity:.9; }

[data-theme=dark] .rv-back,
[data-theme=dark] .rv-card,
[data-theme=dark] .rv-btn,
[data-theme=dark] .rv-dur-btn { background: rgba(24,16,8,.94) !important; border-color: rgba(246,140,54,.2) !important; }
[data-theme=amoled] .rv-back,
[data-theme=amoled] .rv-card,
[data-theme=amoled] .rv-btn,
[data-theme=amoled] .rv-dur-btn { background: rgba(0,0,0,.95) !important; }
</style>
