<template>
  <div class="learn">
    <div class="learn-header">
      <div class="learn-title">Учёба</div>
      <div class="learn-level">{{ props.level }}</div>
    </div>

    <!-- УРОВНИ -->
    <div class="level-tabs">
      <button v-for="lvl in ['A1','A2','B1']" :key="lvl"
        class="ltab" :class="{active: currentLevel===lvl}"
        @click="currentLevel=lvl">
        {{ lvl }}
      </button>
    </div>

    <!-- УРОКИ -->
    <div class="learn-body">
      <div class="learn-list">
        <div v-for="l in filteredLessons" :key="l.id"
          class="ll" :class="{locked: l.locked, done: completedIds.has(l.id)}"
          @click="!l.locked && openLesson(l)">
          <div class="ll-num" :class="{locked: l.locked}">{{ l.id }}</div>
          <div class="ll-info">
            <div class="ll-ru">{{ l.ru }}</div>
            <div class="ll-arm">{{ l.arm }}</div>
            <div class="ll-desc">{{ l.desc }}</div>
          </div>
          <div class="ll-right">
            <span class="ll-done" v-if="completedIds.has(l.id)">✓</span>
            <span class="ll-lock" v-else-if="l.locked">🔒</span>
            <span class="ll-arrow" v-else>→</span>
          </div>
        </div>
      </div>
    </div>

    <!-- МОДАЛКА -->
    <Teleport to="body">
      <div v-if="active" class="lmodal" @click.self="close">
        <div class="lmodal-box">
          <button class="lmodal-close" @click="close">✕</button>
          <div class="lm-eye">Урок {{ active.id }} · {{ active.level }}</div>
          <h2 class="lm-ru">{{ active.ru }}</h2>
          <h3 class="lm-arm">{{ active.arm }}</h3>
          <p  class="lm-desc">{{ active.desc }}</p>
          <AlphabetTab  v-if="active.comp==='alphabet'"  :words="props.words" />
          <PronounsTab  v-else-if="active.comp==='pronouns'" />
          <NumbersTab   v-else-if="active.comp==='numbers'" />
          <div v-else class="lm-coming">
            <div class="lm-coming-icon">🚧</div>
            <div class="lm-coming-text">Урок в разработке</div>
            <div class="lm-coming-sub">Скоро будет доступен</div>
          </div>
          <button class="lm-done-btn" @click="markDone">
            {{ completedIds.has(active.id) ? '✓ Пройден' : 'Отметить как пройденный' }}
          </button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, shallowRef } from 'vue'
import AlphabetTab from '../AlphabetTab.vue'
import PronounsTab from '../PronounsTab.vue'
import NumbersTab  from '../NumbersTab.vue'

const props = defineProps({ words: Array, level: String })

const currentLevel = ref(props.level || 'A1')
const active       = ref(null)
const completedIds = ref(new Set(JSON.parse(localStorage.getItem('barr_lessons') || '[]')))

const LESSONS = [
  // A1 — Начинающий
  { id:1,  ru:'Алфавит',          arm:'Հայոց Այբուբեն', desc:'39 букв · фонетика · произношение',   level:'A1', locked:false, comp:'alphabet' },
  { id:2,  ru:'Первые слова',      arm:'Արաջնաբաններ', desc:'Приветствия · базовые слова',         level:'A1', locked:false, comp:'pronouns' },
  { id:3,  ru:'Местоимения',       arm:'Դերանուններ', desc:'Я, ты, он/она · 7 падежей',          level:'A1', locked:false, comp:'pronouns' },
  { id:4,  ru:'Числа',             arm:'Թվեր', desc:'0–1000 · порядковые числа',           level:'A1', locked:false, comp:'numbers' },
  { id:5,  ru:'Семья',             arm:'ընթանիք', desc:'Отец, мать, брат, сестра...',         level:'A1', locked:true,  comp:null },
  { id:6,  ru:'Цвета и природа',   arm:'գուներ', desc:'Цвета · природа · погода',           level:'A1', locked:true,  comp:null },
  { id:7,  ru:'Глагол "быть"',     arm:'կամ', desc:'Кам — я есть · настоящее время',     level:'A1', locked:true,  comp:null },
  { id:8,  ru:'Еда и напитки',     arm:'Ճաշ', desc:'Блюда · продукты · ресторан',        level:'A1', locked:true,  comp:null },
  { id:9,  ru:'Время и дни',       arm:'ժամանակ', desc:'Часы · дни недели · месяцы',         level:'A1', locked:true,  comp:null },
  { id:10, ru:'Базовые глаголы',   arm:'բայեր', desc:'Идти · есть · говорить · видеть',    level:'A1', locked:true,  comp:null },
  // A2 — Элементарный
  { id:11, ru:'Падежи',            arm:'հանգույթներ', desc:'7 падежей существительных',          level:'A2', locked:true,  comp:null },
  { id:12, ru:'Настоящее время',   arm:'ներկային', desc:'Спряжение глаголов',                level:'A2', locked:true,  comp:null },
  { id:13, ru:'Город и транспорт', arm:'կաղակ', desc:'Транспорт · улицы · маршруты',      level:'A2', locked:true,  comp:null },
  { id:14, ru:'Прилагательные',    arm:'ազդականներ', desc:'Описания · сравнения · антонимы',    level:'A2', locked:true,  comp:null },
  { id:15, ru:'Вопросы',           arm:'հարցներ', desc:'Кто? Что? Где? Когда? Почему?',     level:'A2', locked:true,  comp:null },
  { id:16, ru:'Тело и здоровье',   arm:'մարմնի', desc:'Части тела · симптомы · врач',      level:'A2', locked:true,  comp:null },
  { id:17, ru:'Прошедшее время',   arm:'անցյալ', desc:'Что делал? · вчера · прошлое',      level:'A2', locked:true,  comp:null },
  { id:18, ru:'Дом и быт',         arm:'տուն', desc:'Комнаты · мебель · домашние дела',  level:'A2', locked:true,  comp:null },
  { id:19, ru:'Магазин и деньги',  arm:'շուկա', desc:'Покупки · цены · торговля',         level:'A2', locked:true,  comp:null },
  { id:20, ru:'Будущее время',     arm:'աgագա', desc:'Планы · намерения · будущее',        level:'A2', locked:true,  comp:null },
  // B1 — Средний
  { id:21, ru:'Отрицание',         arm:'չև', desc:'Отрицательные формы глаголов',      level:'B1', locked:true,  comp:null },
  { id:22, ru:'Сложные глаголы',   arm:'բարդական', desc:'Каузативы · залог · виды',          level:'B1', locked:true,  comp:null },
  { id:23, ru:'Армения',           arm:'Հայաստան', desc:'История · культура · традиции',     level:'B1', locked:true,  comp:null },
  { id:24, ru:'Диалоги',           arm:'զրույթ', desc:'Живая речь · разговорные фразы',    level:'B1', locked:true,  comp:null },
  { id:25, ru:'Литература',        arm:'գրականութ', desc:'Классические тексты',               level:'B1', locked:true,  comp:null },
]

const filteredLessons = computed(() =>
  LESSONS.filter(l => l.level === currentLevel.value)
)

function openLesson(l) {
  active.value = l
  window.scrollTo(0,0)
}

function close() {
  active.value = null
}

function markDone() {
  const s = new Set(completedIds.value)
  s.add(active.value.id)
  completedIds.value = s
  localStorage.setItem('barr_lessons', JSON.stringify([...s]))
  // Разблокируем следующий урок
  const nextId = active.value.id + 1
  const nextLesson = LESSONS.find(l => l.id === nextId)
  if (nextLesson) nextLesson.locked = false
}
</script>

<style scoped>
.learn { padding-bottom:20px; }
.learn-header {
  display:flex; align-items:center; justify-content:space-between;
  padding:20px; border-bottom:1px solid rgba(176,120,40,.2);
  position:sticky; top:0; z-index:10;
  background:rgba(242,232,213,.92); backdrop-filter:blur(10px);
}
.learn-title { font-family:var(--d); font-size:28px; font-weight:700; font-style:italic; color:var(--red); }
.learn-level { background:var(--red); color:var(--bg); font-family:var(--m); font-size:12px; font-weight:700; padding:6px 14px; border-radius:20px; }

.level-tabs { display:flex; padding:16px 20px 0; gap:8px; }
.ltab {
  flex:1; padding:10px; border:1.5px solid var(--line); border-radius:10px;
  font-family:var(--m); font-size:13px; font-weight:700; color:var(--muted);
  background:rgba(242,232,213,.7); cursor:pointer; transition:.15s; text-align:center;
}
.ltab.active { background:var(--red); border-color:var(--red); color:var(--bg); }
.ltab:hover:not(.active) { border-color:var(--gold); color:var(--ink); }

.learn-body  { padding:16px 20px; }
.learn-list  { display:flex; flex-direction:column; gap:10px; }

.ll {
  display:flex; align-items:center; gap:14px;
  background:rgba(242,232,213,.88); backdrop-filter:blur(6px);
  border:1px solid rgba(176,120,40,.2); border-radius:14px;
  padding:16px; cursor:pointer; transition:all .2s;
}
.ll:hover:not(.locked) { border-color:var(--gold); background:rgba(242,232,213,.96); transform:translateX(2px); }
.ll.locked  { opacity:.5; cursor:default; }
.ll.done    { border-color:var(--gold); background:rgba(176,120,40,.08); }

.ll-num {
  width:48px; height:48px; border-radius:12px; flex-shrink:0;
  background:var(--ink); color:var(--bg);
  display:flex; align-items:center; justify-content:center;
  font-family:var(--d); font-size:22px; font-weight:700;
}
.ll-num.locked { background:var(--muted); }
.ll.done .ll-num { background:var(--gold); }

.ll-info { flex:1; min-width:0; }
.ll-ru   { font-family:var(--s); font-size:17px; font-weight:600; color:var(--ink); }
.ll-arm  { font-family:var(--d); font-size:14px; font-style:italic; color:var(--red); opacity:.8; margin-top:2px; }
.ll-desc { font-family:var(--m); font-size:11px; color:var(--muted); margin-top:3px; }

.ll-right { flex-shrink:0; }
.ll-done  { color:var(--gold); font-size:18px; font-weight:700; }
.ll-lock  { font-size:16px; }
.ll-arrow { color:var(--muted); font-size:20px; }

/* МОДАЛКА */
.lmodal {
  position:fixed; inset:0; z-index:200;
  background:rgba(26,16,8,.5); backdrop-filter:blur(4px);
  display:flex; align-items:flex-end;
}
.lmodal-box {
  width:100%; max-height:94vh; overflow-y:auto;
  background:var(--bg); border-radius:24px 24px 0 0;
  padding:28px 20px 48px; position:relative;
}
.lmodal-close {
  position:absolute; top:16px; right:16px;
  width:32px; height:32px; border-radius:50%;
  background:rgba(0,0,0,.08); border:none; cursor:pointer;
  font-size:14px; color:var(--muted);
}
.lm-eye  { font-family:var(--m); font-size:9px; letter-spacing:3px; text-transform:uppercase; color:var(--gold); margin-bottom:4px; }
.lm-ru   { font-family:var(--d); font-size:36px; font-weight:700; font-style:italic; color:var(--red); margin-bottom:4px; }
.lm-arm  { font-family:var(--d); font-size:22px; font-style:italic; color:var(--muted); margin-bottom:8px; }
.lm-desc { font-family:var(--s); font-size:14px; color:var(--muted); margin-bottom:20px; font-style:italic; }
.lm-coming { text-align:center; padding:48px 20px; }
.lm-coming-icon { font-size:48px; margin-bottom:12px; }
.lm-coming-text { font-family:var(--d); font-size:24px; font-style:italic; color:var(--ink); }
.lm-coming-sub  { font-family:var(--s); font-size:14px; color:var(--muted); margin-top:6px; }
.lm-done-btn {
  width:100%; padding:16px; background:var(--red); border:none;
  border-radius:14px; color:var(--bg);
  font-family:var(--d); font-size:18px; font-style:italic;
  cursor:pointer; margin-top:24px; transition:.2s;
}
.lm-done-btn:hover { opacity:.88; }

[data-theme=dark]   .learn-header { background:rgba(10,8,4,.92) !important; }
[data-theme=amoled] .learn-header { background:rgba(0,0,0,.96) !important; }
[data-theme=dark]   .ll { background:rgba(26,18,8,.82) !important; }
[data-theme=amoled] .ll { background:rgba(0,0,0,.85) !important; }
[data-theme=dark]   .ltab { background:rgba(26,18,8,.75) !important; }
[data-theme=dark]   .ltab.active { background:var(--red) !important; }
[data-theme=dark]   .lmodal-box { background:var(--bg); }
</style>
