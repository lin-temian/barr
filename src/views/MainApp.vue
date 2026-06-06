<template>
  <div class="app-wrap">
    <div class="app-content">
      <HomeTab     v-if="tab==='home'"     :user="user" :words="words" :level="level" :learned="learned" :streak="streak" @go-tab="tab=$event" />
      <LearnTab    v-else-if="tab==='learn'"    :words="words" :level="level" />
      <DictTab     v-else-if="tab==='dict'"     :words="words" :learned="learned" @toggle-learn="toggleLearn" />
      <PracticeTab v-else-if="tab==='practice'" :words="words" />
      <ProfileTab  v-else-if="tab==='profile'"  :user="user" :learned="learned" :streak="streak" :level="level" @logout="handleLogout" @change-level="handleChangeLevel" />
    </div>

    <nav class="tabbar">
      <button v-for="t in tabs" :key="t.id"
        class="tabbar-btn" :class="{active: tab===t.id}"
        @click="tab=t.id">
        <svg class="tab-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path :d="t.icon"/>
        </svg>
        <span class="tabbar-label">{{ t.label }}</span>
      </button>
    </nav>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { logout } from '../firebase'
import HomeTab     from '../components/tabs/HomeTab.vue'
import LearnTab    from '../components/tabs/LearnTab.vue'
import DictTab     from '../components/tabs/DictTab.vue'
import PracticeTab from '../components/tabs/PracticeTab.vue'
import ProfileTab  from '../components/tabs/ProfileTab.vue'

const props = defineProps({ user: Object, level: String, words: Array })

const tab = ref('home')
const tabs = [
  { id: 'home',     label: 'Главная',  icon: 'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10' },
  { id: 'learn',    label: 'Учёба',    icon: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5' },
  { id: 'dict',     label: 'Словарь',  icon: 'M4 19.5A2.5 2.5 0 016.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z' },
  { id: 'practice', label: 'Практика', icon: 'M22 11.08V12a10 10 0 11-5.93-9.14 M22 4L12 14.01l-3-3' },
  { id: 'profile',  label: 'Профиль',  icon: 'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 11a4 4 0 100-8 4 4 0 000 8z' },
]

const SK = 'barr_v8'
const learned = ref(new Set(JSON.parse(localStorage.getItem(SK) || '[]')))
const streak  = ref(Number(localStorage.getItem('barr_streak') || 0))

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

[data-theme=dark]   .tabbar  { background: rgba(10,8,4,.95); border-top-color: rgba(176,120,40,.2); }
[data-theme=amoled] .tabbar  { background: rgba(0,0,0,.98); }
</style>
