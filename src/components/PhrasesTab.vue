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
import { ref, computed } from 'vue'

const SENTENCES = [
  {arm:'Ես Ռուսաստանից եմ',translit:'Yes Rusastanits yem',ru:'Я из России',cat:'знакомство'},
  {arm:'Ինձ անունս է...',translit:'Indz anunim e...',ru:'Меня зовут...',cat:'знакомство'},
  {arm:'Ի՞նչ է ձեր անունը',translit:'Inch e dzer anuny',ru:'Как вас зовут?',cat:'знакомство'},
  {arm:'Ուրախ եմ ծանոթանալ',translit:'Urakh yem tsanothanal',ru:'Рад познакомиться',cat:'знакомство'},
  {arm:'Ես հայերեն չեմ խոսում',translit:'Yes hayeren chem khvosum',ru:'Я не говорю по-армянски',cat:'знакомство'},
  {arm:'Ես սովորում եմ հայերեն',translit:'Yes sovoroom yem hayeren',ru:'Я учу армянский',cat:'знакомство'},
  {arm:'Ես ուզում եմ...',translit:'Yes uzoom yem...',ru:'Я хочу...',cat:'ресторан'},
  {arm:'Բերեք հաշիվը, խնդրեմ',translit:'Berek hashive, khndrem',ru:'Принесите счёт, пожалуйста',cat:'ресторан'},
  {arm:'Ինչ ունե՞ք',translit:'Inch unek',ru:'Что у вас есть?',cat:'ресторан'},
  {arm:'Շատ համով է',translit:'Shat hamov e',ru:'Очень вкусно',cat:'ресторан'},
  {arm:'Ջուր բերե՞ք',translit:'Jur berek',ru:'Принесёте воды?',cat:'ресторан'},
  {arm:'Ես բուսակեր եմ',translit:'Yes busakyer yem',ru:'Я вегетарианец',cat:'ресторан'},
  {arm:'Ո՞ւր է...',translit:'Vur e...',ru:'Где находится...?',cat:'навигация'},
  {arm:'Ձախ',translit:'Dzakh',ru:'Налево',cat:'навигация'},
  {arm:'Աջ',translit:'Aj',ru:'Направо',cat:'навигация'},
  {arm:'Ուղիղ',translit:'Ughigh',ru:'Прямо',cat:'навигация'},
  {arm:'Կանգ',translit:'Kang',ru:'Остановка / Стоп',cat:'навигация'},
  {arm:'Ռ/կ ո՞ւր է',translit:'Rrk vur e',ru:'Где метро?',cat:'навигация'},
  {arm:'Կարո՞ղ եք օգնել',translit:'Karogh ek ognel',ru:'Можете помочь?',cat:'навигация'},
  {arm:'Ինչ ե՞ղավ',translit:'Inch yeghav',ru:'Что случилось?',cat:'повседневное'},
  {arm:'Ոչինչ',translit:'Vochinch',ru:'Ничего / Всё нормально',cat:'повседневное'},
  {arm:'Հիանալի',translit:'Hianali',ru:'Отлично / Замечательно',cat:'повседневное'},
  {arm:'Ճիշտ',translit:'Jisht',ru:'Правильно / Точно',cat:'повседневное'},
  {arm:'Կարևոր է',translit:'Karevvor e',ru:'Это важно',cat:'повседневное'},
  {arm:'Ես չգիտեմ',translit:'Yes chgitem',ru:'Я не знаю',cat:'повседневное'},
  {arm:'Ինչ արժե՞',translit:'Inch arje',ru:'Сколько стоит?',cat:'повседневное'},
]

const cat = ref('all')
const cats = computed(() => ['all', ...new Set(SENTENCES.map(s=>s.cat))])
const shown = computed(() => cat.value==='all' ? SENTENCES : SENTENCES.filter(s=>s.cat===cat.value))
const openIdx = ref(-1)
</script>

<style scoped>
.sent-hd { margin-bottom:18px; }
.sent-hd h2 { font-family:var(--d); font-size:clamp(26px,3.5vw,46px); font-weight:400; color:var(--red); }
.sent-hd p  { font-size:15px; color:var(--muted); font-style:italic; margin-top:4px; }
.sent-list  { display:flex; flex-direction:column; gap:7px; margin-top:14px; }
.scard { border:1px solid var(--line); background:rgba(236,221,198,.8); padding:18px 22px; cursor:pointer; transition:.15s; position:relative; }
.scard:hover { border-color:var(--gold); background:rgba(242,232,213,.9); }
.s-arm  { font-family:var(--d); font-size:clamp(18px,2.2vw,24px); font-weight:600; color:var(--red); }
.s-tr   { font-family:var(--m); font-size:11px; color:var(--muted); margin-top:3px; }
.s-ru   { display:none; font-size:15px; color:var(--blue); font-style:italic; margin-top:9px; padding-top:9px; border-top:1px solid var(--line); }
.scard.open .s-ru { display:block; }
.s-tag  { position:absolute; top:9px; right:12px; font-family:var(--m); font-size:7px; letter-spacing:1px; text-transform:uppercase; color:var(--muted); border:1px solid var(--line); padding:2px 5px; }
.s-hint { font-family:var(--m); font-size:10px; color:var(--muted); opacity:.5; margin-top:5px; letter-spacing:1px; text-transform:uppercase; }
.scard.open .s-hint { display:none; }
</style>
