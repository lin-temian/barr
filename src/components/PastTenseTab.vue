<template>
  <div class="inline-tab">
    <div class="it-title">Прошедшее время — Անցյaլ</div>
    <div class="it-note">Образование: основа + <strong>–ацி (–atsi)</strong> + личное окончание</div>
    <div class="sect-lbl">Спряжение: Կարդլ (читать)</div>
    <div class="conj-table">
      <div class="cj-head"><div>Лицо</div><div>Форма</div><div>Translit</div></div>
      <div class="cj-row"><div class="cj-face">Ես (я)</div><div class="cj-arm">Կարդացի</div><div class="cj-tr">kardatsi</div></div>
      <div class="cj-row"><div class="cj-face">Դու (ты)</div><div class="cj-arm">Կարդացիր</div><div class="cj-tr">kardatsir</div></div>
      <div class="cj-row"><div class="cj-face">Նա (он/она)</div><div class="cj-arm">Կարդաց</div><div class="cj-tr">kardatsets</div></div>
      <div class="cj-row"><div class="cj-face">Մենք (мы)</div><div class="cj-arm">Կարդացինք</div><div class="cj-tr">kardatsink</div></div>
      <div class="cj-row"><div class="cj-face">Դուք (вы)</div><div class="cj-arm">Կարդացիք</div><div class="cj-tr">kardatsik</div></div>
      <div class="cj-row"><div class="cj-face">Նրանք (они)</div><div class="cj-arm">Կարդացին</div><div class="cj-tr">kardatsin</div></div>
    </div>
    <div class="sect-lbl">Другие глаголы в прошедшем</div>
    <div class="past-list">
      <div class="pl-row"><span class="pl-inf">Գնaլ</span><span class="pl-arr">→</span><span class="pl-past">Գնaցի</span><span class="pl-tr">gnatsi</span><span class="pl-ru">Пошёл</span></div>
      <div class="pl-row"><span class="pl-inf">Սիրել</span><span class="pl-arr">→</span><span class="pl-past">Սիրեցի</span><span class="pl-tr">siretsi</span><span class="pl-ru">Полюбил</span></div>
      <div class="pl-row"><span class="pl-inf">Ուտել</span><span class="pl-arr">→</span><span class="pl-past">Ուտեցի</span><span class="pl-tr">utetsi</span><span class="pl-ru">Покушал</span></div>
      <div class="pl-row"><span class="pl-inf">Խոսել</span><span class="pl-arr">→</span><span class="pl-past">Խոսեցի</span><span class="pl-tr">khosetsi</span><span class="pl-ru">Поговорил</span></div>
      <div class="pl-row"><span class="pl-inf">Գրել</span><span class="pl-arr">→</span><span class="pl-past">Գրեցի</span><span class="pl-tr">gretsi</span><span class="pl-ru">Написал</span></div>
      <div class="pl-row"><span class="pl-inf">Տեսնել</span><span class="pl-arr">→</span><span class="pl-past">Տեսնեցի</span><span class="pl-tr">tesnetsi</span><span class="pl-ru">Увидел</span></div>
    </div>
    <div class="sect-lbl">Примеры</div>
    <div class="past-ex"><div class="pe-arm">Ես Երևվան Գնaցի</div><div class="pe-tr">Yes Yerevan gnatsi</div><div class="pe-ru">Я поехал в Ереван</div></div>
    <div class="past-ex"><div class="pe-arm">Ես Գիրք Կարդaցի</div><div class="pe-tr">Yes girk kardatsi</div><div class="pe-ru">Я читал книгу</div></div>
  </div>
</template>
<script setup></script>
<style scoped>
.sect-lbl{font-family:var(--m);font-size:9px;letter-spacing:2px;text-transform:uppercase;color:var(--blue);margin-top:6px;}
.conj-table{background:var(--bg2);border:1px solid var(--line);border-radius:12px;overflow:hidden;}
.cj-head,.cj-row{display:grid;grid-template-columns:1fr 1fr 1fr;padding:9px 12px;border-bottom:1px solid var(--line);}
.cj-row:last-child{border-bottom:none;}
.cj-head{font-family:var(--m);font-size:9px;text-transform:uppercase;color:var(--muted);background:var(--bg3);}
.cj-face{font-family:var(--s);font-size:13px;color:var(--muted);}
.cj-arm{font-family:var(--d);font-size:17px;font-style:italic;color:var(--red);}
.cj-tr{font-family:var(--m);font-size:10px;color:var(--muted);}
.past-list{display:flex;flex-direction:column;gap:7px;}
.pl-row{display:flex;align-items:baseline;gap:8px;background:var(--bg2);border:1px solid var(--line);border-radius:10px;padding:9px 12px;}
.pl-inf{font-family:var(--d);font-size:16px;font-style:italic;color:var(--red);min-width:80px;}
.pl-arr{color:var(--muted);}
.pl-past{font-family:var(--d);font-size:16px;font-style:italic;color:var(--blue);flex:1;}
.pl-tr{font-family:var(--m);font-size:10px;color:var(--muted);}
.pl-ru{font-family:var(--s);font-size:13px;color:var(--ink);}
.past-ex{background:var(--bg2);border:1px solid var(--line);border-radius:10px;padding:10px 14px;}
.pe-arm{font-family:var(--d);font-size:18px;font-style:italic;color:var(--ink);}
.pe-tr{font-family:var(--m);font-size:10px;color:var(--muted);}
.pe-ru{font-family:var(--s);font-size:14px;color:var(--muted);}
</style>