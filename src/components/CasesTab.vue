<template>
  <div class="cases-tab">
    <div class="ct-intro">В армянском <strong>7 падежей</strong>. Родительный и дательный совпадают — одна форма для двух функций.</div>
    <div class="sect-lbl">Падежи</div>
    <div class="cases-grid">
      <div v-for="c in CASES" :key="c.ru" class="case-card" @click="open=open===c.ru?null:c.ru" :class="{active:open===c.ru}">
        <div class="cc-top"><div><div class="cc-arm">{{ c.arm }}</div><div class="cc-tr">{{ c.tr }}</div></div><div class="cc-ru">{{ c.ru }}</div></div>
        <div class="cc-q">{{ c.q }}</div>
        <div v-if="open===c.ru" class="cc-ex"><div class="cc-earm">{{ c.ex }}</div><div class="cc-eru">{{ c.exru }}</div></div>
      </div>
    </div>
    <div class="sect-lbl">Склонение: Տուն (tun) — Дом</div>
    <div class="decl-table">
      <div class="dt-head"><div>Падеж</div><div>Форма</div><div>Translit</div><div>Перевод</div></div>
      <div class="dt-row" v-for="r in DECL_TUN" :key="r.tr"><div class="dt-case">{{r.case}}</div><div class="dt-arm">{{r.arm}}</div><div class="dt-tr">{{r.tr}}</div><div class="dt-ru">{{r.ru}}</div></div>
    </div>
    <div class="sect-lbl">Склонение: Գիրք (girk) — Книга</div>
    <div class="decl-table">
      <div class="dt-head"><div>Падеж</div><div>Форма</div><div>Translit</div><div>Перевод</div></div>
      <div class="dt-row" v-for="r in DECL_GIRK" :key="r.tr"><div class="dt-case">{{r.case}}</div><div class="dt-arm">{{r.arm}}</div><div class="dt-tr">{{r.tr}}</div><div class="dt-ru">{{r.ru}}</div></div>
    </div>
    <div class="ct-note">
      <div class="sect-lbl">Ключевые суффиксы</div>
      <div v-for="s in SUFFS" :key="s.s" class="suf-row"><span class="suf-s">{{s.s}}</span><span class="suf-d">{{s.d}}</span></div>
    </div>
  </div>
</template>
<script setup>
import {ref} from 'vue'
const open = ref(null)
const CASES = [
  {arm:"Ուղղական", tr:"Ugghakan",   ru:"Именительный",  q:"Кто? Что?",        ex:"Տուն", exru:"дом"},
  {arm:"Հայցական",tr:"Haytsakan",  ru:"Винительный",   q:"Кого? Что?",       ex:"Տունը", exru:"(вижу) дом"},
  {arm:"Սեռական", tr:"Serrakan",   ru:"Родит./Датель.", q:"Кого? Кому? Чей?", ex:"Տան", exru:"дома / дому"},
  {arm:"Բացառական", tr:"Batsarakan", ru:"Исходный",       q:"Откуда? От кого?", ex:"Տնից", exru:"от дома"},
  {arm:"Գործիական",tr:"Gortsakan",  ru:"Творительный",  q:"Кем? Чем?",        ex:"Տնում", exru:"домом"},
  {arm:"Ներգոյական",tr:"Nergoyakan", ru:"Местный",        q:"Где? В чём?",      ex:"Տնում", exru:"в доме"},
]
const DECL_TUN = [
  {case:"Имен.",  arm:"Տուն",                  tr:"tun",    ru:"дом"},
  {case:"Вин.",   arm:"Տունը",          tr:"tuny",   ru:"(вижу) дом"},
  {case:"Рд/Дт.", arm:"Տան", tr:"tan",    ru:"дома/дому"},
  {case:"Исход.", arm:"Տնից", tr:"tnits", ru:"от дома"},
  {case:"Твор.",  arm:"Տնում", tr:"tnum", ru:"домом"},
  {case:"Местн.", arm:"Տնում", tr:"tnum", ru:"в доме"},
]
const DECL_GIRK = [
  {case:"Имен.",  arm:"Գիրք",                          tr:"girk",   ru:"книга"},
  {case:"Вин.",   arm:"Գիրքը",                 tr:"girky",  ru:"(читаю) книгу"},
  {case:"Рд/Дт.", arm:"Գիրքի", tr:"girki",  ru:"книги/книге"},
  {case:"Исход.", arm:"Գիրքից", tr:"girkits", ru:"из книги"},
  {case:"Твор.",  arm:"Գիրքում", tr:"girkum", ru:"книгой"},
  {case:"Местн.", arm:"Գիրքում", tr:"girkum", ru:"в книге"},
]
const SUFFS = [
  {s:"–ը/–ն", d:"Винительный (прямое дополнение)"},
  {s:"–ի/–ան", d:"Родит./Дательный (чего, кому)"},
  {s:"–ից",  d:"Исходный (откуда, от)"},
  {s:"–ում", d:"Творительный и Местный"},
]
</script>
<style scoped>
.cases-tab{display:flex;flex-direction:column;gap:14px;}
.ct-intro{font-family:var(--s);font-size:14px;color:var(--ink);line-height:1.6;background:var(--glass-bg);border:1px solid var(--line);border-radius:12px;padding:14px;border-color:var(--glass-border);box-shadow:inset 0 1px 0 var(--glass-shine),0 4px 16px var(--glass-shadow);}
.ct-intro strong{color:var(--red);}
.sect-lbl{font-family:var(--m);font-size:9px;letter-spacing:2px;text-transform:uppercase;color:var(--blue);}
.cases-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;}
.case-card{background:var(--glass-bg);border:1px solid var(--line);border-radius:12px;padding:11px;cursor:pointer;transition:.15s var(--spring);border-color:var(--glass-border);box-shadow:inset 0 1px 0 var(--glass-shine),0 4px 16px var(--glass-shadow);}
.case-card.active{border-color:var(--red);}
.cc-top{display:flex;justify-content:space-between;margin-bottom:3px;}
.cc-arm{font-family:var(--d);font-size:13px;font-style:italic;color:var(--red);}
.cc-tr{font-family:var(--m);font-size:9px;color:var(--muted);}
.cc-ru{font-family:var(--s);font-size:12px;font-weight:700;color:var(--ink);text-align:right;}
.cc-q{font-family:var(--m);font-size:10px;color:var(--blue);}
.cc-ex{margin-top:7px;padding-top:7px;border-top:1px solid var(--line);}
.cc-earm{font-family:var(--d);font-size:17px;font-style:italic;color:var(--ink);}
.cc-eru{font-family:var(--s);font-size:12px;color:var(--muted);}
.decl-table{background:var(--glass-bg);border:1px solid var(--line);border-radius:12px;overflow:hidden;border-color:var(--glass-border);box-shadow:inset 0 1px 0 var(--glass-shine),0 4px 16px var(--glass-shadow);}
.dt-head,.dt-row{display:grid;grid-template-columns:72px 1fr 80px 1fr;padding:8px 12px;border-bottom:1px solid var(--line);gap:6px;align-items:center;}
.dt-row:last-child{border-bottom:none;}
.dt-head{font-family:var(--m);font-size:9px;text-transform:uppercase;color:var(--muted);background:var(--glass-bg);box-shadow:inset 0 1px 0 var(--glass-shine),0 4px 16px var(--glass-shadow);}
.dt-case{font-family:var(--m);font-size:10px;color:var(--muted);}
.dt-arm{font-family:var(--d);font-size:17px;font-style:italic;color:var(--red);}
.dt-tr{font-family:var(--m);font-size:10px;color:var(--muted);}
.dt-ru{font-family:var(--s);font-size:13px;color:var(--ink);}
.ct-note{background:rgba(26,58,110,.06);border:1px solid rgba(26,58,110,.15);border-radius:12px;padding:14px;display:flex;flex-direction:column;gap:8px;}
.suf-row{display:flex;align-items:baseline;gap:10px;}
.suf-s{font-family:var(--d);font-size:19px;font-style:italic;color:var(--red);min-width:90px;}
.suf-d{font-family:var(--s);font-size:13px;color:var(--ink);}
</style>