<template>
  <div class="home">
    <div class="home-header">
      <div v-if="!screen && !activeArticle">
        <div class="home-greeting">Բարև,</div>
        <div class="home-name">{{ displayName }} 👋</div>
      </div>
      <button v-else class="home-back" @click="goBack">← Назад</button>
      <div class="home-level" v-if="!screen && !activeArticle">{{ level }}</div>
    </div>

    <!-- МЕНЮ: Статьи / Чтение -->
    <div v-if="screen==='menu'" class="home-menu">
      <div class="home-menu-card" @click="screen='articles'">
        <div class="hmc-icon">📝</div>
        <div class="hmc-body">
          <div class="hmc-title">Статьи</div>
          <div class="hmc-desc">{{ articles.length ? articles.length + ' ' + pluralMaterials(articles.length) : 'Загрузка...' }}</div>
        </div>
        <div class="hmc-arrow">→</div>
      </div>
      <div class="home-menu-card" @click="screen='reading'">
        <div class="hmc-icon">Այբ</div>
        <div class="hmc-body">
          <div class="hmc-title">Чтение с буквами</div>
          <div class="hmc-desc">Тексты где русские буквы заменены армянскими — тренируй узнавание</div>
          <div class="hmc-badge">{{ learnedAlphaCount }} букв выучено</div>
        </div>
        <div class="hmc-arrow">→</div>
      </div>
      <div class="home-menu-card" @click="screen='literature'">
        <div class="hmc-icon">Գր</div>
        <div class="hmc-body">
          <div class="hmc-title">Литература</div>
          <div class="hmc-desc">Числа · грамматика · история армянского языка</div>
        </div>
        <div class="hmc-arrow">→</div>
      </div>
    </div>

    <!-- ЛИТЕРАТУРА -->
    <div v-else-if="screen==='literature'" class="home-section-body">
      <LitTab />
    </div>

    <!-- СТАТЬЯ (детально) -->
    <div v-else-if="activeArticle" class="art-body">
      <div class="art-body-level">{{ activeArticle.level }} · {{ activeArticle.category }}</div>
      <div class="art-body-title">{{ activeArticle.title }}</div>
      <div class="art-body-text" v-html="renderBody(activeArticle.body)"></div>
    </div>

    <!-- СТАТЬИ: список -->
    <div v-else-if="screen==='articles'" class="home-section-body">
      <div v-if="!articles.length" class="lit-empty">Статей пока нет</div>
      <div class="art-list">
        <div v-for="a in articles" :key="a.id" class="art-card" @click="activeArticle = a">
          <div class="art-header"><span class="art-level">{{ a.level }}</span><span class="art-cat">{{ a.category }}</span></div>
          <div class="art-title">{{ a.title }}</div>
          <div class="art-desc">{{ a.desc }}</div>
          <div class="art-arrow">Читать →</div>
        </div>
      </div>
    </div>

    <!-- ЧТЕНИЕ С БУКВАМИ -->
    <div v-else-if="screen==='reading'" class="home-section-body">
      <div class="reading-info">
        <div class="ri-title">Чтение с заменой букв</div>
        <div class="ri-desc">Выучи буквы в Алфавите — и они появятся в текстах красным.</div>
        <div class="ri-count">Выучено: <strong>{{ learnedAlphaCount }}</strong> из 39 букв</div>
      </div>
      <div class="text-list">
        <div v-for="(story, si) in STORIES" :key="si"
          class="story-card"
          :class="{active: activeStory === si}"
          @click="activeStory = activeStory === si ? null : si">
          <div class="sc-head">
            <div>
              <div class="sc-title">{{ story.title }}</div>
              <div class="sc-focus" v-if="story.focus">фокус: {{ story.focus }}</div>
            </div>
            <div class="sc-level">{{ story.level }}</div>
          </div>
          <div v-if="activeStory === si" class="sc-body">
            <p class="sc-text" v-html="renderText(story.text)"></p>
            <div class="sc-legend">
              <span class="scl-arm">Арм</span> — выученная буква &nbsp;&nbsp; <span class="scl-ru">обычная</span> — ещё не выучена
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="home-body" v-else>
      <!-- STREAK -->
      <div class="streak-card">
        <div class="streak-fire" :class="{pulse: streakPulse}">
          <span class="streak-emoji">🔥</span>
          <span class="streak-num">{{ streak }}</span>
          <span class="streak-lbl">дней подряд</span>
          <span class="streak-freeze" v-if="streakFreezes > 0" title="Заморозки streak — сохранят серию при пропущенном дне">
            ❄️ {{ streakFreezes }}
          </span>
        </div>
        <div class="streak-sep"></div>
        <div class="streak-progress">
          <div class="sp-top">
            <span class="sp-lbl">Цель на сегодня</span>
            <span class="sp-val">{{ Math.min(learnedToday, dailyGoal) }}/{{ dailyGoal }} слов</span>
          </div>
          <div class="sp-bar">
            <div class="sp-fill" :style="{width: Math.min(learnedToday/dailyGoal*100, 100)+'%'}"></div>
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

      <!-- ПОВТОРЕНИЕ -->
      <div v-if="dueCount > 0" class="review-card" @click="$emit('go-tab','review')">
        <div class="rc-badge">{{ dueCount }}</div>
        <div class="rc-body">
          <div class="rc-title">Пора повторить</div>
          <div class="rc-desc">{{ dueCount }} {{ wordForm(dueCount) }} {{ waitForm(dueCount) }} повторения</div>
        </div>
        <span class="rc-arrow">→</span>
      </div>

      <!-- СЛАБЫЕ МЕСТА -->
      <div v-if="weakCount > 0" class="weak-card" @click="$emit('go-weak-review')">
        <div class="rc-badge weak">{{ weakCount }}</div>
        <div class="rc-body">
          <div class="rc-title">Слабые места</div>
          <div class="rc-desc">{{ weakCount }} {{ wordForm(weakCount) }}, {{ weakCount===1?'которое даётся':'которые даются' }} тяжело</div>
        </div>
        <span class="rc-arrow">→</span>
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

      <!-- СТАТЬИ И ЧТЕНИЕ -->
      <div class="home-menu-entry" @click="screen='menu'">
        <div class="hme-icon">📚</div>
        <div class="hme-body">
          <div class="hme-title">Статьи и чтение</div>
          <div class="hme-desc">Статьи, тексты с заменой букв, грамматика и история языка</div>
        </div>
        <div class="hme-arrow">→</div>
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
import { ref, computed, onMounted, watch } from 'vue'
import { db } from '../../firebase.js'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import LitTab from './LitTab.vue'
const props = defineProps({
  user:Object, words:Array, level:String, learned:Object, streak:Number,
  dueCount:{type:Number, default:0}, weakCount:{type:Number, default:0},
  dailyGoal:{type:Number, default:10}, learnedToday:{type:Number, default:0},
  streakFreezes:{type:Number, default:0}, learnedAlpha:Object,
})
defineEmits(['go-tab', 'go-weak-review'])

// ── МЕНЮ «Статьи и чтение» ───────────────────────────────────────────────
const screen         = ref(null) // null | 'menu' | 'articles' | 'reading' | 'literature'
const articles       = ref([])
const activeArticle  = ref(null)
const activeStory    = ref(null)

function goBack() {
  if (activeArticle.value) { activeArticle.value = null; return }
  if (screen.value === 'articles' || screen.value === 'reading' || screen.value === 'literature') { screen.value = 'menu'; return }
  screen.value = null
}

async function loadArticles() {
  try {
    const q = query(collection(db, 'articles'), orderBy('createdAt', 'desc'))
    const s = await getDocs(q)
    articles.value = s.docs.map(d => ({ id: d.id, ...d.data() }))
  } catch(e) { articles.value = [] }
}
function renderBody(text) {
  if (!text) return ''
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>')
    .replace(/^/, '<p>').replace(/$/, '</p>')
}
function pluralMaterials(n) {
  const mod10 = n % 10, mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return 'материал'
  if ([2,3,4].includes(mod10) && ![12,13,14].includes(mod100)) return 'материала'
  return 'материалов'
}
onMounted(loadArticles)

// ── ЧТЕНИЕ С ЗАМЕНОЙ БУКВ ─────────────────────────────────────────────────
const learnedAlphaCount = computed(() => props.learnedAlpha?.size || 0)

const IDX_TO_RU = {
  0: ['а','А'],   // Ա а/А
  1: ['б','Б'],   // Բ б/Б
  2: ['г','Г'],   // Գ г/Г
  3: ['д','Д'],   // Դ д/Д
  4: ['е','Е'],   // Ե е/Е
  5: ['з','З'],   // Զ з/З
  9: ['ж','Ж'],   // Ժ ж/Ж
  10: ['и','И'],  // Ի и/И
  11: ['л','Л'],  // Լ л/Л
  14: ['к','К'],  // Կ к/К
  19: ['м','М'],  // Մ м/М
  21: ['н','Н'],  // Ն н/Н
  22: ['ш','Ш'],  // Շ ш/Ш
  23: ['о','О'],  // Ո о/О
  25: ['п','П'],  // Պ п/П
  27: ['р','Р'],  // Ռ р/Р
  28: ['с','С'],  // Ս с/С
  29: ['в','В'],  // Վ в/В
  30: ['т','Т'],  // Տ т/Т
  34: ['ф','Ф'],  // Փ ф/Ф
  12: ['х','Х'],  // Խ х/Х
}
const ALPHA_LOWER = [
  'ա','բ','գ','դ','ե','զ','է','ը',
  'թ','ժ','ի','լ','խ','ծ','կ','հ',
  'ձ','ղ','ճ','մ','յ','ն','շ','ո',
  'չ','պ','ջ','ռ','ս','վ','տ','ր',
  'ց','ու','փ','ք','և','օ','ֆ',
]
const ALPHA_UPPER = [
  'Ա','Բ','Գ','Դ','Ե','Զ','Է','Ը',
  'Թ','Ժ','Ի','Լ','Խ','Ծ','Կ','Հ',
  'Ձ','Ղ','Ճ','Մ','Յ','Ն','Շ','Ո',
  'Չ','Պ','Ջ','Ռ','Ս','Վ','Տ','Ր',
  'Ց','ՈՒ','Փ','Ք','ԵՎ','Օ','Ֆ',
]

const learnedMap = computed(() => {
  const map = {}
  const _ = props.learnedAlpha?.size
  if (!props.learnedAlpha) return map
  for (const [idxStr, ruPair] of Object.entries(IDX_TO_RU)) {
    const idx = Number(idxStr)
    if (props.learnedAlpha.has(idx)) {
      map[ruPair[0]] = ALPHA_LOWER[idx]
      map[ruPair[1]] = ALPHA_UPPER[idx]
    }
  }
  return map
})

function renderText(text) {
  const map = learnedMap.value
  let result = ''
  for (const ch of text) {
    if (map[ch]) {
      result += `<span class="arm-char">${map[ch]}</span>`
    } else {
      result += ch
    }
  }
  return result
}

const STORIES = [
  {
    title: 'Маша и школа',
    level: 'Начальный',
    focus: 'А, Б, Г, Д',
    text: 'Маша пошла домой после школы. По дороге она встретила подругу Дашу. Они шли вместе и разговаривали о сегодняшнем уроке рисования. Учительница Анна Петровна похвалила Машину работу. Маша нарисовала горный пейзаж с рекой и деревьями. Даша тоже старалась но сказала что у неё не получаются горы. Маша пообещала помочь ей. Дома Маша поела и сделала домашнее задание. Потом она нарисовала ещё один рисунок — подарок для мамы. Мама была очень рада.'
  },
  {
    title: 'Город и горы',
    level: 'Начальный',
    focus: 'Г, Д, З, И',
    text: 'Арам живёт в небольшом городе у подножия гор. Каждое утро он открывает окно и видит заснеженные вершины. Летом горы зелёные а зимой белые от снега. В прошлые выходные Арам ходил в горы с братом и двумя друзьями. Они шли три часа по узкой тропинке. По дороге видели орла который парил высоко в небе. На вершине холма они разожгли небольшой костёр и сварили чай. Вид оттуда был потрясающий — весь город был виден как на ладони. Арам сфотографировал закат и отправил фото родителям. Горный воздух был чистым и холодным. Домой вернулись уже в темноте уставшие но довольные.'
  },
  {
    title: 'Утро в Ереване',
    level: 'Начальный',
    focus: 'А, Е, И, О',
    text: 'Арег живёт в Ереване уже пять лет. Каждое утро он встаёт в семь часов. Первым делом он открывает занавески и смотрит на Арарат. В ясные дни гора видна очень хорошо — огромная и белая. Арег варит кофе и завтракает на балконе. Потом он идёт пешком на работу — это занимает около двадцати минут. По дороге он проходит мимо рынка где уже в такую рань кипит торговля. Продавцы раскладывают фрукты и зелень. Пахнет свежим хлебом из пекарни на углу. На работе Арег занимается переводами с армянского на русский. Вечером он любит гулять по старым улицам города.'
  },
  {
    title: 'Рынок',
    level: 'Средний',
    focus: 'М, Н, С, П',
    text: 'Каждую субботу бабушка Сируш ходит на рынок. Она выходит из дома рано пока не стало жарко. Рынок находится в десяти минутах ходьбы от её дома. Там продают всё — овощи фрукты зелень сыр мясо и домашнее варенье. Продавец Вартан знает Сируш уже много лет. Он всегда откладывает для неё самые спелые персики и самые сочные помидоры. Сегодня она купила килограмм абрикосов полкило сыра пучок кинзы и свежий лаваш. Вартан дал ей немного мяты в подарок. Сируш поблагодарила его и пошла домой. Дома она сварила варенье из абрикосов — по старому семейному рецепту. Запах разошёлся по всему двору.'
  },
  {
    title: 'Письмо другу',
    level: 'Средний',
    focus: 'Р, С, Т, В',
    text: 'Дорогой Артур! Давно не писал тебе — всё никак не находил времени. Сейчас я в Ереване уже третий месяц. Город очень красивый особенно весной когда всё цветёт. Вчера я ходил в Матенадаран — это знаменитый музей рукописей. Там хранятся тысячи древних книг написанных вручную. Некоторым рукописям больше тысячи лет. Я стоял перед одной страницей и думал о том человеке который её писал. Каким терпением нужно было обладать! После музея я зашёл в кафе и попробовал настоящий армянский кофе — густой крепкий с кардамоном. Очень советую приехать сюда этим летом. Буду рад тебя встретить. Твой друг Нарек.'
  },
  {
    title: 'Армянская кухня',
    level: 'Средний',
    focus: 'Д, З, Л, М',
    text: 'Армянская кухня — одна из древнейших в мире. Главное блюдо праздничного стола — долма. Это фарш из баранины с рисом и специями завёрнутый в виноградные листья. Готовится долма долго — несколько часов. Ещё одно важное блюдо — хаш. Его варят из говяжьих ног всю ночь и едят ранним утром с чесноком и лавашом. Лаваш — тонкий хлеб который пекут в глиняной печи тандыре. Женщины раскатывают тесто очень тонко и бросают его на раскалённые стенки. Готовый лаваш высыхает и хранится месяцами. Перед едой его смачивают водой и он снова становится мягким. На десерт обычно подают пахлаву или гата — слоёное печенье с орехами и сахаром. Армяне говорят что еда без хлеба — не еда.'
  },
  {
    title: 'Монастырь Гегард',
    level: 'Продвинутый',
    focus: 'Все буквы',
    text: 'В сорока километрах от Еревана в горном ущелье спрятан монастырь Гегард. Его название означает «копьё» — по преданию здесь хранилось копьё которым пронзили Христа. Монастырь основан в четвёртом веке но большинство построек относятся к двенадцатому-тринадцатому векам. Часть монастыря буквально вырублена в скале. Каменщики средневековья создали внутри горы целые залы с куполами и колоннами. Стены покрыты резьбой — цветами крестами и надписями на древнеармянском. Акустика внутри удивительная — малейший звук отражается от стен и звучит как орган. В хорошую погоду сюда приезжают сотни туристов. Местные жители до сих пор приходят сюда молиться и зажигать свечи. Монастырь включён в список всемирного наследия ЮНЕСКО.'
  },
  {
    title: 'Арарат',
    level: 'Средний',
    focus: 'А, Р, Т',
    text: 'Арарат — самая известная гора в истории Армении. Она состоит из двух вершин: Большой Арарат высотой пять тысяч метров и Малый Арарат высотой около четырёх тысяч. По Библии именно на Арарате остановился Ноев ковчег после потопа. Для армян это священная гора — символ родины и национальной идентичности. Арарат изображён на гербе Армении и на этикетке знаменитого армянского коньяка. Однако сама гора находится на территории Турции — это болезненная историческая тема для армянского народа. Граница проходит совсем близко. С ереванских улиц и крыш гора видна очень хорошо — огромная белая двуглавая громада на горизонте. В ясные дни она кажется близкой но добраться до неё непросто. Туристы могут наблюдать Арарат из Армении но подняться на него — уже с турецкой стороны.'
  },
  {
    title: 'Ереванское метро',
    level: 'Продвинутый',
    focus: 'Е, М, Р, Н',
    text: 'Ереванское метро — одно из самых маленьких в мире. В нём всего одна линия и десять станций. Строительство началось в советское время и первые поезда пошли в тысяча девятьсот восемьдесят первом году. Станции оформлены в разных стилях — есть строгие советские и есть украшенные армянскими орнаментами. Станция Площадь Республики считается самой красивой — её стены отделаны розовым туфом. Метро работает с шести утра до полуночи. Билет стоит совсем недорого. Многие жители предпочитают метро автобусу потому что в час пик на улицах большие пробки. Туристам метро интересно само по себе — как памятник советской архитектуры. Некоторые старые вагоны до сих пор в строю. На некоторых станциях можно купить горячий кофе прямо на платформе.'
  },
]

function wordForm(n) {
  const mod10 = n % 10, mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return 'слово'
  if ([2,3,4].includes(mod10) && ![12,13,14].includes(mod100)) return 'слова'
  return 'слов'
}
function waitForm(n) {
  const mod10 = n % 10, mod100 = n % 100
  return (mod10 === 1 && mod100 !== 11) ? 'ждёт' : 'ждут'
}

const flipped = ref(false)
const displayName = computed(() => props.user?.displayName?.split(' ')[0] || 'Друг')
const progress = computed(() => Math.round(props.learned.size / props.words.length * 100))

const streakPulse = ref(false)
watch(() => props.streak, (n, old) => {
  if (n > old) {
    streakPulse.value = true
    setTimeout(() => { streakPulse.value = false }, 550)
  }
})
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
  background:var(--glass-bg-strong);
  border-bottom:1px solid var(--line);
  position:sticky; top:0; z-index:10;
border-color:var(--glass-border);backdrop-filter:var(--glass-blur);-webkit-backdrop-filter:var(--glass-blur);}
.home-greeting { font-family:var(--m); font-size:11px; color:var(--muted); }
.home-name { font-family:var(--d); font-size:26px; font-weight:700; font-style:italic; color:var(--red); }
.home-level { background:var(--red); color:var(--on-accent); font-family:var(--m); font-size:12px; font-weight:700; padding:6px 14px; border-radius:20px; letter-spacing:1px; }
.home-body { padding:16px; display:flex; flex-direction:column; gap:14px; }
.streak-card {
  background:var(--glass-bg); 
  border:1px solid rgba(246,140,54,.3); border-radius:16px;
  padding:18px; display:flex; gap:16px; align-items:center;
border-color:var(--glass-border);backdrop-filter:var(--glass-blur);-webkit-backdrop-filter:var(--glass-blur);}
.streak-fire { display:flex; flex-direction:column; align-items:center; gap:2px; }
.streak-emoji { font-size:32px; line-height:1; }
.streak-num { font-family:var(--d); font-size:40px; font-weight:700; color:var(--red); line-height:1; transition:transform .3s var(--spring); }
.streak-fire.pulse .streak-num { animation:streakPulse .5s var(--spring); }
@keyframes streakPulse { 0%{transform:scale(1)} 40%{transform:scale(1.35)} 100%{transform:scale(1)} }
.streak-lbl { font-family:var(--m); font-size:8px; letter-spacing:1px; text-transform:uppercase; color:var(--muted); }
.streak-freeze { font-family:var(--m); font-size:10px; color:var(--blue); margin-top:2px; }
.streak-sep { width:1px; height:50px; background:rgba(246,140,54,.25); }
.streak-progress { flex:1; }
.sp-top { display:flex; justify-content:space-between; margin-bottom:8px; }
.sp-lbl { font-family:var(--m); font-size:10px; color:var(--muted); }
.sp-val { font-family:var(--s); font-size:13px; font-weight:600; color:var(--ink); }
.sp-bar { height:8px; background:rgba(128,6,19,.15); border-radius:4px; }
.sp-fill { height:100%; background:var(--red); border-radius:4px; transition:width .5s; }
.continue-card {
  background:var(--ink); border-radius:16px; padding:20px;
  cursor:pointer; transition:opacity .2s; position:relative;
}
.continue-card:hover { opacity:.92; }
.cc-eyebrow { font-family:var(--m); font-size:9px; letter-spacing:2px; text-transform:uppercase; color:rgba(231,220,208,.5); margin-bottom:6px; }
.cc-title { font-family:var(--d); font-size:24px; font-style:italic; color:var(--bg); margin-bottom:14px; }
.cc-footer { display:flex; align-items:center; gap:10px; }
.cc-bar { flex:1; height:5px; background:var(--glass-bg); border-radius:3px; border-color:var(--glass-border);box-shadow:inset 0 1px 0 var(--glass-shine),0 4px 16px var(--glass-shadow);backdrop-filter:var(--glass-blur);-webkit-backdrop-filter:var(--glass-blur);}
.cc-fill { height:100%; background:var(--gold); border-radius:3px; transition:width .5s; }
.cc-pct { font-family:var(--m); font-size:11px; color:rgba(231,220,208,.6); }
.cc-arrow { margin-left:auto; font-size:18px; color:rgba(231,220,208,.4); }
.review-card {
  display:flex; align-items:center; gap:14px;
  background:var(--glass-bg); border:1px solid rgba(246,140,54,.35); border-radius:16px;
  padding:16px 18px; cursor:pointer; transition:all .2s;
  border-color:var(--glass-border);
}
.review-card:hover { border-color:var(--gold); }
.rc-badge {
  flex-shrink:0; width:36px; height:36px; border-radius:50%;
  background:var(--gold); color:var(--on-accent);
  display:flex; align-items:center; justify-content:center;
  font-family:var(--m); font-size:14px; font-weight:700;
}
.rc-body { flex:1; }
.rc-title { font-family:var(--s); font-size:15px; font-weight:600; color:var(--ink); }
.rc-desc  { font-family:var(--m); font-size:10px; color:var(--muted); margin-top:2px; }
.rc-arrow { font-size:18px; color:var(--gold); }

.weak-card {
  display:flex; align-items:center; gap:14px;
  background:var(--glass-bg); border:1px solid rgba(35,88,138,.35); border-radius:16px;
  padding:16px 18px; cursor:pointer; transition:all .2s;
  border-color:var(--glass-border);
}
.weak-card:hover { border-color:var(--blue); }
.weak-card .rc-arrow { color:var(--blue); }
.rc-badge.weak { background:var(--blue); }

.word-card {
  background:var(--glass-bg); 
  border:1px solid rgba(35,88,138,.2); border-radius:16px;
  padding:20px; cursor:pointer; min-height:110px;
  transition:all .2s;
border-color:var(--glass-border);backdrop-filter:var(--glass-blur);-webkit-backdrop-filter:var(--glass-blur);}
.word-card:hover { border-color:rgba(35,88,138,.35); }
.wc-label { font-family:var(--m); font-size:9px; letter-spacing:2px; text-transform:uppercase; color:var(--blue); margin-bottom:10px; }
.wc-arm  { font-family:var(--d); font-size:52px; font-style:italic; color:var(--red); line-height:1; }
.wc-tr   { font-family:var(--m); font-size:12px; color:var(--muted); margin-top:4px; }
.wc-tap  { font-family:var(--s); font-size:11px; color:var(--muted); margin-top:8px; font-style:italic; opacity:.7; }
.wc-ru   { font-family:var(--d); font-size:40px; font-weight:700; color:var(--ink); }
.wc-arm-sm { font-family:var(--d); font-size:20px; font-style:italic; color:var(--muted); margin-top:4px; }
.quick-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
.qc {
  background:var(--glass-bg); 
  border:1px solid var(--line); border-radius:16px;
  padding:18px; cursor:pointer; transition:all .2s; text-align:center;
border-color:var(--glass-border);backdrop-filter:var(--glass-blur);-webkit-backdrop-filter:var(--glass-blur);}
.qc:hover { border-color:var(--gold); }
.qc-label { font-family:var(--s); font-size:15px; font-weight:600; color:var(--ink); margin-top:8px; }
.qc-desc  { font-family:var(--m); font-size:10px; color:var(--muted); margin-top:3px; }
.stats-row {
  background:var(--glass-bg); 
  border:1px solid var(--line); border-radius:16px;
  display:flex; align-items:center;
border-color:var(--glass-border);backdrop-filter:var(--glass-blur);-webkit-backdrop-filter:var(--glass-blur);}
.stat { flex:1; padding:16px; text-align:center; }
.stat-n { font-family:var(--d); font-size:30px; font-weight:700; color:var(--red); line-height:1; }
.stat-l { font-family:var(--m); font-size:8px; letter-spacing:1px; text-transform:uppercase; color:var(--muted); margin-top:4px; }
.stat-div { width:1px; height:44px; background:rgba(246,140,54,.2); }
.lang-fact {
  background:rgba(35,88,138,.07);
  border:1px solid rgba(35,88,138,.18); border-radius:16px;
  padding:20px; display:flex; flex-direction:column; gap:12px;
  backdrop-filter: blur(16px) saturate(130%);
  -webkit-backdrop-filter: blur(16px) saturate(130%);
}
.lf-label { font-family:var(--m); font-size:9px; letter-spacing:2px; text-transform:uppercase; color:var(--blue); }
.lf-text  { font-family:var(--s); font-size:15px; color:var(--ink); line-height:1.6; }
.lf-next  { background:none; border:none; font-family:var(--m); font-size:11px; color:var(--blue); cursor:pointer; text-align:left; padding:0; letter-spacing:1px; }
.lf-next:hover { text-decoration:underline; }
.flip-enter-active, .flip-leave-active { transition: all .25s; }
.flip-enter-from { opacity:0; transform:translateY(6px); }
.flip-leave-to   { opacity:0; transform:translateY(-6px); }

/* СТАТЬИ */
.home-back {
  background:var(--glass-bg); border:1px solid var(--line2); border-radius:20px;
  font-family:var(--m); font-size:10px; letter-spacing:2px; text-transform:uppercase;
  color:var(--ink); cursor:pointer; padding:8px 14px; transition:.15s var(--spring);
  backdrop-filter:var(--glass-blur); -webkit-backdrop-filter:var(--glass-blur);
}
.home-back:hover { color:var(--red); border-color:var(--gold); }

/* ВХОД В МЕНЮ (на дашборде) */
.home-menu-entry {
  display:flex; align-items:center; gap:14px;
  background:var(--glass-bg); border:1.5px solid var(--line2); border-radius:16px;
  padding:16px 18px; cursor:pointer; transition:.15s var(--spring);
  box-shadow:inset 0 1px 0 var(--glass-shine),0 4px 16px var(--glass-shadow);
  backdrop-filter:var(--glass-blur); -webkit-backdrop-filter:var(--glass-blur);
}
.home-menu-entry:hover { border-color:var(--gold); }
.hme-icon { font-size:26px; line-height:1; flex-shrink:0; }
.hme-body { flex:1; }
.hme-title { font-family:var(--s); font-size:15px; font-weight:600; color:var(--ink); }
.hme-desc { font-family:var(--m); font-size:10px; color:var(--muted); margin-top:3px; line-height:1.4; }
.hme-arrow { font-size:18px; color:var(--gold); }

/* МЕНЮ: Статьи / Чтение */
.home-menu { padding:16px; display:flex; flex-direction:column; gap:12px; }
.home-menu-card {
  background:var(--glass-bg); border:1.5px solid var(--line2); border-radius:18px;
  padding:18px 20px; cursor:pointer; display:flex; align-items:center; gap:16px;
  transition:.15s var(--spring);
  box-shadow:inset 0 1px 0 var(--glass-shine),0 4px 16px var(--glass-shadow);
  backdrop-filter:var(--glass-blur); -webkit-backdrop-filter:var(--glass-blur);
}
.home-menu-card:hover { border-color:var(--gold); }
.hmc-icon { font-family:var(--d); font-size:28px; color:var(--red); line-height:1; min-width:40px; text-align:center; }
.hmc-body { flex:1; }
.hmc-title { font-family:var(--d); font-size:17px; font-style:italic; color:var(--ink); margin-bottom:4px; }
.hmc-desc { font-family:var(--s); font-size:12px; color:var(--muted); line-height:1.5; }
.hmc-badge { display:inline-block; margin-top:6px; background:rgba(128,6,19,.1); color:var(--red); font-family:var(--m); font-size:10px; padding:2px 10px; border-radius:20px; }
.hmc-arrow { font-size:18px; color:var(--muted); }

.home-section-body { padding:16px; display:flex; flex-direction:column; gap:12px; }
.lit-empty { text-align:center; color:var(--muted); font-family:var(--s); padding:40px 20px; }

/* ЧТЕНИЕ С ЗАМЕНОЙ БУКВ */
.reading-info { background:rgba(35,88,138,.07); border:1px solid rgba(35,88,138,.18); border-radius:14px; padding:16px; }
.ri-title { font-family:var(--d); font-size:18px; font-style:italic; color:var(--blue); margin-bottom:6px; }
.ri-desc  { font-family:var(--s); font-size:13px; color:var(--ink); line-height:1.6; margin-bottom:8px; }
.ri-count { font-family:var(--m); font-size:11px; color:var(--muted); }
.ri-count strong { color:var(--ink); }
.text-list { display:flex; flex-direction:column; gap:10px; }
.story-card {
  background:var(--glass-bg); border:1.5px solid var(--line2); border-radius:14px;
  overflow:hidden; cursor:pointer; transition:all .2s;
  backdrop-filter:var(--glass-blur); -webkit-backdrop-filter:var(--glass-blur);
}
.story-card:hover { border-color:var(--gold); }
.story-card.active { border-color:var(--red); }
.sc-head { display:flex; align-items:center; justify-content:space-between; padding:14px 16px; gap:8px; }
.sc-title { font-family:var(--d); font-size:17px; font-style:italic; color:var(--ink); }
.sc-focus { font-family:var(--m); font-size:9px; color:var(--muted); margin-top:2px; }
.sc-level { font-family:var(--m); font-size:9px; letter-spacing:1px; background:rgba(246,140,54,.15); color:var(--gold); padding:3px 10px; border-radius:20px; white-space:nowrap; flex-shrink:0; }
.sc-body { padding:0 16px 16px; border-top:1px solid var(--line); padding-top:12px; }
.sc-text { font-family:var(--s); font-size:18px; line-height:2.2; color:var(--ink); margin:0 0 12px; }
.arm-char { font-family:var(--d); font-size:1.15em; color:var(--red); font-weight:700; }
.sc-legend { font-family:var(--s); font-size:12px; color:var(--muted); background:var(--glass-bg); border-radius:8px; padding:8px 12px; backdrop-filter:var(--glass-blur); -webkit-backdrop-filter:var(--glass-blur); }
.scl-arm { font-family:var(--d); font-size:1.05em; color:var(--red); font-weight:700; }
.scl-ru  { color:var(--muted); }

.art-list { display:flex; flex-direction:column; gap:10px; }
.art-card { background:var(--glass-bg); border:1.5px solid var(--line2); border-radius:14px; padding:16px; cursor:pointer; transition:.15s var(--spring); display:flex; flex-direction:column; gap:6px; box-shadow:inset 0 1px 0 var(--glass-shine),0 4px 16px var(--glass-shadow); backdrop-filter:var(--glass-blur); -webkit-backdrop-filter:var(--glass-blur); }
.art-card:hover { border-color:var(--gold); }
.art-header { display:flex; gap:8px; align-items:center; }
.art-level { font-family:var(--m); font-size:10px; letter-spacing:1px; background:var(--red); color:var(--on-accent); padding:2px 8px; border-radius:10px; }
.art-cat { font-family:var(--m); font-size:10px; color:var(--muted); text-transform:uppercase; letter-spacing:1px; }
.art-title { font-family:var(--d); font-size:18px; font-style:italic; color:var(--ink); }
.art-desc { font-family:var(--s); font-size:13px; color:var(--muted); line-height:1.5; }
.art-arrow { font-family:var(--m); font-size:11px; color:var(--gold); margin-top:4px; }
.art-body { padding:16px; display:flex; flex-direction:column; gap:10px; }
.art-body-level { font-family:var(--m); font-size:10px; color:var(--muted); letter-spacing:1px; text-transform:uppercase; }
.art-body-title { font-family:var(--d); font-size:26px; font-style:italic; font-weight:700; color:var(--red); line-height:1.2; }
.art-body-text {
  font-family:var(--s); font-size:15px; color:var(--ink); line-height:1.8;
  background:var(--glass-bg); border:1px solid var(--line); border-radius:14px; padding:18px;
  box-shadow:inset 0 1px 0 var(--glass-shine),0 4px 16px var(--glass-shadow); backdrop-filter:var(--glass-blur); -webkit-backdrop-filter:var(--glass-blur);
}
.art-body-text :deep(p) { margin:0 0 12px; }
.art-body-text :deep(p:last-child) { margin:0; }

[data-theme=dark] .home-back { background:rgba(24,16,8,.94) !important; border-color:rgba(246,140,54,.2) !important; color:rgba(231,220,208,.9) !important; }
[data-theme=amoled] .home-back { background:rgba(0,0,0,.95) !important; color:rgba(231,220,208,.9) !important; }
[data-theme=dark] .art-card,
[data-theme=dark] .art-body-text,
[data-theme=dark] .home-menu-entry,
[data-theme=dark] .home-menu-card,
[data-theme=dark] .story-card { background:rgba(24,16,8,.94) !important; border-color:rgba(246,140,54,.2) !important; }
[data-theme=amoled] .art-card,
[data-theme=amoled] .art-body-text,
[data-theme=amoled] .home-menu-entry,
[data-theme=amoled] .home-menu-card,
[data-theme=amoled] .story-card { background:rgba(0,0,0,.95) !important; }
[data-theme=dark] .art-title,
[data-theme=dark] .art-body-text,
[data-theme=dark] .hmc-title,
[data-theme=dark] .hme-title,
[data-theme=dark] .sc-title,
[data-theme=dark] .sc-text { color:rgba(231,220,208,.9) !important; }
[data-theme=dark] .reading-info { background:rgba(35,88,138,.15) !important; }
[data-theme=dark] .sc-legend { background:rgba(24,16,8,.94) !important; color:rgba(231,220,208,.5) !important; }

[data-theme=dark] .home-header,
[data-theme=amoled] .home-header { background:rgba(10,8,4,.96) !important; }
[data-theme=dark] .streak-card,
[data-theme=dark] .word-card,
[data-theme=dark] .qc,
[data-theme=dark] .review-card,
[data-theme=dark] .stats-row { background:rgba(24,16,8,.94) !important; }
[data-theme=amoled] .streak-card,
[data-theme=amoled] .word-card,
[data-theme=amoled] .qc,
[data-theme=amoled] .review-card,
[data-theme=amoled] .stats-row { background:rgba(0,0,0,.95) !important; }
</style>
