<template>
  <div class="admin-panel">
    <div class="ap-header">
      <div class="ap-title">⚙️ Админ-панель</div>
      <div class="ap-tabs">
        <button v-for="t in TABS" :key="t.id" class="apt-btn" :class="{on: tab===t.id}" @click="tab=t.id">{{ t.label }}</button>
      </div>
    </div>

    <!-- ══ СЛОВА ══ -->
    <div v-if="tab==='words'" class="ap-sec">
      <div class="ap-row">
        <input v-model="ws" class="ap-input" placeholder="Поиск..." />
        <button class="ap-btn primary" @click="openAdd">+ Добавить</button>
      </div>
      <div v-for="w in filtered" :key="w.firestoreId||w.id" class="apw-row">
        <span class="apw-arm">{{ w.arm }}</span>
        <span class="apw-tr">{{ w.translit }}</span>
        <span class="apw-ru">{{ w.ru }}</span>
        <span class="apw-cat">{{ w.cat }}</span>
        <div class="apw-btns">
          <button class="ap-btn sm" @click="openEdit(w)">✏️</button>
          <button class="ap-btn sm danger" @click="delWord(w)">🗑️</button>
        </div>
      </div>
    </div>

    <!-- ══ СТАТЬИ ══ -->
    <div v-if="tab==='articles'" class="ap-sec">
      <button class="ap-btn primary" style="margin-bottom:12px" @click="openAddArt">+ Новая статья</button>
      <div v-if="articles.length===0" class="ap-empty">Статей пока нет</div>
      <div v-for="a in articles" :key="a.id" class="apa-row">
        <div class="apa-info">
          <div class="apa-title">{{ a.title }}</div>
          <div class="apa-meta">{{ a.category }} · {{ a.level }} · {{ fmtDate(a.createdAt) }}</div>
        </div>
        <div class="apw-btns">
          <button class="ap-btn sm" @click="openEditArt(a)">✏️</button>
          <button class="ap-btn sm danger" @click="delArt(a)">🗑️</button>
        </div>
      </div>
    </div>

    <!-- ══ СТАТИСТИКА ══ -->
    <div v-if="tab==='stats'" class="ap-sec">
      <div class="ap-stats">
        <div class="aps-card"><div class="aps-n">{{ props.words.length }}</div><div class="aps-l">Слов</div></div>
        <div class="aps-card"><div class="aps-n">{{ articles.length }}</div><div class="aps-l">Статей</div></div>
        <div class="aps-card"><div class="aps-n">{{ cats }}</div><div class="aps-l">Категорий</div></div>
      </div>
      <div v-for="[c,n] in catList" :key="c" class="apc-row">
        <span class="apc-n">{{ c }}</span>
        <div class="apc-bw"><div class="apc-b" :style="{width:(n/maxCat*100)+'%'}"></div></div>
        <span class="apc-c">{{ n }}</span>
      </div>
      <div class="ap-migrate">
        <div class="ap-mig-title">🔄 Управление словами в Firestore</div>
        <div class="ap-mig-desc">Если слова задублировались — очисти коллекцию и залей заново из words.json</div>
        <div v-if="migMsg" class="ap-mig-msg">{{ migMsg }}</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <button class="ap-btn primary" @click="migrate" :disabled="mig">
            {{ mig ? migMsg : '🚀 Залить слова в Firestore' }}
          </button>
          <button class="ap-btn danger" @click="clearWords" :disabled="mig">
            🗑️ Очистить коллекцию words
          </button>
        </div>
      </div>
    </div>

    <!-- МОДАЛ СЛОВО -->
    <div v-if="wModal" class="ap-overlay" @click.self="wModal=false">
      <div class="ap-modal">
        <div class="ap-modal-title">{{ wForm.firestoreId ? 'Редактировать' : 'Добавить слово' }}</div>
        <label>Армянский</label><input v-model="wForm.arm" class="ap-input" />
        <label>Транслит</label><input v-model="wForm.translit" class="ap-input" />
        <label>Русский</label><input v-model="wForm.ru" class="ap-input" />
        <label>Категория</label>
        <select v-model="wForm.cat" class="ap-input">
          <option v-for="c in allCats" :key="c" :value="c">{{ c }}</option>
          <option value="__new__">+ Новая</option>
        </select>
        <input v-if="wForm.cat==='__new__'" v-model="wForm.newCat" class="ap-input" placeholder="Название категории" />
        <div class="ap-modal-btns">
          <button class="ap-btn" @click="wModal=false">Отмена</button>
          <button class="ap-btn primary" @click="saveWord" :disabled="saving">{{ saving?'...':'Сохранить' }}</button>
        </div>
      </div>
    </div>

    <!-- МОДАЛ СТАТЬЯ -->
    <div v-if="aModal" class="ap-overlay" @click.self="aModal=false">
      <div class="ap-modal ap-modal-wide">
        <div class="ap-modal-title">{{ aForm.id ? 'Редактировать' : 'Новая статья' }}</div>
        <label>Заголовок</label><input v-model="aForm.title" class="ap-input" placeholder="Название статьи" />
        <label>Категория</label><input v-model="aForm.category" class="ap-input" placeholder="история, грамматика..." />
        <label>Уровень</label>
        <select v-model="aForm.level" class="ap-input">
          <option>A1</option><option>A2</option><option>B1</option><option>Все</option>
        </select>
        <label>Краткое описание</label><input v-model="aForm.desc" class="ap-input" />
        <label>Текст статьи</label>
        <textarea v-model="aForm.body" class="ap-textarea" placeholder="Текст статьи..."></textarea>
        <div class="ap-modal-btns">
          <button class="ap-btn" @click="aModal=false">Отмена</button>
          <button class="ap-btn primary" @click="saveArt" :disabled="saving">{{ saving?'...':'Опубликовать' }}</button>
        </div>
      </div>
    </div>

    <div v-if="toast" class="ap-toast">{{ toast }}</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { db } from '../firebase.js'
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc,
         writeBatch, serverTimestamp, orderBy, query, getDoc } from 'firebase/firestore'
import wordsJson from '../data/words.json'

const props = defineProps({ words: Array })
const emit  = defineEmits(['words-updated'])

const TABS = [
  { id:'words',    label:'📚 Слова' },
  { id:'articles', label:'📝 Статьи' },
  { id:'stats',    label:'📊 Статистика' },
]

const tab      = ref('words')
const ws       = ref('')
const articles = ref([])
const saving   = ref(false)
const toast    = ref('')
const mig      = ref(false)
const migMsg   = ref('')

const wModal = ref(false)
const aModal = ref(false)
const wForm  = ref({ arm:'', translit:'', ru:'', cat:'', newCat:'', firestoreId:null })
const aForm  = ref({ id:null, title:'', category:'', level:'A1', desc:'', body:'' })

// ── СЛОВА ────────────────────────────────────────────────
const filtered = computed(() => {
  const q = ws.value.toLowerCase().trim()
  if (!q) return props.words
  return props.words.filter(w =>
    (w.arm||''). includes(ws.value) ||
    (w.ru||''). toLowerCase().includes(q) ||
    (w.translit||w.tr||''). toLowerCase().includes(q) ||
    (w.cat||''). toLowerCase().includes(q)
  )
})

const allCats = computed(() => [...new Set(props.words.map(w => w.cat))].sort())

function openAdd() {
  wForm.value = { arm:'', translit:'', ru:'', cat:allCats.value[0]||'разное', newCat:'', firestoreId:null }
  wModal.value = true
}
function openEdit(w) {
  wForm.value = { arm:w.arm, translit:w.translit||w.tr||'', ru:w.ru, cat:w.cat, newCat:'', firestoreId:w.firestoreId||null }
  wModal.value = true
}
async function saveWord() {
  const cat = wForm.value.cat==='__new__' ? wForm.value.newCat : wForm.value.cat
  const data = { arm:wForm.value.arm, translit:wForm.value.translit, ru:wForm.value.ru, cat }
  saving.value = true
  try {
    if (wForm.value.firestoreId) {
      await updateDoc(doc(db,'words',wForm.value.firestoreId), data)
    } else {
      const maxId = Math.max(0, ...props.words.map(w=>w.id||0))
      await addDoc(collection(db,'words'), { ...data, id: maxId+1 })
    }
    wModal.value = false
    emit('words-updated')
    showToast('✓ Сохранено')
  } catch(e) { showToast('Ошибка: '+e.message) }
  finally { saving.value = false }
}
async function delWord(w) {
  if (!confirm(`Удалить "${w.arm}"?`)) return
  if (w.firestoreId) await deleteDoc(doc(db,'words',w.firestoreId))
  emit('words-updated')
  showToast('Удалено')
}

// ── СТАТЬИ ────────────────────────────────────────────────
async function loadArts() {
  try {
    const q = query(collection(db,'articles'), orderBy('createdAt','desc'))
    const s = await getDocs(q)
    articles.value = s.docs.map(d => ({ id:d.id, ...d.data() }))
  } catch(e) { articles.value = [] }
}
function openAddArt() {
  aForm.value = { id:null, title:'', category:'', level:'A1', desc:'', body:'' }
  aModal.value = true
}
function openEditArt(a) {
  aForm.value = { id:a.id, title:a.title, category:a.category, level:a.level, desc:a.desc||'', body:a.body }
  aModal.value = true
}
async function saveArt() {
  saving.value = true
  try {
    const data = { title:aForm.value.title, category:aForm.value.category, level:aForm.value.level,
                   desc:aForm.value.desc, body:aForm.value.body, createdAt:serverTimestamp() }
    if (aForm.value.id) await updateDoc(doc(db,'articles',aForm.value.id), data)
    else await addDoc(collection(db,'articles'), data)
    aModal.value = false
    await loadArts()
    showToast('✓ Статья опубликована')
  } catch(e) { showToast('Ошибка: '+e.message) }
  finally { saving.value = false }
}
async function delArt(a) {
  if (!confirm(`Удалить "${a.title}"?`)) return
  await deleteDoc(doc(db,'articles',a.id))
  await loadArts()
  showToast('Удалено')
}

// ── СТАТИСТИКА ────────────────────────────────────────────
const cats    = computed(() => new Set(props.words.map(w=>w.cat)).size)
const catList = computed(() => {
  const m={}; props.words.forEach(w=>{m[w.cat]=(m[w.cat]||0)+1})
  return Object.entries(m).sort((a,b)=>b[1]-a[1]).slice(0,15)
})
const maxCat = computed(() => Math.max(...catList.value.map(([,n])=>n),1))

// ── МИГРАЦИЯ ──────────────────────────────────────────────
async function clearWords() {
  if (!confirm('Удалить ВСЕ слова из Firestore? Это нельзя отменить.')) return
  mig.value = true; migMsg.value = 'Удаляем...';
  try {
    const snap = await getDocs(collection(db,'words'))
    const CHUNK = 400
    for (let i=0; i<snap.docs.length; i+=CHUNK) {
      const batch = writeBatch(db)
      snap.docs.slice(i,i+CHUNK).forEach(d => batch.delete(d.ref))
      await batch.commit()
      migMsg.value = `Удалено ${Math.min(i+CHUNK,snap.docs.length)}/${snap.docs.length}`
    }
    emit('words-updated')
    showToast('✓ Коллекция очищена')
    migMsg.value = ''
  } catch(e) { showToast('Ошибка: '+e.message) }
  finally { mig.value = false }
}

async function migrate() {
  if (!confirm(`Загрузить ${wordsJson.length} слов из words.json в Firestore?`)) return
  mig.value = true
  const CHUNK = 400
  let total = 0
  try {
    for (let i=0; i<wordsJson.length; i+=CHUNK) {
      const batch = writeBatch(db)
      wordsJson.slice(i,i+CHUNK).forEach(w => {
        batch.set(doc(collection(db,'words')), {
          id: w.id, arm:w.arm, translit:w.translit||w.tr||'', ru:w.ru, cat:w.cat||'разное'
        })
      })
      await batch.commit()
      total += Math.min(CHUNK, wordsJson.length-i)
      migMsg.value = `Загружено ${total}/${wordsJson.length}...`
    }
    emit('words-updated')
    showToast(`✅ Загружено ${total} слов`)
    migMsg.value = `✅ Готово — ${total} слов`
  } catch(e) { showToast('Ошибка: '+e.message); migMsg.value = '' }
  finally { mig.value = false }
}

function fmtDate(ts) {
  if (!ts) return ''
  const d = ts.toDate ? ts.toDate() : new Date(ts)
  return d.toLocaleDateString('ru-RU')
}
function showToast(msg) { toast.value = msg; setTimeout(()=>toast.value='',2500) }

onMounted(loadArts)
</script>

<style scoped>
.admin-panel { padding-bottom:80px; }
.ap-header { padding:16px 16px 0; position:sticky; top:0; z-index:10; background:var(--glass-bg-strong); border-bottom:1px solid var(--line); border-color:var(--glass-border);box-shadow:inset 0 1px 0 var(--glass-shine),0 4px 16px var(--glass-shadow);}
.ap-title { font-family:var(--d); font-size:24px; font-weight:700; font-style:italic; color:var(--red); margin-bottom:10px; }
.ap-tabs { display:flex; gap:4px; }
.apt-btn { padding:8px 14px; background:none; border:none; border-bottom:2px solid transparent; font-family:var(--s); font-size:13px; color:var(--ink); cursor:pointer; position:relative; bottom:-1px; transition:.15s var(--spring); }
.apt-btn.on { color:var(--red); border-bottom-color:var(--red); font-weight:600; }
.ap-sec { padding:14px 16px; display:flex; flex-direction:column; gap:8px; }
.ap-row { display:flex; gap:10px; }
.ap-input { flex:1; padding:9px 12px; border:1px solid var(--line); border-radius:8px; background:var(--glass-bg); font-family:var(--s); font-size:14px; color:var(--ink); outline:none; width:100%; box-sizing:border-box; border-color:var(--glass-border);backdrop-filter:var(--glass-blur-sm);-webkit-backdrop-filter:var(--glass-blur-sm);box-shadow:inset 0 1px 0 var(--glass-shine),0 4px 16px var(--glass-shadow);}
.ap-input:focus { border-color:var(--gold); }
.ap-btn { padding:9px 16px; border:1px solid var(--line); border-radius:8px; background:var(--glass-bg); font-family:var(--s); font-size:13px; color:var(--ink); cursor:pointer; transition:.15s var(--spring); white-space:nowrap; border-color:var(--glass-border);backdrop-filter:var(--glass-blur-sm);-webkit-backdrop-filter:var(--glass-blur-sm);box-shadow:inset 0 1px 0 var(--glass-shine),0 4px 16px var(--glass-shadow);}
.ap-btn:hover { border-color:var(--gold); }
.ap-btn.primary { background:var(--red); border-color:var(--red); color:var(--bg); font-weight:600; }
.ap-btn.sm { padding:5px 10px; font-size:13px; }
.ap-btn.danger { border-color:var(--red); color:var(--red); }
.ap-btn:disabled { opacity:.5; cursor:not-allowed; }
.apw-row { display:grid; grid-template-columns:130px 90px 1fr 80px 60px; gap:8px; align-items:center; background:var(--glass-bg); border:1px solid var(--line); border-radius:8px; padding:8px 12px; border-color:var(--glass-border);backdrop-filter:var(--glass-blur-sm);-webkit-backdrop-filter:var(--glass-blur-sm);box-shadow:inset 0 1px 0 var(--glass-shine),0 4px 16px var(--glass-shadow);}
.apw-arm { font-family:var(--d); font-size:16px; font-style:italic; color:var(--red); }
.apw-tr { font-family:var(--m); font-size:10px; color:var(--muted); }
.apw-ru { font-family:var(--s); font-size:13px; color:var(--ink); }
.apw-cat { font-family:var(--m); font-size:10px; color:var(--blue); text-transform:uppercase; letter-spacing:1px; }
.apw-btns { display:flex; gap:4px; }
.apa-row { display:flex; justify-content:space-between; align-items:center; background:var(--glass-bg); border:1px solid var(--line); border-radius:10px; padding:12px 14px; border-color:var(--glass-border);backdrop-filter:var(--glass-blur-sm);-webkit-backdrop-filter:var(--glass-blur-sm);box-shadow:inset 0 1px 0 var(--glass-shine),0 4px 16px var(--glass-shadow);}
.apa-title { font-family:var(--s); font-size:15px; font-weight:600; color:var(--ink); }
.apa-meta { font-family:var(--m); font-size:10px; color:var(--muted); margin-top:2px; }
.ap-empty { text-align:center; color:var(--muted); font-family:var(--s); padding:40px; }
.ap-stats { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; }
.aps-card { background:var(--glass-bg); border:1px solid var(--line); border-radius:12px; padding:16px; text-align:center; border-color:var(--glass-border);backdrop-filter:var(--glass-blur-sm);-webkit-backdrop-filter:var(--glass-blur-sm);box-shadow:inset 0 1px 0 var(--glass-shine),0 4px 16px var(--glass-shadow);}
.aps-n { font-family:var(--d); font-size:32px; font-weight:700; color:var(--red); }
.aps-l { font-family:var(--m); font-size:10px; letter-spacing:1px; text-transform:uppercase; color:var(--muted); margin-top:4px; }
.apc-row { display:grid; grid-template-columns:100px 1fr 40px; gap:8px; align-items:center; }
.apc-n { font-family:var(--m); font-size:11px; color:var(--ink); }
.apc-bw { background:var(--line2); border-radius:3px; height:6px; }
.apc-b { background:var(--red); border-radius:3px; height:100%; transition:width .3s; }
.apc-c { font-family:var(--m); font-size:11px; color:var(--muted); text-align:right; }
.ap-migrate { margin-top:16px; background:var(--glass-bg); border:1px solid var(--line); border-radius:12px; padding:16px; display:flex; flex-direction:column; gap:10px; border-color:var(--glass-border);backdrop-filter:var(--glass-blur-sm);-webkit-backdrop-filter:var(--glass-blur-sm);box-shadow:inset 0 1px 0 var(--glass-shine),0 4px 16px var(--glass-shadow);}
.ap-mig-title { font-family:var(--s); font-size:15px; font-weight:700; color:var(--ink); }
.ap-mig-desc { font-family:var(--s); font-size:13px; color:var(--muted); line-height:1.5; }
.ap-mig-msg { font-family:var(--m); font-size:12px; color:var(--gold); }
.ap-overlay { position:fixed; inset:0; background:rgba(0,0,0,.5); z-index:1000; display:flex; align-items:center; justify-content:center; padding:16px; }
.ap-modal { background:var(--bg); border:1px solid var(--line); border-radius:16px; padding:20px; width:100%; max-width:420px; max-height:90vh; overflow-y:auto; display:flex; flex-direction:column; gap:8px; }
.ap-modal-wide { max-width:600px; }
.ap-modal-title { font-family:var(--d); font-size:20px; font-style:italic; color:var(--red); margin-bottom:6px; }
.ap-modal label { font-family:var(--m); font-size:10px; letter-spacing:1px; text-transform:uppercase; color:var(--muted); }
.ap-textarea { padding:10px 12px; border:1px solid var(--line); border-radius:8px; background:var(--glass-bg); font-family:var(--s); font-size:14px; color:var(--ink); outline:none; min-height:160px; resize:vertical; border-color:var(--glass-border);backdrop-filter:var(--glass-blur-sm);-webkit-backdrop-filter:var(--glass-blur-sm);box-shadow:inset 0 1px 0 var(--glass-shine),0 4px 16px var(--glass-shadow);}
.ap-modal-btns { display:flex; gap:8px; justify-content:flex-end; margin-top:8px; }
.ap-toast { position:fixed; bottom:90px; left:50%; transform:translateX(-50%); background:var(--ink); color:var(--bg); font-family:var(--s); font-size:14px; padding:10px 20px; border-radius:20px; z-index:2000; pointer-events:none; }
</style>
