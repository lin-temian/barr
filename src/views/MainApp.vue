<template>
  <div class="app-wrap">
    <div class="app-content">
      <KeepAlive>
        <HomeTab     v-if="tab==='home'"     :user="user" :words="words" :level="level" :learned="learned" :streak="streak" :due-count="dueWords.length" @go-tab="tab=$event" />
        <LearnTab    v-else-if="tab==='learn'"    :words="words" :level="level" @open-alphabet="alphaOpen = true" />
        <DictTab     v-else-if="tab==='dict'"     :words="words" :learned="learned" @toggle-learn="toggleLearn" />
        <PracticeTab v-else-if="tab==='practice'" :words="words" />
        <ReviewTab   v-else-if="tab==='review'"   :words="dueWords" @review="reviewWord" @go-tab="tab=$event" />
        <LitTab      v-else-if="tab==='lit'"      :learnedAlpha="learnedAlpha" />
        <AdminPanel  v-else-if="tab==='admin'" :words="words" @words-updated="$emit('reload-words')" />
        <ProfileTab  v-else-if="tab==='profile'"  :user="user" :learned="learned" :streak="streak" :level="level" :learnedAlpha="learnedAlpha" @logout="handleLogout" @change-level="handleChangeLevel" />
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
import { logout } from '../firebase'
import HomeTab     from '../components/tabs/HomeTab.vue'
import LearnTab    from '../components/tabs/LearnTab.vue'
import DictTab     from '../components/tabs/DictTab.vue'
import PracticeTab from '../components/tabs/PracticeTab.vue'
import ProfileTab  from '../components/tabs/ProfileTab.vue'
import ReviewTab   from '../components/tabs/ReviewTab.vue'
import AdminPanel  from '../components/AdminPanel.vue'
import LitTab      from '../components/tabs/LitTab.vue'
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
  { id: 'lit',      label: 'Литература',icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
  { id: 'profile',  label: 'Профиль',   icon: 'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 11a4 4 0 100-8 4 4 0 000 8z' },
]

const SK = 'barr_v8'
const learned      = ref(new Set(JSON.parse(localStorage.getItem(SK) || '[]')))
const learnedAlpha = ref(new Set(JSON.parse(localStorage.getItem('barr_alpha') || '[]')))
const streak       = ref(Number(localStorage.getItem('barr_streak') || 0))

function toggleLearn(id) {
  const s = new Set(learned.value)
  if (s.has(id)) {
    s.delete(id)
  } else {
    s.add(id)
    if (!srs.value[id]) {
      srs.value = { ...srs.value, [id]: { box: 0, due: Date.now() } }
      localStorage.setItem(SRS_KEY, JSON.stringify(srs.value))
    }
  }
  learned.value = s
  localStorage.setItem(SK, JSON.stringify([...s]))
}

/* ── интервальные повторения (Leitner) ── */
const SRS_KEY = 'barr_srs'
const REVIEW_INTERVALS_DAYS = [0, 1, 3, 7, 14, 30]
const srs = ref(JSON.parse(localStorage.getItem(SRS_KEY) || '{}'))

const dueWords = computed(() => props.words.filter(w => {
  if (!learned.value.has(w.id)) return false
  const entry = srs.value[w.id]
  return !entry || entry.due <= Date.now()
}))

function reviewWord(id, remembered) {
  const cur  = srs.value[id] || { box: 0, due: Date.now() }
  const box  = remembered ? Math.min(cur.box + 1, REVIEW_INTERVALS_DAYS.length - 1) : 0
  const due  = Date.now() + REVIEW_INTERVALS_DAYS[box] * 86400000
  srs.value  = { ...srs.value, [id]: { box, due } }
  localStorage.setItem(SRS_KEY, JSON.stringify(srs.value))
}

async function handleLogout() {
  await logout()
  localStorage.removeItem('barr_level')
  window.location.reload()
}

function handleChangeLevel(l) {
  localStorage.setItem('barr_level', l)
  window.location.reload()
}

onMounted(() => {
  const today     = new Date().toDateString()
  const lastDay   = localStorage.getItem('barr_last_day')
  const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1)
  if (lastDay !== today) {
    streak.value = lastDay === yesterday.toDateString() ? streak.value + 1 : 1
    localStorage.setItem('barr_streak', streak.value)
    localStorage.setItem('barr_last_day', today)
  }
})

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
  background: var(--glass-bg-strong);


  border: 1px solid var(--glass-border);
  box-shadow: 0 10px 34px var(--glass-shadow), inset 0 1px 0 var(--glass-shine);
  display:flex; align-items:stretch;
  z-index:100;
  transition: background-color .4s var(--spring-soft), border-color .4s var(--spring-soft);
}
.tabbar::before{
  content:''; position:absolute; inset:0; border-radius:inherit; pointer-events:none;
  background:linear-gradient(135deg, var(--glass-shine) 0%, transparent 30%, transparent 70%, rgba(176,120,40,.08) 100%);
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
  background: rgba(140,28,28,.10);
  box-shadow: inset 0 0 0 1px rgba(140,28,28,.18);
  transition: transform .5s var(--spring), width .5s var(--spring);
  pointer-events:none; z-index:0;
}
[data-theme=dark] .tab-indicator, [data-theme=amoled] .tab-indicator{
  background: rgba(212,160,64,.12);
  box-shadow: inset 0 0 0 1px rgba(212,160,64,.22);
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

[data-theme=dark] .tabbar-btn   { color: rgba(180,140,90,.6); }
[data-theme=dark] .tabbar-btn.active { color: var(--red); }
[data-theme=dark] .alpha-fab-letter { color: var(--red); }
</style>
