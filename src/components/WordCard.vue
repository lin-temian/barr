<template>
  <div class="cw" :class="{flipped, lrn: learned}" @click="flipped=!flipped">
    <div class="fl">
      <div class="face front">
        <div class="f-cat">{{ word.cat }}</div>
        <div class="f-arm">{{ word.arm }}</div>
        <div class="f-btm">
          <span class="f-tr">{{ word.translit }}</span>
          <span class="f-hint">↻</span>
        </div>
        <div class="f-num">{{ String(index+1).padStart(2,'0') }}</div>
      </div>
      <div class="face back">
        <div class="b-arm">{{ word.arm }} · {{ word.translit }}</div>
        <div class="b-ru">{{ word.ru }}</div>
        <div class="b-btm">
          <span class="b-cat">{{ word.cat }}</span>
          <button class="lbtn" :class="{on: learned}"
            @click.stop="$emit('toggle-learn')">
            {{ learned ? '✓ Знаю' : 'Выучил' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
defineProps({ word: Object, index: Number, learned: Boolean })
defineEmits(['toggle-learn'])
const flipped = ref(false)
</script>
