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
      <button class="dt-cat-select" @click="catModalOpen = true">
        <span class="dcs-label">Категория</span>
        <span class="dcs-value">{{ cat==='all' ? 'Все слова' : cat }}</span>
        <span class="dcs-arrow">▾</span>
      </button>
      <div class="dt-words">
        <div v-for="w in filtered" :key="w.id"
          class="dt-word" :class="{learned: learned.has(w.id)}"
          @click="selected=selected===w.id?null:w.id">
          <div class="dtw-arm">{{ w.arm }}</div>
          <button class="dtw-play" v-if="w.audioUrl" title="Прослушать произношение" @click.stop="playWord(w)">▶</button>
          <div class="dtw-tr">{{ w.translit }}</div>
          <div class="dtw-ru" v-if="selected===w.id">{{ w.ru }}</div>
          <div class="dtw-mnem" v-if="selected===w.id" @click.stop>
            <textarea
              class="dtw-mnem-input"
              :value="mnemonics[w.id] || ''"
              placeholder="Твоя ассоциация (необязательно)"
              @blur="onMnemonicBlur(w.id, $event.target.value)"
            ></textarea>
          </div>
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
        <button class="sw-img-toggle" :class="{on: imageMode}" title="Режим: картинка → слово" @click="imageMode=!imageMode">🖼</button>
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
            <template v-if="imageMode">
              <img v-if="swDeck[swIdx].imageUrl" class="sw-img" :src="swDeck[swIdx].imageUrl" :alt="swDeck[swIdx].ru" />
              <div v-else class="sw-img-placeholder">
                <span class="sw-img-ph-icon">🖼</span>
                <span>Изображение скоро появится</span>
              </div>
            </template>
            <template v-else>
              <div class="sw-word">{{ swDeck[swIdx].arm }}</div>
              <div class="sw-tr">{{ swDeck[swIdx].translit }}</div>
            </template>
            <div class="sw-cat">{{ swDeck[swIdx].cat }}</div>
          </div>
          <!-- Задняя сторона -->
          <div class="sw-back">
            <div class="sw-word">{{ swDeck[swIdx].arm }}</div>
            <div class="sw-tr">{{ swDeck[swIdx].translit }}</div>
            <div class="sw-ru">{{ swDeck[swIdx].ru }}</div>
            <div class="sw-example" v-if="swDeck[swIdx].exampleAm">
              <div class="sw-ex-am" v-html="highlightWord(swDeck[swIdx].exampleAm, swDeck[swIdx].arm)"></div>
              <div class="sw-ex-ru">{{ swDeck[swIdx].exampleRu }}</div>
            </div>
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

    <!-- ══ ВЫБОР КАТЕГОРИИ ══ -->
    <Teleport to="body">
      <transition name="cm-fade">
        <div v-if="catModalOpen" class="cat-modal-overlay" @click.self="catModalOpen=false">
          <div class="cat-modal">
            <div class="cat-modal-header">
              <div class="cat-modal-title">Категория</div>
              <button class="cat-modal-close" @click="catModalOpen=false">✕</button>
            </div>
            <div class="cat-grid">
              <button class="cat-chip" :class="{on: cat==='all'}" @click="selectCat('all')">
                Все слова <span class="cat-chip-n">{{ words.length }}</span>
              </button>
              <button v-for="c in cats" :key="c"
                class="cat-chip" :class="{on: cat===c}" @click="selectCat(c)">
                {{ c }} <span class="cat-chip-n">{{ catCounts[c] }}</span>
              </button>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useSpeech } from '../../composables/useSpeech.js'

const props = defineProps({ words: Array, learned: Object, mnemonics: { type: Object, default: () => ({}) } })
const emit  = defineEmits(['toggle-learn', 'save-mnemonic'])
const { playWord } = useSpeech()

function onMnemonicBlur(id, text) {
  const trimmed = text.trim()
  if (trimmed === (props.mnemonics[id] || '')) return
  emit('save-mnemonic', id, trimmed)
}

// ── СЛОВАРЬ ─────────────────────────────────────────────
const tab      = ref('list')
const search   = ref('')
const cat      = ref('all')
const selected = ref(null)

const cats = computed(() => [...new Set(props.words.map(w => w.cat))].sort())
const catCounts = computed(() => {
  const m = {}
  props.words.forEach(w => { m[w.cat] = (m[w.cat]||0) + 1 })
  return m
})
const catModalOpen = ref(false)
function selectCat(c) { cat.value = c; catModalOpen.value = false }

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
const imageMode = ref(false)
function highlightWord(sentence, word) {
  if (!sentence || !word) return sentence || ''
  return sentence.split(word).join(`<strong>${word}</strong>`)
}

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
border-color:var(--glass-border);backdrop-filter:var(--glass-blur);-webkit-backdrop-filter:var(--glass-blur);}
.dt-title { font-family: var(--d); font-size: 28px; font-weight: 700; font-style: italic; color: var(--red); }
.dt-count { font-family: var(--m); font-size: 10px; letter-spacing: 1px; color: var(--muted); }

/* ── TABS ── */
.dt-tabs {
  display: flex; border-bottom: 1px solid var(--line);
  position: sticky; top: 69px; z-index: 9; background:var(--glass-bg-strong);
border-color:var(--glass-border);box-shadow:inset 0 1px 0 var(--glass-shine),0 4px 16px var(--glass-shadow);backdrop-filter:var(--glass-blur);-webkit-backdrop-filter:var(--glass-blur);}
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
border-color:var(--glass-border);box-shadow:inset 0 1px 0 var(--glass-shine),0 4px 16px var(--glass-shadow);backdrop-filter:var(--glass-blur);-webkit-backdrop-filter:var(--glass-blur);}
.dt-search:focus { border-color: var(--gold); }
.dt-cat-select {
  display: flex; align-items: center; gap: 8px; width: 100%;
  padding: 12px 14px; margin-bottom: 12px; border: 1px solid var(--line); border-radius: 12px;
  background:var(--glass-bg); cursor: pointer; transition:.15s var(--spring); text-align: left;
border-color:var(--glass-border);box-shadow:inset 0 1px 0 var(--glass-shine),0 4px 16px var(--glass-shadow);backdrop-filter:var(--glass-blur);-webkit-backdrop-filter:var(--glass-blur);}
.dt-cat-select:hover { border-color: var(--gold); }
.dcs-label { font-family: var(--m); font-size: 9px; letter-spacing: 1px; text-transform: uppercase; color: var(--muted); }
.dcs-value { font-family: var(--s); font-size: 14px; font-weight: 600; color: var(--ink); text-transform: capitalize; flex: 1; }
.dcs-arrow { color: var(--muted); font-size: 12px; }

/* ── МОДАЛ ВЫБОРА КАТЕГОРИИ ── */
.cat-modal-overlay { position: fixed; inset: 0; z-index: 1000; background: rgba(0,0,0,.5); display: flex; align-items: flex-end; }
.cat-modal { width: 100%; max-height: 80dvh; overflow-y: auto; background: var(--bg); border-radius: 24px 24px 0 0; padding: 20px; box-shadow: 0 -8px 40px rgba(0,0,0,.3); }
.cat-modal-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.cat-modal-title { font-family: var(--d); font-size: 22px; font-style: italic; color: var(--red); }
.cat-modal-close { width: 32px; height: 32px; border-radius: 50%; background: rgba(128,6,19,.1); border: none; font-size: 14px; color: var(--red); cursor: pointer; }
.cat-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px,1fr)); gap: 8px; }
.cat-chip {
  padding: 10px 12px; border: 1px solid var(--line); border-radius: 12px;
  background:var(--glass-bg); font-family: var(--s); font-size: 13px;
  color: var(--ink); cursor: pointer; transition:.15s var(--spring);
  text-transform: capitalize; display: flex; align-items: center; justify-content: space-between; gap: 6px;
border-color:var(--glass-border);box-shadow:inset 0 1px 0 var(--glass-shine),0 4px 16px var(--glass-shadow);backdrop-filter:var(--glass-blur);-webkit-backdrop-filter:var(--glass-blur);}
.cat-chip:hover { border-color: var(--gold); }
.cat-chip.on { background: var(--red); border-color: var(--red); color: var(--on-accent); }
.cat-chip-n { font-family: var(--m); font-size: 10px; opacity: .65; }
.cm-fade-enter-active, .cm-fade-leave-active { transition: opacity .2s; }
.cm-fade-enter-active .cat-modal, .cm-fade-leave-active .cat-modal { transition: transform .25s cubic-bezier(.22,.61,.36,1); }
.cm-fade-enter-from { opacity: 0; }
.cm-fade-enter-from .cat-modal { transform: translateY(40px); }
.cm-fade-leave-to { opacity: 0; }

[data-theme=dark] .cat-modal, [data-theme=amoled] .cat-modal { background: #0a0804; }
[data-theme=dark] .cat-chip, [data-theme=amoled] .cat-chip { background: rgba(24,16,8,.94) !important; border-color: rgba(246,140,54,.2) !important; }
.dt-words { display: flex; flex-direction: column; gap: 6px; }
.dt-word {
  display: flex; align-items: center; gap: 10px;
  padding: 12px 14px; border: 1px solid var(--line);
  border-radius: 10px; background:var(--glass-bg);
  cursor: pointer; transition: background-color .15s, border-color .15s; flex-wrap: wrap;
  content-visibility: auto; contain-intrinsic-size: auto 58px;
border-color:var(--glass-border);box-shadow:inset 0 1px 0 var(--glass-shine),0 4px 16px var(--glass-shadow);backdrop-filter:var(--glass-blur);-webkit-backdrop-filter:var(--glass-blur);}
.dt-word.learned { border-color: var(--gold); background: rgba(246,140,54,.07); }
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
.dtw-mnem { width: 100%; margin-top: 8px; }
.dtw-mnem-input {
  width: 100%; box-sizing: border-box; resize: vertical; min-height: 44px;
  padding: 8px 10px; border: 1px dashed var(--line2); border-radius: 8px;
  background: var(--glass-bg); font-family: var(--s); font-size: 12px; color: var(--ink);
  font-style: italic; outline: none;
}
.dtw-mnem-input:focus { border-color: var(--gold); }
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
.sw-img-toggle {
  flex-shrink: 0; width: 30px; height: 30px; border-radius: 50%;
  border: 1px solid var(--line); background: var(--glass-bg); font-size: 14px; cursor: pointer;
  display: flex; align-items: center; justify-content: center; transition: .15s var(--spring);
}
.sw-img-toggle:hover { border-color: var(--gold); }
.sw-img-toggle.on { background: var(--red); border-color: var(--red); }

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
border-color:var(--glass-border);box-shadow:inset 0 1px 0 var(--glass-shine),0 4px 16px var(--glass-shadow);backdrop-filter:var(--glass-blur);-webkit-backdrop-filter:var(--glass-blur);}
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
border-color:var(--glass-border);box-shadow:inset 0 1px 0 var(--glass-shine),0 4px 16px var(--glass-shadow);backdrop-filter:var(--glass-blur);-webkit-backdrop-filter:var(--glass-blur);}
.sw-back {
  transform: rotateY(180deg);
  background:var(--glass-bg);
  border-color: var(--gold);
border-color:var(--glass-border);box-shadow:inset 0 1px 0 var(--glass-shine),0 4px 16px var(--glass-shadow);backdrop-filter:var(--glass-blur);-webkit-backdrop-filter:var(--glass-blur);}

.sw-word { font-family: var(--d); font-size: clamp(32px,8vw,52px); font-style: italic; font-weight: 700; color: var(--red); text-align: center; line-height: 1.1; }
.sw-tr   { font-family: var(--m); font-size: 14px; color: var(--muted); letter-spacing: 1px; }
.sw-cat  { font-family: var(--m); font-size: 10px; color: var(--muted); opacity: .6; text-transform: uppercase; letter-spacing: 2px; }
.sw-ru   { font-family: var(--s); font-size: 24px; font-weight: 700; color: var(--ink); text-align: center; }
.sw-img  { max-width: 100%; max-height: 140px; border-radius: 12px; object-fit: cover; }
.sw-img-placeholder {
  display: flex; flex-direction: column; align-items: center; gap: 8px;
  color: var(--muted); font-family: var(--s); font-size: 12px; font-style: italic; text-align: center;
  padding: 20px; border: 1.5px dashed var(--line2); border-radius: 12px;
}
.sw-img-ph-icon { font-size: 32px; opacity: .5; }
.sw-example {
  margin-top: 6px; padding: 10px 14px; border-radius: 12px; background: rgba(35,88,138,.07);
  max-width: 100%; box-sizing: border-box;
}
.sw-ex-am { font-family: var(--s); font-size: 13px; color: var(--ink); line-height: 1.5; }
.sw-ex-am :deep(strong) { color: var(--red); font-weight: 700; }
.sw-ex-ru { font-family: var(--m); font-size: 11px; color: var(--muted); margin-top: 4px; font-style: italic; }

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
