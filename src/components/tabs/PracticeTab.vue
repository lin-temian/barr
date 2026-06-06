<template>
  <div class="practice">
    <div class="prac-header">
      <div class="prac-title">Практика</div>
    </div>
    <div class="prac-body">
      <QuizTab :words="words" />
      <PhrasesTab style="margin-top:24px" />
    </div>
  </div>
</template>

<script setup>
import QuizTab   from '../QuizTab.vue'
import PhrasesTab from '../PhrasesTab.vue'
defineProps({ words: Array })
</script>

<style scoped>
.practice { padding-bottom: 20px; }
.prac-header {
  padding: 20px; border-bottom: 1px solid var(--line);
  position: sticky; top: 0; z-index: 10;
  background: rgba(242,232,213,.95);
}
.prac-title { font-family: var(--d); font-size: 28px; font-weight: 700; font-style: italic; color: var(--red); }
.prac-body { padding: 20px; }
</style>
