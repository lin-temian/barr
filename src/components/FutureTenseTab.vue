<template>
  <div class="inline-tab">
    <div class="it-title">Будущее время — Ապագա</div>
    <div class="it-note">Способ 1: <strong>կը</strong> + настоящее. Способ 2: <strong>պիտի</strong> + инфинитив</div>
    <div class="sect-lbl">կը + настоящее время (Կարդալ)</div>
    <div class="conj-table">
      <div class="cj-head"><div>Лицо</div><div>Форма</div><div>Перевод</div></div>
      <div class="cj-row"><div class="cj-face">Ես (я)</div><div class="cj-arm">կը Կարդում եմ</div><div class="cj-tr">Я буду читать</div></div>
      <div class="cj-row"><div class="cj-face">Դու (ты)</div><div class="cj-arm">կը Կարդում ես</div><div class="cj-tr">Ты будешь читать</div></div>
      <div class="cj-row"><div class="cj-face">Նա (он)</div><div class="cj-arm">կը Կարդում ե</div><div class="cj-tr">Он будет читать</div></div>
      <div class="cj-row"><div class="cj-face">Մենք (мы)</div><div class="cj-arm">կը Կարդում ենք</div><div class="cj-tr">Мы будем читать</div></div>
      <div class="cj-row"><div class="cj-face">Դուք (вы)</div><div class="cj-arm">կը Կարդում եք</div><div class="cj-tr">Вы будете читать</div></div>
      <div class="cj-row"><div class="cj-face">Նրանք (они)</div><div class="cj-arm">կը Կարդում են</div><div class="cj-tr">Они будут читать</div></div>
    </div>
    <div class="sect-lbl">պիտի (piti) + инфинитив</div>
    <div class="past-ex"><div class="pe-arm">Ես պիտի Գնալ</div><div class="pe-tr">Yes piti gnal</div><div class="pe-ru">Я собираюсь идти</div></div>
    <div class="past-ex"><div class="pe-arm">Ես պիտի Կարդալ</div><div class="pe-tr">Yes piti kardal</div><div class="pe-ru">Я буду читать</div></div>
    <div class="past-ex"><div class="pe-arm">Նա պիտի Գալ</div><div class="pe-tr">Na piti gal</div><div class="pe-ru">Он придёт</div></div>
    <div class="past-ex"><div class="pe-arm">Մենք պիտի երգենք</div><div class="pe-tr">Menk piti yergenk</div><div class="pe-ru">Мы будем петь</div></div>
  </div>
</template>
<script setup></script>
<style scoped>
.sect-lbl{font-family:var(--m);font-size:9px;letter-spacing:2px;text-transform:uppercase;color:var(--blue);margin-top:6px;}
.conj-table{background:var(--glass-bg);border:1px solid var(--line);border-radius:12px;overflow:hidden;border-color:var(--glass-border);backdrop-filter:var(--glass-blur-sm);-webkit-backdrop-filter:var(--glass-blur-sm);box-shadow:inset 0 1px 0 var(--glass-shine),0 4px 16px var(--glass-shadow);}
.cj-head,.cj-row{display:grid;grid-template-columns:1fr 1fr 1fr;padding:9px 12px;border-bottom:1px solid var(--line);}
.cj-row:last-child{border-bottom:none;}
.cj-head{font-family:var(--m);font-size:9px;text-transform:uppercase;color:var(--muted);background:var(--glass-bg);backdrop-filter:var(--glass-blur-sm);-webkit-backdrop-filter:var(--glass-blur-sm);box-shadow:inset 0 1px 0 var(--glass-shine),0 4px 16px var(--glass-shadow);}
.cj-face{font-family:var(--s);font-size:13px;color:var(--muted);}
.cj-arm{font-family:var(--d);font-size:17px;font-style:italic;color:var(--red);}
.cj-tr{font-family:var(--m);font-size:10px;color:var(--muted);}
.past-list{display:flex;flex-direction:column;gap:7px;}
.pl-row{display:flex;align-items:baseline;gap:8px;background:var(--glass-bg);border:1px solid var(--line);border-radius:10px;padding:9px 12px;border-color:var(--glass-border);backdrop-filter:var(--glass-blur-sm);-webkit-backdrop-filter:var(--glass-blur-sm);box-shadow:inset 0 1px 0 var(--glass-shine),0 4px 16px var(--glass-shadow);}
.pl-inf{font-family:var(--d);font-size:16px;font-style:italic;color:var(--red);min-width:80px;}
.pl-arr{color:var(--muted);}
.pl-past{font-family:var(--d);font-size:16px;font-style:italic;color:var(--blue);flex:1;}
.pl-tr{font-family:var(--m);font-size:10px;color:var(--muted);}
.pl-ru{font-family:var(--s);font-size:13px;color:var(--ink);}
.past-ex{background:var(--glass-bg);border:1px solid var(--line);border-radius:10px;padding:10px 14px;border-color:var(--glass-border);backdrop-filter:var(--glass-blur-sm);-webkit-backdrop-filter:var(--glass-blur-sm);box-shadow:inset 0 1px 0 var(--glass-shine),0 4px 16px var(--glass-shadow);}
.pe-arm{font-family:var(--d);font-size:18px;font-style:italic;color:var(--ink);}
.pe-tr{font-family:var(--m);font-size:10px;color:var(--muted);}
.pe-ru{font-family:var(--s);font-size:14px;color:var(--muted);}
</style>