<template>
  <div class="inline-tab">
    <div class="it-title">Отрицание — Անիծչև</div>
    <div class="it-note">Частица <strong>չև</strong> ставится перед глаголом. В некоторых формах сливается с ним.</div>
    <div class="sect-lbl">Положительное → отрицательное</div>
    <div class="neg-pair"><div class="np-s"><div class="np-arm">Ես Կարդում եմ</div><div class="np-ru">Я читаю</div></div><div class="np-arr">→</div><div class="np-s np-n"><div class="np-arm red">Ես չևԿարդում եմ</div><div class="np-ru">Я не читаю</div></div></div>
    <div class="neg-pair"><div class="np-s"><div class="np-arm">Ես գնում եմ</div><div class="np-ru">Я иду</div></div><div class="np-arr">→</div><div class="np-s np-n"><div class="np-arm red">Ես չևգնուt եմ</div><div class="np-ru">Я не иду</div></div></div>
    <div class="neg-pair"><div class="np-s"><div class="np-arm">Նա calis</div><div class="np-ru">Он придёт</div></div><div class="np-arr">→</div><div class="np-s np-n"><div class="np-arm red">na չև caլ</div><div class="np-ru">Он не придёт</div></div></div>
    <div class="sect-lbl">Важные отрицательные фразы</div>
    <div class="neg-ph"><div class="nph-arm">չև citem</div><div class="nph-tr">Che gitem</div><div class="nph-ru">Не знаю</div></div>
    <div class="neg-ph"><div class="nph-arm">չև kareli</div><div class="nph-tr">Che kareli</div><div class="nph-ru">Нельзя/Невозможно</div></div>
    <div class="neg-ph"><div class="nph-arm">կa չև</div><div class="nph-tr">Ka che</div><div class="nph-ru">Нет (есть нет)</div></div>
    <div class="neg-ph"><div class="nph-arm">` voretegh</div><div class="nph-tr">Voch vortegh</div><div class="nph-ru">Нигде</div></div>
    <div class="neg-ph"><div class="nph-arm">` erb</div><div class="nph-tr">Voch yerb</div><div class="nph-ru">Никогда</div></div>
  </div>
</template>
<script setup></script>
<style scoped>
.sect-lbl{font-family:var(--m);font-size:9px;letter-spacing:2px;text-transform:uppercase;color:var(--blue);margin-top:6px;}
.neg-pair{display:grid;grid-template-columns:1fr 20px 1fr;background:var(--bg2);border:1px solid var(--line);border-radius:10px;overflow:hidden;}
.np-s{padding:10px 12px;}.np-n{background:rgba(140,28,28,.06);}
.np-arr{display:flex;align-items:center;justify-content:center;color:var(--muted);}
.np-arm{font-family:var(--d);font-size:16px;font-style:italic;color:var(--ink);}
.np-arm.red{color:var(--red);}
.np-ru{font-family:var(--s);font-size:12px;color:var(--muted);}
.neg-ph{background:var(--bg2);border:1px solid var(--line);border-radius:10px;padding:10px 14px;}
.nph-arm{font-family:var(--d);font-size:18px;font-style:italic;color:var(--red);}
.nph-tr{font-family:var(--m);font-size:10px;color:var(--muted);}
.nph-ru{font-family:var(--s);font-size:13px;color:var(--ink);}
</style>