<template>
  <div class="alpha-tab">
    <div class="at-header">
      <h2 class="at-title">Հայոց Այբուբեն</h2>
      <p class="at-sub">Нажми на букву — изучи и провери знания</p>
      <div class="at-progress">
        <div class="at-bar"><div class="at-fill" :style="{width: progress+'%'}"></div></div>
        <span class="at-pct">{{ progress }}% изучено</span>
      </div>
    </div>

    <!-- СЕТКА БУКВ -->
    <div v-if="activeIdx === null" class="at-grid">
      <div v-for="(l, i) in ALPHA" :key="i"
        class="at-cell"
        :class="{vowel: isVowel(i), learned: learnedLetters.has(i)}"
        @click="openLetter(i)">
        <div class="atc-upper">{{ l.upper }}</div>
        <div class="atc-lower">{{ l.lower }}</div>
        <div class="atc-sound">{{ l.sound }}</div>
        <div class="atc-check" v-if="learnedLetters.has(i)">✓</div>
      </div>
    </div>

    <!-- КАРТОЧКА БУКВЫ -->
    <div v-else class="letter-view">
      <button class="lv-back" @click="activeIdx=null">← Все буквы</button>

      <div class="lv-counter-row">
        <button class="lv-nav-btn" @click="prev" :disabled="activeIdx===0">‹</button>
        <span class="lv-counter">{{ activeIdx+1 }} / 39</span>
        <button class="lv-nav-btn" @click="next" :disabled="activeIdx===38">›</button>
      </div>

      <!-- Буква крупно -->
      <div class="lv-letter-card" :class="{vowel: isVowel(activeIdx)}">
        <div class="lv-big">{{ ALPHA[activeIdx].upper }}</div>
        <div class="lv-small">{{ ALPHA[activeIdx].lower }}</div>
        <div class="lv-name-badge">{{ ALPHA[activeIdx].name }}</div>
      </div>

      <!-- Звук крупно -->
      <div class="lv-sound-block">
        <div class="lv-sound-label">Звук</div>
        <div class="lv-sound-big">{{ ALPHA[activeIdx].sound }}</div>
        <div class="lv-note" v-if="ALPHA[activeIdx].note">{{ ALPHA[activeIdx].note }}</div>
      </div>

      <!-- Слово-пример -->
      <div class="lv-word-card" v-if="ALPHA[activeIdx].word">
        <div class="lv-word-label">Слово с этой буквой</div>
        <div class="lv-word-arm" v-html="highlightedWord"></div>
        <div class="lv-word-tr">{{ ALPHA[activeIdx].word.translit }}</div>
        <div class="lv-word-ru">{{ ALPHA[activeIdx].word.ru }}</div>
      </div>

      <!-- Мини-тест -->
      <div class="lv-quiz" v-if="quizMode">
        <div class="lv-quiz-q">Как звучит эта буква?</div>
        <div class="lv-quiz-opts">
          <button v-for="opt in quizOpts" :key="opt"
            class="lv-quiz-opt"
            :class="{correct: quizAnswered && opt===ALPHA[activeIdx].sound, wrong: quizAnswered && opt===quizChosen && opt!==ALPHA[activeIdx].sound}"
            :disabled="quizAnswered"
            @click="checkQuiz(opt)">{{ opt }}</button>
        </div>
        <div class="lv-quiz-fb ok"  v-if="quizAnswered && quizChosen===ALPHA[activeIdx].sound">Правильно! 🎉</div>
        <div class="lv-quiz-fb bad" v-if="quizAnswered && quizChosen!==ALPHA[activeIdx].sound">Неверно — это {{ ALPHA[activeIdx].sound }}</div>
      </div>
      <button class="lv-quiz-start" v-else @click="startQuiz">
        Проверить знание →
      </button>

      <!-- Кнопки -->
      <div class="lv-actions">
        <button class="lv-learned-btn"
          :class="{done: learnedLetters.has(activeIdx)}"
          @click="toggleLearned">
          {{ learnedLetters.has(activeIdx) ? '✓ Выучено' : 'Выучил' }}
        </button>
        <button class="lv-next-btn" @click="next" v-if="activeIdx < 38">
          Следующая →
        </button>
        <button class="lv-next-btn lv-finish-btn" @click="activeIdx=null" v-else>
          К алфавиту ✓
        </button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
defineProps({ words: Array })

const VOWEL_IDX = new Set([0,4,6,7,10,23,33,36,37])

const ALPHA = [
  {upper:'Ա',lower:'ա',name:'Այб',sound:'[а]',note:'',word:{id:600,arm:'աղ',translit:'agh',ru:'Соль'}},
  {upper:'Բ',lower:'բ',name:'Բen',sound:'[б]',note:'',word:{id:128,arm:'բեմ',translit:'bem',ru:'Сцена (театр)'}},
  {upper:'Գ',lower:'գ',name:'Γim',sound:'[г]',note:'',word:{id:17,arm:'գետ',translit:'get',ru:'Река'}},
  {upper:'Դ',lower:'դ',name:'Δа',sound:'[д]',note:'',word:{id:45,arm:'դար',translit:'dar',ru:'Век'}},
  {upper:'Ե',lower:'ե',name:'Εч',sound:'[е]',note:'в начале = йе',word:{id:81,arm:'ելք',translit:'yelk',ru:'Выход'}},
  {upper:'Զ',lower:'զ',name:'Ζа',sound:'[з]',note:'',word:{id:165,arm:'զանգ',translit:'zang',ru:'Звонок'}},
  {upper:'Է',lower:'է',name:'Է',sound:'[э]',note:'долгий э',word:{id:153,arm:'էջ',translit:'ej',ru:'Страница'}},
  {upper:'Ը',lower:'ը',name:'Ըθ',sound:'[ə]',note:'нейтральный',word:{id:55,arm:'ընկեր',translit:'enker',ru:'Друг'}},
  {upper:'Թ',lower:'թ',name:'Θо',sound:'[т]',note:'придыхательное',word:{id:326,arm:'թիվ',translit:'tiv',ru:'Количество'}},
  {upper:'Ժ',lower:'ժ',name:'Жe',sound:'[ж]',note:'',word:{id:41,arm:'ժամ',translit:'zham',ru:'Час'}},
  {upper:'Ի',lower:'ի',name:'Ини',sound:'[и]',note:'',word:{id:66,arm:'իմաստ',translit:'imast',ru:'Смысл'}},
  {upper:'Լ',lower:'լ',name:'Лйун',sound:'[л]',note:'',word:{id:16,arm:'լեռ',translit:'ler',ru:'Гора'}},
  {upper:'Խ',lower:'խ',name:'Хе',sound:'[х]',note:'гортанный',word:{id:313,arm:'խիտ',translit:'khit',ru:'Густой'}},
  {upper:'Ծ',lower:'ծ',name:'Цa',sound:'[ц]',note:'',word:{id:15,arm:'ծով',translit:'tsov',ru:'Море'}},
  {upper:'Կ',lower:'կ',name:'Кen',sound:'[к]',note:'',word:{id:430,arm:'կապ',translit:'kap',ru:'Взаимодействие'}},
  {upper:'Հ',lower:'հ',name:'Хо',sound:'[h]',note:'как h',word:{id:22,arm:'հող',translit:'hogh',ru:'Земля/Почва'}},
  {upper:'Ձ',lower:'ձ',name:'Дзa',sound:'[дз]',note:'',word:{id:110,arm:'ձայն',translit:'dzayn',ru:'Звук/Голос'}},
  {upper:'Ղ',lower:'ղ',name:'Ğaт',sound:'[ğ]',note:'гортанный',word:{id:355,arm:'ղեկավար',translit:'ghekavar',ru:'Сотрудник'}},
  {upper:'Ճ',lower:'ճ',name:'Чe',sound:'[ч]',note:'',word:{id:588,arm:'ճաշ',translit:'chash',ru:'Премьер-министр'}},
  {upper:'Մ',lower:'մ',name:'Мen',sound:'[м]',note:'',word:{id:47,arm:'մահ',translit:'mah',ru:'Смерть'}},
  {upper:'Յ',lower:'յ',name:'Йи',sound:'[й]',note:'',word:null},
  {upper:'Ն',lower:'ն',name:'Ну',sound:'[н]',note:'',word:{id:174,arm:'նավ',translit:'nav',ru:'Корабль'}},
  {upper:'Շ',lower:'շ',name:'Шa',sound:'[ш]',note:'',word:{id:741,arm:'շեմ',translit:'shem',ru:'Порог'}},
  {upper:'Ո',lower:'ո',name:'Во',sound:'[о]',note:'в начале = во',word:{id:418,arm:'ուժ',translit:'uzh',ru:'Усиление'}},
  {upper:'Չ',lower:'չ',name:'Чa',sound:'[ч]',note:'придыхательное',word:{id:719,arm:'չոր',translit:'chor',ru:'Сухой'}},
  {upper:'Պ',lower:'պ',name:'Пe',sound:'[п]',note:'',word:{id:95,arm:'պատ',translit:'pat',ru:'Стена'}},
  {upper:'Ջ',lower:'ջ',name:'Джe',sound:'[дж]',note:'',word:{id:5,arm:'ջուր',translit:'jur',ru:'Вода'}},
  {upper:'Ռ',lower:'ռ',name:'Рa',sound:'[р]',note:'раскатистое',word:{id:680,arm:'ռադիո',translit:'radio',ru:'Радио'}},
  {upper:'Ս',lower:'ս',name:'Сe',sound:'[с]',note:'',word:{id:102,arm:'սև',translit:'sev',ru:'Чёрный'}},
  {upper:'Վ',lower:'վ',name:'Вев',sound:'[в]',note:'',word:{id:68,arm:'վախ',translit:'vakh',ru:'Страх'}},
  {upper:'Տ',lower:'տ',name:'Тьун',sound:'[т]',note:'',word:{id:218,arm:'տալ',translit:'tal',ru:'Давать'}},
  {upper:'Ր',lower:'ր',name:'Рe',sound:'[р]',note:'мягкое',word:{id:40,arm:'րոպե',translit:'rope',ru:'Минута'}},
  {upper:'Ց',lower:'ց',name:'Цо',sound:'[ц]',note:'придыхательное',word:{id:152,arm:'ցանց',translit:'tsants',ru:'Сеть'}},
  {upper:'Ոու',lower:'ու',name:'У',sound:'[у]',note:'диграф',word:{id:418,arm:'ուժ',translit:'uzh',ru:'Усиление'}},
  {upper:'Փ',lower:'փ',name:'Пьур',sound:'[п]',note:'придыхательное',word:{id:310,arm:'փակ',translit:'pak',ru:'Закрытый'}},
  {upper:'Ք',lower:'ք',name:'Кe',sound:'[к]',note:'придыхательное',word:{id:23,arm:'քար',translit:'kar',ru:'Камень'}},
  {upper:'Եվ',lower:'և',name:'Ев',sound:'[ев]',note:'лигатура',word:null},
  {upper:'Օ',lower:'օ',name:'О',sound:'[о]',note:'долгий о',word:{id:34,arm:'օր',translit:'or',ru:'День'}},
  {upper:'Ֆ',lower:'ֆ',name:'Фe',sound:'[ф]',note:'',word:{id:156,arm:'ֆայլ',translit:'fayl',ru:'Файл'}},
]

const activeIdx      = ref(null)
const learnedLetters = ref(new Set(JSON.parse(localStorage.getItem('barr_alpha') || '[]')))
const quizMode       = ref(false)
const quizOpts       = ref([])
const quizChosen     = ref(null)
const quizAnswered   = ref(false)

const progress = computed(() => Math.round(learnedLetters.value.size / 39 * 100))
function isVowel(i) { return VOWEL_IDX.has(i) }

function openLetter(i) {
  activeIdx.value    = i
  quizMode.value     = false
  quizAnswered.value = false
  quizChosen.value   = null
  window.scrollTo(0, 0)
}
function prev() { if (activeIdx.value > 0)  openLetter(activeIdx.value - 1) }
function next() { if (activeIdx.value < 38) openLetter(activeIdx.value + 1) }

function toggleLearned() {
  const s = new Set(learnedLetters.value)
  s.has(activeIdx.value) ? s.delete(activeIdx.value) : s.add(activeIdx.value)
  learnedLetters.value = s
  localStorage.setItem('barr_alpha', JSON.stringify([...s]))
}

function startQuiz() {
  const all   = [...new Set(ALPHA.map(l => l.sound))].filter(s => s !== ALPHA[activeIdx.value].sound)
  const wrong = all.sort(() => Math.random() - .5).slice(0, 3)
  quizOpts.value     = [...wrong, ALPHA[activeIdx.value].sound].sort(() => Math.random() - .5)
  quizMode.value     = true
  quizChosen.value   = null
  quizAnswered.value = false
}

function checkQuiz(opt) {
  quizChosen.value   = opt
  quizAnswered.value = true
  if (opt === ALPHA[activeIdx.value].sound) {
    const s = new Set(learnedLetters.value)
    s.add(activeIdx.value)
    learnedLetters.value = s
    localStorage.setItem('barr_alpha', JSON.stringify([...s]))
  }
}

const highlightedWord = computed(() => {
  if (activeIdx.value === null || !ALPHA[activeIdx.value]?.word) return ''
  const arm   = ALPHA[activeIdx.value].word.arm
  const chars = [ALPHA[activeIdx.value].upper, ALPHA[activeIdx.value].lower]
  let result  = arm
  chars.forEach(c => {
    result = result.split(c).join('<span class="hl-letter">' + c + '</span>')
  })
  return result
})
</script>
<style scoped>
.alpha-tab { padding-bottom:20px; }
.at-header { padding:20px; border-bottom:1px solid rgba(176,120,40,.2); background:rgba(242,232,213,.88); backdrop-filter:blur(8px); position:sticky; top:0; z-index:10; }
.at-title  { font-family:var(--d); font-size:clamp(28px,5vw,48px); font-weight:700; font-style:italic; color:var(--red); }
.at-sub    { font-family:var(--s); font-size:13px; color:var(--muted); margin-top:4px; font-style:italic; }
.at-progress { display:flex; align-items:center; gap:10px; margin-top:12px; }
.at-bar  { flex:1; height:6px; background:rgba(140,28,28,.15); border-radius:3px; }
.at-fill { height:100%; background:var(--red); border-radius:3px; transition:width .5s; }
.at-pct  { font-family:var(--m); font-size:10px; color:var(--muted); white-space:nowrap; }

.at-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(88px,1fr)); border-left:1px solid rgba(176,120,40,.2); border-top:1px solid rgba(176,120,40,.2); }
.at-cell { border-right:1px solid rgba(176,120,40,.2); border-bottom:1px solid rgba(176,120,40,.2); padding:18px 10px 14px; background:rgba(242,232,213,.82); backdrop-filter:blur(4px); cursor:pointer; transition:all .15s; position:relative; text-align:center; }
.at-cell:hover { background:rgba(255,248,235,.96); box-shadow:inset 0 0 0 2px var(--gold); z-index:1; }
.at-cell.learned { background:rgba(176,120,40,.12); }
.at-cell.learned .atc-upper { color:var(--gold); }
.atc-upper { font-family:var(--d); font-size:48px; font-weight:700; line-height:1; color:var(--red); }
.at-cell.vowel .atc-upper { color:var(--blue); }
.atc-lower { font-family:var(--d); font-size:28px; line-height:1; opacity:.4; }
.atc-sound { font-family:var(--m); font-size:12px; color:var(--muted); margin-top:6px; }
.atc-check { position:absolute; top:5px; right:7px; color:var(--gold); font-size:13px; font-weight:700; }

/* КАРТОЧКА */
.letter-view { padding:16px; display:flex; flex-direction:column; gap:14px; }
.lv-back { background:none; border:none; font-family:var(--m); font-size:10px; letter-spacing:2px; text-transform:uppercase; color:var(--muted); cursor:pointer; padding:0; align-self:flex-start; }
.lv-back:hover { color:var(--red); }
.lv-counter-row { display:flex; align-items:center; justify-content:center; gap:20px; }
.lv-nav-btn { background:rgba(242,232,213,.9); border:1px solid var(--line); width:44px; height:44px; border-radius:50%; font-size:22px; cursor:pointer; transition:.15s; color:var(--ink); }
.lv-nav-btn:hover:not(:disabled) { border-color:var(--gold); }
.lv-nav-btn:disabled { opacity:.3; cursor:default; }
.lv-counter { font-family:var(--m); font-size:12px; color:var(--muted); letter-spacing:2px; min-width:60px; text-align:center; }

.lv-letter-card { background:rgba(242,232,213,.92); backdrop-filter:blur(8px); border:2px solid rgba(140,28,28,.25); border-radius:20px; padding:36px 20px 28px; text-align:center; }
.lv-letter-card.vowel { border-color:rgba(26,58,110,.25); }
.lv-big   { font-family:var(--d); font-size:clamp(100px,22vw,160px); font-weight:700; line-height:1; color:var(--red); }
.lv-letter-card.vowel .lv-big { color:var(--blue); }
.lv-small { font-family:var(--d); font-size:clamp(60px,13vw,96px); font-weight:400; line-height:1; opacity:.35; color:var(--ink); }
.lv-name-badge { display:inline-block; background:var(--ink); color:var(--bg); font-family:var(--m); font-size:12px; letter-spacing:2px; padding:5px 16px; border-radius:20px; margin-top:14px; }

.lv-sound-block { background:rgba(242,232,213,.88); border:1px solid rgba(176,120,40,.2); border-radius:14px; padding:16px 20px; display:flex; align-items:center; gap:16px; }
.lv-sound-label { font-family:var(--m); font-size:9px; letter-spacing:2px; text-transform:uppercase; color:var(--muted); flex-shrink:0; }
.lv-sound-big   { font-family:var(--m); font-size:32px; font-weight:700; color:var(--ink); }
.lv-note        { font-family:var(--s); font-size:13px; color:var(--muted); font-style:italic; }

.lv-word-card { background:rgba(242,232,213,.9); backdrop-filter:blur(6px); border:1px solid rgba(26,58,110,.2); border-radius:16px; padding:18px 20px; }
.lv-word-label { font-family:var(--m); font-size:9px; letter-spacing:2px; text-transform:uppercase; color:var(--blue); margin-bottom:10px; }
.lv-word-arm   { font-family:var(--d); font-size:40px; font-style:italic; color:var(--ink); line-height:1.2; margin-bottom:8px; }
.lv-word-tr    { font-family:var(--m); font-size:16px; color:var(--muted); margin-bottom:6px; }
.lv-word-ru    { font-family:var(--s); font-size:20px; color:var(--ink); font-weight:600; }
:deep(.hl-letter) { color:var(--red) !important; font-weight:800; text-decoration:underline; text-decoration-color:rgba(140,28,28,.5); font-size:1.15em; }

.lv-quiz { background:rgba(242,232,213,.9); border:1px solid rgba(176,120,40,.2); border-radius:16px; padding:18px; }
.lv-quiz-q    { font-family:var(--s); font-size:16px; color:var(--ink); margin-bottom:14px; text-align:center; }
.lv-quiz-opts { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
.lv-quiz-opt  { padding:16px; border:1.5px solid var(--line); border-radius:12px; background:rgba(242,232,213,.8); font-family:var(--m); font-size:16px; color:var(--ink); cursor:pointer; transition:.15s; text-align:center; }
.lv-quiz-opt:hover:not(:disabled) { border-color:var(--gold); }
.lv-quiz-opt.correct { background:rgba(42,94,58,.12); border-color:#2a5e3a; color:#2a5e3a; font-weight:700; }
.lv-quiz-opt.wrong   { background:rgba(140,28,28,.1); border-color:var(--red); color:var(--red); }
.lv-quiz-opt:disabled { cursor:default; }
.lv-quiz-fb   { text-align:center; font-family:var(--d); font-size:18px; font-style:italic; margin-top:12px; }
.lv-quiz-fb.ok  { color:#2a5e3a; }
.lv-quiz-fb.bad { color:var(--red); }
.lv-quiz-start { width:100%; padding:14px; background:rgba(26,58,110,.08); border:1px solid rgba(26,58,110,.2); border-radius:14px; font-family:var(--s); font-size:15px; color:var(--blue); cursor:pointer; transition:.15s; }
.lv-quiz-start:hover { background:rgba(26,58,110,.14); }

.lv-actions { display:flex; gap:10px; }
.lv-learned-btn { flex:1; padding:16px; background:rgba(242,232,213,.9); border:2px solid var(--line); border-radius:14px; font-family:var(--d); font-size:16px; font-style:italic; color:var(--muted); cursor:pointer; transition:all .2s; }
.lv-learned-btn:hover { border-color:var(--gold); color:var(--ink); }
.lv-learned-btn.done  { background:rgba(176,120,40,.12); border-color:var(--gold); color:var(--gold); }
.lv-next-btn  { flex:2; padding:16px; background:var(--red); border:none; border-radius:14px; font-family:var(--d); font-size:18px; font-style:italic; color:var(--bg); cursor:pointer; transition:.2s; }
.lv-next-btn:hover { opacity:.88; }
.lv-finish-btn { background:var(--ink); }

@media(max-width:480px) {
  .at-grid { grid-template-columns:repeat(auto-fill,minmax(76px,1fr)); }
  .atc-upper { font-size:40px; }
  .lv-big { font-size:clamp(80px,18vw,130px); }
}
</style>