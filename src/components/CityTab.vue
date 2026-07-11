<template>
  <div class="inline-tab">
    <div class="it-title">Город и транспорт — Կաղաք</div>
    <div class="it-grid">
      <div v-for="w in WORDS" :key="w.tr" class="it-wcard">
        <div class="it-arm">{{ w.arm }}</div>
        <div class="it-tr">{{ w.tr }}</div>
        <div class="it-ru">{{ w.ru }}</div>
      </div>
    </div>

    <div class="sect-lbl">Диалог: как пройти</div>
    <div class="dialog-list">
      <div class="d-line"><div class="d-sp">A</div>
        <div class="d-body"><div class="d-arm">կնորհակալ, որտևղ կ Կաղաքից կանգառ?</div><div class="d-tr">Knorhakal, vortegh e Kaghakits kangar?</div><div class="d-ru">Извините, где остановка в город?</div></div></div>
      <div class="d-line rb"><div class="d-sp">B</div>
        <div class="d-body"><div class="d-arm">Աառիգ գնաց, ապա Ձախ ու</div><div class="d-tr">Aarig gnatse, apa dzakh ou</div><div class="d-ru">Идите прямо, потом налево</div></div></div>
      <div class="d-line"><div class="d-sp">A</div>
        <div class="d-body"><div class="d-arm">շնորհակալ</div><div class="d-tr">Shnorhakal</div><div class="d-ru">Спасибо</div></div></div>
    </div>
  </div>
</template>
<script setup>
const WORDS = [
  {arm:"Կաղաք", tr:"Kaghak", ru:"Город"},
  {arm:"Պողոց", tr:"Poghots", ru:"Улица"},
  {arm:"Ավտոբուս", tr:"Avtobus", ru:"Автобус"},
  {arm:"Մևտրո", tr:"Metro", ru:"Метро"},
  {arm:"Թակսի", tr:"Taksi", ru:"Такси"},
  {arm:"կայարան", tr:"Kayaran", ru:"Вокзал"},
  {arm:"Աերիկային", tr:"Aerikain", ru:"Аэропорт"},
  {arm:"կանգառ", tr:"Kangar", ru:"Остановка"},
  {arm:"Հարթակ", tr:"Hartak", ru:"Площадь"},
  {arm:"Կամուրջ", tr:"Kamurj", ru:"Мост"},
  {arm:"Մուզև", tr:"Muzey", ru:"Музей"},
  {arm:"Բանկ", tr:"Bank", ru:"Банк"},
  {arm:"Հիվանդանոց", tr:"Hivandanots", ru:"Больница"},
  {arm:"Ապթևկարան", tr:"Aptekararan", ru:"Аптека"},
  {arm:"Աառիգ", tr:"Aarig", ru:"Прямо"},
  {arm:"Ձախ", tr:"Dzakh", ru:"Налево"},
  {arm:"ԱՁջ", tr:"Ajj", ru:"Направо"},
  {arm:"Հետ", tr:"Het", ru:"Назад"},
]
</script>
<style scoped><style scoped>
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