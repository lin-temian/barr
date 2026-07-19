<template>
  <div class="ob">
    <div class="ob-inner">
      <div class="ob-logo">
        <div class="ob-arev">֎</div>
        <h1 class="ob-title">Բառ</h1>
        <p class="ob-sub">Армянский язык</p>
      </div>

      <div class="ob-question">Какой у тебя уровень?</div>
      <p class="ob-hint">Выберем с чего начать</p>

      <div class="ob-levels">
        <div v-for="l in levels" :key="l.code"
          class="ob-level" :class="{active: selected === l.code}"
          @click="selected = l.code">
          <div class="ob-level-badge" :style="{background: l.color}">{{ l.code }}</div>
          <div class="ob-level-info">
            <div class="ob-level-name">{{ l.name }}</div>
            <div class="ob-level-desc">{{ l.desc }}</div>
          </div>
          <div class="ob-check" v-if="selected === l.code">✓</div>
        </div>
      </div>

      <button class="ob-btn" @click="$emit('done', selected)">
        Продолжить →
      </button>
    </div>

    <!-- Орнаментальная рамка -->
    <div class="ob-frame ob-frame-tl"></div>
    <div class="ob-frame ob-frame-tr"></div>
    <div class="ob-frame ob-frame-bl"></div>
    <div class="ob-frame ob-frame-br"></div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
defineEmits(['done'])

const selected = ref('A1')
const levels = [
  {
    code: 'A1',
    name: 'Начинающий',
    desc: 'С нуля — алфавит и первые слова',
    color: '#8c1c1c'
  },
  {
    code: 'A2',
    name: 'Элементарный',
    desc: 'Знаю буквы, понимаю простые фразы',
    color: '#1a3a6e'
  },
  {
    code: 'B1',
    name: 'Средний',
    desc: 'Говорю и понимаю речь',
    color: '#2a5e3a'
  },
]
</script>

<style scoped>
.ob {
  position: fixed; inset: 0;
  background: var(--bg);
  display: flex; align-items: center; justify-content: center;
  padding: 24px;
  overflow: hidden;
}
.ob-inner {
  width: 100%; max-width: 420px;
  position: relative; z-index: 1;
}
.ob-logo { text-align: center; margin-bottom: 40px; }
.ob-arev {
  font-size: 72px; line-height: 1; color: var(--red);
  display: inline-block;
  animation: spin 8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
.ob-title {
  font-family: var(--d); font-size: 64px; font-weight: 700;
  font-style: italic; color: var(--red); line-height: 1;
  letter-spacing: -2px;
}
.ob-sub {
  font-family: var(--m); font-size: 10px; letter-spacing: 4px;
  text-transform: uppercase; color: var(--muted); margin-top: 6px;
}
.ob-question {
  font-family: var(--d); font-size: 24px; font-weight: 700;
  color: var(--ink); margin-bottom: 4px; text-align: center;
}
.ob-hint {
  font-family: var(--s); font-size: 14px; color: var(--muted);
  text-align: center; margin-bottom: 24px;
}
.ob-levels { display: flex; flex-direction: column; gap: 10px; margin-bottom: 28px; }
.ob-level {
  display: flex; align-items: center; gap: 14px;
  border: 1.5px solid var(--line);
  border-radius: 12px; padding: 14px 16px;
  background:var(--glass-bg);
  cursor: pointer; transition: all .2s;
  position: relative;
border-color:var(--glass-border);box-shadow:inset 0 1px 0 var(--glass-shine),0 4px 16px var(--glass-shadow);backdrop-filter:var(--glass-blur);-webkit-backdrop-filter:var(--glass-blur);}
.ob-level:hover { border-color: var(--gold); background:var(--glass-bg); border-color:var(--glass-border);box-shadow:inset 0 1px 0 var(--glass-shine),0 4px 16px var(--glass-shadow);backdrop-filter:var(--glass-blur);-webkit-backdrop-filter:var(--glass-blur);}
.ob-level.active {
  border-color: var(--red); border-width: 2px;
  background: rgba(128,6,19,.06);
}
.ob-level-badge {
  width: 44px; height: 44px; border-radius: 10px;
  color: #f2e8d5; display: flex; align-items: center; justify-content: center;
  font-family: var(--m); font-size: 13px; font-weight: 700;
  letter-spacing: 1px; flex-shrink: 0;
}
.ob-level-name {
  font-family: var(--s); font-size: 16px; font-weight: 600; color: var(--ink);
}
.ob-level-desc {
  font-family: var(--s); font-size: 12px; color: var(--muted); margin-top: 2px;
}
.ob-check {
  margin-left: auto; color: var(--red); font-size: 18px; font-weight: 700;
}
.ob-btn {
  width: 100%; padding: 16px;
  background: var(--red); color: var(--on-accent);
  border: none; border-radius: 12px;
  font-family: var(--d); font-size: 18px; font-style: italic;
  cursor: pointer; transition: background .2s;
}
.ob-btn:hover { background: var(--ink); }
.ob-btn:active { transform: scale(.98); }

/* Угловые орнаменты */
.ob-frame {
  position: absolute; width: 40px; height: 40px;
  border-color: var(--gold); border-style: solid;
  opacity: .4;
}
.ob-frame-tl { top: 20px; left: 20px; border-width: 2px 0 0 2px; }
.ob-frame-tr { top: 20px; right: 20px; border-width: 2px 2px 0 0; }
.ob-frame-bl { bottom: 20px; left: 20px; border-width: 0 0 2px 2px; }
.ob-frame-br { bottom: 20px; right: 20px; border-width: 0 2px 2px 0; }

@media (max-width: 480px) {
  .ob-arev { font-size: 52px; }
  .ob-title { font-size: 48px; }
}
</style>
