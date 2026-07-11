<template>
  <div class="plural-tab">
    <div class="pt-section">
      <div class="pts-title">Единственное число</div>
      <p class="pts-desc">Существительное в базовой форме — без суффиксов.</p>
      <div class="pts-grid">
        <div class="pts-card" v-for="w in SINGULAR" :key="w.arm">
          <div class="ptc-arm">{{ w.arm }}</div>
          <div class="ptc-tr">{{ w.tr }}</div>
          <div class="ptc-ru">{{ w.ru }}</div>
        </div>
      </div>
    </div>

    <div class="pt-rule">
      <div class="ptr-title">Правило образования множественного числа</div>
      <div class="ptr-cases">
        <div class="ptr-case">
          <div class="ptrc-label">–ер (–ер)</div>
          <div class="ptrc-desc">После гласной на конце слова</div>
        </div>
        <div class="ptr-case">
          <div class="ptrc-label">–нер (–нер)</div>
          <div class="ptrc-desc">После согласной на конце слова</div>
        </div>
      </div>
    </div>

    <div class="pt-section">
      <div class="pts-title">Множественное число: суффикс –ер</div>
      <div class="pts-compare" v-for="p in PLURAL_ER" :key="p.arm">
        <div class="ptcmp-left">
          <div class="ptcmp-label">ед.ч.</div>
          <div class="ptcmp-arm">{{ p.arm }}</div>
          <div class="ptcmp-ru">{{ p.ru }}</div>
        </div>
        <div class="ptcmp-arrow">→</div>
        <div class="ptcmp-right">
          <div class="ptcmp-label">мн.ч.</div>
          <div class="ptcmp-arm">{{ p.plural }}</div>
          <div class="ptcmp-ru">{{ p.ru_pl }}</div>
        </div>
      </div>
    </div>

    <div class="pt-section">
      <div class="pts-title">Множественное число: суффикс –нер</div>
      <div class="pts-compare" v-for="p in PLURAL_NER" :key="p.arm">
        <div class="ptcmp-left">
          <div class="ptcmp-label">ед.ч.</div>
          <div class="ptcmp-arm">{{ p.arm }}</div>
          <div class="ptcmp-ru">{{ p.ru }}</div>
        </div>
        <div class="ptcmp-arrow">→</div>
        <div class="ptcmp-right">
          <div class="ptcmp-label">мн.ч.</div>
          <div class="ptcmp-arm">{{ p.plural }}</div>
          <div class="ptcmp-ru">{{ p.ru_pl }}</div>
        </div>
      </div>
    </div>

    <div class="pt-note">
      <div class="ptn-title">✦ Важно знать</div>
      <ul>
        <li>Нет грамматического рода: «он», «она», «оно» — одно слово <strong>Նа (Na)</strong></li>
        <li>Определённость: суффикс <strong>–н</strong> после существительного означает «этот/эта» (Тун → Тунн)</li>
        <li>Множественное число не изменяется по падежам — падеж показывается другим суффиксом</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
const SINGULAR = [
  {arm:'Տoun', tr:'Tun', ru:'Дом'},
  {arm:'Манук', tr:'Manuk', ru:'Ребёнок'},
  {arm:'Кин', tr:'Gin', ru:'Женщина'},
  {arm:'Айр', tr:'Ayr', ru:'Мужчина/Отец'},
  {arm:'Сер', tr:'Ser', ru:'Любовь'},
  {arm:'Гирк', tr:'Girk', ru:'Книга'},
]

const PLURAL_ER = [
  {arm:'Сер', ru:'Любовь', plural:'Серер', ru_pl:'Любови'},
  {arm:'Гирк', ru:'Книга', plural:'Гирkер', ru_pl:'Книги'},
  {arm:'Ашхарh', ru:'Мир', plural:'Ашхарhер', ru_pl:'Миры'},
]

const PLURAL_NER = [
  {arm:'Тун', ru:'Дом', plural:'Тунер', ru_pl:'Дома'},
  {arm:'Манук', ru:'Ребёнок', plural:'Манукнер', ru_pl:'Дети'},
  {arm:'Кин', ru:'Женщина', plural:'Кинер', ru_pl:'Женщины'},
  {arm:'Айр', ru:'Отец', plural:'Айрер', ru_pl:'Отцы'},
]
</script>

<style scoped>
.plural-tab { display: flex; flex-direction: column; gap: 18px; padding-top: 8px; }
.pt-section { display: flex; flex-direction: column; gap: 10px; }
.pts-title { font-family: var(--m); font-size: 9px; letter-spacing: 2px; text-transform: uppercase; color: var(--blue); }
.pts-desc  { font-family: var(--s); font-size: 14px; color: var(--muted); margin: 0; }
.pts-grid  { display: grid; grid-template-columns: repeat(2,1fr); gap: 8px; }
.pts-card  { background:var(--glass-bg); border:1px solid var(--line); border-radius: 12px; padding: 12px; border-color:var(--glass-border);backdrop-filter:var(--glass-blur-sm);-webkit-backdrop-filter:var(--glass-blur-sm);box-shadow:inset 0 1px 0 var(--glass-shine),0 4px 16px var(--glass-shadow);}
.ptc-arm { font-family: var(--d); font-size: 22px; font-style: italic; color: var(--red); }
.ptc-tr  { font-family: var(--m); font-size: 10px; color: var(--muted); }
.ptc-ru  { font-family: var(--s); font-size: 14px; color: var(--ink); }

.pt-rule { background: rgba(26,58,110,.07); border: 1px solid rgba(26,58,110,.15); border-radius: 14px; padding: 16px; }
.ptr-title { font-family: var(--s); font-size: 15px; font-weight: 700; color: var(--ink); margin-bottom: 12px; }
.ptr-cases { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.ptr-case  { background:var(--glass-bg); border-radius: 10px; padding: 10px 12px; border-color:var(--glass-border);backdrop-filter:var(--glass-blur-sm);-webkit-backdrop-filter:var(--glass-blur-sm);box-shadow:inset 0 1px 0 var(--glass-shine),0 4px 16px var(--glass-shadow);}
.ptrc-label { font-family: var(--d); font-size: 18px; font-style: italic; color: var(--red); }
.ptrc-desc  { font-family: var(--s); font-size: 12px; color: var(--muted); margin-top: 4px; }

.pts-compare {
  display: flex; align-items: center; gap: 10px;
  background:var(--glass-bg); border:1px solid var(--line); border-radius: 12px; padding: 12px 14px;
border-color:var(--glass-border);backdrop-filter:var(--glass-blur-sm);-webkit-backdrop-filter:var(--glass-blur-sm);box-shadow:inset 0 1px 0 var(--glass-shine),0 4px 16px var(--glass-shadow);}
.ptcmp-left, .ptcmp-right { flex: 1; }
.ptcmp-arrow { font-size: 20px; color: var(--gold); }
.ptcmp-label { font-family: var(--m); font-size: 8px; letter-spacing: 1px; text-transform: uppercase; color: var(--muted); }
.ptcmp-arm { font-family: var(--d); font-size: 20px; font-style: italic; color: var(--red); }
.ptcmp-right .ptcmp-arm { color: var(--blue); }
.ptcmp-ru  { font-family: var(--s); font-size: 12px; color: var(--muted); }

.pt-note { background: rgba(176,120,40,.07); border:1px solid var(--line); border-radius: 14px; padding: 16px; }
.ptn-title { font-family: var(--m); font-size: 9px; letter-spacing: 2px; text-transform: uppercase; color: var(--gold); margin-bottom: 10px; }
.pt-note ul { margin: 0; padding-left: 18px; display: flex; flex-direction: column; gap: 8px; }
.pt-note li { font-family: var(--s); font-size: 14px; color: var(--ink); line-height: 1.5; }
.pt-note strong { color: var(--red); }

[data-theme=dark] .pts-card,
[data-theme=dark] .pts-compare { background: rgba(30,20,10,.75) !important; }
[data-theme=dark] .ptc-ru,
[data-theme=dark] .ptcmp-ru,
[data-theme=dark] .pt-note li { color: rgba(242,232,213,.8) !important; }
</style>
