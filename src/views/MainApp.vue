<template>
  <div class="app-wrap">
    <div class="app-content">
      <KeepAlive>
        <HomeTab     v-if="tab==='home'"     :user="user" :words="words" :level="level" :learned="learned" :streak="streak" :due-count="dueWords.length" :weak-count="weakWords.length" :daily-goal="dailyGoal" :learned-today="learnedToday" :streak-freezes="streakFreezes" :learnedAlpha="learnedAlpha" @go-tab="handleGoTab" @go-weak-review="startWeakReview" />
        <LearnTab    v-else-if="tab==='learn'"    :words="words" :level="level" @open-alphabet="alphaOpen = true" />
        <DictTab     v-else-if="tab==='dict'"     :words="words" :learned="learned" :mnemonics="mnemonics" @toggle-learn="toggleLearn" @save-mnemonic="saveMnemonic" />
        <PracticeTab v-else-if="tab==='practice'" :words="words" />
        <ReviewTab   v-else-if="tab==='review'"   :words="reviewQueue" :mode="reviewMode" :mnemonics="mnemonics" @review="reviewWord" @go-tab="tab=$event" />
        <AdminPanel  v-else-if="tab==='admin'" :words="words" @words-updated="$emit('reload-words')" />
        <ProfileTab  v-else-if="tab==='profile'"  :user="user" :learned="learned" :streak="streak" :level="level" :learnedAlpha="learnedAlpha" :daily-goal="dailyGoal" @logout="handleLogout" @change-level="handleChangeLevel" @change-daily-goal="setDailyGoal" />
      </KeepAlive>
    </div>

    <!-- ALPHABET MODAL -->
    <AlphabetTab
      :isOpen="alphaOpen"
      v-model:learnedAlpha="learnedAlpha"
      @close="alphaOpen = false"
    />

    <nav class="tabbar" ref="tabbarEl">
      <div class="tab-indicator" ref="indicatorEl"></div>

      <!-- АЛФАВИТ — центральная кнопка -->
      <button class="tabbar-btn alpha-fab" @click="alphaOpen = true" :class="{active: alphaOpen}" ref="alphaBtnRef" data-key="alpha">
        <span class="alpha-fab-letter">Ա</span>
        <span class="tabbar-label">Алфавит</span>
      </button>

      <button v-for="t in tabs" :key="t.id"
        class="tabbar-btn" :class="{active: tab===t.id}"
        @click="tab=t.id" ref="tabBtnRefs" :data-key="t.id">
        <svg class="tab-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path :d="t.icon"/>
        </svg>
        <span class="tabbar-label">{{ t.label }}</span>
      </button>
      <button v-if="isAdmin" class="tabbar-btn admin-btn" :class="{active: tab==='admin'}" @click="tab='admin'" ref="adminBtnRef" data-key="admin">
      <span class="tabbar-icon">⚙️</span>
      <span class="tabbar-label">Админ</span>
    </button>
  </nav>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { logout, db } from '../firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { migrateSrsMap, reviewSM2 } from '../composables/useSM2.js'
import HomeTab     from '../components/tabs/HomeTab.vue'
import LearnTab    from '../components/tabs/LearnTab.vue'
import DictTab     from '../components/tabs/DictTab.vue'
import PracticeTab from '../components/tabs/PracticeTab.vue'
import ProfileTab  from '../components/tabs/ProfileTab.vue'
import ReviewTab   from '../components/tabs/ReviewTab.vue'
import AdminPanel  from '../components/AdminPanel.vue'
import AlphabetTab from '../components/AlphabetTab.vue'

const emit = defineEmits(['reload-words'])
const props = defineProps({ user: Object, level: String, words: Array })

const ADMIN_UID = 'A7ycZaW63leFfE0fxJfC3tXzT403'
const isAdmin = computed(() => props.user?.uid === ADMIN_UID)
function loadWords() { /* words обновляются через emit в App.vue */ }

const tab      = ref('home')
const alphaOpen = ref(false)

const tabs = [
  { id: 'home',     label: 'Главная',   icon: 'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10' },
  { id: 'learn',    label: 'Учёба',     icon: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5' },
  { id: 'dict',     label: 'Словарь',   icon: 'M4 19.5A2.5 2.5 0 016.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z' },
  { id: 'practice', label: 'Практика',  icon: 'M12 12m-8 0a8 8 0 1016 0a8 8 0 10-16 0 M12 12m-3 0a3 3 0 106 0a3 3 0 10-6 0' },
  { id: 'profile',  label: 'Профиль',   icon: 'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 11a4 4 0 100-8 4 4 0 000 8z' },
]

const SK = 'barr_v8'
const learned      = ref(new Set(JSON.parse(localStorage.getItem(SK) || '[]')))
const learnedAlpha = ref(new Set(JSON.parse(localStorage.getItem('barr_alpha') || '[]')))
const streak       = ref(Number(localStorage.getItem('barr_streak') || 0))

function todayStr() { return new Date().toDateString() }

/* ── дневная цель и счётчик выученного сегодня ── */
const GOAL_KEY = 'barr_daily_goal'
const dailyGoal = ref(Number(localStorage.getItem(GOAL_KEY) || 10))
function setDailyGoal(n) {
  dailyGoal.value = n
  localStorage.setItem(GOAL_KEY, n)
}

const LEARNED_TODAY_KEY      = 'barr_learned_today'
const LEARNED_TODAY_DATE_KEY = 'barr_learned_today_date'
const learnedToday = ref(
  localStorage.getItem(LEARNED_TODAY_DATE_KEY) === todayStr()
    ? Number(localStorage.getItem(LEARNED_TODAY_KEY) || 0)
    : 0
)
function bumpLearnedToday() {
  if (localStorage.getItem(LEARNED_TODAY_DATE_KEY) !== todayStr()) {
    learnedToday.value = 0
    localStorage.setItem(LEARNED_TODAY_DATE_KEY, todayStr())
  }
  learnedToday.value++
  localStorage.setItem(LEARNED_TODAY_KEY, learnedToday.value)
}

/* ── streak по факту активности (не просто по открытию приложения) + заморозки ── */
const STREAK_KEY   = 'barr_streak'
const LAST_DAY_KEY = 'barr_last_day'
const FREEZE_KEY   = 'barr_streak_freezes'
const MAX_FREEZES  = 2
const streakFreezes = ref(Number(localStorage.getItem(FREEZE_KEY) || 0))

function recordActivity() {
  const today   = todayStr()
  const lastDay = localStorage.getItem(LAST_DAY_KEY)
  if (lastDay === today) return // сегодняшняя активность уже учтена

  const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1)
  const gapDays = lastDay ? Math.round((new Date(today) - new Date(lastDay)) / 86400000) : 1

  if (!lastDay) {
    streak.value = 1
  } else if (lastDay === yesterday.toDateString()) {
    streak.value += 1
  } else if (gapDays === 2 && streakFreezes.value > 0) {
    // пропущен ровно один день, но есть заморозка — streak сохраняем
    streakFreezes.value -= 1
    localStorage.setItem(FREEZE_KEY, streakFreezes.value)
  } else {
    streak.value = 1
  }

  if (streak.value > 0 && streak.value % 7 === 0 && streakFreezes.value < MAX_FREEZES) {
    streakFreezes.value += 1
    localStorage.setItem(FREEZE_KEY, streakFreezes.value)
  }

  localStorage.setItem(STREAK_KEY, streak.value)
  localStorage.setItem(LAST_DAY_KEY, today)
}

function toggleLearn(id) {
  const s = new Set(learned.value)
  if (s.has(id)) {
    s.delete(id)
  } else {
    s.add(id)
    if (!srs.value[id]) {
      srs.value = { ...srs.value, [id]: { ease: 2.5, interval: 0, reps: 0, lapses: 0, due: Date.now(), lastReviewed: Date.now() } }
      localStorage.setItem(SRS_KEY, JSON.stringify(srs.value))
    }
    bumpLearnedToday()
    recordActivity()
  }
  learned.value = s
  localStorage.setItem(SK, JSON.stringify([...s]))
}

/* ── SM-2 повторения ── */
const SRS_KEY = 'barr_srs'
const srs = ref(migrateSrsMap(JSON.parse(localStorage.getItem(SRS_KEY) || '{}')))

const dueWords = computed(() => props.words.filter(w => {
  if (!learned.value.has(w.id)) return false
  const entry = srs.value[w.id]
  return !entry || entry.due <= Date.now()
}))

/* ── слабые места: низкий ease или много ошибок ── */
const WEAK_EASE_THRESHOLD   = 2.0
const WEAK_LAPSES_THRESHOLD = 3
const weakWords = computed(() => props.words.filter(w => {
  if (!learned.value.has(w.id)) return false
  const e = srs.value[w.id]
  return e && (e.ease < WEAK_EASE_THRESHOLD || e.lapses >= WEAK_LAPSES_THRESHOLD)
}))

const reviewMode  = ref('due') // 'due' | 'weak'
const reviewQueue = computed(() => reviewMode.value === 'weak' ? weakWords.value : dueWords.value)
function startWeakReview() { reviewMode.value = 'weak'; tab.value = 'review' }
function handleGoTab(t) {
  if (t === 'review') reviewMode.value = 'due'
  tab.value = t
}

function reviewWord(id, remembered) {
  srs.value = { ...srs.value, [id]: reviewSM2(srs.value[id], remembered) }
  localStorage.setItem(SRS_KEY, JSON.stringify(srs.value))
  recordActivity()
}

/* ── ассоциации пользователя ("mems") ── */
const MNEM_KEY = 'barr_mnemonics'
const mnemonics = ref(JSON.parse(localStorage.getItem(MNEM_KEY) || '{}'))
function saveMnemonic(id, text) {
  const m = { ...mnemonics.value }
  if (text) m[id] = text
  else delete m[id]
  mnemonics.value = m
  localStorage.setItem(MNEM_KEY, JSON.stringify(m))
}

/* ── синхронизация с Firestore для авторизованных (srs + ассоциации + цель + заморозки) ── */
let userDataSaveTimer = null
function scheduleUserDataSave() {
  if (!props.user) return
  clearTimeout(userDataSaveTimer)
  userDataSaveTimer = setTimeout(() => {
    setDoc(doc(db, 'users', props.user.uid), {
      srs: srs.value,
      mnemonics: mnemonics.value,
      dailyGoal: dailyGoal.value,
      streakFreezes: streakFreezes.value,
    }, { merge: true }).catch(() => {})
  }, 800)
}
watch([srs, mnemonics, dailyGoal, streakFreezes], scheduleUserDataSave, { deep: true })

watch(() => props.user, async (u) => {
  if (!u) return
  try {
    const snap = await getDoc(doc(db, 'users', u.uid))
    if (snap.exists()) {
      const data = snap.data()
      if (data.srs && Object.keys(data.srs).length) {
        srs.value = migrateSrsMap(data.srs)
        localStorage.setItem(SRS_KEY, JSON.stringify(srs.value))
      }
      if (data.mnemonics) {
        mnemonics.value = data.mnemonics
        localStorage.setItem(MNEM_KEY, JSON.stringify(mnemonics.value))
      }
      if (typeof data.dailyGoal === 'number') {
        dailyGoal.value = data.dailyGoal
        localStorage.setItem(GOAL_KEY, dailyGoal.value)
      }
      if (typeof data.streakFreezes === 'number') {
        streakFreezes.value = data.streakFreezes
        localStorage.setItem(FREEZE_KEY, streakFreezes.value)
      }
    }
    if (!snap.exists() || !snap.data().srs) scheduleUserDataSave()
  } catch (e) { /* оффлайн или нет доступа — остаёмся на localStorage */ }
}, { immediate: true })

async function handleLogout() {
  await logout()
  localStorage.removeItem('barr_level')
  window.location.reload()
}

function handleChangeLevel(l) {
  localStorage.setItem('barr_level', l)
  window.location.reload()
}

/* ── морфящий стеклянный индикатор в таббаре ── */
const tabbarEl    = ref(null)
const indicatorEl = ref(null)
const alphaBtnRef = ref(null)
const tabBtnRefs  = ref([])
const adminBtnRef = ref(null)

function activeKey() {
  if (alphaOpen.value) return 'alpha'
  return tab.value
}
function moveIndicator() {
  const bar = tabbarEl.value
  const ind = indicatorEl.value
  if (!bar || !ind) return
  const allBtns = [alphaBtnRef.value, ...(Array.isArray(tabBtnRefs.value) ? tabBtnRefs.value : []), adminBtnRef.value]
  const btn = allBtns.find(b => b && b.dataset && b.dataset.key === activeKey())
  if (!btn) return
  const barRect = bar.getBoundingClientRect()
  const btnRect = btn.getBoundingClientRect()
  ind.style.width     = btnRect.width + 'px'
  ind.style.transform = `translateX(${btnRect.left - barRect.left}px)`
}
onMounted(() => nextTick(moveIndicator))
watch([tab, alphaOpen], () => nextTick(moveIndicator))
window.addEventListener('resize', () => nextTick(moveIndicator))
</script>

<style scoped>
.app-wrap    { display:flex; flex-direction:column; min-height:100vh; min-height:100dvh; }
.app-content { flex:1; overflow-y:auto; padding-bottom:96px; }

/* ── ПЛАВАЮЩАЯ СТЕКЛЯННАЯ КАПСУЛА ── */
.tabbar {
  position:fixed; left:12px; right:12px; bottom:calc(12px + env(safe-area-inset-bottom));
  height:64px; border-radius:24px;
  background: color-mix(in srgb, var(--bg) 92%, transparent);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);

  border: 1px solid var(--glass-border);
  box-shadow: 0 10px 34px var(--glass-shadow), inset 0 1px 0 var(--glass-shine);
  display:flex; align-items:stretch;
  z-index:100;
  transition: background-color .4s var(--spring-soft), border-color .4s var(--spring-soft);
}
.tabbar::before{
  content:''; position:absolute; inset:0; border-radius:inherit; pointer-events:none;
  background:linear-gradient(135deg, var(--glass-shine) 0%, transparent 30%, transparent 70%, rgba(246,140,54,.08) 100%);
}
.tabbar::after{
  content:''; position:absolute; top:0; left:16%; right:16%; height:1px;
  background:linear-gradient(90deg, transparent, var(--gold), transparent);
  opacity:.5; pointer-events:none;
}

/* ── ДЕСКТОП: узкая колонка с рамками по бокам, как на телефоне ── */
@media (min-width: 700px) {
  .app-wrap {
    max-width:480px; margin:0 auto;
    border-left:1px solid var(--line); border-right:1px solid var(--line);
    box-shadow: 0 0 60px var(--glass-shadow);
  }
  .tabbar {
    left:50%; right:auto; transform:translateX(-50%);
    width:min(456px, calc(100vw - 24px));
  }
}

/* морфящий индикатор — перетекает между вкладками */
.tab-indicator{
  position:absolute; top:6px; bottom:6px; left:0;
  border-radius:18px;
  background: rgba(128,6,19,.10);
  box-shadow: inset 0 0 0 1px rgba(128,6,19,.18);
  transition: transform .5s var(--spring), width .5s var(--spring);
  pointer-events:none; z-index:0;
}
[data-theme=dark] .tab-indicator, [data-theme=amoled] .tab-indicator{
  background: rgba(251,157,89,.12);
  box-shadow: inset 0 0 0 1px rgba(251,157,89,.22);
}

.tabbar-btn {
  position:relative; z-index:1;
  flex:1; display:flex; flex-direction:column;
  align-items:center; justify-content:center; gap:3px;
  background:none; border:none; cursor:pointer; padding:6px 0;
  transition: color .3s var(--ease-out), transform .25s var(--spring); color: #b09070;
}
.tabbar-btn:active { transform: scale(.88); }
.tabbar-btn.active  { color: var(--red); }
.tab-svg    { width:22px; height:22px; transition: transform .3s var(--spring); }
.tabbar-btn.active .tab-svg { transform: translateY(-1px) scale(1.08); }
.tabbar-label { font-family:var(--m); font-size:9px; letter-spacing:.5px; }

/* АЛФАВИТ — особая кнопка */
.alpha-fab {
  color: var(--red);
  position: relative;
}
.alpha-fab.active { color: var(--red); }
.alpha-fab-letter {
  font-family: var(--d);
  font-size: 28px;
  font-weight: 700;
  line-height: 1;
  color: var(--red);
  transition: transform .35s var(--spring);
}
.alpha-fab.active .alpha-fab-letter {
  transform: scale(1.15) rotate(-4deg);
}

[data-theme=dark] .tabbar-btn   { color: rgba(178,161,145,.6); }
[data-theme=dark] .tabbar-btn.active { color: var(--red); }
[data-theme=dark] .alpha-fab-letter { color: var(--red); }
</style>
