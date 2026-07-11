<template>
  <!-- MODAL OVERLAY -->
  <teleport to="body">
    <transition name="modal-fade">
      <div v-if="isOpen" class="alpha-modal-overlay" @click.self="$emit('close')">
        <div class="alpha-modal">
          <!-- HEADER -->
          <div class="am-header">
            <div>
              <h2 class="at-title">Հայոցս Այբուբեն</h2>
              <p class="at-sub">Нажми на букву — изучи и проверь знания</p>
            </div>
            <button class="am-close" @click="$emit('close')">✕</button>
          </div>

          <!-- ПРОГРЕСС -->
          <div class="am-progress-row">
            <div class="at-bar"><div class="at-fill" :style="{width: progress+'%'}"></div></div>
            <span class="at-pct">{{ progress }}% изучено</span>
          </div>

          <!-- СЕТКА БУКВ -->
          <div v-if="activeIdx === null" class="am-body">
            <!-- ДОСТИЖЕНИЯ -->
            <div class="achievements-row" v-if="earnedBadges.length">
              <div v-for="b in earnedBadges" :key="b.id" class="badge" :title="b.desc">
                <span class="badge-icon">{{ b.icon }}</span>
                <span class="badge-name">{{ b.name }}</span>
              </div>
            </div>

            <div class="at-grid">
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
          </div>

          <!-- КАРТОЧКА БУКВЫ -->
          <div v-else class="am-body letter-view">
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

            <!-- Звук -->
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

            <!-- Достижение при выучивании -->
            <transition name="badge-pop">
              <div v-if="newBadge" class="new-badge-toast">
                <span class="nbt-icon">{{ newBadge.icon }}</span>
                <div>
                  <div class="nbt-title">Достижение разблокировано!</div>
                  <div class="nbt-name">{{ newBadge.name }}</div>
                  <div class="nbt-desc">{{ newBadge.desc }}</div>
                </div>
              </div>
            </transition>

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
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({ isOpen: Boolean })
const emit  = defineEmits(['close', 'update:learnedAlpha'])

const VOWEL_IDX = new Set([0,4,6,7,10,23,33,36,37])

const ALPHA = [
  {upper:'Ա',lower:'ա',name:'Այբ',sound:'[а]',note:'',word:{id:600,arm:'աղ',translit:'agh',ru:'Соль'}},
  {upper:'Բ',lower:'բ',name:'Բևն',sound:'[б]',note:'',word:{id:128,arm:'բեմ',translit:'bem',ru:'Сцена'}},
  {upper:'Գ',lower:'գ',name:'Գիմ',sound:'[г]',note:'',word:{id:17,arm:'գետ',translit:'get',ru:'Река'}},
  {upper:'Դ',lower:'դ',name:'Դա',sound:'[д]',note:'',word:{id:45,arm:'դար',translit:'dar',ru:'Век'}},
  {upper:'Ե',lower:'ե',name:'Եչ',sound:'[е]',note:'в начале = йе',word:{id:81,arm:'ելք',translit:'yelk',ru:'Выход'}},
  {upper:'Զ',lower:'զ',name:'Զա',sound:'[з]',note:'',word:{id:165,arm:'զանգ',translit:'zang',ru:'Звонок'}},
  {upper:'Է',lower:'է',name:'Է',sound:'[э]',note:'долгий э',word:{id:153,arm:'էջ',translit:'ej',ru:'Страница'}},
  {upper:'Ը',lower:'ը',name:'Ըթ',sound:'[ə]',note:'нейтральный',word:{id:55,arm:'ընկեր',translit:'enker',ru:'Друг'}},
  {upper:'Թ',lower:'թ',name:'Թո',sound:'[т]',note:'придыхательное',word:{id:326,arm:'թիվ',translit:'tiv',ru:'Количество'}},
  {upper:'Ժ',lower:'ժ',name:'Ղե',sound:'[ж]',note:'',word:{id:41,arm:'ժամ',translit:'zham',ru:'Час'}},
  {upper:'Ի',lower:'ի',name:'Ինի',sound:'[и]',note:'',word:{id:66,arm:'իմաստ',translit:'imast',ru:'Смысл'}},
  {upper:'Լ',lower:'լ',name:'Լյուն',sound:'[л]',note:'',word:{id:16,arm:'լեռ',translit:'ler',ru:'Гора'}},
  {upper:'Խ',lower:'խ',name:'Խև',sound:'[х]',note:'гортанный',word:{id:313,arm:'խիտ',translit:'khit',ru:'Густой'}},
  {upper:'Ծ',lower:'ծ',name:'Ձա',sound:'[ц]',note:'',word:{id:15,arm:'ծով',translit:'tsov',ru:'Море'}},
  {upper:'Կ',lower:'կ',name:'Կևն',sound:'[к]',note:'',word:{id:430,arm:'կապ',translit:'kap',ru:'Взаимодействие'}},
  {upper:'Հ',lower:'հ',name:'Հո',sound:'[h]',note:'как h',word:{id:22,arm:'հող',translit:'hogh',ru:'Земля'}},
  {upper:'Ձ',lower:'ձ',name:'Դզա',sound:'[дз]',note:'',word:{id:110,arm:'ձայն',translit:'dzayn',ru:'Звук/Голос'}},
  {upper:'Ղ',lower:'ղ',name:'Գատ',sound:'[ğ]',note:'гортанный',word:{id:355,arm:'ղեկավար',translit:'ghekavar',ru:'Руководитель'}},
  {upper:'Ճ',lower:'ճ',name:'Ճև',sound:'[ч]',note:'',word:{id:588,arm:'ճաշ',translit:'chash',ru:'Обед'}},
  {upper:'Մ',lower:'մ',name:'Մևն',sound:'[м]',note:'',word:{id:47,arm:'մահ',translit:'mah',ru:'Смерть'}},
  {upper:'Յ',lower:'յ',name:'Յի',sound:'[й]',note:'',word:null},
  {upper:'Ն',lower:'ն',name:'Նու',sound:'[н]',note:'',word:{id:174,arm:'նավ',translit:'nav',ru:'Корабль'}},
  {upper:'Շ',lower:'շ',name:'Շա',sound:'[ш]',note:'',word:{id:741,arm:'շեմ',translit:'shem',ru:'Порог'}},
  {upper:'Ո',lower:'ո',name:'Ովո',sound:'[о]',note:'в начале = во',word:{id:418,arm:'ուժ',translit:'uzh',ru:'Сила'}},
  {upper:'Չ',lower:'չ',name:'Չա',sound:'[ч]',note:'придыхательное',word:{id:719,arm:'չոր',translit:'chor',ru:'Сухой'}},
  {upper:'Պ',lower:'պ',name:'Պև',sound:'[п]',note:'',word:{id:95,arm:'պատ',translit:'pat',ru:'Стена'}},
  {upper:'Ջ',lower:'ջ',name:'Արակևլ',sound:'[дж]',note:'',word:{id:5,arm:'ջուր',translit:'jur',ru:'Вода'}},
  {upper:'Ռ',lower:'ռ',name:'Ռա',sound:'[р]',note:'раскатистое',word:{id:680,arm:'ռադիո',translit:'radio',ru:'Радио'}},
  {upper:'Ս',lower:'ս',name:'Սև',sound:'[с]',note:'',word:{id:102,arm:'սևվ',translit:'sev',ru:'Чёрный'}},
  {upper:'Վ',lower:'վ',name:'Վևվ',sound:'[в]',note:'',word:{id:68,arm:'վախ',translit:'vakh',ru:'Страх'}},
  {upper:'Տ',lower:'տ',name:'Տուն',sound:'[т]',note:'',word:{id:218,arm:'տալ',translit:'tal',ru:'Давать'}},
  {upper:'Ր',lower:'ր',name:'Րև',sound:'[р]',note:'мягкое',word:{id:40,arm:'րոպև',translit:'rope',ru:'Минута'}},
  {upper:'Ց',lower:'ց',name:'Ցո',sound:'[ц]',note:'придыхательное',word:{id:152,arm:'ցանց',translit:'tsants',ru:'Сеть'}},
  {upper:'ՈՒ',lower:'ու',name:'Ու',sound:'[у]',note:'диграф',word:{id:418,arm:'ուժ',translit:'uzh',ru:'Сила'}},
  {upper:'Փ',lower:'փ',name:'Փուր',sound:'[п]',note:'придыхательное',word:{id:310,arm:'փակ',translit:'pak',ru:'Закрытый'}},
  {upper:'Ք',lower:'ք',name:'Քև',sound:'[к]',note:'придыхательное',word:{id:23,arm:'քար',translit:'kar',ru:'Камень'}},
  {upper:'ԵՎ',lower:'և',name:'Եվ',sound:'[ев]',note:'лигатура',word:null},
  {upper:'Օ',lower:'օ',name:'Օ',sound:'[о]',note:'долгий о',word:{id:34,arm:'օր',translit:'or',ru:'День'}},
  {upper:'Ֆ',lower:'ֆ',name:'Ֆև',sound:'[ф]',note:'',word:{id:156,arm:'ֆայլ',translit:'fayl',ru:'Файл'}},
]

const BADGES = [
  { id: 'first',    icon: '🌱', name: 'Первый шаг',      desc: 'Выучил первую букву',         threshold: 1  },
  { id: 'five',     icon: '⭐', name: 'Пять звёзд',      desc: 'Выучил 5 букв',               threshold: 5  },
  { id: 'ten',      icon: '🔟', name: 'Десятка',          desc: 'Выучил 10 букв',              threshold: 10 },
  { id: 'half',     icon: '🏅', name: 'Половина пути',    desc: 'Выучил половину алфавита',    threshold: 20 },
  { id: 'vowels',   icon: '🎵', name: 'Гласные звуки',    desc: 'Выучил все гласные буквы',    threshold: -1 },
  { id: 'master',   icon: '👑', name: 'Мастер алфавита',  desc: 'Выучил все 39 букв!',         threshold: 39 },
]

const activeIdx      = ref(null)
const learnedLetters = ref(new Set(JSON.parse(localStorage.getItem('barr_alpha') || '[]')))
const quizMode       = ref(false)
const quizOpts       = ref([])
const quizChosen     = ref(null)
const quizAnswered   = ref(false)
const newBadge       = ref(null)
const prevBadgeIds   = ref(new Set(JSON.parse(localStorage.getItem('barr_badges') || '[]')))

const progress = computed(() => Math.round(learnedLetters.value.size / 39 * 100))
function isVowel(i) { return VOWEL_IDX.has(i) }

const earnedBadges = computed(() => {
  const count = learnedLetters.value.size
  const allVowels = [...VOWEL_IDX].every(i => learnedLetters.value.has(i))
  return BADGES.filter(b => {
    if (b.id === 'vowels') return allVowels
    return b.threshold > 0 && count >= b.threshold
  })
})

function checkNewBadges() {
  const prev = prevBadgeIds.value
  const curr = new Set(earnedBadges.value.map(b => b.id))
  for (const b of earnedBadges.value) {
    if (!prev.has(b.id)) {
      newBadge.value = b
      setTimeout(() => { newBadge.value = null }, 4000)
      break
    }
  }
  prevBadgeIds.value = curr
  localStorage.setItem('barr_badges', JSON.stringify([...curr]))
}

function openLetter(i) {
  activeIdx.value    = i
  quizMode.value     = false
  quizAnswered.value = false
  quizChosen.value   = null
}
function prev() { if (activeIdx.value > 0)  openLetter(activeIdx.value - 1) }
function next() { if (activeIdx.value < 38) openLetter(activeIdx.value + 1) }

function toggleLearned() {
  const s = new Set(learnedLetters.value)
  s.has(activeIdx.value) ? s.delete(activeIdx.value) : s.add(activeIdx.value)
  learnedLetters.value = s
  localStorage.setItem('barr_alpha', JSON.stringify([...s]))
  emit('update:learnedAlpha', s)
  checkNewBadges()
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
    emit('update:learnedAlpha', s)
    checkNewBadges()
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
/* MODAL */
.alpha-modal-overlay {
  position: fixed; inset: 0; z-index: 1000;
  background: rgba(0,0,0,.55);
  backdrop-filter: blur(4px);
  display: flex; align-items: flex-end;
}
.alpha-modal {
  width: 100%; max-height: 94dvh;
  background: var(--bg);
  border-radius: 24px 24px 0 0;
  overflow: hidden;
  display: flex; flex-direction: column;
  box-shadow: 0 -8px 40px rgba(0,0,0,.3);
}
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity .25s; }
.modal-fade-enter-active .alpha-modal, .modal-fade-leave-active .alpha-modal { transition: transform .3s cubic-bezier(.22,.61,.36,1); }
.modal-fade-enter-from { opacity: 0; }
.modal-fade-enter-from .alpha-modal { transform: translateY(60px); }
.modal-fade-leave-to { opacity: 0; }

.am-header {
  display: flex; align-items: flex-start; justify-content: space-between;
  padding: 20px 20px 12px;
  border-bottom: 1px solid rgba(176,120,40,.2);
  background:var(--glass-bg);
  backdrop-filter: blur(8px);
  flex-shrink: 0;
border-color:var(--glass-border);}
.am-close {
  width: 36px; height: 36px; border-radius: 50%;
  background: rgba(140,28,28,.1); border: none;
  font-size: 16px; color: var(--red); cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; margin-top: 4px;
  transition: background .15s;
}
.am-close:hover { background: rgba(140,28,28,.2); }

.am-progress-row {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 20px;
  background:var(--glass-bg);
  border-bottom: 1px solid rgba(176,120,40,.15);
  flex-shrink: 0;
border-color:var(--glass-border);backdrop-filter:var(--glass-blur-sm);-webkit-backdrop-filter:var(--glass-blur-sm);box-shadow:inset 0 1px 0 var(--glass-shine),0 4px 16px var(--glass-shadow);}
.am-body { flex: 1; overflow-y: auto; }

.at-title  { font-family:var(--d); font-size:clamp(24px,5vw,40px); font-weight:700; font-style:italic; color:var(--red); }
.at-sub    { font-family:var(--s); font-size:13px; color:var(--muted); margin-top:4px; font-style:italic; }
.at-bar    { flex:1; height:6px; background:rgba(140,28,28,.15); border-radius:3px; }
.at-fill   { height:100%; background:var(--red); border-radius:3px; transition:width .5s; }
.at-pct    { font-family:var(--m); font-size:10px; color:var(--muted); white-space:nowrap; }

/* ДОСТИЖЕНИЯ */
.achievements-row { display: flex; flex-wrap: wrap; gap: 8px; padding: 14px 14px 0; }
.badge {
  display: flex; align-items: center; gap: 6px;
  background: rgba(176,120,40,.12); border: 1px solid rgba(176,120,40,.3);
  border-radius: 20px; padding: 5px 12px;
}
.badge-icon { font-size: 16px; line-height: 1; }
.badge-name { font-family: var(--m); font-size: 10px; color: var(--gold); letter-spacing: .5px; }

/* ТОСТ НОВОГО ДОСТИЖЕНИЯ */
.new-badge-toast {
  display: flex; align-items: center; gap: 14px;
  background: var(--ink); border-radius: 16px; padding: 14px 18px;
  margin: 0;
}
.nbt-icon  { font-size: 36px; line-height: 1; }
.nbt-title { font-family: var(--m); font-size: 9px; letter-spacing: 2px; text-transform: uppercase; color: rgba(242,232,213,.5); margin-bottom: 4px; }
.nbt-name  { font-family: var(--d); font-size: 20px; font-style: italic; color: var(--bg); }
.nbt-desc  { font-family: var(--s); font-size: 12px; color: rgba(242,232,213,.6); margin-top: 2px; }
.badge-pop-enter-active { transition: all .4s cubic-bezier(.22,.61,.36,1); }
.badge-pop-leave-active { transition: all .3s ease; }
.badge-pop-enter-from   { opacity: 0; transform: scale(.85) translateY(10px); }
.badge-pop-leave-to     { opacity: 0; transform: scale(.95); }

/* СЕТКА */
.at-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(88px,1fr)); border-left:1px solid rgba(176,120,40,.2); border-top:1px solid rgba(176,120,40,.2); margin-top: 12px; }
.at-cell { border-right:1px solid rgba(176,120,40,.2); border-bottom:1px solid var(--line); padding:18px 10px 14px; background:var(--glass-bg); backdrop-filter:blur(4px); cursor:pointer; transition:all .15s; position:relative; text-align:center; border-color:var(--glass-border);}
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
.lv-back { background:none; border:none; font-family:var(--m); font-size:10px; letter-spacing:2px; text-transform:uppercase; color:var(--ink); cursor:pointer; padding:0; align-self:flex-start; }
.lv-back:hover { color:var(--red); }
.lv-counter-row { display:flex; align-items:center; justify-content:center; gap:20px; }
.lv-nav-btn { background:var(--glass-bg); border:1px solid var(--line); width:44px; height:44px; border-radius:50%; font-size:22px; cursor:pointer; transition:.15s var(--spring); color:var(--ink); border-color:var(--glass-border);backdrop-filter:var(--glass-blur-sm);-webkit-backdrop-filter:var(--glass-blur-sm);box-shadow:inset 0 1px 0 var(--glass-shine),0 4px 16px var(--glass-shadow);}
.lv-nav-btn:hover:not(:disabled) { border-color:var(--gold); }
.lv-nav-btn:disabled { opacity:.3; cursor:default; }
.lv-counter { font-family:var(--m); font-size:12px; color:var(--muted); letter-spacing:2px; min-width:60px; text-align:center; }
.lv-letter-card { background:var(--glass-bg); backdrop-filter:blur(8px); border:2px solid rgba(140,28,28,.25); border-radius:20px; padding:36px 20px 28px; text-align:center; border-color:var(--glass-border);}
.lv-letter-card.vowel { border-color:rgba(26,58,110,.25); }
.lv-big   { font-family:var(--d); font-size:clamp(100px,22vw,160px); font-weight:700; line-height:1; color:var(--red); }
.lv-letter-card.vowel .lv-big { color:var(--blue); }
.lv-small { font-family:var(--d); font-size:clamp(60px,13vw,96px); font-weight:400; line-height:1; opacity:.35; color:var(--ink); }
.lv-name-badge { display:inline-block; background:var(--ink); color:var(--bg); font-family:var(--m); font-size:12px; letter-spacing:2px; padding:5px 16px; border-radius:20px; margin-top:14px; }
.lv-sound-block { background:var(--glass-bg); border:1px solid var(--line); border-radius:14px; padding:16px 20px; display:flex; align-items:center; gap:16px; border-color:var(--glass-border);backdrop-filter:var(--glass-blur-sm);-webkit-backdrop-filter:var(--glass-blur-sm);box-shadow:inset 0 1px 0 var(--glass-shine),0 4px 16px var(--glass-shadow);}
.lv-sound-label { font-family:var(--m); font-size:9px; letter-spacing:2px; text-transform:uppercase; color:var(--muted); flex-shrink:0; }
.lv-sound-big   { font-family:var(--m); font-size:32px; font-weight:700; color:var(--ink); }
.lv-note        { font-family:var(--s); font-size:13px; color:var(--muted); font-style:italic; }
.lv-word-card { background:var(--glass-bg); backdrop-filter:blur(6px); border:1px solid rgba(26,58,110,.2); border-radius:16px; padding:18px 20px; border-color:var(--glass-border);}
.lv-word-label { font-family:var(--m); font-size:9px; letter-spacing:2px; text-transform:uppercase; color:var(--blue); margin-bottom:10px; }
.lv-word-arm   { font-family:var(--d); font-size:40px; font-style:italic; color:var(--ink); line-height:1.2; margin-bottom:8px; }
.lv-word-tr    { font-family:var(--m); font-size:16px; color:var(--muted); margin-bottom:6px; }
.lv-word-ru    { font-family:var(--s); font-size:20px; color:var(--ink); font-weight:600; }
:deep(.hl-letter) { color:var(--red) !important; font-weight:800; text-decoration:underline; text-decoration-color:rgba(140,28,28,.5); font-size:1.15em; }
.lv-quiz { background:var(--glass-bg); border:1px solid var(--line); border-radius:16px; padding:18px; border-color:var(--glass-border);backdrop-filter:var(--glass-blur-sm);-webkit-backdrop-filter:var(--glass-blur-sm);box-shadow:inset 0 1px 0 var(--glass-shine),0 4px 16px var(--glass-shadow);}
.lv-quiz-q    { font-family:var(--s); font-size:16px; color:var(--ink); margin-bottom:14px; text-align:center; }
.lv-quiz-opts { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
.lv-quiz-opt  { padding:16px; border:1.5px solid var(--line); border-radius:12px; background:var(--glass-bg); font-family:var(--m); font-size:16px; color:var(--ink); cursor:pointer; transition:.15s var(--spring); text-align:center; border-color:var(--glass-border);backdrop-filter:var(--glass-blur-sm);-webkit-backdrop-filter:var(--glass-blur-sm);box-shadow:inset 0 1px 0 var(--glass-shine),0 4px 16px var(--glass-shadow);}
.lv-quiz-opt:hover:not(:disabled) { border-color:var(--gold); }
.lv-quiz-opt.correct { background:rgba(42,94,58,.12); border-color:#2a5e3a; color:#2a5e3a; font-weight:700; }
.lv-quiz-opt.wrong   { background:rgba(140,28,28,.1); border-color:var(--red); color:var(--red); }
.lv-quiz-opt:disabled { cursor:default; }
.lv-quiz-fb   { text-align:center; font-family:var(--d); font-size:18px; font-style:italic; margin-top:12px; }
.lv-quiz-fb.ok  { color:#2a5e3a; }
.lv-quiz-fb.bad { color:var(--red); }
.lv-quiz-start { width:100%; padding:14px; background:rgba(26,58,110,.08); border:1px solid rgba(26,58,110,.2); border-radius:14px; font-family:var(--s); font-size:15px; color:var(--blue); cursor:pointer; transition:.15s var(--spring); }
.lv-quiz-start:hover { background:rgba(26,58,110,.14); }
.lv-actions { display:flex; gap:10px; }
.lv-learned-btn { flex:1; padding:16px; background:var(--glass-bg); border:2px solid var(--line); border-radius:14px; font-family:var(--d); font-size:16px; font-style:italic; color:var(--muted); cursor:pointer; transition:all .2s; border-color:var(--glass-border);backdrop-filter:var(--glass-blur-sm);-webkit-backdrop-filter:var(--glass-blur-sm);box-shadow:inset 0 1px 0 var(--glass-shine),0 4px 16px var(--glass-shadow);}
.lv-learned-btn:hover { border-color:var(--gold); color:var(--ink); }
.lv-learned-btn.done  { background:rgba(176,120,40,.12); border-color:var(--gold); color:var(--gold); }
.lv-next-btn  { flex:2; padding:16px; background:var(--red); border:none; border-radius:14px; font-family:var(--d); font-size:18px; font-style:italic; color:var(--bg); cursor:pointer; transition:.2s var(--spring); }
.lv-next-btn:hover { opacity:.88; }
.lv-finish-btn { background:var(--ink); }

[data-theme=dark] .alpha-modal   { background: #0a0804; }
[data-theme=dark] .am-header     { background: rgba(10,8,4,.95) !important; }
[data-theme=dark] .at-cell       { background: rgba(26,18,8,.8); }
[data-theme=dark] .lv-letter-card,
[data-theme=dark] .lv-sound-block,
[data-theme=dark] .lv-word-card,
[data-theme=dark] .lv-quiz,
[data-theme=dark] .lv-learned-btn { background: rgba(26,18,8,.9) !important; }
[data-theme=amoled] .alpha-modal  { background: #000; }
[data-theme=amoled] .am-header    { background: rgba(0,0,0,.98) !important; }
</style>
