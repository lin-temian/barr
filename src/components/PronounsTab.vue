<template>
  <div class="pron-wrap">
    <div class="pv-title">Դերanouнnеr — Местоимения</div>
    <div class="pron-note">В армянском 7 падежей. Местоимения не различают род в 3-м лице.</div>

    <!-- ТАБЛИЦА 1: 1-е и 2-е лицо -->
    <div class="pron-group-title">1-е и 2-е лицо</div>
    <div class="pron-scroll">
      <table class="pt">
        <thead>
          <tr>
            <th class="pt-pad">Падеж</th>
            <th><div class="pt-arm">Ես</div><div class="pt-tr">Yes</div><div class="pt-ru">Я</div></th>
            <th><div class="pt-arm">Մենք</div><div class="pt-tr">Menk</div><div class="pt-ru">Мы</div></th>
            <th><div class="pt-arm">Դու</div><div class="pt-tr">Du</div><div class="pt-ru">Ты</div></th>
            <th><div class="pt-arm">Դոք</div><div class="pt-tr">Duk</div><div class="pt-ru">Вы</div></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in rows1" :key="r.ru">
            <td class="pt-pad"><div class="pt-case-arm">{{ r.arm }}</div><div class="pt-case-ru">{{ r.ru }}</div></td>
            <td v-for="v in r.vals" :key="v" class="pt-val">{{ v }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- ТАБЛИЦА 2: 3-е лицо -->
    <div class="pron-group-title" style="margin-top:32px">3-е лицо</div>
    <div class="pron-scroll">
      <table class="pt">
        <thead>
          <tr>
            <th class="pt-pad">Падеж</th>
            <th><div class="pt-arm">Նա</div><div class="pt-tr">Na</div><div class="pt-ru">Он / Она</div></th>
            <th><div class="pt-arm">Նրանք</div><div class="pt-tr">Nrank</div><div class="pt-ru">Они</div></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in rows3" :key="r.ru">
            <td class="pt-pad"><div class="pt-case-arm">{{ r.arm }}</div><div class="pt-case-ru">{{ r.ru }}</div></td>
            <td v-for="v in r.vals" :key="v" class="pt-val">{{ v }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="pron-note" style="margin-top:24px">
      Притяжательные артикли крепятся к концу слова: մayрс (моя мать), мayрд (твоя мать), мayрн (его/её мать).
    </div>
  </div>
</template>

<script setup>
const rows1 = [
  { arm: 'Ողղական',    ru: 'Именительный', vals: ['Ես',    'Մենք',  'Դու',    'Դոք']   },
  { arm: 'Սևռական',     ru: 'Родит. / Дат.',  vals: ['իմ',     'մեր',   'քո',    'դզեր']  },
  { arm: 'Հայցական',  ru: 'Винительный',   vals: ['ինդ',   'մեզ',   'կեզ',   'դզեզ']  },
  { arm: 'Բացառական',  ru: 'Исходный',      vals: ['ինդանից', 'մեզանից', 'կեզանից', 'դզեզանից'] },
  { arm: 'Գործիական',   ru: 'Творительный',  vals: ['ինդանով','մեզանով','կեզանով','դզեզանով'] },
  { arm: '',                    ru: 'Местный',       vals: ['—', '—', '—', '—'] },
]

const rows3 = [
  { arm: 'Ողղական',    ru: 'Именительный', vals: ['Նա',    'Նրանք']  },
  { arm: 'Սևռական',     ru: 'Родит. / Дат.',  vals: ['նրա',   'նրանց']  },
  { arm: 'Հայցական',  ru: 'Винительный',   vals: ['նրան',  'նրանց'] },
  { arm: 'Բացառական',  ru: 'Исходный',      vals: ['նրանից','նրանցից'] },
  { arm: 'Գործիական',   ru: 'Творительный',  vals: ['նրանով','նրանցով'] },
  { arm: '',                    ru: 'Местный',       vals: ['—', '—'] },
]
</script>

<style scoped>
.pron-wrap { padding-bottom: 40px; }
.pv-title {
  font-family:var(--d); font-size:clamp(26px,4vw,48px);
  font-weight:700; font-style:italic; color:var(--red);
  padding:28px 0 16px; border-bottom:2px solid var(--line);
  margin-bottom:16px; position:relative;
}
.pv-title::after {
  content:''; position:absolute; bottom:-3px; left:0; right:0;
  height:1px; background:var(--blue); opacity:.6;
}
.pron-note {
  font-family:var(--s); font-size:14px; color:var(--muted);
  font-style:italic; padding:10px 0; margin-bottom:20px;
}
.pron-group-title {
  font-family:var(--m); font-size:10px; letter-spacing:3px;
  text-transform:uppercase; color:var(--gold); margin-bottom:12px;
}
.pron-scroll { overflow-x:auto; }
.pt {
  border-collapse:collapse; width:100%;
  border:1px solid var(--line);
}
.pt thead th {
  background:var(--bg2);
  border:1px solid var(--line);
  padding:14px 20px;
  text-align:center;
  vertical-align:bottom;
}
.pt-pad {
  background:var(--ink) !important;
  color:var(--bg) !important;
  font-family:var(--m); font-size:9px; letter-spacing:2px;
  text-transform:uppercase;
  min-width:140px; width:140px;
  padding:12px 16px !important;
  text-align:left !important;
  vertical-align:middle !important;
}
.pt-arm {
  font-family:var(--d); font-size:24px; font-style:italic;
  color:var(--red); line-height:1.1; margin-bottom:4px;
}
.pt-tr { font-family:var(--m); font-size:9px; color:var(--muted); }
.pt-ru { font-family:var(--s); font-size:13px; color:var(--ink); margin-top:2px; }
.pt tbody tr:hover td { background:rgba(242,232,213,.9); }
.pt-case-arm {
  font-family:var(--d); font-size:13px; font-style:italic;
  color:var(--red); margin-bottom:3px;
}
.pt-case-ru {
  font-family:var(--m); font-size:9px; color:var(--bg);
  letter-spacing:1px;
}
.pt-val {
  font-family:var(--d); font-size:20px; font-style:italic;
  color:var(--ink); padding:12px 20px;
  border:1px solid var(--line);
  background:rgba(236,221,198,.7);
  text-align:center;
}
@media(max-width:768px) {
  .pt-pad { min-width:100px; width:100px; padding:10px 10px !important; }
  .pt-val { font-size:16px; padding:10px 12px; }
  .pt-arm { font-size:18px; }
}
</style>
