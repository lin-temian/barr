<template>
  <div class="pron-wrap">
    <div class="pv-title">Դeranounnеr — Местоимения</div>
    <div class="pron-note">В армянском 7 падежей. Местоимения не различают род в 3-м лице.</div>

    <div class="pron-group-title">1-е и 2-е лицо</div>
    <div class="pron-scroll">
      <table class="pt">
        <thead>
          <tr>
            <th class="pt-pad">Падеж</th>
            <th v-for="h in heads1" :key="h.arm">
              <div class="pt-arm">{{ h.arm }}</div>
              <div class="pt-tr">{{ h.tr }}</div>
              <div class="pt-ru">{{ h.ru }}</div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in rows1" :key="r.ru">
            <td class="pt-pad">
              <div class="pt-case-arm">{{ r.arm }}</div>
              <div class="pt-case-ru">{{ r.ru }}</div>
            </td>
            <td v-for="v in r.vals" :key="v.arm" class="pt-val">
              <div class="ptv-arm">{{ v.arm }}</div>
              <div class="ptv-tr">{{ v.tr }}</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="pron-group-title" style="margin-top:32px">3-е лицо</div>
    <div class="pron-scroll">
      <table class="pt">
        <thead>
          <tr>
            <th class="pt-pad">Падеж</th>
            <th v-for="h in heads3" :key="h.arm">
              <div class="pt-arm">{{ h.arm }}</div>
              <div class="pt-tr">{{ h.tr }}</div>
              <div class="pt-ru">{{ h.ru }}</div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in rows3" :key="r.ru">
            <td class="pt-pad">
              <div class="pt-case-arm">{{ r.arm }}</div>
              <div class="pt-case-ru">{{ r.ru }}</div>
            </td>
            <td v-for="v in r.vals" :key="v.arm" class="pt-val">
              <div class="ptv-arm">{{ v.arm }}</div>
              <div class="ptv-tr">{{ v.tr }}</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="pron-note pron-note-bottom">
      Притяжательные артикли: –ս (мой), –դ (твой), –ն (его/её) крепятся к концу существительного.
    </div>
  </div>
</template>

<script setup>
const heads1 = [
  { arm:'Ես',   tr:'Yes',  ru:'Я'  },
  { arm:'Մենք', tr:'Menk', ru:'Мы' },
  { arm:'Դու',  tr:'Du',   ru:'Ты' },
  { arm:'Դուք', tr:'Duk',  ru:'Вы' },
]
const heads3 = [
  { arm:'Նա',    tr:'Na',    ru:'Он / Она' },
  { arm:'Նրանք', tr:'Nrank', ru:'Они'      },
]

const rows1 = [
  { arm:'Ուղղական',  ru:'Именительный',
    vals:[ {arm:'Ես',       tr:'Yes'},      {arm:'Մենք',      tr:'Menk'},
           {arm:'Դու',      tr:'Du'},       {arm:'Դուք',      tr:'Duk'}  ] },
  { arm:'Սեռական',   ru:'Родит. / Дат.',
    vals:[ {arm:'իմ',       tr:'im'},       {arm:'մեր',       tr:'mer'},
           {arm:'քո',       tr:'qo'},       {arm:'Ձեր',       tr:'Dzer'} ] },
  { arm:'Հայցական',  ru:'Винительный',
    vals:[ {arm:'ինձ',      tr:'indz'},     {arm:'մեզ',       tr:'mez'},
           {arm:'քեզ',      tr:'qez'},      {arm:'ձեզ',       tr:'dzez'} ] },
  { arm:'Բացառական', ru:'Исходный',
    vals:[ {arm:'ինձանից',  tr:'indzanits'},{arm:'մեզանից',   tr:'mezanits'},
           {arm:'քեզանից',  tr:'qezanits'}, {arm:'ձեզանից',   tr:'dzezanits'} ] },
  { arm:'Գործիական', ru:'Творительный',
    vals:[ {arm:'ինձանով',  tr:'indzanov'}, {arm:'մեզանով',   tr:'mezanov'},
           {arm:'քեզանով',  tr:'qezanov'},  {arm:'ձեզանով',   tr:'dzezanov'} ] },
  { arm:'',          ru:'Местный',
    vals:[ {arm:'—',tr:''}, {arm:'—',tr:''}, {arm:'—',tr:''}, {arm:'—',tr:''} ] },
]

const rows3 = [
  { arm:'Ուղղական',  ru:'Именительный',
    vals:[ {arm:'Նա',      tr:'Na'},      {arm:'Նրանք',    tr:'Nrank'}    ] },
  { arm:'Սեռական',   ru:'Родит. / Дат.',
    vals:[ {arm:'նրա',     tr:'nra'},     {arm:'նրանց',    tr:'nrants'}   ] },
  { arm:'Հայցական',  ru:'Винительный',
    vals:[ {arm:'նրան',    tr:'nran'},    {arm:'նրանց',    tr:'nrants'}   ] },
  { arm:'Բացառական', ru:'Исходный',
    vals:[ {arm:'նրանից',  tr:'nranits'}, {arm:'նրանցից',  tr:'nrantsits'}] },
  { arm:'Գործիական', ru:'Творительный',
    vals:[ {arm:'նրանով',  tr:'nranov'},  {arm:'նրանցով',  tr:'nrantsov'} ] },
  { arm:'',          ru:'Местный',
    vals:[ {arm:'—',tr:''}, {arm:'—',tr:''} ] },
]
</script>

<style scoped>
.pron-wrap { padding-bottom:40px; }
.pv-title {
  font-family:var(--d); font-size:clamp(22px,4vw,40px);
  font-weight:700; font-style:italic; color:var(--red);
  padding:28px 0 16px; border-bottom:2px solid var(--line);
  margin-bottom:16px; position:relative;
}
.pv-title::after { content:''; position:absolute; bottom:-3px; left:0; right:0; height:1px; background:var(--blue); opacity:.6; }
.pron-note { font-family:var(--s); font-size:15px; color:var(--ink); padding:10px 0; margin-bottom:20px; line-height:1.5; }
.pron-note-bottom { margin-top:24px; border-top:1px solid var(--line); padding-top:16px; color:var(--muted); font-style:italic; }
.pron-group-title { font-family:var(--m); font-size:11px; letter-spacing:3px; text-transform:uppercase; color:var(--gold); margin-bottom:12px; }
.pron-scroll { overflow-x:auto; -webkit-overflow-scrolling:touch; width:100%; }
.pt { border-collapse:collapse; min-width:340px; width:100%; border:1px solid var(--line); }
.pt thead th { background:var(--bg2); border:1px solid var(--line); padding:12px 14px; text-align:center; vertical-align:bottom; }
.pt-pad {
  background:var(--ink) !important; color:var(--bg) !important;
  font-family:var(--m); font-size:10px; letter-spacing:1px; text-transform:uppercase;
  min-width:100px; width:100px; padding:12px 10px !important;
  text-align:left !important; vertical-align:middle !important;
}
.pt-arm { font-family:var(--d); font-size:clamp(18px,3.5vw,24px); font-style:italic; color:var(--red); line-height:1.1; margin-bottom:2px; }
.pt-tr  { font-family:var(--m); font-size:10px; color:var(--muted); }
.pt-ru  { font-family:var(--s); font-size:14px; color:var(--ink); margin-top:2px; font-weight:600; }
.pt-case-arm { font-family:var(--d); font-size:clamp(12px,2vw,15px); font-style:italic; color:var(--red); line-height:1.2; margin-bottom:2px; }
.pt-case-ru  { font-family:var(--m); font-size:9px; letter-spacing:.5px; text-transform:uppercase; color:rgba(255,255,255,.7); }

/* VALUE CELLS */
.pt-val { border:1px solid var(--line); padding:10px 12px; text-align:center; background:var(--bg2); vertical-align:middle; }
.ptv-arm { font-family:var(--d); font-size:clamp(16px,2.5vw,20px); font-style:italic; color:var(--ink); line-height:1.2; }
.ptv-tr  { font-family:var(--m); font-size:10px; color:var(--muted); margin-top:3px; letter-spacing:.3px; }

/* Чередование строк */
.pt tbody tr:nth-child(even) .pt-val { background:var(--bg3); }

[data-theme=dark] .pt-val,
[data-theme=dark] .pt thead th { background:var(--bg2) !important; }
[data-theme=dark] .pt tbody tr:nth-child(even) .pt-val { background:var(--bg3) !important; }
[data-theme=dark] .ptv-arm { color:var(--ink) !important; }

[data-theme=amoled] .pt-val,
[data-theme=amoled] .pt thead th { background:var(--bg2) !important; }
</style>
