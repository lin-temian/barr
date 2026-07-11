<template>
  <div class="inline-tab">
    <div class="it-title">Магазин и деньги — խանութ</div>
    <div class="it-grid">
      <div v-for="w in WORDS" :key="w.tr" class="it-wcard">
        <div class="it-arm">{{ w.arm }}</div>
        <div class="it-tr">{{ w.tr }}</div>
        <div class="it-ru">{{ w.ru }}</div>
      </div>
    </div>

    <div class="sect-lbl">Диалог в магазине</div>
    <div class="dialog-list">
      <div class="d-line"><div class="d-sp">A</div>
        <div class="d-body"><div class="d-arm">կերպիխ կaրիք?</div><div class="d-tr">Kerpish kariq?</div><div class="d-ru">Чем могу помочь?</div></div></div>
      <div class="d-line rb"><div class="d-sp">B</div>
        <div class="d-body"><div class="d-arm">ինչքan կ կոգխ?</div><div class="d-tr">Inchkan e koghq?</div><div class="d-ru">Сколько стоит это?</div></div></div>
      <div class="d-line"><div class="d-sp">A</div>
        <div class="d-body"><div class="d-arm">կըն 5000 դram</div><div class="d-tr">Kdn 5000 dram</div><div class="d-ru">Это стоит 5000 драм</div></div></div>
      <div class="d-line rb"><div class="d-sp">B</div>
        <div class="d-body"><div class="d-arm">լaվ, կխնդրևլ</div><div class="d-tr">Lav, shnorhakel</div><div class="d-ru">Хорошо, спасибо</div></div></div>
    </div>
  </div>
</template>
<script setup>
const WORDS = [
  {arm:"խանութ", tr:"Khanout", ru:"Магазин"},
  {arm:"շուկa", tr:"Shouka", ru:"Рынок"},
  {arm:"գին", tr:"Gin", ru:"Цена"},
  {arm:"դրաt", tr:"Dram", ru:"Драм"},
  {arm:"dollar", tr:"Dollar", ru:"Доллар"},
  {arm:"կanկ", tr:"Kank", ru:"Кошелёк"},
  {arm:"կիրaկ", tr:"Kirak", ru:"Скидка"},
  {arm:"bank", tr:"Bank", ru:"Банк"},
  {arm:"կaհ", tr:"Kah", ru:"Касса"},
  {arm:"կard", tr:"Kard", ru:"Карта"},
  {arm:"ինչքan", tr:"Inchkan", ru:"Сколько стоит?"},
  {arm:"լaվ", tr:"Lav", ru:"Хорошо / Ладно"},
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