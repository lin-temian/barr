<template>
  <div class="inline-tab">
    <div class="it-title">Тело и здоровье — Մարմնի</div>
    <div class="it-grid">
      <div v-for="w in BODY" :key="w.tr" class="it-wcard"><div class="it-arm">{{w.arm}}</div><div class="it-tr">{{w.tr}}</div><div class="it-ru">{{w.ru}}</div></div>
    </div>
    <div class="sect-lbl">Фразы: у врача</div>
    <div class="h-phrase"><div class="hp-arm">Ես հոգնած եմ</div><div class="hp-tr">Yes hognats em</div><div class="hp-ru">Я устал</div></div>
    <div class="h-phrase"><div class="hp-arm">Ես հիվանդ եմ</div><div class="hp-tr">Yes hivand em</div><div class="hp-ru">Я болен</div></div>
    <div class="h-phrase"><div class="hp-arm">Գլուխս ցավում է</div><div class="hp-tr">Glukhs tsavum e</div><div class="hp-ru">У меня болит голова</div></div>
    <div class="h-phrase"><div class="hp-arm">Կանչեք բժիշկ</div><div class="hp-tr">Kanchek bzhishk</div><div class="hp-ru">Вызовите врача</div></div>
    <div class="h-phrase"><div class="hp-arm">Դեղատուն կա՞</div><div class="hp-tr">Deghatun ka?</div><div class="hp-ru">Есть аптека?</div></div>
    <div class="h-phrase"><div class="hp-arm">Ես առողջ կլինեմ</div><div class="hp-tr">Yes aroghj klinem</div><div class="hp-ru">Буду здоров</div></div>
  </div>
</template>
<script setup>
const BODY = [
  {arm:"Գլուխ", tr:"Glukh", ru:"Голова"},
  {arm:"Աչք", tr:"Achk", ru:"Глаза"},
  {arm:"Քիթ", tr:"Qith", ru:"Нос"},
  {arm:"Բերան", tr:"Beran", ru:"Рот"},
  {arm:"Ականջ", tr:"Akanj", ru:"Ухо"},
  {arm:"Ձեռք", tr:"Dzerk", ru:"Рука"},
  {arm:"Ոտք", tr:"Votk", ru:"Нога"},
  {arm:"Սիրտ", tr:"Sirt", ru:"Сердце"},
  {arm:"Լեզու", tr:"Lezu", ru:"Язык"},
  {arm:"Կուրծք", tr:"Kurtsk", ru:"Грудь"},
  {arm:"Մեջք", tr:"Mejk", ru:"Спина"},
  {arm:"Պարանոց", tr:"Paranots", ru:"Шея"},
  {arm:"Ատամ", tr:"Atam", ru:"Зуб"},
  {arm:"Ուղեղ", tr:"Ughegh", ru:"Мозг"},
  {arm:"Արյուն", tr:"Aryun", ru:"Кровь"},
  {arm:"Ոսկոր", tr:"Voskor", ru:"Кость"},
]
</script>
<style scoped>
.sect-lbl{font-family:var(--m);font-size:9px;letter-spacing:2px;text-transform:uppercase;color:var(--blue);margin-top:6px;}
.h-phrase{background:var(--glass-bg);border:1px solid var(--line);border-radius:10px;padding:10px 14px;border-color:var(--glass-border);box-shadow:inset 0 1px 0 var(--glass-shine),0 4px 16px var(--glass-shadow);}
.hp-arm{font-family:var(--d);font-size:17px;font-style:italic;color:var(--red);}
.hp-tr{font-family:var(--m);font-size:10px;color:var(--muted);}
.hp-ru{font-family:var(--s);font-size:13px;color:var(--ink);}
</style>