<template>
  <div class="learn">
    <div class="learn-header">
      <div class="learn-title">Учёба</div>
      <div class="learn-level">{{ props.level }}</div>
    </div>

    <div class="level-tabs">
      <button v-for="lvl in ['A1','A2','B1']" :key="lvl"
        class="ltab" :class="{active: currentLevel===lvl}"
        @click="currentLevel=lvl">
        {{ lvl }}
      </button>
    </div>

    <div class="learn-body">
      <div class="learn-list">
        <div v-for="l in filteredLessons" :key="l.id"
          class="ll" :class="{locked: l.locked, done: completedIds.has(l.id)}"
          @click="!l.locked && openLesson(l)">
          <div class="ll-num" :class="{locked: l.locked}">{{ l.id }}</div>
          <div class="ll-info">
            <div class="ll-ru">{{ l.ru }}</div>
            <div class="ll-arm">{{ l.arm }}</div>
            <div class="ll-desc">{{ l.desc }}</div>
          </div>
          <div class="ll-right">
            <span class="ll-done" v-if="completedIds.has(l.id)">✓</span>
            <span class="ll-lock" v-else-if="l.locked">🔒</span>
            <span class="ll-arrow" v-else>→</span>
          </div>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="active" class="lmodal" @click.self="close">
        <div class="lmodal-box">
          <button class="lmodal-close" @click="close">✕</button>
          <div class="lm-eye">Урок {{ active.id }} · {{ active.level }}</div>
          <h2 class="lm-ru">{{ active.ru }}</h2>
          <h3 class="lm-arm">{{ active.arm }}</h3>
          <p  class="lm-desc">{{ active.desc }}</p>

          <PronounsTab    v-if="active.comp==='pronouns'" />
          <NumbersTab     v-else-if="active.comp==='numbers'" />
          <PluralTab      v-else-if="active.comp==='plural'" />
          <VerbBeTab      v-else-if="active.comp==='verbBe'" />
          <CasesTab       v-else-if="active.comp==='cases'" />
          <CityTab        v-else-if="active.comp==='city'" />
          <AdjectivesTab  v-else-if="active.comp==='adjectives'" />
          <QuestionsTab   v-else-if="active.comp==='questions'" />
          <BodyTab        v-else-if="active.comp==='body'" />
          <PastTenseTab   v-else-if="active.comp==='pastTense'" />
          <HomeLifeTab    v-else-if="active.comp==='homeLife'" />
          <ShoppingTab    v-else-if="active.comp==='shopping'" />
          <FutureTenseTab v-else-if="active.comp==='futureTense'" />
          <NegationTab    v-else-if="active.comp==='negation'" />
          <ArmeniaTab     v-else-if="active.comp==='armenia'" />
          <ProverbsTab    v-else-if="active.comp==='proverbs'" />
          <FamilyTab      v-else-if="active.comp==='family'" />
          <ColorsTab      v-else-if="active.comp==='colors'" />
          <FoodTab        v-else-if="active.comp==='food'" />
          <TimeTab        v-else-if="active.comp==='time'" />
          <VerbsTab       v-else-if="active.comp==='verbs'" />
          <DialogueTab    v-else-if="active.comp==='dialogue'" />
          <div v-else class="lm-coming">
            <div class="lm-coming-icon">🚧</div>
            <div class="lm-coming-text">Урок в разработке</div>
            <div class="lm-coming-sub">Скоро будет доступен</div>
          </div>

          <div class="gram-rules" v-if="active.grammar">
            <div class="gr-title">Грамматика</div>
            <div class="gr-rule" v-for="rule in active.grammar" :key="rule.title">
              <div class="gr-rule-title">{{ rule.title }}</div>
              <div class="gr-rule-text">{{ rule.text }}</div>
              <div class="gr-example" v-if="rule.example">
                <span class="gr-arm">{{ rule.example.arm }}</span>
                <span class="gr-ru">{{ rule.example.ru }}</span>
              </div>
            </div>
          </div>

          <PronunciationCheck v-if="pronWord && active.comp!=='dialogue'" :word="pronWord" @result="onPronResult" />

          <button class="lm-done-btn" @click="markDone">
            {{ completedIds.has(active.id) ? '✓ Пройден' : 'Отметить как пройденный' }}
          </button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, defineAsyncComponent } from 'vue'
import PronounsTab from '../PronounsTab.vue'
import NumbersTab  from '../NumbersTab.vue'
import PluralTab   from '../PluralTab.vue'
import CasesTab       from '../CasesTab.vue'
import CityTab        from '../CityTab.vue'
import AdjectivesTab  from '../AdjectivesTab.vue'
import QuestionsTab   from '../QuestionsTab.vue'
import BodyTab        from '../BodyTab.vue'
import PastTenseTab   from '../PastTenseTab.vue'
import HomeLifeTab    from '../HomeLifeTab.vue'
import ShoppingTab    from '../ShoppingTab.vue'
import FutureTenseTab from '../FutureTenseTab.vue'
import NegationTab    from '../NegationTab.vue'
import ArmeniaTab     from '../ArmeniaTab.vue'
import ProverbsTab    from '../ProverbsTab.vue'
import DialogueTab    from '../DialogueTab.vue'
import PronunciationCheck from '../PronunciationCheck.vue'

// Lazy inline lesson components — defined locally to avoid extra files
import { defineComponent, h } from 'vue'

const VerbBeTab = defineComponent({
  name: 'VerbBeTab',
  setup() {
    const rows = [
      {face:'Ես (Я)',      arm:'Ես եմ',   tr:'Yes em',   ru:'Я есть'},
      {face:'Դու (Ты)',          arm:'Դու ես',      tr:'Du yes',   ru:'Ты есть'},
      {face:'Նա (Он/Она)',      arm:'Նա ե',       tr:'Na ye',    ru:'Он/она есть'},
      {face:'Մենք (Мы)',        arm:'Մենք ենք',     tr:'Menk enk', ru:'Мы есть'},
      {face:'Դուք (Вы)',         arm:'Դուք եք',       tr:'Duk ek',   ru:'Вы есть'},
      {face:'Նրանք (Они)',      arm:'Նրանք են',     tr:'Nrank en', ru:'Они есть'},
    ]
    return () => h('div', {class:'inline-tab'}, [
      h('div', {class:'it-title'}, 'Глагол «быть» — спряжение'),
      h('div', {class:'it-note'}, 'В армянском «быть» — это вспомогательный глагол, который крепится к концу предложения'),
      ...rows.map(r => h('div', {class:'it-row'}, [
        h('div', {class:'it-face'}, r.face),
        h('div', {class:'it-body'}, [
          h('div', {class:'it-arm'}, r.arm),
          h('div', {class:'it-tr'}, r.tr),
        ]),
        h('div', {class:'it-ru'}, r.ru),
      ])),
      h('div', {class:'it-example'}, [
        h('div', {class:'ite-label'}, 'Пример'),
        h('div', {class:'ite-arm'}, 'Ես ուսանող եմ'),
        h('div', {class:'ite-ru'}, 'Я студент'),
      ]),
    ])
  }
})

const FamilyTab = defineComponent({
  name: 'FamilyTab',
  setup() {
    const words = [
      {arm:'Տղամարդ', tr:'Tghamard', ru:'Мужчина'},
      {arm:'Կին', tr:'Gin', ru:'Женщина / Жена'},
      {arm:'Հայր', tr:'Hayr', ru:'Отец'},
      {arm:'Մայր', tr:'Mayr', ru:'Мать'},
      {arm:'Եղբայր', tr:'Yeghbayr', ru:'Брат'},
      {arm:'Քույր', tr:'Kuyr', ru:'Сестра'},
      {arm:'Տատիկ', tr:'Tatik', ru:'Бабушка'},
      {arm:'Պապիկ', tr:'Papik', ru:'Дедушка'},
      {arm:'Տղա', tr:'Tgha', ru:'Мальчик'},
      {arm:'Աղջիկ', tr:'Aghjik', ru:'Девочка'},
      {arm:'Թոռնիկ', tr:'Tornik', ru:'Внук / Внучка'},
      {arm:'Մանուկ', tr:'Manuk', ru:'Ребёнок'},
    ]
    return () => h('div', {class:'inline-tab'}, [
      h('div', {class:'it-title'}, 'Семья — Ընտանիք'),
      h('div', {class:'it-grid'}, words.map(w =>
        h('div', {class:'it-wcard'}, [
          h('div', {class:'it-arm'}, w.arm),
          h('div', {class:'it-tr'}, w.tr),
          h('div', {class:'it-ru'}, w.ru),
        ])
      )),
      h('div', {class:'it-note'}, 'Հայրը (отец) + суффикс –ус = Հայրուս (мой отец)'),
    ])
  }
})

const ColorsTab = defineComponent({
  name: 'ColorsTab',
  setup() {
    const words = [
      {arm:'Դեղին',          tr:'Deghin',         ru:'Жёлтый',     color:'#f5c518'},
      {arm:'Կարմիր',        tr:'Karmir',         ru:'Красный',     color:'#c0392b'},
      {arm:'Կանաչ',        tr:'Kanach',         ru:'Зелёный',     color:'#27ae60'},
      {arm:'Կապույթ',        tr:'Kapoyt',         ru:'Синий',       color:'#2980b9'},
      {arm:'Մանուշակագույն', tr:'Manushakaguyn',  ru:'Фиолетовый',  color:'#8e44ad'},
      {arm:'Նարնջագույն',   tr:'Narnchaguyn',    ru:'Оранжевый',   color:'#e67e22'},
      {arm:'Սպիտակ',        tr:'Spitak',         ru:'Белый',       color:'#ecf0f1', dark:true},
      {arm:'Սև',            tr:'Sev',            ru:'Чёрный',      color:'#2c3e50'},
      {arm:'Մոխրագույն',     tr:'Mokhaguyn',      ru:'Серый',       color:'#95a5a6'},
      {arm:'Շագանակագույն', tr:'Shaganakaguyn',  ru:'Коричневый',  color:'#8b4513'},
      {arm:'Վարդագույն',     tr:'Vardaguyn',      ru:'Розовый',     color:'#e91e8c'},
    ]
    return () => h('div', {class:'inline-tab'}, [
      h('div', {class:'it-title'}, 'Цвета — Գույներ'),
      h('div', {class:'it-colors'}, words.map(w =>
        h('div', {class:'it-color-card', style:`border-left: 4px solid ${w.color}`}, [
          h('div', {class:'it-arm'}, w.arm),
          h('div', {class:'it-tr'}, w.tr),
          h('div', {class:'it-ru'}, w.ru),
        ])
      )),
    ])
  }
})

const FoodTab = defineComponent({
  name: 'FoodTab',
  setup() {
    const words = [
      {arm:'Հաց',      tr:'Hats',      ru:'Хлеб'},
      {arm:'Լավաշ',    tr:'Lavash',    ru:'Лаваш'},
      {arm:'Ջուր',       tr:'Jur',       ru:'Вода'},
      {arm:'Գինի',      tr:'Gini',      ru:'Вино'},
      {arm:'Թեյ',       tr:'Tey',       ru:'Чай'},
      {arm:'Սուրճ',     tr:'Surch',     ru:'Кофе'},
      {arm:'Միս',       tr:'Mis',       ru:'Мясо'},
      {arm:'Ձուկ',      tr:'Dzuk',      ru:'Рыба'},
      {arm:'Բանջարեղեն',    tr:'Banjareghen', ru:'Овощи'},
      {arm:'Մրգեղեն',    tr:'Mrgegh',    ru:'Фрукты'},
      {arm:'Ճաշ',     tr:'Chash',     ru:'Обед / Еда'},
      {arm:'Ռեստորան', tr:'Restorant', ru:'Ресторан'},
      {arm:'Ցանկ',     tr:'Tsank',     ru:'Меню / Список'},
      {arm:'Շոկոլադ',  tr:'Shokolad',  ru:'Шоколад'},
    ]
    return () => h('div', {class:'inline-tab'}, [
      h('div', {class:'it-title'}, 'Еда и напитки — Ճաշեր'),
      h('div', {class:'it-grid'}, words.map(w =>
        h('div', {class:'it-wcard'}, [
          h('div', {class:'it-arm'}, w.arm),
          h('div', {class:'it-tr'}, w.tr),
          h('div', {class:'it-ru'}, w.ru),
        ])
      )),
      h('div', {class:'it-note'}, 'В ресторане: «Ես ——— Ուզում եմ» = «Я хочу ———»'),
    ])
  }
})

const TimeTab = defineComponent({
  name: 'TimeTab',
  setup() {
    const days = [
      {arm:'Երկուշաբթի',   tr:'Yerkushapti',  ru:'Понедельник'},
      {arm:'Երեքշաբթի',  tr:'Yereqshapti',  ru:'Вторник'},
      {arm:'Չորեքշաբթի', tr:'Choreqshapti', ru:'Среда'},
      {arm:'Հինգշաբթի',   tr:'Hingshapti',   ru:'Четверг'},
      {arm:'Ուրբաթ',        tr:'Urbat',        ru:'Пятница'},
      {arm:'Շաբաթ',       tr:'Shabat',       ru:'Суббота'},
      {arm:'Կիրակի',       tr:'Kiraki',       ru:'Воскресенье'},
    ]
    const months = [
      {arm:'Հունվար',    tr:'Hunvar',    ru:'Январь'},
      {arm:'Փետրվար',   tr:'Fetrvar',   ru:'Февраль'},
      {arm:'Մարտ',     tr:'Marts',     ru:'Март'},
      {arm:'Ապրիլ', tr:'April',     ru:'Апрель'},
      {arm:'Մայիս',     tr:'Mayis',     ru:'Май'},
      {arm:'Հունիս',     tr:'Hunis',     ru:'Июнь'},
      {arm:'Հուլիս',     tr:'Hulis',     ru:'Июль'},
      {arm:'Օգոստոս',   tr:'Ogostos',   ru:'Август'},
      {arm:'Սեպտեմբեր', tr:'September', ru:'Сентябрь'},
      {arm:'Հոկտեմբեր', tr:'Hoktember', ru:'Октябрь'},
      {arm:'Նոյեմբեր',  tr:'Noyember',  ru:'Ноябрь'},
      {arm:'Դեկտեմբեր',  tr:'December',  ru:'Декабрь'},
    ]
    return () => h('div', {class:'inline-tab'}, [
      h('div', {class:'it-title'}, 'Дни недели — Ժամանակ'),
      ...days.map(d => h('div', {class:'it-row'}, [
        h('div', {class:'it-arm'}, d.arm),
        h('div', {class:'it-body'}, [h('div', {class:'it-tr'}, d.tr)]),
        h('div', {class:'it-ru'}, d.ru),
      ])),
      h('div', {class:'it-title', style:'margin-top:16px'}, 'Месяцы'),
      h('div', {class:'it-grid'}, months.map(m =>
        h('div', {class:'it-wcard'}, [
          h('div', {class:'it-arm'}, m.arm),
          h('div', {class:'it-tr'}, m.tr),
          h('div', {class:'it-ru'}, m.ru),
        ])
      )),
    ])
  }
})

const VerbsTab = defineComponent({
  name: 'VerbsTab',
  setup() {
    const verbs = [
      {inf:'Կարդալ', tr:'Kardal', present:'Կարդում եմ', ptr:'Kardum em', ru:'Читать'},
      {inf:'Գնալ',   tr:'Gnal',   present:'Գնում եմ',   ptr:'Gnum em',   ru:'Идти'},
      {inf:'Սիրել',  tr:'Sirel',  present:'Սիրում եմ',  ptr:'Sirum em',  ru:'Любить'},
      {inf:'Ուտել',   tr:'Utel',   present:'Ուտում եմ',   ptr:'Utum em',   ru:'Есть/кушать'},
      {inf:'Խոսել', tr:'Khosel', present:'Խոսում եմ', ptr:'Khosum em', ru:'Говорить'},
      {inf:'Գրել',   tr:'Grel',   present:'Գրում եմ',   ptr:'Grum em',   ru:'Писать'},
      {inf:'Տեսնել', tr:'Tesnel', present:'Տեսնում եմ', ptr:'Tesnum em', ru:'Видеть'},
      {inf:'Գիտել',  tr:'Gitel',  present:'Գիտում եմ',  ptr:'Gitum em',  ru:'Знать'},
      {inf:'Ուզել',   tr:'Uzel',   present:'Ուզում եմ',   ptr:'Uzum em',   ru:'Хотеть'},
      {inf:'Լսել',   tr:'Lsel',   present:'Լսում եմ',   ptr:'Lsum em',   ru:'Слышать'},
    ]
    return () => h('div', {class:'inline-tab'}, [
      h('div', {class:'it-title'}, 'Базовые глаголы — Բայեր'),
      h('div', {class:'it-note'}, 'Настоящее время: основа + –ум + вспомогательный глагол'),
      h('div', {class:'it-verb-table'}, [
        h('div', {class:'itv-head'}, [
          h('div', {}, 'Инфинитив'),
          h('div', {}, 'Translit'),
          h('div', {}, 'Я'),
          h('div', {}, 'Русский'),
        ]),
        ...verbs.map(v => h('div', {class:'itv-row'}, [
          h('div', {class:'itv-inf'}, v.inf),
          h('div', {class:'itv-tr'}, v.tr),
          h('div', {class:'itv-pres'}, v.present),
          h('div', {class:'itv-ru'}, v.ru),
        ])),
      ]),
    ])
  }
})

const props = defineProps({ words: Array, level: String })
const emit  = defineEmits(['open-alphabet'])

const currentLevel = ref(props.level || 'A1')
const active       = ref(null)
const completedIds = ref(new Set(JSON.parse(localStorage.getItem('barr_lessons') || '[]')))

const LESSONS = [
  // A1
  { id:1,  ru:'Алфавит',               arm:'Հայոց Այբուբեն', desc:'39 букв · фонетика · произношение',   level:'A1', locked:false, comp:'alphabet' },
  { id:2,  ru:'Местоимения',            arm:'Դերանուններ',      desc:'Я, ты, он/она · 7 падежей',          level:'A1', locked:false, comp:'pronouns' },
  { id:3,  ru:'Ед. и мн. число',        arm:'Եզակի / Հոգնակի', desc:'Суффиксы –ер и –нер · правила', level:'A1', locked:false, comp:'plural' },
  { id:4,  ru:'Числа',                  arm:'Թվեր',           desc:'0–1000 · механизм образования',      level:'A1', locked:false, comp:'numbers' },
  { id:5,  ru:'Семья',                  arm:'Ընտանիք',        desc:'Отец, мать, брат, сестра...',        level:'A1', locked:false, comp:'family' },
  { id:6,  ru:'Цвета и природа',        arm:'Գույներ',         desc:'Цвета · природа · погода',           level:'A1', locked:false, comp:'colors' },
  { id:7,  ru:'Глагол «быть»',          arm:'Լինել',            desc:'Ем · ес · е · спряжение',            level:'A1', locked:false, comp:'verbBe' },
  { id:8,  ru:'Еда и напитки',          arm:'Ճաշեր',        desc:'Блюда · продукты · ресторан',        level:'A1', locked:false, comp:'food' },
  { id:9,  ru:'Время и дни',            arm:'Ժամանակ',        desc:'Часы · дни недели · месяцы',         level:'A1', locked:false, comp:'time' },
  { id:10, ru:'Базовые глаголы',        arm:'Բայեր',          desc:'Читать · идти · говорить · видеть',  level:'A1', locked:false, comp:'verbs' },
  // A2
  { id:11, ru:'Падежи',                 arm:'Հանկություն',     desc:'7 падежей существительных',          level:'A2', locked:false,  comp:'cases' },
  { id:12, ru:'Настоящее время',        arm:'Ներկային',       desc:'Спряжение глаголов с –ум',           level:'A2', locked:false,  comp:'verbBe' },
  { id:13, ru:'Город и транспорт',      arm:'Կաղաք',          desc:'Транспорт · улицы · маршруты',       level:'A2', locked:false,  comp:'city' },
  { id:14, ru:'Прилагательные',         arm:'Ածականներ',     desc:'Описания · сравнения · антонимы',    level:'A2', locked:false,  comp:'adjectives' },
  { id:15, ru:'Вопросы',               arm:'Հարցեր',        desc:'Кто? Что? Где? Когда? Почему?',      level:'A2', locked:false,  comp:'questions' },
  { id:16, ru:'Тело и здоровье',        arm:'Մարմնի',         desc:'Части тела · симптомы · врач',       level:'A2', locked:false,  comp:'body' },
  { id:17, ru:'Прошедшее время',        arm:'Անցյալ',         desc:'Что делал? · вчера · прошлое',       level:'A2', locked:false,  comp:'pastTense' },
  { id:18, ru:'Дом и быт',              arm:'Տուն',            desc:'Комнаты · мебель · домашние дела',   level:'A2', locked:false,  comp:'homeLife' },
  { id:19, ru:'Магазин и деньги',       arm:'Շուկա',           desc:'Покупки · цены · торговля',          level:'A2', locked:false,  comp:'shopping' },
  { id:20, ru:'Будущее время',          arm:'Ապագա',          desc:'Планы · намерения · будущее',        level:'A2', locked:false,  comp:'futureTense' },
  // B1
  { id:21, ru:'Отрицание',              arm:'Ոչ',            desc:'Отрицательные формы глаголов',       level:'B1', locked:false,  comp:'negation' },
  { id:22, ru:'Сложные глаголы',        arm:'Բարդական',       desc:'Каузативы · залог · виды',           level:'B1', locked:true,  comp:null },
  { id:23, ru:'Армения',                arm:'Հայաստան',       desc:'История · культура · традиции',      level:'B1', locked:false,  comp:'armenia' },
  { id:24, ru:'Диалоги',                arm:'Զրույթ',          desc:'Живая речь · разговорные фразы',     level:'B1', locked:false,  comp:'proverbs' },
  { id:26, ru:'Диалоги на практике',    arm:'Խոսակցություն',      desc:'Кафе · такси · рынок · знакомство · аэропорт', level:'B1', locked:false, comp:'dialogue' },
]

// Unlock based on completed
function applyUnlocks() {
  completedIds.value.forEach(id => {
    const next = LESSONS.find(l => l.id === id + 1)
    if (next) next.locked = false
  })
}
applyUnlocks()

const filteredLessons = computed(() =>
  LESSONS.filter(l => l.level === currentLevel.value)
)

const pronWord = ref(null)
function pickPronWord() {
  if (!props.words?.length) { pronWord.value = null; return }
  pronWord.value = props.words[Math.floor(Math.random() * props.words.length)]
}
function onPronResult(ok) {
  if (!ok) return
  const n = Number(localStorage.getItem('barr_pron_ok') || 0) + 1
  localStorage.setItem('barr_pron_ok', n)
}

function openLesson(l) {
  if (l.comp === 'alphabet') { emit('open-alphabet'); return }
  active.value = l
  pickPronWord()
}
function close() { active.value = null }

function markDone() {
  const s = new Set(completedIds.value)
  s.add(active.value.id)
  completedIds.value = s
  localStorage.setItem('barr_lessons', JSON.stringify([...s]))
  const nextId = active.value.id + 1
  const next   = LESSONS.find(l => l.id === nextId)
  if (next) next.locked = false
}
</script>

<style scoped>
.learn { padding-bottom:20px; }
.learn-header {
  display:flex; align-items:center; justify-content:space-between;
  padding:20px; border-bottom:1px solid var(--line);
  position:sticky; top:0; z-index:10;
  background:var(--glass-bg-strong);
border-color:var(--glass-border);backdrop-filter:var(--glass-blur);-webkit-backdrop-filter:var(--glass-blur);}
.learn-title { font-family:var(--d); font-size:28px; font-weight:700; font-style:italic; color:var(--red); }
.learn-level { background:var(--red); color:var(--on-accent); font-family:var(--m); font-size:12px; font-weight:700; padding:6px 14px; border-radius:20px; }
.level-tabs  { display:flex; padding:16px 20px 0; gap:8px; }
.ltab {
  flex:1; padding:10px; border:1.5px solid var(--line); border-radius:10px;
  font-family:var(--m); font-size:13px; font-weight:700; color:var(--muted);
  background:var(--glass-bg); cursor:pointer; transition:.15s var(--spring); text-align:center;
border-color:var(--glass-border);box-shadow:inset 0 1px 0 var(--glass-shine),0 4px 16px var(--glass-shadow);backdrop-filter:var(--glass-blur);-webkit-backdrop-filter:var(--glass-blur);}
.ltab.active { background:var(--red); border-color:var(--red); color:var(--on-accent); }
.ltab:hover:not(.active) { border-color:var(--gold); color:var(--ink); }
.learn-body { padding:16px 20px; }
.learn-list { display:flex; flex-direction:column; gap:10px; }
.ll {
  display:flex; align-items:center; gap:14px;
  background:var(--glass-bg); 
  border:1px solid var(--line); border-radius:14px;
  padding:16px; cursor:pointer; transition:all .2s;
border-color:var(--glass-border);backdrop-filter:var(--glass-blur);-webkit-backdrop-filter:var(--glass-blur);}
.ll:hover:not(.locked) { border-color:var(--gold); background:var(--glass-bg); transform:translateX(2px); border-color:var(--glass-border);box-shadow:inset 0 1px 0 var(--glass-shine),0 4px 16px var(--glass-shadow);backdrop-filter:var(--glass-blur);-webkit-backdrop-filter:var(--glass-blur);}
.ll.locked { cursor:default; }
.ll.locked .ll-num, .ll.locked .ll-info { opacity:.5; }
.ll.done   { border-color:var(--gold); background:rgba(246,140,54,.08); }
.ll-num { width:48px; height:48px; border-radius:12px; flex-shrink:0; background:var(--ink); color:var(--bg); display:flex; align-items:center; justify-content:center; font-family:var(--d); font-size:22px; font-weight:700; }
.ll-num.locked { background:var(--muted); }
.ll.done .ll-num { background:var(--gold); }
.ll-info { flex:1; min-width:0; }
.ll-ru   { font-family:var(--s); font-size:17px; font-weight:600; color:var(--ink); }
.ll-arm  { font-family:var(--d); font-size:14px; font-style:italic; color:var(--red); opacity:.8; margin-top:2px; }
.ll-desc { font-family:var(--m); font-size:11px; color:var(--muted); margin-top:3px; }
.ll-right { flex-shrink:0; }
.ll-done  { color:var(--gold); font-size:18px; font-weight:700; }
.ll-lock  { font-size:16px; }
.ll-arrow { color:var(--muted); font-size:20px; }

/* МОДАЛКА */
.lmodal { position:fixed; inset:0; z-index:200; background:rgba(26,16,8,.5);  display:flex; align-items:flex-end; }
.lmodal-box { width:100%; max-height:94dvh; overflow-y:auto; background:var(--bg); border-radius:24px 24px 0 0; padding:28px 20px 48px; position:relative; }
.lmodal-close { position:absolute; top:16px; right:16px; width:32px; height:32px; border-radius:50%; background:rgba(0,0,0,.08); border:none; cursor:pointer; font-size:14px; color:var(--muted); }
.lm-eye  { font-family:var(--m); font-size:9px; letter-spacing:3px; text-transform:uppercase; color:var(--gold); margin-bottom:4px; }
.lm-ru   { font-family:var(--d); font-size:36px; font-weight:700; font-style:italic; color:var(--red); margin-bottom:4px; }
.lm-arm  { font-family:var(--d); font-size:22px; font-style:italic; color:var(--muted); margin-bottom:8px; }
.lm-desc { font-family:var(--s); font-size:14px; color:var(--muted); margin-bottom:20px; font-style:italic; }
.lm-coming { text-align:center; padding:48px 20px; }
.lm-coming-icon { font-size:48px; margin-bottom:12px; }
.lm-coming-text { font-family:var(--d); font-size:24px; font-style:italic; color:var(--ink); }
.lm-coming-sub  { font-family:var(--s); font-size:14px; color:var(--muted); margin-top:6px; }
.gram-rules { background:rgba(35,88,138,.05); border:1px solid rgba(35,88,138,.15); border-radius:14px; padding:18px; margin-bottom:16px; }
.gr-title { font-family:var(--m); font-size:9px; letter-spacing:3px; text-transform:uppercase; color:var(--blue); margin-bottom:12px; }
.gr-rule { margin-bottom:14px; padding-bottom:14px; border-bottom:1px solid var(--line); }
.gr-rule:last-child { border-bottom:none; margin-bottom:0; padding-bottom:0; }
.gr-rule-title { font-family:var(--s); font-size:15px; font-weight:700; color:var(--ink); margin-bottom:4px; }
.gr-rule-text  { font-family:var(--s); font-size:14px; color:var(--muted); line-height:1.5; margin-bottom:6px; }
.gr-example { display:flex; gap:12px; align-items:baseline; background:var(--glass-bg); padding:8px 12px; border-radius:8px; border-color:var(--glass-border);box-shadow:inset 0 1px 0 var(--glass-shine),0 4px 16px var(--glass-shadow);backdrop-filter:var(--glass-blur);-webkit-backdrop-filter:var(--glass-blur);}
.gr-arm { font-family:var(--d); font-size:20px; font-style:italic; color:var(--red); }
.gr-ru  { font-family:var(--s); font-size:13px; color:var(--muted); }
.lm-done-btn { width:100%; padding:16px; background:var(--red); border:none; border-radius:14px; color:var(--on-accent); font-family:var(--d); font-size:18px; font-style:italic; cursor:pointer; margin-top:24px; transition:.2s var(--spring); }
.lm-done-btn:hover { opacity:.88; }

/* Inline lesson shared styles */
:deep(.inline-tab) { display:flex; flex-direction:column; gap:10px; margin-bottom:16px; }
:deep(.it-title) { font-family:var(--d); font-size:20px; font-style:italic; color:var(--red); font-weight:700; }
:deep(.it-note) { font-family:var(--s); font-size:13px; color:var(--muted); font-style:italic; background:rgba(35,88,138,.07); border-radius:10px; padding:10px 14px; }
:deep(.it-row) { display:flex; align-items:center; gap:12px; background:var(--glass-bg); border:1px solid var(--line); border-radius:12px; padding:12px 14px; border-color:var(--glass-border);box-shadow:inset 0 1px 0 var(--glass-shine),0 4px 16px var(--glass-shadow);backdrop-filter:var(--glass-blur);-webkit-backdrop-filter:var(--glass-blur);}
:deep(.it-face) { font-family:var(--m); font-size:11px; color:var(--muted); min-width:80px; }
:deep(.it-arm) { font-family:var(--d); font-size:18px; font-style:italic; color:var(--red); }
:deep(.it-tr) { font-family:var(--m); font-size:10px; color:var(--muted); }
:deep(.it-ru) { font-family:var(--s); font-size:14px; color:var(--ink); margin-left:auto; }
:deep(.it-body) { flex:1; }
:deep(.it-grid) { display:grid; grid-template-columns:repeat(2,1fr); gap:8px; }
:deep(.it-wcard) { background:var(--glass-bg); border:1px solid var(--line); border-radius:10px; padding:10px 12px; border-color:var(--glass-border);box-shadow:inset 0 1px 0 var(--glass-shine),0 4px 16px var(--glass-shadow);backdrop-filter:var(--glass-blur);-webkit-backdrop-filter:var(--glass-blur);}
:deep(.it-example) { background:rgba(246,140,54,.08); border:1px solid var(--line); border-radius:12px; padding:14px; }
:deep(.ite-label) { font-family:var(--m); font-size:9px; letter-spacing:2px; text-transform:uppercase; color:var(--gold); margin-bottom:6px; }
:deep(.ite-arm) { font-family:var(--d); font-size:22px; font-style:italic; color:var(--red); }
:deep(.ite-ru) { font-family:var(--s); font-size:14px; color:var(--muted); }
:deep(.it-colors) { display:flex; flex-direction:column; gap:8px; }
:deep(.it-color-card) { background:var(--glass-bg); border-radius:10px; padding:10px 14px; display:flex; gap:12px; align-items:center; border-color:var(--glass-border);box-shadow:inset 0 1px 0 var(--glass-shine),0 4px 16px var(--glass-shadow);backdrop-filter:var(--glass-blur);-webkit-backdrop-filter:var(--glass-blur);}
:deep(.it-verb-table) { display:flex; flex-direction:column; gap:0; border:1px solid var(--line); border-radius:12px; overflow:hidden; }
:deep(.itv-head) { display:grid; grid-template-columns:1fr 80px 1fr 80px; padding:8px 12px; background:rgba(246,140,54,.08); font-family:var(--m); font-size:9px; letter-spacing:1px; text-transform:uppercase; color:var(--muted); }
:deep(.itv-row) { display:grid; grid-template-columns:1fr 80px 1fr 80px; padding:10px 12px; border-top:1px solid rgba(246,140,54,.1); }
:deep(.itv-inf) { font-family:var(--s); font-size:13px; color:var(--ink); }
:deep(.itv-pres) { font-family:var(--d); font-size:14px; font-style:italic; color:var(--red); }
:deep(.itv-ru) { font-family:var(--m); font-size:11px; color:var(--muted); }
:deep(.itv-tr)  { font-family:var(--m); font-size:10px; color:var(--muted); opacity:.7; }

[data-theme=dark]   .learn-header { background:rgba(10,8,4,.96) !important; }
[data-theme=amoled] .learn-header { background:rgba(0,0,0,.96) !important; }
[data-theme=dark]   .ll { background:rgba(24,16,8,.94) !important; }
[data-theme=amoled] .ll { background:rgba(0,0,0,.95) !important; }
[data-theme=dark]   .ltab { background:rgba(24,16,8,.94) !important; }
[data-theme=dark]   .ltab.active { background:var(--red) !important; }
[data-theme=dark]   .lmodal-box { background:#0a0804; }
[data-theme=dark] :deep(.it-row),
[data-theme=dark] :deep(.it-wcard),
[data-theme=dark] :deep(.it-color-card) { background:rgba(24,16,8,.94) !important; }
[data-theme=dark] :deep(.it-ru),
[data-theme=dark] :deep(.it-arm) { color:rgba(231,220,208,.9) !important; }
</style>
