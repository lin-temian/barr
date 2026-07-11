<template>
  <div class="app-wrap">
    <div class="app-content">
      <HomeTab     v-if="tab==='home'"     :user="user" :words="words" :level="level" :learned="learned" :streak="streak" @go-tab="tab=$event" />
      <LearnTab    v-else-if="tab==='learn'"    :words="words" :level="level" @open-alphabet="alphaOpen = true" />
      <DictTab     v-else-if="tab==='dict'"     :words="words" :learned="learned" @toggle-learn="toggleLearn" />
      <PracticeTab v-else-if="tab==='practice'" :words="words" />
      <LitTab      v-else-if="tab==='lit'"      :learnedAlpha="learnedAlpha" />
      <AdminPanel  v-else-if="tab==='admin'" :words="words" @words-updated="$emit('reload-words')" />
      <ProfileTab  v-else-if="tab==='profile'"  :user="user" :learned="learned" :streak="streak" :level="level" :learnedAlpha="learnedAlpha" @logout="handleLogout" @change-level="handleChangeLevel" />
    </div>

    <!-- ALPHABET MODAL -->
    <AlphabetTab
      :isOpen="alphaOpen"
      v-model:learnedAlpha="learnedAlpha"
      @close="alphaOpen = false"
    />

    <nav class="tabbar">
      <!-- АЛФАВИТ — центральная кнопка -->
      <button class="tabbar-btn alpha-fab" @click="alphaOpen = true" :class="{active: alphaOpen}">
        <span class="alpha-fab-letter">Ա</span>
        <span class="tabbar-label">Алфавит</span>
      </button>

      <button v-for="t in tabs" :key="t.id"
        class="tabbar-btn" :class="{active: tab===t.id}"
        @click="tab=t.id">
        <svg class="tab-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path :d="t.icon"/>
        </svg>
        <span class="tabbar-label">{{ t.label }}</span>
      </button>
      <button v-if="isAdmin" class="tabbar-btn admin-btn" :class="{active: tab==='admin'}" @click="tab='admin'">
      <span class="tabbar-icon">⚙️</span>
      <span class="tabbar-label">Админ</span>
    </button>
  </nav>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { logout } from '../firebase'
import HomeTab     from '../components/tabs/HomeTab.vue'
import LearnTab    from '../components/tabs/LearnTab.vue'
import DictTab     from '../components/tabs/DictTab.vue'
import PracticeTab from '../components/tabs/PracticeTab.vue'
import ProfileTab  from '../components/tabs/ProfileTab.vue'
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
  s.has(id) ? s.delete(id) : s.add(id)
  learned.value = s
  localStorage.setItem(SK, JSON.stringify([...s]))
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
</script>

<style scoped>
.app-wrap    { display:flex; flex-direction:column; min-height:100vh; min-height:100dvh; }
.app-content { flex:1; overflow-y:auto; padding-bottom:64px; }
.tabbar {
  position:fixed; bottom:0; left:0; right:0;
  height:64px;
  background: rgba(242,232,213,.95);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-top: 1px solid rgba(176,120,40,.25);
  display:flex; align-items:stretch;
  z-index:100;
  padding-bottom: env(safe-area-inset-bottom);
}
.tabbar-btn {
  flex:1; display:flex; flex-direction:column;
  align-items:center; justify-content:center; gap:3px;
  background:none; border:none; cursor:pointer; padding:6px 0;
  transition: all .15s; color: #b09070;
}
.tabbar-btn:active { transform: scale(.9); }
.tabbar-btn.active  { color: var(--red); }
.tab-svg    { width:22px; height:22px; }
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
  transition: transform .15s;
}
.alpha-fab.active .alpha-fab-letter {
  transform: scale(1.1);
}

[data-theme=dark]   .tabbar  { background: rgba(10,8,4,.95); border-top-color: rgba(176,120,40,.2); }
[data-theme=amoled] .tabbar  { background: rgba(0,0,0,.98); }
[data-theme=dark] .tabbar-btn   { color: rgba(180,140,90,.6); }
[data-theme=dark] .tabbar-btn.active { color: var(--red); }
[data-theme=dark] .alpha-fab-letter { color: var(--red); }
</style>
