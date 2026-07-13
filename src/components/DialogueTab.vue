<template>
  <div class="dlg">
    <div v-if="!active" class="dlg-list">
      <div class="sent-hd"><h2>Диалоги</h2><p>Выбери сценарий и прочитай разговор</p></div>
      <div v-for="d in DIALOGUES" :key="d.id" class="dlg-card" @click="open(d)">
        <div class="dlg-icon">{{ d.icon }}</div>
        <div class="dlg-info">
          <div class="dlg-title">{{ d.title }}</div>
          <div class="dlg-desc">{{ d.desc }}</div>
        </div>
        <span class="dlg-done" v-if="readSet.has(d.id)">✓</span>
        <span class="dlg-arrow" v-else>→</span>
      </div>
    </div>

    <div v-else class="dlg-reading">
      <button class="dlg-back" @click="active=null">← Назад</button>
      <div class="dlg-r-title">{{ active.icon }} {{ active.title }}</div>

      <div class="dlg-lines">
        <div v-for="(l,i) in active.lines" :key="i" class="dlg-line" :class="l.speaker">
          <div class="dlg-line-body">
            <div class="dlg-arm">{{ l.arm }}
              <button class="dlg-play" @click="playWord({arm:l.arm})">▶</button>
            </div>
            <div class="dlg-tr">{{ l.translit }}</div>
            <div class="dlg-ru">{{ l.ru }}</div>
          </div>
        </div>
      </div>

      <div class="dlg-note">
        <div class="dlg-note-title">Ключевая фраза</div>
        <div class="dlg-note-arm">{{ active.note.arm }}</div>
        <div class="dlg-note-text">{{ active.note.text }}</div>
      </div>

      <button class="dlg-read-btn" @click="markRead">
        {{ readSet.has(active.id) ? '✓ Прочитано' : 'Отметить прочитанным' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useSpeech } from '../composables/useSpeech.js'

const { playWord } = useSpeech()

const DIALOGUES = [
  {
    id: 'cafe', icon: '☕', title: 'В кафе', desc: 'Заказ кофе и оплата',
    lines: [
      { speaker:'b', arm:'Բարի գալուստ, ի՞նչ կցանկանաք', translit:'Bari galust, inch ktsankanak', ru:'Добро пожаловать, что желаете?' },
      { speaker:'a', arm:'Մեկ սուրճ, խնդրեմ',              translit:'Mek soorch, khndrem',            ru:'Одну кофе, пожалуйста' },
      { speaker:'b', arm:'Այլ ինչ-որ բան',                 translit:'Ayl inch-vor ban',               ru:'Что-нибудь ещё?' },
      { speaker:'a', arm:'Ոչ, շնորհակալություն։ Որքա՞ն արժե', translit:'Voch, shnorhakalutyun. Vorkan arje', ru:'Нет, спасибо. Сколько стоит?' },
      { speaker:'b', arm:'Հինգ հարյուր դրամ',               translit:'Hing haryur dram',               ru:'Пятьсот драм' },
    ],
    note: { arm:'Խնդրեմ', text:'«Пожалуйста» — используется и как просьба, и как ответ «вот, держите»' },
  },
  {
    id: 'taxi', icon: '🚕', title: 'В такси', desc: 'Куда едем и сколько это займёт',
    lines: [
      { speaker:'a', arm:'Բարև, ազատ ե՞ք',                translit:'Barev, azat ek',                ru:'Здравствуйте, вы свободны?' },
      { speaker:'b', arm:'Այո, ո՞ւր եք գնում',             translit:'Ayo, vur ek gnum',              ru:'Да, куда едете?' },
      { speaker:'a', arm:'Օդանավակայան, խնդրեմ',          translit:'Odanavakayan, khndrem',         ru:'В аэропорт, пожалуйста' },
      { speaker:'b', arm:'Լավ, նստեք',                    translit:'Lav, nstek',                    ru:'Хорошо, садитесь' },
      { speaker:'a', arm:'Որքա՞ն ժամանակ կտևի',           translit:'Vorkan zhamanak kdevi',         ru:'Сколько времени это займёт?' },
      { speaker:'b', arm:'Մոտ քսան րոպե',                 translit:'Mot ksan rope',                 ru:'Около двадцати минут' },
    ],
    note: { arm:'Ո՞ւր եք գնում', text:'Вопросительная частица -՞ ставится на ударный слог вопросительного слова' },
  },
  {
    id: 'market', icon: '🧺', title: 'На рынке', desc: 'Спросить цену и купить',
    lines: [
      { speaker:'a', arm:'Բարև, այս խնձորները թա՞րմ են',  translit:'Barev, ays khndzornery tarm en', ru:'Здравствуйте, эти яблоки свежие?' },
      { speaker:'b', arm:'Այո, այսօրվա',                  translit:'Ayo, aysorva',                  ru:'Да, сегодняшние' },
      { speaker:'a', arm:'Ինչ արժե՞ մեկ կիլոգրամը',       translit:'Inch arje mek kilogramy',       ru:'Сколько стоит килограмм?' },
      { speaker:'b', arm:'Երեք հարյուր դրամ',             translit:'Yerek haryur dram',             ru:'Триста драм' },
      { speaker:'a', arm:'Կտամ երկու կիլոգրամ',           translit:'Ktam yerku kilogram',           ru:'Дайте два килограмма' },
    ],
    note: { arm:'Ինչ արժե՞', text:'Главный вопрос для любого рынка — «Сколько стоит?»' },
  },
  {
    id: 'intro', icon: '🤝', title: 'Знакомство', desc: 'Представиться и спросить имя',
    lines: [
      { speaker:'a', arm:'Բարև ձեզ',                       translit:'Barev dzez',                    ru:'Здравствуйте' },
      { speaker:'b', arm:'Բարև, ի՞նչ է ձեր անունը',        translit:'Barev, inch e dzer anuny',      ru:'Здравствуйте, как вас зовут?' },
      { speaker:'a', arm:'Ինձ անունս Աննա է',              translit:'Indz anunis Anna e',             ru:'Меня зовут Анна' },
      { speaker:'b', arm:'Ուրախ եմ ծանոթանալ։ Ես Դավիթն եմ', translit:'Urakh yem tsanotanal. Yes Davitn yem', ru:'Рад познакомиться. Я Давид' },
      { speaker:'a', arm:'Ես Ռուսաստանից եմ, իսկ դու՞ք',   translit:'Yes Rusastanits yem, isk duk',   ru:'Я из России, а вы?' },
      { speaker:'b', arm:'Ես հայ եմ, Երևանից',             translit:'Yes hay yem, Yerevanits',        ru:'Я армянин, из Еревана' },
    ],
    note: { arm:'Ուրախ եմ ծանոթանալ', text:'Стандартная вежливая фраза при первой встрече — «Рад(а) познакомиться»' },
  },
  {
    id: 'airport', icon: '✈️', title: 'В аэропорту', desc: 'Регистрация и рейс',
    lines: [
      { speaker:'a', arm:'Ներողություն, ո՞ւր է ռեգիստրացիան', translit:'Neroghutyun, vur e registratsian', ru:'Извините, где регистрация?' },
      { speaker:'b', arm:'Ուղիղ, ապա ձախ',                 translit:'Ughigh, apa dzakh',              ru:'Прямо, потом налево' },
      { speaker:'a', arm:'Շնորհակալություն։ Իմ չվերթը ուշանում է՞', translit:'Shnorhakalutyun. Im chverty ushanum e', ru:'Спасибо. Мой рейс задерживается?' },
      { speaker:'b', arm:'Ոչ, ամեն ինչ ժամանակին է',        translit:'Voch, amen inch zhamanakin e',   ru:'Нет, всё по расписанию' },
    ],
    note: { arm:'Ներողություն', text:'«Извините» — вежливое обращение, чтобы привлечь внимание незнакомого человека' },
  },
]

const READ_KEY = 'barr_dialogues_read'
const readSet  = ref(new Set(JSON.parse(localStorage.getItem(READ_KEY) || '[]')))
const active   = ref(null)

function open(d) { active.value = d }

function markRead() {
  const s = new Set(readSet.value)
  s.add(active.value.id)
  readSet.value = s
  localStorage.setItem(READ_KEY, JSON.stringify([...s]))
}
</script>

<style scoped>
.dlg-card {
  display:flex; align-items:center; gap:14px;
  border:1px solid var(--line); background:var(--glass-bg);
  padding:16px 18px; border-radius:14px; cursor:pointer; transition:.15s var(--spring);
  margin-bottom:8px; border-color:var(--glass-border);
}
.dlg-card:hover { border-color:var(--gold); }
.dlg-icon { font-size:28px; flex-shrink:0; }
.dlg-info { flex:1; }
.dlg-title { font-family:var(--s); font-size:16px; font-weight:600; color:var(--ink); }
.dlg-desc  { font-family:var(--m); font-size:11px; color:var(--muted); margin-top:2px; }
.dlg-arrow { color:var(--gold); font-size:16px; }
.dlg-done  { color:var(--ok); font-size:16px; }

.dlg-back {
  background:var(--glass-bg); border: 1px solid var(--line); border-radius: 20px;
  font-family: var(--m); font-size: 10px;
  letter-spacing: 1px; text-transform: uppercase; color: var(--muted);
  cursor: pointer; padding: 8px 14px; transition:.15s var(--spring);
  border-color:var(--glass-border);
}
.dlg-back:hover { color: var(--red); border-color: var(--gold); }
[data-theme=dark] .dlg-back,
[data-theme=amoled] .dlg-back { background: rgba(24,16,8,.94) !important; border-color: rgba(176,120,40,.2) !important; color: rgba(242,232,213,.9) !important; }

.dlg-r-title { font-family:var(--d); font-size:26px; font-style:italic; color:var(--red); margin:14px 0 18px; }
.dlg-lines { display:flex; flex-direction:column; gap:10px; }
.dlg-line { display:flex; }
.dlg-line.b { justify-content:flex-end; }
.dlg-line-body {
  max-width:82%; background:var(--glass-bg); border:1px solid var(--line);
  border-radius:14px; padding:12px 16px; border-color:var(--glass-border);
}
.dlg-line.a .dlg-line-body { border-top-left-radius:4px; }
.dlg-line.b .dlg-line-body { border-top-right-radius:4px; background:rgba(26,58,110,.06); }
.dlg-arm { font-family:var(--d); font-size:17px; font-style:italic; color:var(--red); display:flex; align-items:center; gap:8px; }
.dlg-play {
  width:22px; height:22px; border-radius:50%; flex-shrink:0;
  border:1px solid var(--line); background:transparent;
  font-size:8px; color:var(--muted); cursor:pointer;
  display:flex; align-items:center; justify-content:center; padding-left:1px;
}
.dlg-play:hover { border-color:var(--gold); color:var(--gold); }
.dlg-tr { font-family:var(--m); font-size:10px; color:var(--muted); margin-top:3px; }
.dlg-ru { font-family:var(--s); font-size:13px; color:var(--ink); margin-top:4px; }

.dlg-note {
  margin-top:20px; padding:14px 16px; border-radius:12px;
  background:rgba(176,120,40,.08); border:1px solid rgba(176,120,40,.25);
}
.dlg-note-title { font-family:var(--m); font-size:9px; letter-spacing:2px; text-transform:uppercase; color:var(--gold); }
.dlg-note-arm   { font-family:var(--d); font-size:18px; font-style:italic; color:var(--red); margin-top:6px; }
.dlg-note-text  { font-family:var(--s); font-size:13px; color:var(--muted); margin-top:4px; line-height:1.4; }

.dlg-read-btn {
  margin-top:18px; width:100%; padding:14px; border-radius:14px; border:none;
  background:var(--ink); color:var(--bg); font-family:var(--s); font-size:14px; font-weight:600;
  cursor:pointer; transition:opacity .2s;
}
.dlg-read-btn:hover { opacity:.9; }

[data-theme=dark] .dlg-card,
[data-theme=dark] .dlg-line-body { background:rgba(24,16,8,.94) !important; border-color:rgba(176,120,40,.2) !important; }
[data-theme=amoled] .dlg-card,
[data-theme=amoled] .dlg-line-body { background:rgba(0,0,0,.95) !important; }
</style>
