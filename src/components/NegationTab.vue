<template>
  <div class="inline-tab">
    <div class="it-title">Отрицание — Ժխտում</div>
    <div class="it-note">Частица <strong>չ</strong> присоединяется к вспомогательному глаголу и встаёт перед смысловым глаголом</div>
    <div class="sect-lbl">Положительное → отрицательное</div>
    <div class="neg-pair"><div class="np-s"><div class="np-arm">Ես կարդում եմ</div><div class="np-ru">Я читаю</div></div><div class="np-arr">→</div><div class="np-s np-n"><div class="np-arm red">Ես չեմ կարդում</div><div class="np-ru">Я не читаю</div></div></div>
    <div class="neg-pair"><div class="np-s"><div class="np-arm">Ես գնում եմ</div><div class="np-ru">Я иду</div></div><div class="np-arr">→</div><div class="np-s np-n"><div class="np-arm red">Ես չեմ գնում</div><div class="np-ru">Я не иду</div></div></div>
    <div class="neg-pair"><div class="np-s"><div class="np-arm">Նա կգա</div><div class="np-ru">Он придёт</div></div><div class="np-arr">→</div><div class="np-s np-n"><div class="np-arm red">Նա չի գա</div><div class="np-ru">Он не придёт</div></div></div>
    <div class="sect-lbl">Важные отрицательные фразы</div>
    <div class="neg-ph"><div class="nph-arm">Չգիտեմ</div><div class="nph-tr">Chgitem</div><div class="nph-ru">Не знаю</div></div>
    <div class="neg-ph"><div class="nph-arm">Հնարավոր չէ</div><div class="nph-tr">Hnaravor che</div><div class="nph-ru">Нельзя/Невозможно</div></div>
    <div class="neg-ph"><div class="nph-arm">Չկա</div><div class="nph-tr">Chka</div><div class="nph-ru">Нет (не имеется)</div></div>
    <div class="neg-ph"><div class="nph-arm">Ոչ մի տեղ</div><div class="nph-tr">Voch mi tegh</div><div class="nph-ru">Нигде</div></div>
    <div class="neg-ph"><div class="nph-arm">Երբեք</div><div class="nph-tr">Yerbek</div><div class="nph-ru">Никогда</div></div>
  </div>
</template>
<script setup></script>
<style scoped>
.sect-lbl{font-family:var(--m);font-size:9px;letter-spacing:2px;text-transform:uppercase;color:var(--blue);margin-top:6px;}
.neg-pair{display:grid;grid-template-columns:1fr 20px 1fr;background:var(--glass-bg);border:1px solid var(--line);border-radius:10px;overflow:hidden;border-color:var(--glass-border);box-shadow:inset 0 1px 0 var(--glass-shine),0 4px 16px var(--glass-shadow);backdrop-filter:var(--glass-blur);-webkit-backdrop-filter:var(--glass-blur);}
.np-s{padding:10px 12px;}.np-n{background:rgba(128,6,19,.06);}
.np-arr{display:flex;align-items:center;justify-content:center;color:var(--muted);}
.np-arm{font-family:var(--d);font-size:16px;font-style:italic;color:var(--ink);}
.np-arm.red{color:var(--red);}
.np-ru{font-family:var(--s);font-size:12px;color:var(--muted);}
.neg-ph{background:var(--glass-bg);border:1px solid var(--line);border-radius:10px;padding:10px 14px;border-color:var(--glass-border);box-shadow:inset 0 1px 0 var(--glass-shine),0 4px 16px var(--glass-shadow);backdrop-filter:var(--glass-blur);-webkit-backdrop-filter:var(--glass-blur);}
.nph-arm{font-family:var(--d);font-size:18px;font-style:italic;color:var(--red);}
.nph-tr{font-family:var(--m);font-size:10px;color:var(--muted);}
.nph-ru{font-family:var(--s);font-size:13px;color:var(--ink);}
</style>