<template>
  <div class="dict-tab">
    <div class="dt-header">
      <div class="dt-title">Словарь</div>
      <div class="dt-count">{{ words.length }} слов</div>
    </div>
    <div class="dt-search-wrap">
      <input v-model="search" class="dt-search" placeholder="Поиск..." />
    </div>
    <!-- Табы категорий -->
    <div class="dt-tabs">
      <button v-for="tab in mainTabs" :key="tab.v"
        class="dt-tab" :class="{on: activeTab===tab.v}"
        @click="activeTab=tab.v">{{ tab.l }}</button>
    </div>
    <!-- Контент -->
    <div class="dt-content">
      <AlphabetTab  v-if="activeTab==='alpha'" :words="words" />
      <PronounsTab  v-else-if="activeTab==='pron'" />
      <NumbersTab   v-else-if="activeTab==='nums'" />
      <PhrasesTab   v-else-if="activeTab==='phrases'" />
      <div v-else>
        <!-- Фильтр категорий -->
        <div class="dt-pills">
          <button v-for="c in ['all',...cats]" :key="c"
            class="pill" :class="{on: cat===c}" @click="cat=c">
            {{ c==='all' ? 'Все' : c }}
          </button>
        </div>
        <div class="dt-words">
          <div v-for="w in filtered" :key="w.id" class="dt-word"
            :class="{learned: learned.has(w.id)}"
            @click="selected=selected===w.id?null:w.id">
            <div class="dtw-arm">{{ w.arm }}</div>
            <div class="dtw-tr">{{ w.translit }}</div>
            <div class="dtw-ru" v-if="selected===w.id">{{ w.ru }}</div>
            <button class="dtw-learn" @click.stop="$emit('toggle-learn',w.id)">
              {{ learned.has(w.id) ? '✓' : '+' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import AlphabetTab from '../AlphabetTab.vue'
import PronounsTab from '../PronounsTab.vue'
import NumbersTab  from '../NumbersTab.vue'
import PhrasesTab  from '../PhrasesTab.vue'

const props = defineProps({ words: Array, learned: Object })
defineEmits(['toggle-learn'])

const search    = ref('')
const activeTab = ref('alpha')
const cat       = ref('all')
const selected  = ref(null)

const mainTabs = [
  {v:'alpha',l:'Алфавит'}, {v:'pron',l:'Местоимения'},
  {v:'nums',l:'Числа'},    {v:'phrases',l:'Фразы'},
  {v:'cards',l:'Карточки'},
]

const cats = computed(() => [...new Set(props.words.map(w=>w.cat))])
const filtered = computed(() => {
  let list = cat.value === 'all' ? [...props.words] : props.words.filter(w=>w.cat===cat.value)
  if (search.value) {
    const q = search.value.toLowerCase()
    list = list.filter(w => w.arm.includes(search.value) || w.ru.toLowerCase().includes(q) || w.translit.toLowerCase().includes(q))
  }
  return list
})
</script>

<style scoped>
.dict-tab { padding-bottom: 20px; }
.dt-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 20px; border-bottom: 1px solid var(--line);
  position: sticky; top: 0; z-index: 10;
  background: rgba(242,232,213,.95);
}
.dt-title { font-family: var(--d); font-size: 28px; font-weight: 700; font-style: italic; color: var(--red); }
.dt-count { font-family: var(--m); font-size: 10px; letter-spacing: 2px; color: var(--muted); }
.dt-search-wrap { padding: 12px 16px; }
.dt-search {
  width: 100%; padding: 10px 14px;
  border: 1px solid var(--line); border-radius: 10px;
  background: rgba(236,221,198,.6); font-family: var(--s); font-size: 15px;
  color: var(--ink); outline: none;
}
.dt-search:focus { border-color: var(--gold); }
.dt-tabs {
  display: flex; gap: 0; overflow-x: auto; padding: 0 16px;
  border-bottom: 1px solid var(--line); margin-bottom: 16px;
}
.dt-tab {
  flex-shrink: 0; padding: 10px 16px; background: none; border: none;
  border-bottom: 2px solid transparent; font-family: var(--s); font-size: 13px;
  color: var(--muted); cursor: pointer; transition: .15s;
  position: relative; bottom: -1px;
}
.dt-tab.on { color: var(--red); border-bottom-color: var(--blue); }
.dt-content { padding: 0 16px; }
.dt-pills { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 14px; }
.pill { padding: 5px 12px; border: 1px solid var(--line); border-radius: 20px; background: transparent; font-family: var(--m); font-size: 10px; letter-spacing: 1px; color: var(--muted); cursor: pointer; transition: .15s; }
.pill.on { background: var(--red); border-color: var(--red); color: var(--bg); }
.dt-words { display: flex; flex-direction: column; gap: 6px; }
.dt-word {
  display: flex; align-items: center; gap: 10px;
  padding: 12px 14px; border: 1px solid var(--line);
  border-radius: 10px; background: rgba(236,221,198,.7);
  cursor: pointer; transition: all .15s; flex-wrap: wrap;
}
.dt-word.learned { border-color: var(--gold); background: rgba(176,120,40,.08); }
.dt-word:hover { border-color: var(--gold); }
.dtw-arm  { font-family: var(--d); font-size: 22px; font-style: italic; color: var(--red); flex-shrink: 0; }
.dtw-tr   { font-family: var(--m); font-size: 11px; color: var(--muted); flex: 1; }
.dtw-ru   { width: 100%; font-family: var(--s); font-size: 15px; color: var(--ink); padding-top: 6px; border-top: 1px solid var(--line); margin-top: 4px; }
.dtw-learn {
  margin-left: auto; width: 28px; height: 28px; border-radius: 50%;
  border: 1px solid var(--line); background: transparent;
  font-size: 14px; color: var(--muted); cursor: pointer; flex-shrink: 0;
  transition: .15s;
}
.dt-word.learned .dtw-learn { background: var(--gold); border-color: var(--gold); color: var(--bg); }
</style>
