<template>
  <div class="home">
    <div class="home-header">
      <div>
        <div class="home-greeting">Բարև,</div>
        <div class="home-name">{{ displayName }} 👋</div>
      </div>
      <div class="home-level">{{ level }}</div>
    </div>

    <div class="home-body">
      <!-- STREAK -->
      <div class="streak-card">
        <div class="streak-fire">
          <span class="streak-emoji">🔥</span>
          <span class="streak-num">{{ streak }}</span>
          <span class="streak-lbl">дней подряд</span>
        </div>
        <div class="streak-sep"></div>
        <div class="streak-progress">
          <div class="sp-top">
            <span class="sp-lbl">Цель на сегодня</span>
            <span class="sp-val">{{ Math.min(learned.size % 10, 10) }}/10 слов</span>
          </div>
          <div class="sp-bar">
            <div class="sp-fill" :style="{width: Math.min((learned.size % 10)/10*100, 100)+'%'}"></div>
          </div>
        </div>
      </div>

      <!-- ПРОДОЛЖИТЬ -->
      <div class="continue-card" @click="$emit('go-tab','learn')">
        <div class="cc-eyebrow">Продолжить</div>
        <div class="cc-title">{{ lessonTitle }}</div>
        <div class="cc-footer">
          <div class="cc-bar"><div class="cc-fill" :style="{width:progress+'%'}"></div></div>
          <span class="cc-pct">{{ progress }}%</span>
          <span class="cc-arrow">→</span>
        </div>
      </div>

      <!-- СЛОВО ДНЯ -->
      <div class="word-card" @click="flipped=!flipped">
        <div class="wc-label">✦ Слово дня</div>
        <transition name="flip">
          <div v-if="!flipped" key="front" class="wc-front">
            <div class="wc-arm">{{ wordDay.arm }}</div>
            <div class="wc-tr">{{ wordDay.translit }}</div>
            <div class="wc-tap">нажми — узнай перевод</div>
          </div>
          <div v-else key="back" class="wc-back">
            <div class="wc-ru">{{ wordDay.ru }}</div>
            <div class="wc-arm-sm">{{ wordDay.arm }}</div>
          </div>
        </transition>
      </div>

      <!-- БЫСТРЫЕ КНОПКИ -->
      <div class="quick-grid">
        <div class="qc" @click="$emit('go-tab','practice')">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--red)" stroke-width="1.8"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          <div class="qc-label">Тест</div>
          <div class="qc-desc">5 вопросов</div>
        </div>
        <div class="qc" @click="$emit('go-tab','dict')">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--red)" stroke-width="1.8"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>
          <div class="qc-label">Словарь</div>
          <div class="qc-desc">{{ words.length }} слов</div>
        </div>
      </div>

      <!-- ФАКТ О ЯЗЫКЕ -->
      <div class="lang-fact">
        <div class="lf-label">✦ Знаешь ли ты?</div>
        <div class="lf-text">{{ facts[factIdx] }}</div>
        <button class="lf-next" @click="nextFact">Следующий факт →</button>
      </div>

      <!-- СТАТИСТИКА -->
      <div class="stats-row">
        <div class="stat"><div class="stat-n">{{ learned.size }}</div><div class="stat-l">выучено</div></div>
        <div class="stat-div"></div>
        <div class="stat"><div class="stat-n">{{ words.length }}</div><div class="stat-l">всего</div></div>
        <div class="stat-div"></div>
        <div class="stat"><div class="stat-n">{{ progress }}%</div><div class="stat-l">прогресс</div></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
const props = defineProps({ user:Object, words:Array, level:String, learned:Object, streak:Number })
defineEmits(['go-tab'])

const flipped = ref(false)
const displayName = computed(() => props.user?.displayName?.split(' ')[0] || 'Друг')
const progress = computed(() => Math.round(props.learned.size / props.words.length * 100))
const lessonTitle = computed(() => ({ A1:'Урок 1 · Алфавит', A2:'Урок 5 · Глаголы', B1:'Урок 10 · Падежи' }[props.level] || 'Урок 1'))
const wordDay = props.words[new Date().getDate() % props.words.length]

const factIdx = ref(0)
const facts = [
  'Армянский алфавит создан в 405 году Месропом Маштоцем — одним из первых в мире специально созданных алфавитов.',
  'В армянском языке нет грамматического рода — он, она, оно обозначаются одним словом «Նա».',
  'Ударение в армянском всегда падает на последний слог.',
  'Армянский — один из древнейших живых языков мира, ему более 1600 лет в письменной форме.',
  'В армянском 7 падежей — на два больше чем в русском.',
  'Восточноармянский и западноармянский — два диалекта, носители с трудом понимают друг друга.',
  'Слово «Հայաստան» (Армения) означает «страна Хайев» — самоназвание армян.',
  'Армянский язык является изолированной ветвью индоевропейской семьи языков.',
  'Первая книга на армянском вышла в 1512 году в Венеции.',
  'В армянском алфавите 39 букв — одна из самых богатых фонетических систем.',
]
function nextFact() {
  factIdx.value = (factIdx.value + 1) % facts.length
}
</script>

<style scoped>
.home { padding-bottom:20px; }
.home-header {
  display:flex; align-items:center; justify-content:space-between;
  padding:20px 20px 16px;
  background:var(--glass-bg);
  backdrop-filter:blur(10px);
  border-bottom:1px solid var(--line);
  position:sticky; top:0; z-index:10;
border-color:var(--glass-border);}
.home-greeting { font-family:var(--m); font-size:11px; color:var(--muted); }
.home-name { font-family:var(--d); font-size:26px; font-weight:700; font-style:italic; color:var(--red); }
.home-level { background:var(--red); color:var(--bg); font-family:var(--m); font-size:12px; font-weight:700; padding:6px 14px; border-radius:20px; letter-spacing:1px; }
.home-body { padding:16px; display:flex; flex-direction:column; gap:14px; }
.streak-card {
  background:var(--glass-bg); backdrop-filter:blur(8px);
  border:1px solid rgba(176,120,40,.3); border-radius:16px;
  padding:18px; display:flex; gap:16px; align-items:center;
border-color:var(--glass-border);}
.streak-fire { display:flex; flex-direction:column; align-items:center; gap:2px; }
.streak-emoji { font-size:32px; line-height:1; }
.streak-num { font-family:var(--d); font-size:40px; font-weight:700; color:var(--red); line-height:1; }
.streak-lbl { font-family:var(--m); font-size:8px; letter-spacing:1px; text-transform:uppercase; color:var(--muted); }
.streak-sep { width:1px; height:50px; background:rgba(176,120,40,.25); }
.streak-progress { flex:1; }
.sp-top { display:flex; justify-content:space-between; margin-bottom:8px; }
.sp-lbl { font-family:var(--m); font-size:10px; color:var(--muted); }
.sp-val { font-family:var(--s); font-size:13px; font-weight:600; color:var(--ink); }
.sp-bar { height:8px; background:rgba(140,28,28,.15); border-radius:4px; }
.sp-fill { height:100%; background:var(--red); border-radius:4px; transition:width .5s; }
.continue-card {
  background:var(--ink); border-radius:16px; padding:20px;
  cursor:pointer; transition:opacity .2s; position:relative;
}
.continue-card:hover { opacity:.92; }
.cc-eyebrow { font-family:var(--m); font-size:9px; letter-spacing:2px; text-transform:uppercase; color:rgba(242,232,213,.5); margin-bottom:6px; }
.cc-title { font-family:var(--d); font-size:24px; font-style:italic; color:var(--bg); margin-bottom:14px; }
.cc-footer { display:flex; align-items:center; gap:10px; }
.cc-bar { flex:1; height:5px; background:var(--glass-bg); border-radius:3px; border-color:var(--glass-border);backdrop-filter:var(--glass-blur-sm);-webkit-backdrop-filter:var(--glass-blur-sm);box-shadow:inset 0 1px 0 var(--glass-shine),0 4px 16px var(--glass-shadow);}
.cc-fill { height:100%; background:var(--gold); border-radius:3px; transition:width .5s; }
.cc-pct { font-family:var(--m); font-size:11px; color:rgba(242,232,213,.6); }
.cc-arrow { margin-left:auto; font-size:18px; color:rgba(242,232,213,.4); }
.word-card {
  background:var(--glass-bg); backdrop-filter:blur(8px);
  border:1px solid rgba(26,58,110,.2); border-radius:16px;
  padding:20px; cursor:pointer; min-height:110px;
  transition:all .2s;
border-color:var(--glass-border);}
.word-card:hover { border-color:rgba(26,58,110,.35); }
.wc-label { font-family:var(--m); font-size:9px; letter-spacing:2px; text-transform:uppercase; color:var(--blue); margin-bottom:10px; }
.wc-arm  { font-family:var(--d); font-size:52px; font-style:italic; color:var(--red); line-height:1; }
.wc-tr   { font-family:var(--m); font-size:12px; color:var(--muted); margin-top:4px; }
.wc-tap  { font-family:var(--s); font-size:11px; color:var(--muted); margin-top:8px; font-style:italic; opacity:.7; }
.wc-ru   { font-family:var(--d); font-size:40px; font-weight:700; color:var(--ink); }
.wc-arm-sm { font-family:var(--d); font-size:20px; font-style:italic; color:var(--muted); margin-top:4px; }
.quick-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
.qc {
  background:var(--glass-bg); backdrop-filter:blur(8px);
  border:1px solid var(--line); border-radius:16px;
  padding:18px; cursor:pointer; transition:all .2s; text-align:center;
border-color:var(--glass-border);}
.qc:hover { border-color:var(--gold); }
.qc-label { font-family:var(--s); font-size:15px; font-weight:600; color:var(--ink); margin-top:8px; }
.qc-desc  { font-family:var(--m); font-size:10px; color:var(--muted); margin-top:3px; }
.stats-row {
  background:var(--glass-bg); backdrop-filter:blur(8px);
  border:1px solid var(--line); border-radius:16px;
  display:flex; align-items:center;
border-color:var(--glass-border);}
.stat { flex:1; padding:16px; text-align:center; }
.stat-n { font-family:var(--d); font-size:30px; font-weight:700; color:var(--red); line-height:1; }
.stat-l { font-family:var(--m); font-size:8px; letter-spacing:1px; text-transform:uppercase; color:var(--muted); margin-top:4px; }
.stat-div { width:1px; height:44px; background:rgba(176,120,40,.2); }
.lang-fact {
  background:rgba(26,58,110,.07); backdrop-filter:blur(6px);
  border:1px solid rgba(26,58,110,.18); border-radius:16px;
  padding:20px; display:flex; flex-direction:column; gap:12px;
}
.lf-label { font-family:var(--m); font-size:9px; letter-spacing:2px; text-transform:uppercase; color:var(--blue); }
.lf-text  { font-family:var(--s); font-size:15px; color:var(--ink); line-height:1.6; }
.lf-next  { background:none; border:none; font-family:var(--m); font-size:11px; color:var(--blue); cursor:pointer; text-align:left; padding:0; letter-spacing:1px; }
.lf-next:hover { text-decoration:underline; }
.flip-enter-active, .flip-leave-active { transition: all .25s; }
.flip-enter-from { opacity:0; transform:translateY(6px); }
.flip-leave-to   { opacity:0; transform:translateY(-6px); }

[data-theme=dark] .home-header,
[data-theme=amoled] .home-header { background:rgba(10,8,4,.96) !important; }
[data-theme=dark] .streak-card,
[data-theme=dark] .word-card,
[data-theme=dark] .qc,
[data-theme=dark] .stats-row { background:rgba(24,16,8,.94) !important; }
[data-theme=amoled] .streak-card,
[data-theme=amoled] .word-card,
[data-theme=amoled] .qc,
[data-theme=amoled] .stats-row { background:rgba(0,0,0,.95) !important; }
</style>
