<template>
  <div class="cg">
    <!-- ══ КАРТА УРОВНЕЙ ══ -->
    <div v-if="screen==='map'" class="cg-map">
      <div class="cg-map-hd">
        <div class="cg-map-title">Курс: 30 шагов</div>
        <div class="cg-map-sub">Пройди уровень минимум на 4/6, чтобы открыть следующий</div>
      </div>
      <div class="cg-grid">
        <button v-for="l in lessons" :key="l.id"
          class="cg-node"
          :class="{locked: l.id > progress.unlocked, done: (progress.stars[l.id]||0) > 0}"
          :disabled="l.id > progress.unlocked"
          @click="openIntro(l)">
          <span v-if="l.id > progress.unlocked" class="cg-node-lock">🔒</span>
          <span v-else class="cg-node-num">{{ l.id }}</span>
          <span class="cg-node-stars" v-if="progress.stars[l.id]">{{ '★'.repeat(progress.stars[l.id]) }}</span>
        </button>
      </div>
    </div>

    <!-- ══ ЭКРАН ПЕРЕД УРОВНЕМ ══ -->
    <div v-else-if="screen==='intro'" class="cg-intro">
      <button class="cg-back" @click="screen='map'">← К карте</button>
      <div class="cg-intro-num">Урок {{ activeLesson.id }} / 30</div>
      <div class="cg-intro-title">{{ activeLesson.title }}</div>
      <div class="cg-intro-theory">{{ activeLesson.theory }}</div>
      <div class="cg-intro-stats">
        <div class="cis"><div class="cis-n">{{ activeLesson.vocab.length }}</div><div class="cis-l">слов</div></div>
        <div class="cis"><div class="cis-n">6</div><div class="cis-l">вопросов</div></div>
        <div class="cis" v-if="progress.stars[activeLesson.id]">
          <div class="cis-n">{{ '★'.repeat(progress.stars[activeLesson.id]) }}</div><div class="cis-l">лучший результат</div>
        </div>
      </div>
      <button class="cg-start-btn" @click="startQuiz">Начать игру →</button>
    </div>

    <!-- ══ КВИЗ ══ -->
    <div v-else-if="screen==='quiz'" class="cg-quiz">
      <div class="cg-quiz-top">
        <span class="cg-quiz-lbl">{{ qIdx + 1 }} / {{ quiz.length }}</span>
        <span class="cg-quiz-score">✓ {{ score }}</span>
      </div>
      <div class="cg-timer-track"><div class="cg-timer-bar" :style="{width: timerPct+'%', background: timerPct<35?'var(--red)':'var(--ok)'}"></div></div>

      <div class="cg-qcard">
        <div class="cg-qtype">{{ typeLabel(current.type) }}</div>
        <div class="cg-qprompt">{{ current.prompt }}</div>
        <div class="cg-qsub" v-if="current.sub">{{ current.sub }}</div>
        <div class="cg-fb" :class="fb.cls">{{ fb.text }}</div>
      </div>

      <div class="cg-opts">
        <button v-for="opt in current.options" :key="opt"
          class="cg-opt" :class="{ok: answered && opt===current.answer, bad: answered && chosen===opt && opt!==current.answer}"
          :disabled="answered"
          @click="check(opt)">{{ opt }}</button>
      </div>

      <button class="cg-next-btn" v-if="answered" @click="nextQuestion">
        {{ qIdx + 1 < quiz.length ? 'Дальше →' : 'Итоги →' }}
      </button>
    </div>

    <!-- ══ ИТОГИ ══ -->
    <div v-else-if="screen==='result'" class="cg-result">
      <div class="cg-result-stars">{{ resultStars > 0 ? '★'.repeat(resultStars) + '☆'.repeat(3-resultStars) : '☆☆☆' }}</div>
      <div class="cg-result-title">{{ passed ? 'Уровень пройден!' : 'Почти получилось' }}</div>
      <div class="cg-result-score">{{ score }} / {{ quiz.length }} правильно</div>
      <div class="cg-result-note" v-if="!passed">Нужно минимум 4 из 6, чтобы открыть следующий урок</div>
      <div class="cg-result-btns">
        <button class="cg-result-btn outline" @click="openIntro(activeLesson)">Повторить</button>
        <button class="cg-result-btn" @click="screen='map'">К карте</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import lessonsData from '../data/lessons30.json'
import { LESSON_QUESTIONS } from '../data/lessons30-questions.js'

const lessons = lessonsData

const PROGRESS_KEY = 'barr_course_progress'
function loadProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(PROGRESS_KEY) || 'null')
    if (saved && typeof saved.unlocked === 'number') return saved
  } catch (e) {}
  return { unlocked: 1, stars: {} }
}
const progress = ref(loadProgress())
function saveProgress() {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress.value))
}

const screen = ref('map') // 'map' | 'intro' | 'quiz' | 'result'
const activeLesson = ref(null)

function openIntro(lesson) {
  activeLesson.value = lesson
  screen.value = 'intro'
}

// ── ГЕНЕРАЦИЯ ВОПРОСОВ ──────────────────────────────────────
function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5) }

function vocabQFrom(correct, lesson, direction) {
  const distractorPool = lesson.vocab.filter(v => v !== correct)
  const distractors = shuffle(distractorPool).slice(0, 3)
  const options = shuffle([correct, ...distractors])
  return direction === 'toRu'
    ? { type: 'vocab', prompt: correct.arm, sub: '', options: options.map(o => o.ru), answer: correct.ru }
    : { type: 'vocab', prompt: correct.ru, sub: '', options: options.map(o => o.arm), answer: correct.arm }
}

function clozeQuestion(lesson) {
  const candidates = lesson.examples
    .map(ex => {
      const words = ex.arm.split(/\s+/)
      const vocabWord = lesson.vocab.find(v => words.some(w => w.replace(/[.,:!?]/g, '') === v.arm))
      return vocabWord ? { ex, vocabWord } : null
    })
    .filter(Boolean)
  if (!candidates.length) return null
  const { ex, vocabWord } = candidates[Math.floor(Math.random() * candidates.length)]
  const blanked = ex.arm.split(/\s+/).map(w => (w.replace(/[.,:!?]/g, '') === vocabWord.arm ? '______' : w)).join(' ')
  const distractors = shuffle(lesson.vocab.filter(v => v.arm !== vocabWord.arm)).slice(0, 3).map(v => v.arm)
  const options = shuffle([vocabWord.arm, ...distractors])
  return { type: 'cloze', prompt: blanked, sub: ex.ru, options, answer: vocabWord.arm }
}

function grammarQuestion(lesson) {
  const q = LESSON_QUESTIONS.find(q => q.lessonId === lesson.id)
  if (!q) return null
  return { type: 'grammar', prompt: q.prompt, sub: '', options: shuffle(q.options), answer: q.answer }
}

function buildQuiz(lesson) {
  const sv = shuffle(lesson.vocab)
  const qs = [
    vocabQFrom(sv[0], lesson, 'toRu'),
    vocabQFrom(sv[1], lesson, 'toRu'),
    vocabQFrom(sv[2], lesson, 'toArm'),
    clozeQuestion(lesson) || vocabQFrom(sv[3], lesson, 'toArm'),
    grammarQuestion(lesson) || vocabQFrom(sv[4] || sv[0], lesson, 'toRu'),
    vocabQFrom(sv[4] || sv[0], lesson, 'toRu'),
  ]
  return qs
}

function typeLabel(type) {
  return { vocab: 'Перевод', cloze: 'Заполни пропуск', grammar: 'Грамматика' }[type] || ''
}

// ── СЕССИЯ КВИЗА ──────────────────────────────────────────────
const quiz = ref([])
const qIdx = ref(0)
const score = ref(0)
const answered = ref(false)
const chosen = ref(null)
const fb = ref({ text: '', cls: '' })
const timerPct = ref(100)
let timerVal = 15, timerInterval = null

const current = computed(() => quiz.value[qIdx.value])

function startQuiz() {
  quiz.value = buildQuiz(activeLesson.value)
  qIdx.value = 0
  score.value = 0
  screen.value = 'quiz'
  askQuestion()
}

function askQuestion() {
  answered.value = false
  chosen.value = null
  fb.value = { text: '', cls: '' }
  clearInterval(timerInterval)
  timerVal = 15
  timerPct.value = 100
  timerInterval = setInterval(() => {
    timerVal--
    timerPct.value = timerVal / 15 * 100
    if (timerVal <= 0) { clearInterval(timerInterval); if (!answered.value) check(null) }
  }, 1000)
}

function check(opt) {
  if (answered.value) return
  answered.value = true
  chosen.value = opt
  clearInterval(timerInterval)
  if (opt === current.value.answer) {
    score.value++
    fb.value = { text: shuffle(['Правильно!', 'Верно!', 'Отлично!'])[0], cls: 'ok' }
  } else {
    fb.value = { text: opt ? `Нет — верно «${current.value.answer}»` : `Время! Верно «${current.value.answer}»`, cls: 'bad' }
  }
}

function nextQuestion() {
  if (qIdx.value + 1 < quiz.value.length) {
    qIdx.value++
    askQuestion()
  } else {
    finishQuiz()
  }
}

const passed = computed(() => score.value >= 4)
const resultStars = computed(() => {
  if (score.value >= 6) return 3
  if (score.value >= 5) return 2
  if (score.value >= 4) return 1
  return 0
})

function finishQuiz() {
  clearInterval(timerInterval)
  const id = activeLesson.value.id
  const prevStars = progress.value.stars[id] || 0
  if (resultStars.value > prevStars) {
    progress.value.stars = { ...progress.value.stars, [id]: resultStars.value }
  }
  if (passed.value && id + 1 > progress.value.unlocked) {
    progress.value.unlocked = Math.min(id + 1, 30)
  }
  saveProgress()
  screen.value = 'result'
}
</script>

<style scoped>
.cg { padding: 16px; }

/* КАРТА */
.cg-map-hd { margin-bottom: 16px; }
.cg-map-title { font-family: var(--d); font-size: 26px; font-style: italic; color: var(--red); }
.cg-map-sub { font-family: var(--s); font-size: 12px; color: var(--muted); margin-top: 4px; }
.cg-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; }
.cg-node {
  aspect-ratio: 1; border-radius: 50%; border: 2px solid var(--line2);
  background: var(--glass-bg); display: flex; flex-direction: column; align-items: center; justify-content: center;
  cursor: pointer; transition: .15s var(--spring); position: relative;
  box-shadow: inset 0 1px 0 var(--glass-shine), 0 4px 16px var(--glass-shadow);
  backdrop-filter: var(--glass-blur); -webkit-backdrop-filter: var(--glass-blur);
}
.cg-node:hover:not(:disabled) { border-color: var(--gold); transform: scale(1.05); }
.cg-node:disabled { cursor: default; opacity: .5; }
.cg-node-num { font-family: var(--d); font-size: 20px; font-weight: 700; color: var(--red); }
.cg-node-lock { font-size: 16px; }
.cg-node-stars { position: absolute; bottom: -14px; font-size: 9px; color: var(--gold); white-space: nowrap; }
.cg-node.done { border-color: var(--gold); background: rgba(246,140,54,.1); }

/* INTRO */
.cg-back {
  background: var(--glass-bg); border: 1px solid var(--line); border-radius: 20px;
  font-family: var(--m); font-size: 10px; letter-spacing: 1px; text-transform: uppercase; color: var(--muted);
  cursor: pointer; padding: 8px 14px; margin-bottom: 16px;
}
.cg-back:hover { color: var(--red); border-color: var(--gold); }
.cg-intro-num { font-family: var(--m); font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: var(--gold); }
.cg-intro-title { font-family: var(--d); font-size: 26px; font-style: italic; color: var(--red); margin: 6px 0 14px; }
.cg-intro-theory {
  font-family: var(--s); font-size: 14px; color: var(--ink); line-height: 1.6;
  background: var(--glass-bg); border: 1px solid var(--line); border-radius: 14px; padding: 16px; margin-bottom: 16px;
}
.cg-intro-stats { display: flex; gap: 10px; margin-bottom: 20px; }
.cis { flex: 1; text-align: center; background: var(--glass-bg); border: 1px solid var(--line); border-radius: 12px; padding: 12px; }
.cis-n { font-family: var(--d); font-size: 20px; font-weight: 700; color: var(--red); }
.cis-l { font-family: var(--m); font-size: 9px; letter-spacing: 1px; text-transform: uppercase; color: var(--muted); margin-top: 2px; }
.cg-start-btn {
  width: 100%; padding: 16px; background: var(--red); border: none; border-radius: 14px;
  color: var(--on-accent); font-family: var(--d); font-size: 18px; font-style: italic; cursor: pointer; transition: .2s var(--spring);
}
.cg-start-btn:hover { opacity: .9; }

/* QUIZ */
.cg-quiz-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.cg-quiz-lbl { font-family: var(--m); font-size: 11px; color: var(--muted); }
.cg-quiz-score { font-family: var(--m); font-size: 12px; font-weight: 700; color: var(--ok); }
.cg-timer-track { height: 3px; background: var(--line); border-radius: 2px; margin-bottom: 18px; }
.cg-timer-bar { height: 100%; border-radius: 2px; transition: width .1s linear, background .3s; }
.cg-qcard {
  border: 1.5px solid var(--line2); border-top: 3px solid var(--red); border-radius: 20px;
  padding: 28px 20px; text-align: center; background: var(--glass-bg); margin-bottom: 18px;
  box-shadow: inset 0 1px 0 var(--glass-shine), 0 4px 16px var(--glass-shadow);
}
.cg-qtype { font-family: var(--m); font-size: 9px; letter-spacing: 2px; text-transform: uppercase; color: var(--gold); margin-bottom: 14px; }
.cg-qprompt { font-family: var(--d); font-size: clamp(20px,5vw,32px); font-style: italic; color: var(--ink); line-height: 1.3; word-break: break-word; }
.cg-qsub { font-family: var(--s); font-size: 13px; color: var(--muted); margin-top: 8px; font-style: italic; }
.cg-fb { font-family: var(--d); font-size: 18px; font-style: italic; height: 26px; margin-top: 10px; }
.cg-fb.ok { color: var(--ok); } .cg-fb.bad { color: var(--red); }
.cg-opts { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.cg-opt {
  padding: 16px 12px; border: 1.5px solid var(--line2); border-radius: 14px; background: var(--glass-bg);
  font-family: var(--s); font-size: 15px; color: var(--ink); cursor: pointer; transition: .14s var(--spring); text-align: center;
}
.cg-opt:hover:not(:disabled) { border-color: var(--gold); }
.cg-opt.ok  { border-color: var(--ok);  background: rgba(42,94,58,.08);  color: var(--ok); }
.cg-opt.bad { border-color: var(--red); background: rgba(128,6,19,.08); color: var(--red); }
.cg-opt:disabled { cursor: default; }
.cg-next-btn {
  display: block; width: 100%; padding: 16px; background: var(--ink); border: none; border-radius: 14px;
  color: var(--bg); font-family: var(--s); font-size: 15px; font-style: italic; cursor: pointer; margin-top: 14px;
}
.cg-next-btn:hover { background: var(--red); }

/* RESULT */
.cg-result { text-align: center; padding: 40px 20px; display: flex; flex-direction: column; align-items: center; gap: 8px; }
.cg-result-stars { font-size: 40px; color: var(--gold); letter-spacing: 4px; }
.cg-result-title { font-family: var(--d); font-size: 26px; font-style: italic; color: var(--red); }
.cg-result-score { font-family: var(--s); font-size: 16px; color: var(--ink); }
.cg-result-note { font-family: var(--s); font-size: 12px; color: var(--muted); max-width: 260px; }
.cg-result-btns { display: flex; gap: 10px; margin-top: 16px; width: 100%; max-width: 320px; }
.cg-result-btn {
  flex: 1; padding: 14px; border-radius: 14px; border: none; background: var(--red); color: var(--on-accent);
  font-family: var(--s); font-size: 14px; font-weight: 600; cursor: pointer; transition: opacity .2s;
}
.cg-result-btn.outline { background: transparent; border: 1.5px solid var(--red); color: var(--red); }
.cg-result-btn:hover { opacity: .88; }

[data-theme=dark] .cg-node, [data-theme=dark] .cg-intro-theory, [data-theme=dark] .cis,
[data-theme=dark] .cg-qcard, [data-theme=dark] .cg-opt, [data-theme=dark] .cg-back {
  background: rgba(24,16,8,.94) !important; border-color: rgba(246,140,54,.2) !important;
}
[data-theme=amoled] .cg-node, [data-theme=amoled] .cg-intro-theory, [data-theme=amoled] .cis,
[data-theme=amoled] .cg-qcard, [data-theme=amoled] .cg-opt, [data-theme=amoled] .cg-back {
  background: rgba(0,0,0,.95) !important;
}
</style>
