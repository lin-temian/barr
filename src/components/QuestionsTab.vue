<template>
  <div class="inline-tab">
    <div class="it-title">Вопросы — Հարցեր</div>
    <div class="it-grid">
      <div v-for="q in QS" :key="q.tr" class="it-wcard"><div class="it-arm">{{q.arm}}</div><div class="it-tr">{{q.tr}}</div><div class="it-ru">{{q.ru}}</div></div>
    </div>
    <div class="sect-lbl">Диалог: знакомство</div>
    <div class="dialog-list">
      <div class="d-line"><div class="d-sp">A</div>
        <div class="d-body"><div class="d-arm">Բարևվ!</div><div class="d-tr">Barev!</div><div class="d-ru">Привет!</div></div></div>
      <div class="d-line rb"><div class="d-sp">B</div>
        <div class="d-body"><div class="d-arm">Բարևվ, կերպ Ես?</div><div class="d-tr">Barev, kerp yes?</div><div class="d-ru">Привет! Как ты?</div></div></div>
      <div class="d-line"><div class="d-sp">A</div>
        <div class="d-body"><div class="d-arm">լավ, շնորհակալ.</div><div class="d-tr">Lav, shnorhakal.</div><div class="d-ru">Хорошо, спасибо.</div></div></div>
      <div class="d-line rb"><div class="d-sp">B</div>
        <div class="d-body"><div class="d-arm">ինդզ անունխ Արամ ե.</div><div class="d-tr">Indz anunh Aram e.</div><div class="d-ru">Меня зовут Арам.</div></div></div>
      <div class="d-line"><div class="d-sp">A</div>
        <div class="d-body"><div class="d-arm">ինդզ անունխ Անի ե.</div><div class="d-tr">Indz anunh Ani e.</div><div class="d-ru">Меня зовут Ани.</div></div></div>
      <div class="d-line rb"><div class="d-sp">B</div>
        <div class="d-body"><div class="d-arm">որտևղից եք?</div><div class="d-tr">Vortegits ek?</div><div class="d-ru">Откуда вы?</div></div></div>
      <div class="d-line"><div class="d-sp">A</div>
        <div class="d-body"><div class="d-arm">Ես Հայաստանից եմ.</div><div class="d-tr">Yes Hayastanits em.</div><div class="d-ru">Я из Армении.</div></div></div>
    </div>
  </div>
</template>
<script setup>
const QS = [
  {arm:"ով", tr:"Ov", ru:"Кто?"},
  {arm:"ինչ", tr:"Inch", ru:"Что?"},
  {arm:"որտևղ", tr:"Vortegh", ru:"Где?"},
  {arm:"կան", tr:"Kan", ru:"Куда?"},
  {arm:"երբ", tr:"Yerb", ru:"Когда?"},
  {arm:"ինչով", tr:"Inchov", ru:"Как? Чем?"},
  {arm:"քանի", tr:"Qani", ru:"Сколько?"},
  {arm:"որ", tr:"Vor", ru:"Который?"},
  {arm:"կերպ", tr:"Kerp", ru:"Каким образом?"},
  {arm:"ինչքան", tr:"Inchkan", ru:"Почём?"},
  {arm:"ինչու", tr:"Inchu", ru:"Почему?"},
  {arm:"կա", tr:"Ka", ru:"Есть ли?"},
]
</script>
<style scoped>
.sect-lbl{font-family:var(--m);font-size:9px;letter-spacing:2px;text-transform:uppercase;color:var(--blue);margin-top:6px;}
.sect-lbl{font-family:var(--m);font-size:9px;letter-spacing:2px;text-transform:uppercase;color:var(--blue);margin-top:6px;}
.dialog-list{display:flex;flex-direction:column;gap:8px;}
.d-line{display:flex;gap:10px;align-items:flex-start;}.d-line.rb{flex-direction:row-reverse;}
.d-sp{font-family:var(--m);font-size:11px;font-weight:700;color:var(--bg);background:var(--red);width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:2px;}
.d-line.rb .d-sp{background:var(--blue);}
.d-body{background:var(--bg2);border:1px solid var(--line);border-radius:12px;padding:10px 14px;max-width:88%;}
.d-arm{font-family:var(--d);font-size:17px;font-style:italic;color:var(--ink);}
.d-tr{font-family:var(--m);font-size:10px;color:var(--muted);}
.d-ru{font-family:var(--s);font-size:13px;color:var(--muted);}
</style>