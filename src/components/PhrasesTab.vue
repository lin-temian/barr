<template>
  <div>
    <div class="sent-hd"><h2>Фразы и предложения</h2><p>Нажми на фразу — увидишь перевод</p></div>
    <div class="pills">
      <button v-for="c in cats" :key="c" class="pill" :class="{on:cat===c}" @click="cat=c">
        {{ c === 'all' ? 'Все фразы' : c }}
      </button>
    </div>
    <div class="sent-list">
      <div v-for="(s,i) in shown" :key="i"
        class="scard" :class="{open:openIdx===i}"
        @click="openIdx=openIdx===i?-1:i">
        <div class="s-arm">{{ s.arm }}</div>
        <div class="s-tr">{{ s.translit }}</div>
        <div class="s-ru">{{ s.ru }}</div>
        <div class="s-tag">{{ s.cat }}</div>
        <div class="s-hint" v-if="openIdx!==i">↳ нажми для перевода</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { db } from '../firebase.js'
import { collection, getDocs } from 'firebase/firestore'
import seedPhrases from '../data/phrases.json'

const sentences = ref(seedPhrases)

async function loadPhrases() {
  try {
    const s = await getDocs(collection(db, 'phrases'))
    const list = s.docs.map(d => d.data())
    if (list.length) sentences.value = list
  } catch (e) { /* остаёмся на встроенных фразах */ }
}
onMounted(loadPhrases)

const cat = ref('all')
const cats = computed(() => ['all', ...new Set(sentences.value.map(s=>s.cat))])
const shown = computed(() => cat.value==='all' ? sentences.value : sentences.value.filter(s=>s.cat===cat.value))
const openIdx = ref(-1)
</script>

<style scoped>
.sent-hd { margin-bottom:18px; }
.sent-hd h2 { font-family:var(--d); font-size:clamp(26px,3.5vw,46px); font-weight:400; color:var(--red); }
.sent-hd p  { font-size:15px; color:var(--muted); font-style:italic; margin-top:4px; }
.sent-list  { display:flex; flex-direction:column; gap:7px; margin-top:14px; }
.scard { border:1.5px solid var(--line2); border-radius:14px; background:var(--glass-bg); padding:18px 22px; cursor:pointer; transition:.15s var(--spring); position:relative; box-shadow:inset 0 1px 0 var(--glass-shine),0 4px 16px var(--glass-shadow);backdrop-filter:var(--glass-blur);-webkit-backdrop-filter:var(--glass-blur);}
.scard:hover { border-color:var(--gold); box-shadow:0 0 0 2px rgba(246,140,54,.16), inset 0 1px 0 var(--glass-shine),0 4px 16px var(--glass-shadow); }
.s-arm  { font-family:var(--d); font-size:clamp(18px,2.2vw,24px); font-weight:600; color:var(--red); }
.s-tr   { font-family:var(--m); font-size:11px; color:var(--muted); margin-top:3px; }
.s-ru   { display:none; font-size:15px; color:var(--blue); font-style:italic; margin-top:9px; padding-top:9px; border-top:1px solid var(--line); }
.scard.open .s-ru { display:block; }
.s-tag  { position:absolute; top:9px; right:12px; font-family:var(--m); font-size:7px; letter-spacing:1px; text-transform:uppercase; color:var(--muted); border:1px solid var(--line2); border-radius:6px; padding:2px 5px; }
.s-hint { font-family:var(--m); font-size:10px; color:var(--muted); opacity:.5; margin-top:5px; letter-spacing:1px; text-transform:uppercase; }
.scard.open .s-hint { display:none; }
</style>
