<template>
  <div>
    <div class="pv-title">Թվեր — Числа</div>
    <div class="pv-grid">
      <div v-for="(w,i) in numbers" :key="i"
        class="pv-card num-card"
        :style="{animationDelay:i*0.03+'s'}">
        <div class="pv-arm">{{ w.arm }}</div>
        <div class="pv-tr">{{ w.translit }}</div>
        <div class="pv-ru">{{ w.ru }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
const numbers = [
  {arm:'Մեկ',translit:'Mek',ru:'1 — Один'},
  {arm:'Երկու',translit:'Yerku',ru:'2 — Два'},
  {arm:'Երեք',translit:'Yerek',ru:'3 — Три'},
  {arm:'Չորս',translit:'Chors',ru:'4 — Четыре'},
  {arm:'Հինգ',translit:'Hing',ru:'5 — Пять'},
  {arm:'Վեց',translit:'Vets',ru:'6 — Шесть'},
  {arm:'Յոթ',translit:'Yot',ru:'7 — Семь'},
  {arm:'Ութ',translit:'Ut',ru:'8 — Восемь'},
  {arm:'Ինը',translit:'Inne',ru:'9 — Девять'},
  {arm:'Տաս',translit:'Tas',ru:'10 — Десять'},
  {arm:'Զրո',translit:'zero',ru:'0 — Ноль'},
  {arm:'ՏասնՄեկ',translit:'tasnmek',ru:'11 — Одиннадцать'},
  {arm:'Ծսան',translit:'ksan',ru:'20 — Двадцать'},
  {arm:'Երեսուն',translit:'yeresun',ru:'30 — Тридцать'},
  {arm:'Քառասուն',translit:'karasun',ru:'40 — Сорок'},
  {arm:'Հիսուն',translit:'hisun',ru:'50 — Пятьдесят'},
  {arm:'Հարյուր',translit:'haryur',ru:'100 — Сто'},
  {arm:'Հազար',translit:'hazar',ru:'1000 — Тысяча'}
]
</script>

<style scoped>
.pv-title { font-family:var(--d); font-size:clamp(26px,4vw,48px); font-weight:700; font-style:italic; color:var(--red); padding:28px 0 20px; border-bottom:2px solid var(--line); margin-bottom:24px; position:relative; }
.pv-title::after { content:''; position:absolute; bottom:-3px; left:0; right:0; height:1px; background:var(--blue); opacity:.6; }
.pv-grid  { display:grid; grid-template-columns:repeat(2,1fr); gap:10px; }
.pv-card  { border:1px solid var(--line); border-left:3px solid var(--red); background:var(--glass-bg); padding:14px 16px; overflow:hidden; animation:cardIn .3s both; border-color:var(--glass-border);backdrop-filter:var(--glass-blur-sm);-webkit-backdrop-filter:var(--glass-blur-sm);box-shadow:inset 0 1px 0 var(--glass-shine),0 4px 16px var(--glass-shadow);}
.num-card:hover { border-color:var(--gold); background:var(--glass-bg); border-color:var(--glass-border);backdrop-filter:var(--glass-blur-sm);-webkit-backdrop-filter:var(--glass-blur-sm);box-shadow:inset 0 1px 0 var(--glass-shine),0 4px 16px var(--glass-shadow);}
.pv-arm { font-family:var(--d); font-size:clamp(24px,6vw,36px); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-weight:700; font-style:italic; color:var(--red); line-height:1; margin-bottom:6px; }
.pv-tr  { font-family:var(--m); font-size:11px; color:var(--muted); font-style:italic; margin-bottom:4px; }
.pv-ru  { font-family:var(--s); font-size:16px; color:var(--ink); }
@keyframes cardIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
</style>
