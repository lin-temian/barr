<template>
  <div id="app">
    <!-- ОНБОРДИНГ - первый запуск -->
    <OnboardingView v-if="screen === 'onboarding'" @done="onOnboardingDone" />
    <!-- АВТОРИЗАЦИЯ -->
    <AuthView v-else-if="screen === 'auth'" @done="onAuthDone" @skip="onAuthSkip" />
    <!-- ГЛАВНОЕ ПРИЛОЖЕНИЕ -->
    <MainApp v-else :user="user" :level="level" :words="words" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { auth } from './firebase'
import { onAuthStateChanged } from 'firebase/auth'
import OnboardingView from './views/OnboardingView.vue'
import AuthView from './views/AuthView.vue'
import MainApp from './views/MainApp.vue'
import wordsData from './data/words.json'

const screen = ref('onboarding')
const user   = ref(null)
const level  = ref(localStorage.getItem('barr_level') || 'A1')
const words  = ref(wordsData)

onMounted(() => {
  // Если уровень уже выбран — пропускаем онбординг
  if (localStorage.getItem('barr_level')) {
    screen.value = 'auth'
  }
  // Слушаем Firebase Auth
  onAuthStateChanged(auth, (u) => {
    user.value = u
    if (u && screen.value === 'auth') {
      screen.value = 'main'
    }
  })
})

function onOnboardingDone(selectedLevel) {
  level.value = selectedLevel
  localStorage.setItem('barr_level', selectedLevel)
  screen.value = 'auth'
}

function onAuthDone(u) {
  user.value = u
  screen.value = 'main'
}

function onAuthSkip() {
  screen.value = 'main'
}
</script>
