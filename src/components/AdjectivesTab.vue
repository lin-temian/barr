<template>
  <div class="inline-tab">
    <div class="it-title">Прилагательные — Ածդականներ</div>
    <div class="it-note">Прилагательное стоит <strong>перед</strong> существительным и не изменяется по роду</div>
    <div class="sect-lbl">Антонимы</div>
    <div class="adj-pairs">
      <div v-for="p in PAIRS" :key="p.ru1" class="adj-pair">
        <div class="ap-s"><div class="ap-arm">{{p.arm1}}</div><div class="ap-tr">{{p.tr1}}</div><div class="ap-ru">{{p.ru1}}</div></div>
        <div class="ap-vs">↔</div>
        <div class="ap-s ap-r"><div class="ap-arm">{{p.arm2}}</div><div class="ap-tr">{{p.tr2}}</div><div class="ap-ru">{{p.ru2}}</div></div>
      </div>
    </div>
    <div class="sect-lbl">Превосходная степень + ագույն (aguyn)</div>
    <div class="compare-row" v-for="c in COMPARE" :key="c.base">
      <span class="cmp-base">{{c.base}}</span><span class="cmp-arr">→</span>
      <span class="cmp-sup">{{c.super}}</span><span class="cmp-ru">{{c.ru}}</span>
    </div>
    <div class="sect-lbl">Примеры</div>
    <div v-for="ex in EX" :key="ex.arm" class="adj-ex">
      <span class="ae-arm">{{ex.arm}}</span><span class="ae-sep"> — </span><span class="ae-ru">{{ex.ru}}</span>
    </div>
  </div>
</template>
<script setup>
const PAIRS = [
  {arm1:"Մևծ", tr1:"Metse",  ru1:"Большой",  arm2:"Փոքր", tr2:"Pokr",   ru2:"Маленький"},
  {arm1:"բարծ",tr1:"Barje",  ru1:"Высокий",  arm2:"ցածր", tr2:"Tsaghr", ru2:"Низкий"},
  {arm1:"լավ",tr1:"Lav",    ru1:"Хороший",  arm2:"վատ",   tr2:"Vat",    ru2:"Плохой"},
  {arm1:"նոր",tr1:"Nor",   ru1:"Новый",    arm2:"հին", tr2:"Hin",    ru2:"Старый"},
  {arm1:"Արագ",tr1:"Arag",   ru1:"Быстрый",  arm2:"դանդալ",  tr2:"Dandal", ru2:"Медленный"},
  {arm1:"Մաքուր",tr1:"Makur", ru1:"Чистый",   arm2:"կևղտ", tr2:"Keght",  ru2:"Грязный"},
  {arm1:"տաք", tr1:"Tak",    ru1:"Горячий",  arm2:"սառ",  tr2:"Sar",    ru2:"Холодный"},
  {arm1:"բարի",tr1:"Bari",   ru1:"Добрый",   arm2:"լկa", tr2:"Lka", ru2:"Злой"},
]
const COMPARE = [
  {base:"Մևծ",  super:"Մևծագույն",   ru:"самый большой"},
  {base:"լավ", super:"լավագույն",  ru:"самый хороший"},
  {base:"Արագ", super:"Արագագույն",  ru:"самый быстрый"},
]
const EX = [
  {arm:"Մևծ Կաղաք", ru:"Большой город"},
  {arm:"լավ Մարդ",       ru:"Хороший человек"},
  {arm:"նոր Գիրք",      ru:"Новая книга"},
  {arm:"տաք սուրՃ", ru:"Горячий кофе"},
]
</script>
<style scoped>
.sect-lbl{font-family:var(--m);font-size:9px;letter-spacing:2px;text-transform:uppercase;color:var(--blue);margin-top:6px;}
.adj-pairs{display:flex;flex-direction:column;gap:7px;}
.adj-pair{display:grid;grid-template-columns:1fr 22px 1fr;background:var(--glass-bg);border:1px solid var(--line);border-radius:10px;overflow:hidden;border-color:var(--glass-border);backdrop-filter:var(--glass-blur-sm);-webkit-backdrop-filter:var(--glass-blur-sm);box-shadow:inset 0 1px 0 var(--glass-shine),0 4px 16px var(--glass-shadow);}
.ap-s{padding:9px 12px;}.ap-r{background:var(--glass-bg);backdrop-filter:var(--glass-blur-sm);-webkit-backdrop-filter:var(--glass-blur-sm);box-shadow:inset 0 1px 0 var(--glass-shine),0 4px 16px var(--glass-shadow);}
.ap-vs{display:flex;align-items:center;justify-content:center;color:var(--gold);}
.ap-arm{font-family:var(--d);font-size:17px;font-style:italic;color:var(--red);}
.ap-tr{font-family:var(--m);font-size:9px;color:var(--muted);}
.ap-ru{font-family:var(--s);font-size:13px;color:var(--ink);}
.compare-row{display:flex;align-items:baseline;gap:8px;background:var(--glass-bg);border:1px solid var(--line);border-radius:10px;padding:9px 12px;border-color:var(--glass-border);backdrop-filter:var(--glass-blur-sm);-webkit-backdrop-filter:var(--glass-blur-sm);box-shadow:inset 0 1px 0 var(--glass-shine),0 4px 16px var(--glass-shadow);}
.cmp-base{font-family:var(--d);font-size:18px;font-style:italic;color:var(--red);}
.cmp-arr{color:var(--muted);}
.cmp-sup{font-family:var(--d);font-size:18px;font-style:italic;color:var(--gold);flex:1;}
.cmp-ru{font-family:var(--s);font-size:12px;color:var(--muted);}
.adj-ex{display:flex;align-items:baseline;gap:4px;padding:8px 12px;background:var(--glass-bg);border:1px solid var(--line);border-radius:10px;border-color:var(--glass-border);backdrop-filter:var(--glass-blur-sm);-webkit-backdrop-filter:var(--glass-blur-sm);box-shadow:inset 0 1px 0 var(--glass-shine),0 4px 16px var(--glass-shadow);}
.ae-arm{font-family:var(--d);font-size:18px;font-style:italic;color:var(--ink);}
.ae-sep{color:var(--muted);}
.ae-ru{font-family:var(--s);font-size:14px;color:var(--muted);}
</style>