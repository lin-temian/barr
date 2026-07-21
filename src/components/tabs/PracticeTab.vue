<template>
  <div class="practice">
    <div class="prac-header">
      <div class="prac-title">Практика</div>
    </div>
    <div class="prac-body">
      <QuizTab :words="words" />
      <ClozeQuiz :words="words" style="margin-top:24px" />
      <PhrasesTab style="margin-top:24px" />
    </div>
  </div>
</template>

<script setup>
import QuizTab   from '../QuizTab.vue'
import ClozeQuiz from '../ClozeQuiz.vue'
import PhrasesTab from '../PhrasesTab.vue'
defineProps({ words: Array })
</script>

<style scoped>
.practice { padding-bottom: 20px; }
.prac-header {
  padding: 20px; border-bottom: 1px solid var(--line);
  position: sticky; top: 0; z-index: 10;
  background:var(--glass-bg-strong);
border-color:var(--glass-border);box-shadow:inset 0 1px 0 var(--glass-shine),0 4px 16px var(--glass-shadow);backdrop-filter:var(--glass-blur);-webkit-backdrop-filter:var(--glass-blur);}
.prac-title { font-family: var(--d); font-size: 28px; font-weight: 700; font-style: italic; color: var(--red); }
.prac-body { padding: 20px; }
</style>
