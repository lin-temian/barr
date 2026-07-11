<template>
  <div id="app">
    <div v-if="loading" class="app-loading">
      <div class="app-loading-logo">Բ</div>
      <div class="app-loading-text">Загрузка словаря...</div>
    </div>
    <template v-else>
      <OnboardingView v-if="screen === 'onboarding'" @done="onOnboardingDone" />
      <AuthView       v-else-if="screen === 'auth'" @done="onAuthDone" @skip="onAuthSkip" />
      <MainApp        v-else :user="user" :level="level" :words="words" @reload-words="loadWords" />
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { auth, db } from './firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import OnboardingView from './views/OnboardingView.vue'
import AuthView       from './views/AuthView.vue'
import MainApp        from './views/MainApp.vue'

const screen  = ref('onboarding')
const user    = ref(null)
const level   = ref(localStorage.getItem('barr_level') || 'A1')
const words   = ref([])
const loading = ref(true)

async function loadWords() {
  try {
    const q    = query(collection(db, 'words'), orderBy('id'))
    const snap = await getDocs(q)
    words.value = snap.docs.map(d => ({ firestoreId: d.id, ...d.data() }))
  } catch(e) {
    console.error('Firestore error:', e.message)
    // fallback — пустой массив если Firestore недоступен
    words.value = []
  }
}

onMounted(async () => {
  document.documentElement.dataset.theme = localStorage.getItem('barr_theme') || 'light'
  await loadWords()
  loading.value = false
  if (localStorage.getItem('barr_level')) screen.value = 'auth'
  onAuthStateChanged(auth, (u) => {
    user.value = u
    if (u && screen.value === 'auth') screen.value = 'main'
  })
})

function onOnboardingDone(lvl) {
  level.value = lvl
  localStorage.setItem('barr_level', lvl)
  screen.value = 'auth'
}
function onAuthDone(u) { user.value = u; screen.value = 'main' }
function onAuthSkip()  { screen.value = 'main' }
</script>

<style>
.app-loading { position:fixed; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; background:var(--bg); gap:12px; }
.app-loading-logo { font-family:var(--d); font-size:72px; font-style:italic; color:var(--red); animation:pulse 1.2s ease-in-out infinite; }
.app-loading-text { font-family:var(--m); font-size:11px; letter-spacing:3px; text-transform:uppercase; color:var(--muted); }
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }
</style>
