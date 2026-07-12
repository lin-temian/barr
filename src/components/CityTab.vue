<template>
  <div class="inline-tab">
    <div class="it-title">Город и транспорт — Քաղաք</div>
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
        <div class="d-body"><div class="d-arm">Ներողություն, որտե՞ղ է կանգառը դեպի քաղաք</div><div class="d-tr">Neroghutyun, vortegh e kangare depi qaghaq</div><div class="d-ru">Извините, где остановка в город?</div></div></div>
      <div class="d-line rb"><div class="d-sp">B</div>
        <div class="d-body"><div class="d-arm">Գնացեք ուղիղ, հետո ձախ</div><div class="d-tr">Gnatsek ughigh, heto dzakh</div><div class="d-ru">Идите прямо, потом налево</div></div></div>
      <div class="d-line"><div class="d-sp">A</div>
        <div class="d-body"><div class="d-arm">Շնորհակալություն</div><div class="d-tr">Shnorhakalutyun</div><div class="d-ru">Спасибо</div></div></div>
    </div>
  </div>
</template>
<script setup>
const WORDS = [
  {arm:"Քաղաք", tr:"Kaghak", ru:"Город"},
  {arm:"Պողոց", tr:"Poghots", ru:"Улица"},
  {arm:"Ավտոբուս", tr:"Avtobus", ru:"Автобус"},
  {arm:"Մետրո", tr:"Metro", ru:"Метро"},
  {arm:"Տաքսի", tr:"Taksi", ru:"Такси"},
  {arm:"Կայարան", tr:"Kayaran", ru:"Вокзал"},
  {arm:"Օդանավակայան", tr:"Odanavakayan", ru:"Аэропорт"},
  {arm:"Կանգառ", tr:"Kangar", ru:"Остановка"},
  {arm:"Հրապարակ", tr:"Hraparak", ru:"Площадь"},
  {arm:"Կամուրջ", tr:"Kamurj", ru:"Мост"},
  {arm:"Թանգարան", tr:"Tangaran", ru:"Музей"},
  {arm:"Բանկ", tr:"Bank", ru:"Банк"},
  {arm:"Հիվանդանոց", tr:"Hivandanots", ru:"Больница"},
  {arm:"Դեղատուն", tr:"Deghatun", ru:"Аптека"},
  {arm:"Ուղիղ", tr:"Ughigh", ru:"Прямо"},
  {arm:"Ձախ", tr:"Dzakh", ru:"Налево"},
  {arm:"Աջ", tr:"Aj", ru:"Направо"},
  {arm:"Ետ", tr:"Yet", ru:"Назад"},
]
</script>
<style scoped>
.sect-lbl{font-family:var(--m);font-size:9px;letter-spacing:2px;text-transform:uppercase;color:var(--blue);margin-top:6px;}
.dialog-list{display:flex;flex-direction:column;gap:8px;}
.d-line{display:flex;gap:10px;align-items:flex-start;}.d-line.rb{flex-direction:row-reverse;}
.d-sp{font-family:var(--m);font-size:11px;font-weight:700;color:var(--bg);background:var(--red);width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:2px;}
.d-line.rb .d-sp{background:var(--blue);}
.d-body{background:var(--glass-bg);border:1px solid var(--line);border-radius:12px;padding:10px 14px;max-width:88%;border-color:var(--glass-border);backdrop-filter:var(--glass-blur-sm);-webkit-backdrop-filter:var(--glass-blur-sm);box-shadow:inset 0 1px 0 var(--glass-shine),0 4px 16px var(--glass-shadow);}
.d-arm{font-family:var(--d);font-size:17px;font-style:italic;color:var(--ink);}
.d-tr{font-family:var(--m);font-size:10px;color:var(--muted);}
.d-ru{font-family:var(--s);font-size:13px;color:var(--muted);}
</style>