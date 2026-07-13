<template>
  <div class="dict-tab">
    <div class="dt-header">
      <div class="dt-title">Словарь</div>
      <div class="dt-count">{{ words.length }} слов · {{ learned.size }} выучено</div>
    </div>

    <!-- Только 2 таба -->
    <div class="dt-tabs">
      <button class="dt-tab" :class="{on: tab==='list'}" @click="tab='list'">Словарь</button>
      <button class="dt-tab" :class="{on: tab==='swipe'}" @click="tab='swipe'">Карточки</button>
    </div>

    <!-- ══ СЛОВАРЬ ══ -->
    <div v-if="tab==='list'" class="dt-list">
      <div class="dt-search-wrap">
        <input v-model="search" class="dt-search" placeholder="Поиск по-армянски, по-русски..." />
      </div>
      <div class="dt-pills">
        <button v-for="c in ['all',...cats]" :key="c"
          class="pill" :class="{on: cat===c}" @click="cat=c">
          {{ c==='all' ? 'Все' : c }}
        </button>
      </div>
      <div class="dt-words">
        <div v-for="w in filtered" :key="w.id"
          class="dt-word" :class="{learned: learned.has(w.id)}"
          @click="selected=selected===w.id?null:w.id">
          <div class="dtw-arm">{{ w.arm }}</div>
          <button class="dtw-play" :title="playTitle" @click.stop="speak(w.arm)">▶</button>
          <div class="dtw-tr">{{ w.translit }}</div>
          <div class="dtw-ru" v-if="selected===w.id">{{ w.ru }}</div>
          <button class="dtw-learn" @click.stop="$emit('toggle-learn',w.id)">
            {{ learned.has(w.id) ? '✓' : '+' }}
          </button>
        </div>
      </div>
    </div>

    <!-- ══ КАРТОЧКИ (свайп) ══ -->
    <div v-else class="swipe-wrap">

      <!-- Прогресс -->
      <div class="sw-progress">
        <div class="sw-prog-bar">
          <div class="sw-prog-fill" :style="{width: progPct+'%'}"></div>
        </div>
        <div class="sw-prog-lbl">{{ swIdx + 1 }} / {{ swDeck.length }}</div>
      </div>

      <!-- Подсказки управления -->
      <div class="sw-hints">
        <div class="sw-hint left">← выучил</div>
        <div class="sw-hint tap">нажми / пробел — перевод</div>
        <div class="sw-hint right">дальше →</div>
      </div>

      <!-- Карточка -->
      <div class="sw-card-row">
        <button class="sw-arrow-btn left" @click="swipeLeft" title="Стрелка влево — выучил">
          <svg viewBox="0 0 24 24" width="20" height="20"><path d="M4 12l8-8v5h8v6h-8v5z" fill="currentColor"/></svg>
        </button>

        <div v-if="swDeck.length > 0 && swIdx < swDeck.length"
        class="sw-card"
        :class="{flipped: cardFlipped, fly_left: flying==='left', fly_right: flying==='right'}"
        @click="cardFlipped = !cardFlipped"
        @touchstart="onTouchStart"
        @touchend="onTouchEnd"
        @mousedown="onMouseDown"
        @mouseup="onMouseUp">

        <div class="sw-card-inner">
          <!-- Передняя сторона -->
          <div class="sw-front">
            <div class="sw-word">{{ swDeck[swIdx].arm }}</div>
            <div class="sw-tr">{{ swDeck[swIdx].translit }}</div>
            <div class="sw-cat">{{ swDeck[swIdx].cat }}</div>
          </div>
          <!-- Задняя сторона -->
          <div class="sw-back">
            <div class="sw-word">{{ swDeck[swIdx].arm }}</div>
            <div class="sw-tr">{{ swDeck[swIdx].translit }}</div>
            <div class="sw-ru">{{ swDeck[swIdx].ru }}</div>
          </div>
        </div>

        <!-- Индикаторы свайпа -->
        <div class="sw-indicator left" v-if="dragDelta < -40">✓ Выучил</div>
        <div class="sw-indicator right" v-if="dragDelta > 40">Дальше →</div>
        </div>

        <!-- Завершение колоды -->
        <div v-else-if="swIdx >= swDeck.length" class="sw-done">
          <div class="sw-done-icon">🎉</div>
          <div class="sw-done-title">Колода пройдена!</div>
          <div class="sw-done-sub">Выучено за сессию: {{ sessionLearned }}</div>
          <button class="sw-done-btn" @click="resetDeck">Начать заново</button>
          <button class="sw-done-btn outline" @click="resetDeckUnlearned">Только невыученные</button>
        </div>

        <button class="sw-arrow-btn right" @click="swipeRight" title="Стрелка вправо — дальше">
          <svg viewBox="0 0 24 24" width="20" height="20"><path d="M20 12l-8-8v5H4v6h8v5z" fill="currentColor"/></svg>
        </button>
      </div>

      <!-- Фильтр колоды -->
      <div class="sw-filter">
        <button v-for="f in FILTERS" :key="f.v"
          class="sf-btn" :class="{on: swFilter===f.v}"
          @click="setFilter(f.v)">{{ f.l }}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useSpeech } from '../../composables/useSpeech.js'

const props = defineProps({ words: Array, learned: Object })
const emit  = defineEmits(['toggle-learn'])
const { speak, hasArmenianVoice } = useSpeech()
const playTitle = computed(() => hasArmenianVoice.value
  ? 'Прослушать произношение'
  : 'Армянский голос не найден в браузере — приближённое произношение')

// ── СЛОВАРЬ ─────────────────────────────────────────────
const tab      = ref('list')
const search   = ref('')
const cat      = ref('all')
const selected = ref(null)

const cats = computed(() => [...new Set(props.words.map(w => w.cat))].sort())

const filtered = computed(() => {
  let list = cat.value === 'all' ? [...props.words] : props.words.filter(w => w.cat === cat.value)
  if (search.value) {
    const q = search.value.toLowerCase()
    list = list.filter(w =>
      w.arm.includes(search.value) ||
      w.ru.toLowerCase().includes(q) ||
      w.translit.toLowerCase().includes(q)
    )
  }
  return list
})

// ── КАРТОЧКИ ─────────────────────────────────────────────
const FILTERS = [
  { v: 'all',      l: 'Все слова' },
  { v: 'unlearned', l: 'Невыученные' },
  { v: 'learned',   l: 'Повторить выученные' },
]

const swFilter      = ref('unlearned')
const swIdx         = ref(0)
const cardFlipped   = ref(false)
const flying        = ref(null)
const sessionLearned = ref(0)

// touch state
const touchStartX   = ref(0)
const mouseStartX   = ref(0)
const dragDelta     = ref(0)
const isDragging    = ref(false)

const swDeck = computed(() => {
  if (swFilter.value === 'unlearned') return props.words.filter(w => !props.learned.has(w.id))
  if (swFilter.value === 'learned')   return props.words.filter(w =>  props.learned.has(w.id))
  return [...props.words]
})

const progPct = computed(() =>
  swDeck.value.length ? Math.round(swIdx.value / swDeck.value.length * 100) : 0
)

function setFilter(f) {
  swFilter.value = f
  swIdx.value = 0
  cardFlipped.value = false
  dragDelta.value = 0
}

function resetDeck() {
  swIdx.value = 0
  cardFlipped.value = false
  sessionLearned.value = 0
  dragDelta.value = 0
}

function resetDeckUnlearned() {
  swFilter.value = 'unlearned'
  swIdx.value = 0
  cardFlipped.value = false
  sessionLearned.value = 0
  dragDelta.value = 0
}

function swipeLeft() {
  // Выучил
  const w = swDeck.value[swIdx.value]
  if (w && !props.learned.has(w.id)) {
    emit('toggle-learn', w.id)
    sessionLearned.value++
  }
  animateAndNext('left')
}

function swipeRight() {
  // Пропустить
  animateAndNext('right')
}

function animateAndNext(dir) {
  flying.value = dir
  cardFlipped.value = false
  setTimeout(() => {
    flying.value = null
    dragDelta.value = 0
    swIdx.value++
  }, 280)
}

// ── TOUCH ────────────────────────────────────────────────
function onTouchStart(e) {
  touchStartX.value = e.touches[0].clientX
  dragDelta.value = 0
  isDragging.value = true
}
function onTouchEnd(e) {
  if (!isDragging.value) return
  isDragging.value = false
  const dx = e.changedTouches[0].clientX - touchStartX.value
  dragDelta.value = dx
  if (dx < -60)      swipeLeft()
  else if (dx > 60)  swipeRight()
  else               dragDelta.value = 0
}

// ── MOUSE (desktop) ──────────────────────────────────────
function onMouseDown(e) {
  mouseStartX.value = e.clientX
  dragDelta.value = 0
  isDragging.value = true
}
function onMouseUp(e) {
  if (!isDragging.value) return
  isDragging.value = false
  const dx = e.clientX - mouseStartX.value
  dragDelta.value = dx
  if (dx < -60)      swipeLeft()
  else if (dx > 60)  swipeRight()
  else               dragDelta.value = 0
}

watch(() => props.words, () => { swIdx.value = 0 })

// ── KEYBOARD (desktop arrows) ────────────────────────────
function onKeydown(e) {
  if (tab.value !== 'swipe') return
  if (swIdx.value >= swDeck.value.length) return
  if (e.key === 'ArrowLeft') {
    e.preventDefault()
    swipeLeft()
  } else if (e.key === 'ArrowRight') {
    e.preventDefault()
    swipeRight()
  } else if (e.key === ' ' || e.key === 'Enter') {
    e.preventDefault()
    cardFlipped.value = !cardFlipped.value
  }
}
onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<style scoped>
.dict-tab { padding-bottom: 80px; }

/* ── HEADER ── */
.dt-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 20px 20px 16px; border-bottom: 1px solid var(--line);
  position: sticky; top: 0; z-index: 10;
  background:var(--glass-bg-strong);
border-color:var(--glass-border);}
.dt-title { font-family: var(--d); font-size: 28px; font-weight: 700; font-style: italic; color: var(--red); }
.dt-count { font-family: var(--m); font-size: 10px; letter-spacing: 1px; color: var(--muted); }

/* ── TABS ── */
.dt-tabs {
  display: flex; border-bottom: 1px solid var(--line);
  position: sticky; top: 69px; z-index: 9; background:var(--glass-bg-strong);
border-color:var(--glass-border);box-shadow:inset 0 1px 0 var(--glass-shine),0 4px 16px var(--glass-shadow);}
.dt-tab {
  flex: 1; padding: 12px; background: none; border: none;
  border-bottom: 2px solid transparent;
  font-family: var(--s); font-size: 14px; color: var(--muted);
  cursor: pointer; transition:.15s var(--spring); position: relative; bottom: -1px;
}
.dt-tab.on { color: var(--red); border-bottom-color: var(--red); font-weight: 600; }

/* ── СПИСОК ── */
.dt-list { padding: 12px 16px 0; }
.dt-search-wrap { margin-bottom: 10px; }
.dt-search {
  width: 100%; padding: 10px 14px; border: 1px solid var(--line);
  border-radius: 10px; background:var(--glass-bg);
  font-family: var(--s); font-size: 15px; color: var(--ink); outline: none;
  box-sizing: border-box;
border-color:var(--glass-border);box-shadow:inset 0 1px 0 var(--glass-shine),0 4px 16px var(--glass-shadow);}
.dt-search:focus { border-color: var(--gold); }
.dt-pills { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 12px; }
.pill {
  padding: 5px 12px; border: 1px solid var(--line); border-radius: 20px;
  background:var(--glass-bg); font-family: var(--m); font-size: 10px;
  letter-spacing: 1px; color: var(--ink); cursor: pointer; transition:.15s var(--spring);
  text-transform: capitalize;
border-color:var(--glass-border);box-shadow:inset 0 1px 0 var(--glass-shine),0 4px 16px var(--glass-shadow);}
.pill:hover { border-color: var(--gold); }
.pill.on { background: var(--red); border-color: var(--red); color: var(--on-accent); }
.dt-words { display: flex; flex-direction: column; gap: 6px; }
.dt-word {
  display: flex; align-items: center; gap: 10px;
  padding: 12px 14px; border: 1px solid var(--line);
  border-radius: 10px; background:var(--glass-bg);
  cursor: pointer; transition: background-color .15s, border-color .15s; flex-wrap: wrap;
  content-visibility: auto; contain-intrinsic-size: 0 58px;
border-color:var(--glass-border);box-shadow:inset 0 1px 0 var(--glass-shine),0 4px 16px var(--glass-shadow);}
.dt-word.learned { border-color: var(--gold); background: rgba(176,120,40,.07); }
.dtw-arm  { font-family: var(--d); font-size: 22px; font-style: italic; color: var(--red); flex-shrink: 0; }
.dtw-play {
  width: 22px; height: 22px; border-radius: 50%; flex-shrink: 0;
  border: 1px solid var(--line); background: transparent;
  font-size: 9px; color: var(--muted); cursor: pointer;
  display: flex; align-items: center; justify-content: center; padding-left: 1px;
  transition: .15s var(--spring);
}
.dtw-play:hover { border-color: var(--gold); color: var(--gold); }
.dtw-tr   { font-family: var(--m); font-size: 11px; color: var(--muted); flex: 1; }
.dtw-ru   { width: 100%; font-family: var(--s); font-size: 15px; color: var(--ink); padding-top: 6px; border-top: 1px solid var(--line); margin-top: 4px; }
.dtw-learn {
  margin-left: auto; width: 28px; height: 28px; border-radius: 50%;
  border: 1px solid var(--line); background: transparent;
  font-size: 14px; color: var(--muted); cursor: pointer; flex-shrink: 0;
}
.dt-word.learned .dtw-learn { background: var(--gold); border-color: var(--gold); color: var(--on-accent); }

/* ── КАРТОЧКИ ── */
.swipe-wrap {
  display: flex; flex-direction: column; align-items: center;
  padding: 16px 20px; gap: 16px; min-height: 70vh;
}

.sw-progress { width: 100%; display: flex; align-items: center; gap: 10px; }
.sw-prog-bar { flex: 1; height: 4px; background: var(--line2); border-radius: 2px; }
.sw-prog-fill { height: 100%; background: var(--red); border-radius: 2px; transition: width .3s; }
.sw-prog-lbl { font-family: var(--m); font-size: 11px; color: var(--muted); white-space: nowrap; }

.sw-hints { display: flex; gap: 20px; }
.sw-hint { font-family: var(--m); font-size: 10px; letter-spacing: 1px; color: var(--muted); text-transform: uppercase; }
.sw-hint.left  { color: var(--gold); }
.sw-hint.tap   { color: var(--muted); }
.sw-hint.right { color: var(--blue); }

.sw-card {
  width: 100%; max-width: 420px;
  min-height: 280px;
  position: relative;
  cursor: pointer;
  perspective: 1000px;
  user-select: none;
  transition: transform .28s ease, opacity .28s ease;
}

.sw-card-row {
  width: 100%; display: flex; align-items: center; justify-content: center;
  gap: 14px;
}
.sw-arrow-btn {
  flex-shrink: 0; width: 44px; height: 44px; border-radius: 50%;
  border: 1px solid var(--line); background:var(--glass-bg);
  color: var(--muted); cursor: pointer; display: none;
  align-items: center; justify-content: center; transition:.15s var(--spring);
border-color:var(--glass-border);box-shadow:inset 0 1px 0 var(--glass-shine),0 4px 16px var(--glass-shadow);}
.sw-arrow-btn:hover { border-color: var(--gold); color: var(--ink); transform: scale(1.06); }
.sw-arrow-btn.left:hover  { border-color: var(--gold); color: var(--gold); }
.sw-arrow-btn.right:hover { border-color: var(--blue); color: var(--blue); }
@media (hover: hover) and (pointer: fine) {
  .sw-arrow-btn { display: flex; }
}

.sw-card.fly_left  { transform: translateX(-130%) rotate(-8deg); opacity: 0; }
.sw-card.fly_right { transform: translateX(130%) rotate(8deg); opacity: 0; }

.sw-card-inner {
  width: 100%; height: 100%; min-height: 280px;
  position: relative;
  transform-style: preserve-3d;
  transition: transform .4s ease;
  border-radius: 20px;
}
.sw-card.flipped .sw-card-inner { transform: rotateY(180deg); }

.sw-front, .sw-back {
  position: absolute; width: 100%; min-height: 280px;
  backface-visibility: hidden;
  border-radius: 20px;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 10px;
  padding: 32px 24px; box-sizing: border-box;
  border: 2px solid var(--line);
  background:var(--glass-bg);
border-color:var(--glass-border);box-shadow:inset 0 1px 0 var(--glass-shine),0 4px 16px var(--glass-shadow);}
.sw-back {
  transform: rotateY(180deg);
  background:var(--glass-bg);
  border-color: var(--gold);
border-color:var(--glass-border);box-shadow:inset 0 1px 0 var(--glass-shine),0 4px 16px var(--glass-shadow);}

.sw-word { font-family: var(--d); font-size: clamp(32px,8vw,52px); font-style: italic; font-weight: 700; color: var(--red); text-align: center; line-height: 1.1; }
.sw-tr   { font-family: var(--m); font-size: 14px; color: var(--muted); letter-spacing: 1px; }
.sw-cat  { font-family: var(--m); font-size: 10px; color: var(--muted); opacity: .6; text-transform: uppercase; letter-spacing: 2px; }
.sw-ru   { font-family: var(--s); font-size: 24px; font-weight: 700; color: var(--ink); text-align: center; }

.sw-indicator {
  position: absolute; top: 50%; transform: translateY(-50%);
  font-family: var(--m); font-size: 12px; font-weight: 700;
  letter-spacing: 2px; text-transform: uppercase;
  padding: 6px 16px; border-radius: 20px;
  pointer-events: none; z-index: 10;
}
.sw-indicator.left  { left: 16px;  background: var(--gold);  color: var(--on-accent); }
.sw-indicator.right { right: 16px; background: var(--blue);  color: var(--on-accent); }

/* Финальный экран */
.sw-done {
  display: flex; flex-direction: column; align-items: center; gap: 14px;
  padding: 40px 20px; text-align: center;
}
.sw-done-icon  { font-size: 56px; }
.sw-done-title { font-family: var(--d); font-size: 28px; font-style: italic; color: var(--red); }
.sw-done-sub   { font-family: var(--s); font-size: 15px; color: var(--muted); }
.sw-done-btn {
  padding: 14px 28px; background: var(--red); color: var(--on-accent);
  border: none; border-radius: 12px; font-family: var(--s); font-size: 15px;
  font-weight: 600; cursor: pointer; width: 100%; max-width: 280px;
}
.sw-done-btn.outline { background: transparent; border: 2px solid var(--red); color: var(--red); margin-top: -4px; }

/* Фильтр */
.sw-filter { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; margin-top: auto; }
.sf-btn {
  padding: 8px 16px; border: 1px solid var(--line); border-radius: 20px;
  background: transparent; font-family: var(--m); font-size: 10px;
  letter-spacing: 1px; color: var(--muted); cursor: pointer; transition:.15s var(--spring);
  text-transform: uppercase;
}
.sf-btn.on { background: var(--red); border-color: var(--red); color: var(--on-accent); }
</style>
