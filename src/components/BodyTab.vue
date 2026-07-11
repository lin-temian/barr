<template>
  <div class="inline-tab">
    <div class="it-title">Тело и здоровье — Մարմնի</div>
    <div class="it-grid">
      <div v-for="w in BODY" :key="w.tr" class="it-wcard"><div class="it-arm">{{w.arm}}</div><div class="it-tr">{{w.tr}}</div><div class="it-ru">{{w.ru}}</div></div>
    </div>
    <div class="sect-lbl">Фразы: у врача</div>
    <div class="h-phrase"><div class="hp-arm">Ես կահկալ եմ</div><div class="hp-tr">Yes kahkal em</div><div class="hp-ru">Я устал</div></div>
    <div class="h-phrase"><div class="hp-arm">Ես հիվանդ եմ</div><div class="hp-tr">Yes hivand em</div><div class="hp-ru">Я болен</div></div>
    <div class="h-phrase"><div class="hp-arm">գլխխխխ կածիկ եմ</div><div class="hp-tr">Glkhs kakikh em</div><div class="hp-ru">У меня болит голова</div></div>
    <div class="h-phrase"><div class="hp-arm">Բժիկ կխնդրևք</div><div class="hp-tr">Bjishkin khndrek</div><div class="hp-ru">Вызовите врача</div></div>
    <div class="h-phrase"><div class="hp-arm">Ապթևկ կa եմ?</div><div class="hp-tr">Aptyek ka e?</div><div class="hp-ru">Есть аптека?</div></div>
    <div class="h-phrase"><div class="hp-arm">Լավ լինի եմ</div><div class="hp-tr">Lav lini em</div><div class="hp-ru">Буду здоров</div></div>
  </div>
</template>
<script setup>
const BODY = [
  {arm:"գլխխ", tr:"Glukh", ru:"Голова"},
  {arm:"աչքխ", tr:"Achqh", ru:"Глаза"},
  {arm:"քիթ", tr:"Qith", ru:"Нос"},
  {arm:"բակ", tr:"Bak", ru:"Рот"},
  {arm:"ականջ", tr:"Akanj", ru:"Ухо"},
  {arm:"բազկ", tr:"Bazk", ru:"Рука"},
  {arm:"դկ", tr:"Dk", ru:"Нога"},
  {arm:"սիրտ", tr:"Sirt", ru:"Сердце"},
  {arm:"լևզկ", tr:"Lezk", ru:"Язык"},
  {arm:"կոխկ", tr:"Kokhk", ru:"Грудь"},
  {arm:"հկլկի", tr:"Hklki", ru:"Спина"},
  {arm:"վիրaկ", tr:"Virak", ru:"Шея"},
  {arm:"ատամ", tr:"Atam", ru:"Зуб"},
  {arm:"գլխխին", tr:"Glkhin", ru:"Мозг"},
  {arm:"ariun", tr:"Ariun", ru:"Кровь"},
  {arm:"ոսկ", tr:"Osk", ru:"Кость"},
]
</script>
<style scoped>
.sect-lbl{font-family:var(--m);font-size:9px;letter-spacing:2px;text-transform:uppercase;color:var(--blue);margin-top:6px;}
.h-phrase{background:var(--bg2);border:1px solid var(--line);border-radius:10px;padding:10px 14px;}
.hp-arm{font-family:var(--d);font-size:17px;font-style:italic;color:var(--red);}
.hp-tr{font-family:var(--m);font-size:10px;color:var(--muted);}
.hp-ru{font-family:var(--s);font-size:13px;color:var(--ink);}
</style>