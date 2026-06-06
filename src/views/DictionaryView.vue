<template>
  <div class="dict">
    <!-- TOPBAR -->
    <div class="topbar">
      <div class="topbar-left">
        <span class="brand">Բառ · Армянский</span>
        <button class="aybouben-btn" @click="activeTab='alpha'">Այbубен</button>
      </div>
      <div class="themes">
        <button v-for="t in themes" :key="t.v"
          class="th" :class="{on:theme===t.v}"
          @click="setTheme(t.v)">{{ t.l }}</button>
      </div>
    </div>

    <!-- HERO -->
    <div class="hero">
      <div>
        <div class="h-eyebrow">Тренажёр армянского языка</div>
        <div class="h-title">Բառ</div>
        <div class="h-sub">Слово за словом</div>
      </div>
      <div class="ring-wrap">
        <svg width="72" height="72" viewBox="0 0 72 72">
          <circle cx="36" cy="36" r="30" fill="none" stroke="var(--line)" stroke-width="2.5"/>
          <circle cx="36" cy="36" r="30" fill="none" stroke="var(--red)"
            stroke-width="2.5" stroke-linecap="round"
            :stroke-dasharray="188.5"
            :stroke-dashoffset="188.5*(1-learnedCount/Math.max(words.length,1))"
            transform="rotate(-90 36 36)"
            style="transition:stroke-dashoffset .6s"/>
          <text x="36" y="41" text-anchor="middle"
            font-family="Fraunces" font-size="19" font-weight="700"
            fill="var(--ink)">{{ learnedCount }}</text>
        </svg>
        <div class="ring-label">выучено</div>
      </div>
    </div>

    <!-- STRIP -->
    <div class="strip">
      <div v-for="cat in cats" :key="cat" class="sc">
        <div class="sc-name">{{ cat }}</div>
        <div class="sc-bar"><div class="sc-fill" :style="{width:catProgress(cat)+'%'}"></div></div>
        <div class="sc-num">{{ catLearned(cat) }}/{{ catTotal(cat) }}</div>
      </div>
    </div>

    <!-- NAV -->
    <div class="nav">
      <div class="nav-tabs">
        <button v-for="tab in tabs" :key="tab.v"
          class="ntab" :class="{on:activeTab===tab.v}"
          @click="activeTab=tab.v">{{ tab.l }}</button>
      </div>
      <div class="card-tools" v-if="activeTab==='cards'">
        <button class="tbtn" @click="doShuffle">⇄</button>
        <button class="tbtn" :class="{on:onlyUnlearned}" @click="onlyUnlearned=!onlyUnlearned">
          Не выученные
        </button>
      </div>
    </div>

    <!-- CONTENT -->
    <div class="content">
      <AlphabetTab  v-if="activeTab==='alpha'" :words="words" />
      <PronounsTab  v-else-if="activeTab==='pron'" />
      <NumbersTab   v-else-if="activeTab==='nums'" />

      <div v-else-if="activeTab==='cards'">
        <div class="pills">
          <button v-for="c in ['all',...cats]" :key="c"
            class="pill" :class="{on:currentCat===c}"
            @click="currentCat=c">
            {{ c==='all'?'Все':c }}
            <span v-if="c!=='all'">{{ catTotal(c) }}</span>
          </button>
        </div>
        <div class="wcount">{{ displayWords.length }} слов</div>
        <div class="grid">
          <WordCard v-for="(w,i) in displayWords" :key="w.id"
            :word="w" :index="i"
            :learned="learned.has(w.id)"
            @toggle-learn="toggleLearn(w.id)" />
        </div>
        <div class="shelf" v-if="learnedCount>0">
          <div class="shelf-h">
            <span class="shelf-t">Выученные</span>
            <span class="shelf-c">{{ learnedCount }}</span>
          </div>
          <div class="shelf-list">
            <div v-for="w in learnedWords" :key="w.id" class="chip">
              {{ w.arm }}<span>{{ w.ru }}</span>
            </div>
          </div>
        </div>
      </div>

      <QuizTab    v-else-if="activeTab==='quiz'" :words="words" />
      <PhrasesTab v-else-if="activeTab==='sent'" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import WordCard    from '../components/WordCard.vue'
import AlphabetTab from '../components/AlphabetTab.vue'
import PronounsTab from '../components/PronounsTab.vue'
import NumbersTab  from '../components/NumbersTab.vue'
import QuizTab     from '../components/QuizTab.vue'
import PhrasesTab  from '../components/PhrasesTab.vue'

const props  = defineProps({ words: Array })
defineEmits(['go-learn'])

const SK = 'barr_v8'
const learned = ref(new Set(JSON.parse(localStorage.getItem(SK)||'[]')))
const save = () => localStorage.setItem(SK, JSON.stringify([...learned.value]))

const theme  = ref(localStorage.getItem('barr_theme')||'light')
const themes = [{v:'light',l:'Light'},{v:'dark',l:'Dark'},{v:'amoled',l:'AMOLED'}]
function setTheme(t) {
  theme.value = t
  document.documentElement.dataset.theme = t
  localStorage.setItem('barr_theme', t)
}
onMounted(() => { document.documentElement.dataset.theme = theme.value })

const tabs = [
  {v:'alpha',l:'Алфавит'},{v:'pron',l:'Местоимения'},
  {v:'nums',l:'Числа'},{v:'cards',l:'Карточки'},
  {v:'quiz',l:'Тест'},{v:'sent',l:'Фразы'},
]
const activeTab      = ref('alpha')
const currentCat     = ref('all')
const onlyUnlearned  = ref(false)
const shuffleKey     = ref(0)

const cats = computed(() => [...new Set(props.words.map(w=>w.cat))])

const displayWords = computed(() => {
  let list = currentCat.value==='all' ? [...props.words]
    : props.words.filter(w=>w.cat===currentCat.value)
  if (onlyUnlearned.value) list = list.filter(w=>!learned.value.has(w.id))
  return list
})

function doShuffle() {
  shuffleKey.value++
  displayWords.value.sort(()=>Math.random()-.5)
}

const learnedCount = computed(() => learned.value.size)
const learnedWords = computed(() => props.words.filter(w=>learned.value.has(w.id)))

function toggleLearn(id) {
  const s = new Set(learned.value)
  s.has(id) ? s.delete(id) : s.add(id)
  learned.value = s; save()
}

function catTotal(cat)    { return props.words.filter(w=>w.cat===cat).length }
function catLearned(cat)  { return props.words.filter(w=>w.cat===cat&&learned.value.has(w.id)).length }
function catProgress(cat) { return catTotal(cat) ? catLearned(cat)/catTotal(cat)*100 : 0 }
</script>

<style scoped>
.dict { min-height:100vh; }
.aybouben-btn {
  font-family:var(--m); font-size:10px; letter-spacing:2px; text-transform:uppercase;
  color:var(--muted); background:transparent; border:1px solid var(--line);
  padding:5px 12px; cursor:pointer; transition:.15s; margin-left:14px;
}
.aybouben-btn:hover { color:var(--ink); border-color:var(--gold); }
.topbar-left { display:flex; align-items:center; }
.card-tools  { display:flex; gap:8px; }
</style>
