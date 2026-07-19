<template>
  <div class="lessons">
    <div v-if="lesson===1" class="lesson-page">
      <div class="lesson-header">
        <button class="lesson-back" @click="$emit('go-dict')">← В словарь</button>
        <div class="lesson-eyebrow">Դաս 1 · Урок 1</div>
        <h1 class="lesson-title">Հայոց Այբուբեն</h1>
        <p class="lesson-desc">Армянский алфавит — основа всего. 39 букв, каждая со своим характером.</p>
        <div class="lesson-nav">
          <span class="lesson-dot active"></span>
          <span class="lesson-dot" @click="lesson=2"></span>
        </div>
      </div>
      <div class="lesson-body">
        <div class="lesson-block">
          <div class="lb-title">Гласные · Ձայնավոր</div>
          <div class="lb-sub">9 гласных букв — основа слога</div>
          <div class="lb-letters">
            <div v-for="(l,i) in vowels" :key="i" class="lb-letter-card is-vowel">
              <div class="llc-big">{{ l.upper }}</div>
              <div class="llc-small">{{ l.lower }}</div>
              <div class="llc-sound">{{ l.sound }}</div>
            </div>
          </div>
        </div>
        <div class="lesson-block">
          <div class="lb-title">Согласные · Բաղդզայն</div>
          <div class="lb-sub">30 согласных букв</div>
          <div class="lb-letters">
            <div v-for="(l,i) in consonants" :key="i" class="lb-letter-card is-consonant">
              <div class="llc-big">{{ l.upper }}</div>
              <div class="llc-small">{{ l.lower }}</div>
              <div class="llc-sound">{{ l.sound }}</div>
            </div>
          </div>
        </div>
        <div class="lesson-block">
          <div class="lb-title">Важные особенности</div>
          <div class="lesson-tip" v-for="t in tips" :key="t.l">
            <span class="tip-letter">{{ t.l }}</span>
            <span>{{ t.t }}</span>
          </div>
        </div>
        <div class="lesson-next">
          <button class="lesson-next-btn" @click="lesson=2">Урок 2: Местоимения →</button>
        </div>
      </div>
    </div>

    <div v-else class="lesson-page">
      <div class="lesson-header">
        <button class="lesson-back" @click="lesson=1">← Урок 1</button>
        <div class="lesson-eyebrow">Դաս 2 · Урок 2</div>
        <h1 class="lesson-title">Դերանուններ</h1>
        <p class="lesson-desc">С местоимений начинается любое предложение.</p>
        <div class="lesson-nav">
          <span class="lesson-dot" @click="lesson=1"></span>
          <span class="lesson-dot active"></span>
        </div>
      </div>
      <div class="lesson-body">
        <div class="lesson-block">
          <div class="lb-title">Личные местоимения</div>
          <div class="pron-table">
            <div class="pt-header" v-for="h in pHeaders" :key="h">{{ h }}</div>
            <template v-for="p in pronouns" :key="p.arm">
              <div class="pt-cell">
                <div class="pt-arm">{{ p.arm }}</div>
                <div class="pt-tr">{{ p.tr }}</div>
                <div class="pt-ru">{{ p.ru }}</div>
              </div>
              <div class="pt-cell"><div class="pt-case">{{ p.gen }}</div></div>
              <div class="pt-cell"><div class="pt-case">{{ p.dat }}</div></div>
              <div class="pt-cell"><div class="pt-case">{{ p.ins }}</div></div>
            </template>
          </div>
        </div>
        <div class="lesson-block">
          <div class="lb-title">Примеры предложений</div>
          <div class="lesson-example" v-for="ex in examples" :key="ex.ru">
            <span class="ex-arm">{{ ex.arm }}</span>
            <span class="ex-tr">{{ ex.tr }}</span>
            <span class="ex-ru">{{ ex.ru }}</span>
          </div>
        </div>
        <div class="lesson-next">
          <button class="lesson-next-btn" @click="$emit('go-dict')">Перейти к словарю →</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
defineEmits(['go-dict'])
const lesson = ref(1)

const VOWEL_IDX = new Set([0,4,6,7,10,23,33,36,37])

const vowels = [
  { upper: 'Ա', lower: 'ա', sound: '[а]' },
  { upper: 'Ե', lower: 'ե', sound: '[е]' },
  { upper: 'Է', lower: 'է', sound: '[э]' },
  { upper: 'Ը', lower: 'ը', sound: '[ə]' },
  { upper: 'Ի', lower: 'ի', sound: '[и]' },
  { upper: 'Ո', lower: 'ո', sound: '[о]' },
  { upper: 'Ոու', lower: 'ու', sound: '[у]' },
  { upper: 'Եվ', lower: 'և', sound: '[ев]' },
  { upper: 'Օ', lower: 'օ', sound: '[о]' },
]

const consonants = [
  { upper: 'Բ', lower: 'բ', sound: '[б]' },
  { upper: 'Գ', lower: 'գ', sound: '[г]' },
  { upper: 'Դ', lower: 'դ', sound: '[д]' },
  { upper: 'Զ', lower: 'զ', sound: '[з]' },
  { upper: 'Թ', lower: 'թ', sound: '[т]' },
  { upper: 'Ժ', lower: 'ժ', sound: '[ж]' },
  { upper: 'Լ', lower: 'լ', sound: '[л]' },
  { upper: 'Խ', lower: 'խ', sound: '[х]' },
  { upper: 'Ծ', lower: 'ծ', sound: '[ц]' },
  { upper: 'Կ', lower: 'կ', sound: '[к]' },
  { upper: 'Հ', lower: 'հ', sound: '[h]' },
  { upper: 'Ձ', lower: 'ձ', sound: '[дз]' },
  { upper: 'Ղ', lower: 'ղ', sound: '[ğ]' },
  { upper: 'Ճ', lower: 'ճ', sound: '[ч]' },
  { upper: 'Մ', lower: 'մ', sound: '[м]' },
  { upper: 'Յ', lower: 'յ', sound: '[й]' },
  { upper: 'Ն', lower: 'ն', sound: '[н]' },
  { upper: 'Շ', lower: 'շ', sound: '[ш]' },
  { upper: 'Չ', lower: 'չ', sound: '[ч]' },
  { upper: 'Պ', lower: 'պ', sound: '[п]' },
  { upper: 'Ջ', lower: 'ջ', sound: '[дж]' },
  { upper: 'Ռ', lower: 'ռ', sound: '[р]' },
  { upper: 'Ս', lower: 'ս', sound: '[с]' },
  { upper: 'Վ', lower: 'վ', sound: '[в]' },
  { upper: 'Տ', lower: 'տ', sound: '[т]' },
  { upper: 'Ր', lower: 'ր', sound: '[р]' },
  { upper: 'Ց', lower: 'ց', sound: '[ц]' },
  { upper: 'Փ', lower: 'փ', sound: '[п]' },
  { upper: 'Ք', lower: 'ք', sound: '[к]' },
  { upper: 'Ֆ', lower: 'ֆ', sound: '[ф]' },
]

const tips = [
  { l: 'Ե', t: 'В начале слова читается как йе' },
  { l: 'Ո', t: 'В начале слова читается как во' },
  { l: 'Ու', t: 'Диграф — два знака, один звук у' },
  { l: 'Ղ', t: 'Глубокий звонкий гортанный звук' },
  { l: 'Թ Փ Ք', t: 'Придыхательные — с выдохом воздуха' },
]

const pHeaders = ['Именит.', 'Родит.', 'Дат./Вин.', 'Творит.']

const pronouns = [
  { arm: 'Ես', tr: 'Yes', ru: 'Я', gen: 'իմ', dat: 'ինդ', ins: 'ինդով' },
  { arm: 'Դու', tr: 'Du', ru: 'Ты', gen: 'կո', dat: 'կեզ', ins: 'կեզով' },
  { arm: 'Նա', tr: 'Na', ru: 'Он / Она', gen: 'նրա', dat: 'նրան', ins: 'նրանով' },
  { arm: 'Մենք', tr: 'Menk', ru: 'Мы', gen: 'մեր', dat: 'մեզ', ins: 'մեզով' },
  { arm: 'Դոք', tr: 'Duk', ru: 'Вы', gen: 'դզեր', dat: 'դզեզ', ins: 'դզեզով' },
  { arm: 'Նրանք', tr: 'Nrank', ru: 'Они', gen: 'նրանց', dat: 'նրանց', ins: 'նրանցով' },
]

const examples = [
  { arm: 'Ես կարոգում ևմ խոսել հայերեն', tr: 'Yes karogom yem khosel hayeren', ru: 'Я могу говорить по-армянски' },
  { arm: 'Դու հայաստանիծ ես՞', tr: 'Du hayastanits yes?', ru: 'Ты из Армении?' },
  { arm: 'Նա իմ ընկերն և', tr: 'Na im ynkern e', ru: 'Он мой друг' },
  { arm: 'Մենք րազոմ կատարեցինք', tr: 'Menk razom kataretsinq', ru: 'Мы сделали это вместе' },
]
</script>

<style scoped>
.lessons { min-height:100vh; position:relative; z-index:1; }
.lesson-page { max-width:800px; margin:0 auto; padding:0 56px 80px; }
.lesson-header { padding:48px 0 32px; border-bottom:3px solid var(--ink); margin-bottom:48px; position:relative; border-top:4px solid var(--blue); box-shadow:inset 0 3px 0 var(--gold); }
.lesson-header::after { content:''; position:absolute; bottom:-4px; left:0; right:0; height:1px; background:var(--gold); opacity:.5; }
.lesson-back { font-family:var(--m); font-size:10px; letter-spacing:2px; text-transform:uppercase; color:var(--muted); background:transparent; border:1px solid var(--line); padding:7px 16px; cursor:pointer; transition:.15s var(--spring); margin-bottom:20px; display:inline-block; }
.lesson-back:hover { color:var(--ink); border-color:var(--gold); }
.lesson-eyebrow { font-family:var(--m); font-size:10px; letter-spacing:4px; text-transform:uppercase; color:var(--gold); margin-bottom:10px; }
.lesson-title { font-family:var(--d); font-size:clamp(48px,8vw,88px); font-weight:700; font-style:italic; line-height:1; letter-spacing:-2px; color:var(--red); margin-bottom:14px; }
.lesson-desc { font-family:var(--s); font-size:18px; color:var(--muted); font-style:italic; line-height:1.6; max-width:560px; }
.lesson-nav { display:flex; gap:8px; margin-top:20px; }
.lesson-dot { width:28px; height:3px; background:var(--line); cursor:pointer; transition:.2s var(--spring); }
.lesson-dot.active { background:var(--red); }
.lesson-block { margin-bottom:48px; padding-bottom:40px; border-bottom:1px solid var(--line); }
.lb-title { font-family:var(--d); font-size:28px; font-weight:700; font-style:italic; color:var(--ink); margin-bottom:6px; }
.lb-sub   { font-family:var(--m); font-size:10px; letter-spacing:2px; text-transform:uppercase; color:var(--muted); margin-bottom:20px; }
.lb-letters { display:flex; flex-wrap:wrap; gap:10px; }
.lb-letter-card { border:1px solid var(--line); padding:14px 16px; min-width:72px; text-align:center; transition:.15s var(--spring); background:var(--glass-bg); border-color:var(--glass-border);box-shadow:inset 0 1px 0 var(--glass-shine),0 4px 16px var(--glass-shadow);backdrop-filter:var(--glass-blur);-webkit-backdrop-filter:var(--glass-blur);}
.lb-letter-card.is-vowel .llc-big { color:var(--vowel); }
.lb-letter-card.is-consonant .llc-big { color:var(--consonant); }
.llc-big   { font-family:var(--d); font-size:40px; font-weight:700; line-height:1; }
.llc-small { font-family:var(--d); font-size:24px; opacity:.45; }
.llc-sound { font-family:var(--m); font-size:11px; color:var(--muted); margin-top:4px; }
.lesson-tip { display:flex; align-items:baseline; gap:16px; padding:12px 0; border-bottom:1px solid var(--line); font-family:var(--s); font-size:16px; color:var(--ink); line-height:1.5; }
.tip-letter { font-family:var(--d); font-size:28px; font-weight:700; color:var(--red); flex-shrink:0; min-width:60px; }
.pron-table { display:grid; grid-template-columns:1fr 1fr 1fr 1fr; border-left:1px solid var(--line); border-top:1px solid var(--line); }
.pt-header  { background:var(--ink); color:var(--bg); font-family:var(--m); font-size:9px; letter-spacing:2px; text-transform:uppercase; padding:10px 14px; border-right:1px solid var(--line); border-bottom:1px solid var(--line); }
.pt-cell    { padding:12px 14px; border-right:1px solid var(--line); border-bottom:1px solid var(--line); background:var(--glass-bg); border-color:var(--glass-border);box-shadow:inset 0 1px 0 var(--glass-shine),0 4px 16px var(--glass-shadow);backdrop-filter:var(--glass-blur);-webkit-backdrop-filter:var(--glass-blur);}
.pt-arm     { font-family:var(--d); font-size:22px; font-style:italic; color:var(--red); }
.pt-tr      { font-family:var(--m); font-size:10px; color:var(--muted); margin-top:2px; }
.pt-ru      { font-family:var(--s); font-size:14px; color:var(--ink); margin-top:2px; }
.pt-case    { font-family:var(--d); font-size:18px; color:var(--ink); font-style:italic; }
.lesson-example { display:grid; grid-template-columns:1fr 1fr 1fr; gap:0; border-bottom:1px solid var(--line); padding:14px 0; }
.lesson-example:first-child { border-top:1px solid var(--line); }
.ex-arm { font-family:var(--d); font-size:18px; font-style:italic; color:var(--red); }
.ex-tr  { font-family:var(--m); font-size:11px; color:var(--muted); align-self:center; }
.ex-ru  { font-family:var(--s); font-size:15px; color:var(--ink); align-self:center; }
.lesson-next { text-align:center; padding-top:40px; }
.lesson-next-btn { font-family:var(--d); font-size:18px; font-style:italic; color:var(--bg); background:var(--ink); border:none; padding:16px 48px; cursor:pointer; transition:background .2s; }
.lesson-next-btn:hover { background:var(--red); }
@media(max-width:640px) {
  .lesson-page { padding:0 16px 60px; }
  .pron-table { grid-template-columns:1fr 1fr; }
  .lesson-example { grid-template-columns:1fr; gap:4px; }
}
</style>
