<template>
  <div class="lit-tab">
    <div class="lit-header">
      <h2 class="lit-title">Գրականություն</h2>
      <p class="lit-sub">Արվեստ · История · Тексты для чтения</p>
    </div>

    <div v-if="!activeSection" class="lit-sections">

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
import { ref } from 'vue'

const activeSection = ref(null)
const activeArticle = ref(null)

// ─── NUMBERS ─────────────────────────────────────────────────────────────────
const UNITS = [
  {n:'0', arm:'Զրո', tr:'zero'},
  {n:'1', arm:'Մեկ', tr:'Mek'},
  {n:'2', arm:'Երկու', tr:'Yerku'},
  {n:'3', arm:'Երեք', tr:'Yerek'},
  {n:'4', arm:'Չորս', tr:'Chors'},
  {n:'5', arm:'Հինգ', tr:'Hing'},
  {n:'6', arm:'Վեց', tr:'Vets'},
  {n:'7', arm:'Յոթ', tr:'Yot'},
  {n:'8', arm:'Ութ', tr:'Ut'},
  {n:'9', arm:'Ինը', tr:'Inne'},
  {n:'10', arm:'Տաս', tr:'Tas'},
]

const FORMULA11 = [
  {n:'11', formula:'Տաս + ն + Մեկ', result:'Տասնմեկ'},
  {n:'12', formula:'Տաս + ն + Երկու', result:'Տասներկու'},
  {n:'13', formula:'Տաս + ն + Երեք', result:'Տասներեք'},
  {n:'14', formula:'Տաս + ն + Չորս', result:'Տասնչորս'},
  {n:'15', formula:'Տաս + ն + Հինգ', result:'Տասնհինգ'},
  {n:'19', formula:'Տաս + ն + Ինը', result:'Տասնինը'},
]

const DECADES = [
  {n:'20', arm:'Քսան', tr:'Ksan'},
  {n:'30', arm:'Երեսուն', tr:'Yeresun'},
  {n:'40', arm:'Քառասուն', tr:'Karasun'},
  {n:'50', arm:'Հիսուն', tr:'Hisun'},
  {n:'60', arm:'Վաթսուն', tr:'Vatsun'},
  {n:'70', arm:'Յոթսուն', tr:'Yotsun'},
  {n:'80', arm:'Ութսուն', tr:'Utsun'},
  {n:'90', arm:'Իննսուն', tr:'Innsun'},
]

const FORMULA_COMP = [
  {n:'21', formula:'Քսան + ու + Մեկ', result:'Քսան ու մեկ'},
  {n:'35', formula:'Երեսուն + ու + Հինգ', result:'Երեսուն ու հինգ'},
  {n:'47', formula:'Քառասուն + ու + Յոթ', result:'Քառասուն ու յոթ'},
  {n:'100', formula:'Հարյուր', result:'самостоятельное слово'},
  {n:'101', formula:'Հարյուր + ու + Մեկ', result:'Հարյուր ու մեկ'},
  {n:'1000', formula:'Հազար', result:'самостоятельное слово'},
]

const LARGE = [
  {n:'100', arm:'Հարյուր', tr:'Haryur'},
  {n:'200', arm:'Երկու հարյուր', tr:'Yerku Haryur'},
  {n:'1000', arm:'Հազար', tr:'Hazar'},
  {n:'2000', arm:'Երկու հազար', tr:'Yerku Hazar'},
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
  background:var(--glass-bg-strong);
  position: sticky; top: 0; z-index: 10;
border-color:var(--glass-border);backdrop-filter:var(--glass-blur);-webkit-backdrop-filter:var(--glass-blur);}
.lit-title { font-family: var(--d); font-size: clamp(26px,5vw,40px); font-weight: 700; font-style: italic; color: var(--red); }
.lit-sub   { font-family: var(--s); font-size: 13px; color: var(--muted); margin-top: 4px; font-style: italic; }

.lit-sections { padding: 16px; display: flex; flex-direction: column; gap: 12px; }
.lit-section-card {
  background:var(--glass-bg); 
  border:1px solid var(--line); border-radius: 18px;
  padding: 18px 20px; cursor: pointer; display: flex; align-items: center; gap: 16px;
  transition: all .2s;
border-color:var(--glass-border);backdrop-filter:var(--glass-blur);-webkit-backdrop-filter:var(--glass-blur);}
.lit-section-card:hover { border-color: var(--gold); box-shadow: 0 2px 16px rgba(246,140,54,.12); }
.lsc-icon  { font-family: var(--d); font-size: 32px; color: var(--red); line-height: 1; min-width: 44px; text-align: center; }
.lsc-body  { flex: 1; }
.lsc-title { font-family: var(--d); font-size: 18px; font-style: italic; color: var(--ink); margin-bottom: 4px; }
.lsc-desc  { font-family: var(--s); font-size: 12px; color: var(--muted); line-height: 1.5; }
.lsc-badge { display: inline-block; margin-top: 6px; background: rgba(128,6,19,.1); color: var(--red); font-family: var(--m); font-size: 10px; padding: 2px 10px; border-radius: 20px; }
.lsc-arrow { font-size: 18px; color: var(--muted); }

.lit-inner { padding: 16px; display: flex; flex-direction: column; gap: 14px; }
.lit-back, .art-back {
  background:var(--glass-bg); border: 1px solid var(--line); border-radius: 20px;
  font-family: var(--m); font-size: 10px;
  letter-spacing: 2px; text-transform: uppercase; color: var(--ink);
  cursor: pointer; padding: 8px 14px; align-self: flex-start; transition:.15s var(--spring);
border-color:var(--glass-border);box-shadow:inset 0 1px 0 var(--glass-shine),0 4px 16px var(--glass-shadow);backdrop-filter:var(--glass-blur);-webkit-backdrop-filter:var(--glass-blur);}
.lit-back:hover, .art-back:hover { color: var(--red); border-color: var(--gold); }

[data-theme=dark] .lit-back,
[data-theme=dark] .art-back { background: rgba(24,16,8,.94) !important; border-color: rgba(246,140,54,.2) !important; color: rgba(231,220,208,.9) !important; }
[data-theme=amoled] .lit-back,
[data-theme=amoled] .art-back { background: rgba(0,0,0,.95) !important; color: rgba(231,220,208,.9) !important; }

.sec-title { font-family: var(--d); font-size: 26px; font-style: italic; color: var(--red); margin: 0; }

/* NUMBERS */
.num-section { display: flex; flex-direction: column; gap: 10px; }
.num-sec-title { font-family: var(--m); font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: var(--blue); }
.num-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(100px,1fr)); gap: 8px; }
.num-card { background:var(--glass-bg); border:1px solid var(--line); border-radius: 12px; padding: 12px; text-align: center; border-color:var(--glass-border);box-shadow:inset 0 1px 0 var(--glass-shine),0 4px 16px var(--glass-shadow);backdrop-filter:var(--glass-blur);-webkit-backdrop-filter:var(--glass-blur);}
.nc-n   { font-family: var(--m); font-size: 11px; color: var(--muted); }
.nc-arm { font-family: var(--d); font-size: 20px; font-style: italic; color: var(--red); font-weight: 700; }
.nc-tr  { font-family: var(--m); font-size: 10px; color: var(--muted); margin-top: 2px; }

.formula-table { background:var(--glass-bg); border:1px solid var(--line); border-radius: 12px; overflow: hidden; border-color:var(--glass-border);box-shadow:inset 0 1px 0 var(--glass-shine),0 4px 16px var(--glass-shadow);backdrop-filter:var(--glass-blur);-webkit-backdrop-filter:var(--glass-blur);}
.ft-row { display: grid; grid-template-columns: 56px 1fr 1fr; gap: 0; padding: 10px 14px; border-bottom:1px solid var(--line); font-family: var(--s); font-size: 13px; color: var(--ink); }
.ft-row:last-child { border-bottom: none; }
.ft-head { font-family: var(--m); font-size: 9px; letter-spacing: 1px; text-transform: uppercase; color: var(--muted); background: rgba(246,140,54,.06); }
.ft-n  { font-family: var(--d); font-size: 18px; font-weight: 700; color: var(--red); }
.ft-f  { font-family: var(--m); font-size: 12px; color: var(--blue); }
.ft-r  { font-family: var(--d); font-size: 15px; font-style: italic; color: var(--ink); }

.num-fact { background: rgba(35,88,138,.07); border: 1px solid rgba(35,88,138,.15); border-radius: 14px; padding: 16px; }
.nf-label { font-family: var(--m); font-size: 9px; letter-spacing: 2px; text-transform: uppercase; color: var(--blue); margin-bottom: 8px; }
.num-fact p { font-family: var(--s); font-size: 14px; color: var(--ink); line-height: 1.6; margin: 0; }

/* ARTICLES / GRAMMAR */
.article-list { display: flex; flex-direction: column; gap: 10px; }
.article-card {
  background:var(--glass-bg); 
  border:1px solid var(--line); border-radius: 14px;
  padding: 16px; cursor: pointer; display: flex; align-items: center; gap: 14px;
  transition: all .2s;
border-color:var(--glass-border);backdrop-filter:var(--glass-blur);-webkit-backdrop-filter:var(--glass-blur);}
.article-card:hover { border-color: var(--gold); }
.ac-num  { font-family: var(--d); font-size: 30px; font-weight: 700; color: rgba(246,140,54,.35); line-height: 1; min-width: 40px; }
.ac-body { flex: 1; }
.ac-title { font-family: var(--d); font-size: 16px; font-style: italic; color: var(--ink); margin-bottom: 3px; }
.ac-desc  { font-family: var(--s); font-size: 11px; color: var(--muted); line-height: 1.4; }
.ac-arrow { font-size: 16px; color: var(--muted); }

.article-view { display: flex; flex-direction: column; gap: 14px; }
.av-title { font-family: var(--d); font-size: 22px; font-style: italic; color: var(--red); line-height: 1.3; margin: 0; }
.av-body  { font-family: var(--s); font-size: 14px; line-height: 1.8; color: var(--ink); background:var(--glass-bg); border:1px solid var(--line); border-radius: 14px; padding: 18px; border-color:var(--glass-border);box-shadow:inset 0 1px 0 var(--glass-shine),0 4px 16px var(--glass-shadow);backdrop-filter:var(--glass-blur);-webkit-backdrop-filter:var(--glass-blur);}
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
.av-body :deep(.gt-head) { font-family: var(--m); font-size: 9px; letter-spacing: 1px; text-transform: uppercase; color: var(--muted); background: rgba(246,140,54,.06); }

/* DARK THEME */
[data-theme=dark] .lit-header,
[data-theme=amoled] .lit-header { background: rgba(10,8,4,.95) !important; border-bottom-color: rgba(246,140,54,.15); }

[data-theme=dark] .lit-section-card,
[data-theme=dark] .article-card,
[data-theme=dark] .av-body,
[data-theme=dark] .num-card,
[data-theme=dark] .formula-table { background: rgba(24,16,8,.94) !important; border-color: rgba(246,140,54,.2) !important; }

[data-theme=dark] .av-body,
[data-theme=dark] .ac-title { color: rgba(231,220,208,.9) !important; }

[data-theme=dark] .num-fact { background: rgba(35,88,138,.15) !important; }

[data-theme=dark] .ft-row { color: rgba(231,220,208,.85); border-bottom-color: rgba(246,140,54,.1); }
[data-theme=dark] .ft-head { background: rgba(246,140,54,.08); }

[data-theme=amoled] .lit-section-card,
[data-theme=amoled] .article-card,
[data-theme=amoled] .av-body,
[data-theme=amoled] .num-card,
[data-theme=amoled] .formula-table { background: rgba(0,0,0,.95) !important; }

[data-theme=amoled] .av-body { color: rgba(231,220,208,.9) !important; }
</style>
