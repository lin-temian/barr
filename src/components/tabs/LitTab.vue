<template>
  <div class="lit-tab">
    <div class="lit-header">
      <h2 class="lit-title">Գրականություն</h2>
      <p class="lit-sub">Արվեստ · История · Тексты для чтения</p>
    </div>

    <div v-if="!activeSection" class="lit-sections">

      <div class="lit-section-card" @click="activeSection = 'reading'">
        <div class="lsc-icon">Այբ</div>
        <div class="lsc-body">
          <div class="lsc-title">Чтение с буквами</div>
          <div class="lsc-desc">Тексты где русские буквы заменены армянскими — тренируй узнавание</div>
          <div class="lsc-badge">{{ learnedCount }} букв выучено</div>
        </div>
        <div class="lsc-arrow">→</div>
      </div>

      <div class="lit-section-card" @click="activeSection = 'numbers'">
        <div class="lsc-icon">Թվեր</div>
        <div class="lsc-body">
          <div class="lsc-title">Армянские числа</div>
          <div class="lsc-desc">Как устроена система счёта · механизм «10+н+1» · 1–1000</div>
        </div>
        <div class="lsc-arrow">→</div>
      </div>

      <div class="lit-section-card" @click="activeSection = 'grammar'">
        <div class="lsc-icon">Բար</div>
        <div class="lsc-body">
          <div class="lsc-title">Грамматика</div>
          <div class="lsc-desc">Словосочетания · глаголы · единственное и множественное число</div>
        </div>
        <div class="lsc-arrow">→</div>
      </div>

      <div class="lit-section-card" @click="activeSection = 'history'">
        <div class="lsc-icon">Արვ</div>
        <div class="lsc-body">
          <div class="lsc-title">История армянского</div>
          <div class="lsc-desc">Алфавит · рукописи · факты · уникальность букв</div>
        </div>
        <div class="lsc-arrow">→</div>
      </div>

      <div class="lit-section-card" @click="activeSection = 'articles'">
        <div class="lsc-icon">📝</div>
        <div class="lsc-body">
          <div class="lsc-title">Статьи</div>
          <div class="lsc-desc">{{ articles.length ? articles.length + ' ' + pluralMaterials(articles.length) : 'Загрузка...' }}</div>
        </div>
        <div class="lsc-arrow">→</div>
      </div>

    </div>

    <!-- СТАТЬИ -->
    <div v-else-if="activeSection === 'articles'" class="lit-inner">
      <button class="lit-back" @click="activeSection = null; activeArticle = null">← Назад</button>
      <div v-if="!activeArticle">
        <div v-if="articles.length === 0" class="lit-empty">Статей пока нет</div>
        <div v-for="a in articles" :key="a.id" class="art-card" @click="activeArticle = a">
          <div class="art-header"><span class="art-level">{{ a.level }}</span><span class="art-cat">{{ a.category }}</span></div>
          <div class="art-title">{{ a.title }}</div>
          <div class="art-desc">{{ a.desc }}</div>
          <div class="art-arrow">Читать →</div>
        </div>
      </div>
      <div v-else class="art-body">
        <button class="lit-back" @click="activeArticle = null">← К статьям</button>
        <div class="art-body-level">{{ activeArticle.level }} · {{ activeArticle.category }}</div>
        <div class="art-body-title">{{ activeArticle.title }}</div>
        <div class="art-body-text" v-html="renderBody(activeArticle.body)"></div>
      </div>
    </div>

    <!-- ЧТЕНИЕ -->
    <div v-else-if="activeSection === 'reading'" class="lit-inner">
      <button class="lit-back" @click="activeSection = null; activeStory = null">← Назад</button>
      <div class="reading-info">
        <div class="ri-title">Чтение с заменой букв</div>
        <div class="ri-desc">Выучи буквы в Алфавите — и они появятся в текстах красным.</div>
        <div class="ri-count">Выучено: <strong>{{ learnedCount }}</strong> из 39 букв</div>
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

    <!-- ЧИСЛА -->
    <div v-else-if="activeSection === 'numbers'" class="lit-inner">
      <button class="lit-back" @click="activeSection = null">← Назад</button>
      <h3 class="sec-title">Армянские числа</h3>

      <div class="av-body">
        <p>Армянская система счёта — <strong>десятичная</strong>. Числа 11–19 строятся по принципу <em>«десять + н + единица»</em> (союз «н» звучит как соединительный элемент). Десятки образуются особым образом, а составные числа добавляют единицы через союз <em>«ու» (у)</em>.</p>
      </div>

      <div class="num-section">
        <div class="num-sec-title">Единицы 1–10</div>
        <div class="num-grid">
          <div class="num-card" v-for="n in UNITS" :key="n.n">
            <div class="nc-n">{{ n.n }}</div>
            <div class="nc-arm">{{ n.arm }}</div>
            <div class="nc-tr">{{ n.tr }}</div>
          </div>
        </div>
      </div>

      <div class="num-section">
        <div class="num-sec-title">Механизм 11–19: Տաս + ն + единица</div>
        <div class="formula-table">
          <div class="ft-row ft-head">
            <div>Число</div><div>Формула</div><div>Результат</div>
          </div>
          <div class="ft-row" v-for="f in FORMULA11" :key="f.n">
            <div class="ft-n">{{ f.n }}</div>
            <div class="ft-f">{{ f.formula }}</div>
            <div class="ft-r">{{ f.result }}</div>
          </div>
        </div>
      </div>

      <div class="num-section">
        <div class="num-sec-title">Десятки 20–90</div>
        <div class="num-grid">
          <div class="num-card" v-for="n in DECADES" :key="n.n">
            <div class="nc-n">{{ n.n }}</div>
            <div class="nc-arm">{{ n.arm }}</div>
            <div class="nc-tr">{{ n.tr }}</div>
          </div>
        </div>
      </div>

      <div class="num-section">
        <div class="num-sec-title">Составные числа: десяток + ու + единица</div>
        <div class="formula-table">
          <div class="ft-row ft-head">
            <div>Число</div><div>Формула</div><div>Результат</div>
          </div>
          <div class="ft-row" v-for="f in FORMULA_COMP" :key="f.n">
            <div class="ft-n">{{ f.n }}</div>
            <div class="ft-f">{{ f.formula }}</div>
            <div class="ft-r">{{ f.result }}</div>
          </div>
        </div>
      </div>

      <div class="num-section">
        <div class="num-sec-title">Крупные числа</div>
        <div class="num-grid">
          <div class="num-card" v-for="n in LARGE" :key="n.n">
            <div class="nc-n">{{ n.n }}</div>
            <div class="nc-arm">{{ n.arm }}</div>
            <div class="nc-tr">{{ n.tr }}</div>
          </div>
        </div>
      </div>

      <div class="num-fact">
        <div class="nf-label">✦ Интересный факт</div>
        <p>В армянском языке числа 40 (Քarsasun — «сорок») и 1000 (Hazаr — «тысяча») заимствованы из персидского языка в период персидского владычества над Арменией. Остальные числа — исконно армянские и восходят к праиндоевропейскому корню.</p>
      </div>
    </div>

    <!-- ГРАММАТИКА -->
    <div v-else-if="activeSection === 'grammar'" class="lit-inner">
      <button class="lit-back" @click="activeSection = null; activeArticle = null">← Назад</button>

      <div v-if="activeArticle === null" class="article-list">
        <div v-for="(art, ai) in GRAMMAR_ARTICLES" :key="ai"
          class="article-card" @click="activeArticle = ai">
          <div class="ac-num">{{ String(ai+1).padStart(2,'0') }}</div>
          <div class="ac-body">
            <div class="ac-title">{{ art.title }}</div>
            <div class="ac-desc">{{ art.preview }}</div>
          </div>
          <div class="ac-arrow">→</div>
        </div>
      </div>

      <div v-else class="article-view">
        <button class="art-back" @click="activeArticle = null">← Назад</button>
        <h3 class="av-title">{{ GRAMMAR_ARTICLES[activeArticle].title }}</h3>
        <div class="av-body" v-html="GRAMMAR_ARTICLES[activeArticle].content"></div>
      </div>
    </div>

    <!-- ИСТОРИЯ -->
    <div v-else-if="activeSection === 'history'" class="lit-inner">
      <button class="lit-back" @click="activeSection = null; activeArticle = null">← Назад</button>

      <div v-if="activeArticle === null" class="article-list">
        <div v-for="(art, ai) in ARTICLES" :key="ai"
          class="article-card" @click="activeArticle = ai">
          <div class="ac-num">{{ String(ai+1).padStart(2,'0') }}</div>
          <div class="ac-body">
            <div class="ac-title">{{ art.title }}</div>
            <div class="ac-desc">{{ art.preview }}</div>
          </div>
          <div class="ac-arrow">→</div>
        </div>
      </div>

      <div v-else class="article-view">
        <button class="art-back" @click="activeArticle = null">← Назад</button>
        <h3 class="av-title">{{ ARTICLES[activeArticle].title }}</h3>
        <div class="av-body" v-html="ARTICLES[activeArticle].content"></div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { db } from '../../firebase.js'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'

const props = defineProps({ learnedAlpha: Object })
const learnedCount = computed(() => props.learnedAlpha?.size || 0)

const activeSection = ref(null)
const activeArticle = ref(null)
const articles      = ref([])

async function loadArticles() {
  try {
    const q = query(collection(db, 'articles'), orderBy('createdAt', 'desc'))
    const s = await getDocs(q)
    articles.value = s.docs.map(d => ({ id: d.id, ...d.data() }))
  } catch(e) { articles.value = [] }
}

function pluralMaterials(n) {
  const mod10 = n % 10, mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return 'материал'
  if ([2,3,4].includes(mod10) && ![12,13,14].includes(mod100)) return 'материала'
  return 'материалов'
}

function fmtDate(ts) {
  if (!ts) return ''
  const d = ts.toDate ? ts.toDate() : new Date(ts)
  return d.toLocaleDateString('ru-RU')
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

onMounted(loadArticles)
const activeStory   = ref(null)

// ─── CHAR MAP ────────────────────────────────────────────────────────────────
const IDX_TO_RU = {
  0: ['\u0430','\u0410'],   // Ա а/А
  1: ['\u0431','\u0411'],   // Բ б/Б
  2: ['\u0433','\u0413'],   // Գ г/Г
  3: ['\u0434','\u0414'],   // Դ д/Д
  4: ['\u0435','\u0415'],   // Ե е/Е
  5: ['\u0437','\u0417'],   // Զ з/З
  9: ['\u0436','\u0416'],   // Ժ ж/Ж
  10: ['\u0438','\u0418'],  // Ի и/И
  11: ['\u043b','\u041b'],  // Լ л/Л
  14: ['\u043a','\u041a'],  // Կ к/К
  19: ['\u043c','\u041c'],  // Մ м/М
  21: ['\u043d','\u041d'],  // Ն н/Н
  22: ['\u0448','\u0428'],  // Շ ш/Ш
  23: ['\u043e','\u041e'],  // Ո о/О
  25: ['\u043f','\u041f'],  // Պ п/П
  27: ['\u0440','\u0420'],  // Ռ р/Р
  28: ['\u0441','\u0421'],  // Ս с/С
  29: ['\u0432','\u0412'],  // Վ в/В
  30: ['\u0442','\u0422'],  // Տ т/Т
  34: ['\u0444','\u0424'],  // Փ ф/Ф
  12: ['\u0445','\u0425'],  // Խ х/Х
}
const ALPHA_LOWER = [
  '\u0561','\u0562','\u0563','\u0564','\u0565','\u0566','\u0567','\u0568',
  '\u0569','\u056a','\u056b','\u056c','\u056d','\u056e','\u056f','\u0570',
  '\u0571','\u0572','\u0573','\u0574','\u0575','\u0576','\u0577','\u0578',
  '\u0579','\u057a','\u057b','\u057c','\u057d','\u057e','\u057f','\u0580',
  '\u0581','\u0578\u0582','\u0583','\u0584','\u0587','\u0585','\u0586',
]
const ALPHA_UPPER = [
  '\u0531','\u0532','\u0533','\u0534','\u0535','\u0536','\u0537','\u0538',
  '\u0539','\u053a','\u053b','\u053c','\u053d','\u053e','\u053f','\u0540',
  '\u0541','\u0542','\u0543','\u0544','\u0545','\u0546','\u0547','\u0548',
  '\u0549','\u054a','\u054b','\u054c','\u054d','\u054e','\u054f','\u0550',
  '\u0551','\u0548\u0552','\u0553','\u0554','\u0535\u054e','\u0555','\u0556',
]

// Реактивная карта замен — computed автоматически следит за learnedAlpha
const learnedMap = computed(() => {
  const map = {}
  // Читаем size чтобы computed отслеживал изменения Set
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

// ─── STORIES ─────────────────────────────────────────────────────────────────
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

// ─── NUMBERS ─────────────────────────────────────────────────────────────────
const UNITS = [
  {n:'0', arm:'Զռо', tr:'zero'},
  {n:'1', arm:'Մек', tr:'Mek'},
  {n:'2', arm:'Երку', tr:'Yerku'},
  {n:'3', arm:'Ерек', tr:'Yerek'},
  {n:'4', arm:'Чорс', tr:'Chors'},
  {n:'5', arm:'Хинг', tr:'Hing'},
  {n:'6', arm:'Вец', tr:'Vets'},
  {n:'7', arm:'Йот', tr:'Yot'},
  {n:'8', arm:'Ут', tr:'Ut'},
  {n:'9', arm:'Инэ', tr:'Inne'},
  {n:'10', arm:'Тас', tr:'Tas'},
]

const FORMULA11 = [
  {n:'11', formula:'Тас + н + Мek', result:'Тасnмek'},
  {n:'12', formula:'Тас + н + Ерку', result:'ТасnЕрку'},
  {n:'13', formula:'Тас + н + Ерek', result:'ТасnЕрek'},
  {n:'14', formula:'Тас + н + Чорс', result:'ТасnЧорс'},
  {n:'15', formula:'Тас + н + Хинг', result:'ТасnХинг'},
  {n:'19', formula:'Тас + н + Инэ', result:'ТасnИнэ'},
]

const DECADES = [
  {n:'20', arm:'Цсан', tr:'Ksan'},
  {n:'30', arm:'Ересун', tr:'Yeresun'},
  {n:'40', arm:'Карасун', tr:'Karasun'},
  {n:'50', arm:'Хисун', tr:'Hisun'},
  {n:'60', arm:'Ватсун', tr:'Vatsun'},
  {n:'70', arm:'Йотсун', tr:'Yotsun'},
  {n:'80', arm:'Утсун', tr:'Utsun'},
  {n:'90', arm:'Иннсун', tr:'Innsun'},
]

const FORMULA_COMP = [
  {n:'21', formula:'Цсан + у + Мek', result:'Цсан у мek'},
  {n:'35', formula:'Ересун + у + Хинг', result:'Ересун у хинг'},
  {n:'47', formula:'Карасун + у + Йот', result:'Карасун у йот'},
  {n:'100', formula:'Хариур', result:'самостоятельное слово'},
  {n:'101', formula:'Хариур + у + Мek', result:'Хариур у мek'},
  {n:'1000', formula:'Хазар', result:'самостоятельное слово'},
]

const LARGE = [
  {n:'100', arm:'Харюр', tr:'Haryur'},
  {n:'200', arm:'Ерку харюр', tr:'Yerku Haryur'},
  {n:'1000', arm:'Хазар', tr:'Hazar'},
  {n:'2000', arm:'Ерку хазар', tr:'Yerku Hazar'},
]

// ─── GRAMMAR ARTICLES ────────────────────────────────────────────────────────
const GRAMMAR_ARTICLES = [
  {
    title: 'Единственное и множественное число',
    preview: 'Как образуется множественное число в армянском языке',
    content: `
      <p>В армянском языке множественное число существительных образуется добавлением суффикса <strong>–ер (ер)</strong> или <strong>–нер (нер)</strong> после основы слова.</p>

      <h4>Суффикс –ер: для слов, оканчивающихся на гласную</h4>
      <div class="gram-table">
        <div class="gt-row gt-head"><div>Единственное</div><div>Перевод</div><div>Множественное</div></div>
        <div class="gt-row"><div>Գիրք (girk)</div><div>Книга</div><div>Գirqер (girker)</div></div>
        <div class="gt-row"><div>Տoun (tun)</div><div>Дом</div><div>Тунер (tuner)</div></div>
        <div class="gt-row"><div>Սер (ser)</div><div>Любовь</div><div>Серер (serer)</div></div>
      </div>

      <h4>Суффикс –нер: для слов, оканчивающихся на согласную</h4>
      <div class="gram-table">
        <div class="gt-row gt-head"><div>Единственное</div><div>Перевод</div><div>Множественное</div></div>
        <div class="gt-row"><div>Манук (manuk)</div><div>Ребёнок</div><div>Манукнер (manukner)</div></div>
        <div class="gt-row"><div>Ашхарh (ashkharh)</div><div>Мир/Страна</div><div>Ашхарhнер</div></div>
        <div class="gt-row"><div>Кин (gin)</div><div>Женщина</div><div>Кинер (giner)</div></div>
      </div>

      <p><strong>Важно:</strong> в армянском нет грамматического рода (мужской/женский/средний). Одно и то же слово Նa (Na) означает «он», «она» и «оно».</p>

      <p><strong>Определённый артикль</strong> в армянском присоединяется в конце слова. Суффикс <em>–н</em> (ն) означает «определённый»: Тун → Тунн («дом» → «этот дом»).</p>
    `
  },
  {
    title: 'Словосочетания и порядок слов',
    preview: 'Как строится армянское предложение · место подлежащего и сказуемого',
    content: `
      <p>Базовый порядок слов в армянском: <strong>Подлежащее — Дополнение — Сказуемое (SOV)</strong>. Это отличается от русского, где сказуемое обычно стоит в середине или конце.</p>

      <div class="gram-table">
        <div class="gt-row gt-head"><div>Армянский</div><div>Дословно</div><div>По-русски</div></div>
        <div class="gt-row"><div>Ес гирk ем кардум</div><div>Я книгу есть читаю</div><div>Я читаю книгу</div></div>
        <div class="gt-row"><div>Нa тун е гнум</div><div>Он домой есть идёт</div><div>Он идёт домой</div></div>
        <div class="gt-row"><div>Ес кез сирум ем</div><div>Я тебя люблю есть</div><div>Я люблю тебя</div></div>
      </div>

      <h4>Прилагательное всегда стоит ПЕРЕД существительным</h4>
      <div class="gram-table">
        <div class="gt-row"><div>Хохорд тун</div><div>Большой дом</div></div>
        <div class="gt-row"><div>Кармир вардак</div><div>Красная роза</div></div>
        <div class="gt-row"><div>Лав манук</div><div>Хороший ребёнок</div></div>
      </div>

      <h4>Притяжательные конструкции</h4>
      <p>Вместо отдельного «мой/твой» армянский использует постфиксы: <em>–ус</em> (мой), <em>–ыт</em> (твой), <em>–ын</em> (его/её).</p>
      <div class="gram-table">
        <div class="gt-row"><div>Тун + ус = Тунус</div><div>Мой дом</div></div>
        <div class="gt-row"><div>Тун + ыт = Тунынд</div><div>Твой дом</div></div>
        <div class="gt-row"><div>Тун + н = Тунн</div><div>Его дом / этот дом</div></div>
      </div>
    `
  },
  {
    title: 'Глаголы: настоящее время',
    preview: 'Спряжение армянских глаголов · вспомогательный глагол «быть»',
    content: `
      <p>В восточноармянском настоящее время строится с помощью <strong>вспомогательного глагола «кам» (быть)</strong>, который спрягается по лицам и числам.</p>

      <h4>Вспомогательный глагол «Кам» (Я есть)</h4>
      <div class="gram-table">
        <div class="gt-row gt-head"><div>Лицо</div><div>Армянский</div><div>Русский</div></div>
        <div class="gt-row"><div>Я</div><div>Ес — ем</div><div>Я есть</div></div>
        <div class="gt-row"><div>Ты</div><div>Ду — ес</div><div>Ты есть</div></div>
        <div class="gt-row"><div>Он/Она</div><div>На — е</div><div>Он/она есть</div></div>
        <div class="gt-row"><div>Мы</div><div>Менк — енк</div><div>Мы есть</div></div>
        <div class="gt-row"><div>Вы</div><div>Дуk — эк</div><div>Вы есть</div></div>
        <div class="gt-row"><div>Они</div><div>Нранк — ен</div><div>Они есть</div></div>
      </div>

      <h4>Образование настоящего времени</h4>
      <p>Глагол ставится в форму причастия настоящего времени (суффикс <em>–ум</em>), затем добавляется вспомогательный глагол.</p>
      <div class="gram-table">
        <div class="gt-row gt-head"><div>Инфинитив</div><div>Ес (я)</div><div>На (он)</div></div>
        <div class="gt-row"><div>Кардал (читать)</div><div>Ес кардум ем</div><div>На кардум е</div></div>
        <div class="gt-row"><div>Гнал (идти)</div><div>Ес гнум ем</div><div>На гнум е</div></div>
        <div class="gt-row"><div>Сирел (любить)</div><div>Ес сирум ем</div><div>На сирум е</div></div>
        <div class="gt-row"><div>Утел (есть/кушать)</div><div>Ес утум ем</div><div>На утум е</div></div>
      </div>

      <p><strong>Отрицание:</strong> перед глаголом добавляется <em>«че»</em> (не). «Ес че гнум ем» = «Я не иду».</p>
    `
  },
]

// ─── HISTORY ARTICLES ────────────────────────────────────────────────────────
const ARTICLES = [
  {
    title: 'История создания армянских букв',
    preview: 'Как в 405 году появился один из совершеннейших алфавитов мира',
    content: `<p>В начале V века армянский народ оказался на духовном распутье. В <strong>405 году</strong> монах <strong>Месроп Маштоц</strong> создал армянский алфавит из <strong>36 букв</strong> (позднее добавили ещё 3). Маштоц провёл глубокий фонетический анализ языка, чтобы каждый звук получил точное обозначение.</p><p>По преданию, первыми словами стала фраза из Библии: <em>«Познать мудрость и наставление, понять изречения разума»</em>.</p><p>Первая переведённая книга — <strong>Библия</strong>. Учёные XIX века назвали армянский перевод «Царицей переводов».</p><p>Уникальность алфавита Маштоца в том, что он создавался <em>специально</em> под один язык — изобретён с нуля как идеальный инструмент для армянской фонетики.</p>`
  },
  {
    title: 'История армянских рукописей',
    preview: 'Матенадаран и сокровища средневековой книжной культуры',
    content: `<p>Матенадаран в Ереване хранит более <strong>23 000 рукописей</strong> — один из крупнейших архивов средневековых манускриптов в мире. Объект ЮНЕСКО.</p><p>В XIII веке художник <strong>Торос Рослин</strong> создал шесть Евангелий, признанных вершиной армянского миниатюрного искусства.</p><p>Во время геноцида 1915 года многие рукописи были уничтожены. Выжившие спасали книги, рискуя жизнью.</p>`
  },
  {
    title: '10 фактов про Армению',
    preview: 'Удивительные факты о стране, горах и народе',
    content: `<ol><li><strong>Первое христианское государство.</strong> В 301 году Армения первой в мире приняла христианство как государственную религию.</li><li><strong>Арарат.</strong> Символ Армении — гора Арарат — находится на территории Турции, но изображена на армянском гербе.</li><li><strong>Шахматы</strong> обязательны в школьной программе — единственная такая страна в мире.</li><li><strong>Коньяк.</strong> Черчилль получал ящик армянского коньяка в год от Сталина.</li><li><strong>90% территории</strong> Армении — горы. Средняя высота — 1800 метров.</li><li><strong>Озеро Севан</strong> расположено на высоте 1900 м. Площадь — 1240 км².</li><li><strong>Диаспора.</strong> За пределами Армении — ~8 млн армян, вдвое больше чем в стране.</li><li><strong>Нораванк, Гегард, Хор Вирап</strong> — объекты мирового культурного наследия.</li><li><strong>Абрикос</strong> по-латыни Prunus armeniaca — «армянская слива». Родина абрикоса.</li><li><strong>Язык-изолят:</strong> армянский образует отдельную ветвь индоевропейской семьи.</li></ol>`
  },
  {
    title: 'Чем уникальны армянские буквы',
    preview: 'Фонетика, красота и совершенство системы Маштоца',
    content: `<p><strong>«Одна буква — один звук».</strong> Каждая буква обозначает ровно один звук — редкость для мировых алфавитов.</p><p><strong>Три типа согласных:</strong> обычный (բ), придыхательный (փ) и «твёрдый» (պ). В русском только два типа.</p><p><strong>Стабильность:</strong> за 1600 лет алфавит почти не изменился. Тексты V века современный армянин читает без особого труда.</p><p><strong>Диграф ու (у)</strong> — звук «у» передаётся двумя буквами: одна из немногих особенностей системы.</p>`
  },
]
</script>

<style scoped>
.lit-tab { padding-bottom: 20px; }
.lit-header {
  padding: 20px;
  border-bottom:1px solid var(--line);
  background:var(--bg2);
  backdrop-filter: blur(8px);
  position: sticky; top: 0; z-index: 10;
}
.lit-title { font-family: var(--d); font-size: clamp(26px,5vw,40px); font-weight: 700; font-style: italic; color: var(--red); }
.lit-sub   { font-family: var(--s); font-size: 13px; color: var(--muted); margin-top: 4px; font-style: italic; }

.lit-sections { padding: 16px; display: flex; flex-direction: column; gap: 12px; }
.lit-section-card {
  background:var(--bg2); backdrop-filter: blur(6px);
  border:1px solid var(--line); border-radius: 18px;
  padding: 18px 20px; cursor: pointer; display: flex; align-items: center; gap: 16px;
  transition: all .2s;
}
.lit-section-card:hover { border-color: var(--gold); box-shadow: 0 2px 16px rgba(176,120,40,.12); }
.lsc-icon  { font-family: var(--d); font-size: 32px; color: var(--red); line-height: 1; min-width: 44px; text-align: center; }
.lsc-body  { flex: 1; }
.lsc-title { font-family: var(--d); font-size: 18px; font-style: italic; color: var(--ink); margin-bottom: 4px; }
.lsc-desc  { font-family: var(--s); font-size: 12px; color: var(--muted); line-height: 1.5; }
.lsc-badge { display: inline-block; margin-top: 6px; background: rgba(140,28,28,.1); color: var(--red); font-family: var(--m); font-size: 10px; padding: 2px 10px; border-radius: 20px; }
.lsc-arrow { font-size: 18px; color: var(--muted); }

.lit-inner { padding: 16px; display: flex; flex-direction: column; gap: 14px; }
.lit-back, .art-back {
  background: none; border: none; font-family: var(--m); font-size: 10px;
  letter-spacing: 2px; text-transform: uppercase; color: var(--muted);
  cursor: pointer; padding: 0; align-self: flex-start;
}
.lit-back:hover, .art-back:hover { color: var(--red); }

.sec-title { font-family: var(--d); font-size: 26px; font-style: italic; color: var(--red); margin: 0; }

/* READING */
.reading-info { background: rgba(26,58,110,.07); border: 1px solid rgba(26,58,110,.18); border-radius: 14px; padding: 16px; }
.ri-title { font-family: var(--d); font-size: 18px; font-style: italic; color: var(--blue); margin-bottom: 6px; }
.ri-desc  { font-family: var(--s); font-size: 13px; color: var(--ink); line-height: 1.6; margin-bottom: 8px; }
.ri-count { font-family: var(--m); font-size: 11px; color: var(--muted); }
.ri-count strong { color: var(--ink); }

.text-list { display: flex; flex-direction: column; gap: 10px; }
.story-card {
  background:var(--bg2); backdrop-filter: blur(4px);
  border:1px solid var(--line); border-radius: 14px;
  overflow: hidden; cursor: pointer; transition: all .2s;
}
.story-card:hover { border-color: var(--gold); }
.story-card.active { border-color: var(--red); }
.sc-head { display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; gap: 8px; }
.sc-title { font-family: var(--d); font-size: 17px; font-style: italic; color: var(--ink); }
.sc-focus { font-family: var(--m); font-size: 9px; color: var(--muted); margin-top: 2px; }
.sc-level { font-family: var(--m); font-size: 9px; letter-spacing: 1px; background: rgba(176,120,40,.15); color: var(--gold); padding: 3px 10px; border-radius: 20px; white-space: nowrap; flex-shrink: 0; }
.sc-body  { padding: 0 16px 16px; border-top:1px solid var(--line); padding-top: 12px; }
.sc-text  { font-family: var(--s); font-size: 18px; line-height: 2.2; color: var(--ink); margin: 0 0 12px; }
.arm-char { font-family: var(--d); font-size: 1.15em; color: var(--red); font-weight: 700; }
.sc-legend { font-family: var(--s); font-size: 12px; color: var(--muted); background:var(--bg2); border-radius: 8px; padding: 8px 12px; }
.scl-arm   { font-family: var(--d); font-size: 1.05em; color: var(--red); font-weight: 700; }
.scl-ru    { color: var(--muted); }

/* NUMBERS */
.num-section { display: flex; flex-direction: column; gap: 10px; }
.num-sec-title { font-family: var(--m); font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: var(--blue); }
.num-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(100px,1fr)); gap: 8px; }
.num-card { background:var(--bg2); border:1px solid var(--line); border-radius: 12px; padding: 12px; text-align: center; }
.nc-n   { font-family: var(--m); font-size: 11px; color: var(--muted); }
.nc-arm { font-family: var(--d); font-size: 20px; font-style: italic; color: var(--red); font-weight: 700; }
.nc-tr  { font-family: var(--m); font-size: 10px; color: var(--muted); margin-top: 2px; }

.formula-table { background:var(--bg2); border:1px solid var(--line); border-radius: 12px; overflow: hidden; }
.ft-row { display: grid; grid-template-columns: 56px 1fr 1fr; gap: 0; padding: 10px 14px; border-bottom:1px solid var(--line); font-family: var(--s); font-size: 13px; color: var(--ink); }
.ft-row:last-child { border-bottom: none; }
.ft-head { font-family: var(--m); font-size: 9px; letter-spacing: 1px; text-transform: uppercase; color: var(--muted); background: rgba(176,120,40,.06); }
.ft-n  { font-family: var(--d); font-size: 18px; font-weight: 700; color: var(--red); }
.ft-f  { font-family: var(--m); font-size: 12px; color: var(--blue); }
.ft-r  { font-family: var(--d); font-size: 15px; font-style: italic; color: var(--ink); }

.num-fact { background: rgba(26,58,110,.07); border: 1px solid rgba(26,58,110,.15); border-radius: 14px; padding: 16px; }
.nf-label { font-family: var(--m); font-size: 9px; letter-spacing: 2px; text-transform: uppercase; color: var(--blue); margin-bottom: 8px; }
.num-fact p { font-family: var(--s); font-size: 14px; color: var(--ink); line-height: 1.6; margin: 0; }

/* ARTICLES / GRAMMAR */
.article-list { display: flex; flex-direction: column; gap: 10px; }
.article-card {
  background:var(--bg2); backdrop-filter: blur(4px);
  border:1px solid var(--line); border-radius: 14px;
  padding: 16px; cursor: pointer; display: flex; align-items: center; gap: 14px;
  transition: all .2s;
}
.article-card:hover { border-color: var(--gold); }
.ac-num  { font-family: var(--d); font-size: 30px; font-weight: 700; color: rgba(176,120,40,.35); line-height: 1; min-width: 40px; }
.ac-body { flex: 1; }
.ac-title { font-family: var(--d); font-size: 16px; font-style: italic; color: var(--ink); margin-bottom: 3px; }
.ac-desc  { font-family: var(--s); font-size: 11px; color: var(--muted); line-height: 1.4; }
.ac-arrow { font-size: 16px; color: var(--muted); }

.article-view { display: flex; flex-direction: column; gap: 14px; }
.av-title { font-family: var(--d); font-size: 22px; font-style: italic; color: var(--red); line-height: 1.3; margin: 0; }
.av-body  { font-family: var(--s); font-size: 14px; line-height: 1.8; color: var(--ink); background:var(--bg2); border:1px solid var(--line); border-radius: 14px; padding: 18px; }
.av-body :deep(p) { margin: 0 0 12px; }
.av-body :deep(p:last-child) { margin: 0; }
.av-body :deep(h4) { font-family: var(--m); font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: var(--blue); margin: 16px 0 8px; }
.av-body :deep(strong) { color: var(--ink); font-weight: 700; }
.av-body :deep(em) { font-style: italic; color: var(--blue); }
.av-body :deep(ol) { padding-left: 18px; margin: 0; display: flex; flex-direction: column; gap: 8px; }
.av-body :deep(li) { line-height: 1.6; }

/* GRAMMAR TABLE inside articles */
.av-body :deep(.gram-table) { border:1px solid var(--line); border-radius: 10px; overflow: hidden; margin: 10px 0; }
.av-body :deep(.gt-row) { display: grid; grid-template-columns: 1fr 1fr 1fr; border-bottom:1px solid var(--line); padding: 8px 12px; font-size: 13px; gap: 8px; }
.av-body :deep(.gt-row:last-child) { border-bottom: none; }
.av-body :deep(.gt-head) { font-family: var(--m); font-size: 9px; letter-spacing: 1px; text-transform: uppercase; color: var(--muted); background: rgba(176,120,40,.06); }

/* DARK THEME */
[data-theme=dark] .lit-header,
[data-theme=amoled] .lit-header { background: rgba(10,8,4,.95) !important; border-bottom-color: rgba(176,120,40,.15); }

[data-theme=dark] .lit-section-card,
[data-theme=dark] .story-card,
[data-theme=dark] .article-card,
[data-theme=dark] .av-body,
[data-theme=dark] .art-body-text,
[data-theme=dark] .num-card,
[data-theme=dark] .formula-table { background: rgba(30,20,10,.85) !important; border-color: rgba(176,120,40,.2) !important; }

[data-theme=dark] .sc-text,
[data-theme=dark] .av-body,
[data-theme=dark] .art-body-text,
[data-theme=dark] .ac-title,
[data-theme=dark] .sc-title { color: rgba(242,232,213,.9) !important; }

[data-theme=dark] .reading-info,
[data-theme=dark] .num-fact { background: rgba(26,58,110,.15) !important; }

[data-theme=dark] .ft-row { color: rgba(242,232,213,.85); border-bottom-color: rgba(176,120,40,.1); }
[data-theme=dark] .ft-head { background: rgba(176,120,40,.08); }

[data-theme=dark] .sc-legend { background: rgba(30,20,10,.6); color: rgba(242,232,213,.5); }

[data-theme=amoled] .lit-section-card,
[data-theme=amoled] .story-card,
[data-theme=amoled] .article-card,
[data-theme=amoled] .av-body,
[data-theme=amoled] .art-body-text,
[data-theme=amoled] .num-card,
[data-theme=amoled] .formula-table { background: rgba(0,0,0,.88) !important; }

[data-theme=amoled] .sc-text,
[data-theme=amoled] .av-body,
[data-theme=amoled] .art-body-text { color: rgba(242,232,213,.9) !important; }
/* ── СТАТЬИ ── */
.lit-empty { text-align:center; color:var(--muted); font-family:var(--s); padding:40px 20px; }
.art-card { background:var(--bg2); border:1px solid var(--line); border-radius:14px; padding:16px; cursor:pointer; transition:.15s; display:flex; flex-direction:column; gap:6px; margin-bottom:10px; }
.art-card:hover { border-color:var(--gold); }
.art-header { display:flex; gap:8px; align-items:center; }
.art-level { font-family:var(--m); font-size:10px; letter-spacing:1px; background:var(--red); color:var(--bg); padding:2px 8px; border-radius:10px; }
.art-cat { font-family:var(--m); font-size:10px; color:var(--muted); text-transform:uppercase; letter-spacing:1px; }
.art-title { font-family:var(--d); font-size:20px; font-style:italic; color:var(--ink); }
.art-desc { font-family:var(--s); font-size:13px; color:var(--muted); line-height:1.5; }
.art-arrow { font-family:var(--m); font-size:11px; color:var(--gold); margin-top:4px; }
.art-body { display:flex; flex-direction:column; gap:10px; }
.art-body-level { font-family:var(--m); font-size:10px; color:var(--muted); letter-spacing:1px; text-transform:uppercase; }
.art-body-title { font-family:var(--d); font-size:28px; font-style:italic; font-weight:700; color:var(--red); line-height:1.2; }
.art-body-text {
  font-family:var(--s); font-size:15px; color:var(--ink); line-height:1.8;
  background:var(--bg2); border:1px solid var(--line); border-radius:14px; padding:18px;
}
.art-body-text p { margin:0 0 12px; }
.art-body-text p:last-child { margin:0; }
</style>
