<template>
  <div class="inline-tab">
    <div class="it-title">Пословицы — Առածներ</div>
    <div class="it-note">Армянские пословицы и крылатые выражения народной мудрости</div>
    <div class="prov-card"><div class="pr-arm">Աշխատանքը մարդուն կզարդարէ</div><div class="pr-tr">Ashkhatanqy martun kzardare</div><div class="pr-ru">Труд красит человека</div></div>
    <div class="prov-card"><div class="pr-arm">Համբերությունը դառը է, բայց պտուղը՝ քաղցր</div><div class="pr-tr">Hamberutyuny dary e, bayts ptughy k'aghtsr</div><div class="pr-ru">Терпение горько, но плод его сладок</div></div>
    <div class="prov-card"><div class="pr-arm">Լավ է ուշ, քան երբեք</div><div class="pr-tr">Lav e ush, qan yerbek</div><div class="pr-ru">Лучше поздно, чем никогда</div></div>
    <div class="prov-card"><div class="pr-arm">Կաթիլ առ կաթիլ ծով կդառնա</div><div class="pr-tr">Katil ar katil tsov kdarna</div><div class="pr-ru">Капля за каплей — море (терпение и труд всё перетрут)</div></div>
    <div class="prov-card"><div class="pr-arm">Լեզուն ոսկոր չունի</div><div class="pr-tr">Lezun voskor chuni</div><div class="pr-ru">Язык без костей</div></div>
    <div class="prov-card"><div class="pr-arm">Ով որ փոս փորի ուրիշի համար, ինքն կընկնի մեջը</div><div class="pr-tr">Ov vor pos pori urishi hamar, inkn kynkni mejy</div><div class="pr-ru">Не рой другому яму — сам в неё попадёшь</div></div>
    <div class="prov-card"><div class="pr-arm">Հայրենիք, լեզու, հավատք</div><div class="pr-tr">Hayrenik, lezu, havatq</div><div class="pr-ru">Родина, язык и вера</div></div>
    <div class="prov-card"><div class="pr-arm">Առողջ եղիր</div><div class="pr-tr">Aroghj yeghir</div><div class="pr-ru">Будь здоров</div></div>
    <div class="prov-card"><div class="pr-arm">Ապրես</div><div class="pr-tr">Apres</div><div class="pr-ru">Живи долго (пожелание благодарности)</div></div>
    <div class="prov-card"><div class="pr-arm">Արյունը ջուր չի դառնում</div><div class="pr-tr">Aryuny jur chi darnum</div><div class="pr-ru">Кровь не превращается в воду (семья важна)</div></div>
  </div>
</template>
<script setup></script>
<style scoped>
.prov-card{background:var(--glass-bg);border:1px solid var(--line);border-left:3px solid var(--gold);border-radius:12px;padding:12px 14px;border-color:var(--glass-border);box-shadow:inset 0 1px 0 var(--glass-shine),0 4px 16px var(--glass-shadow);}
.pr-arm{font-family:var(--d);font-size:17px;font-style:italic;color:var(--ink);margin-bottom:4px;}
.pr-tr{font-family:var(--m);font-size:10px;color:var(--muted);margin-bottom:4px;}
.pr-ru{font-family:var(--s);font-size:13px;color:var(--muted);}
</style>