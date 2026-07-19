<template>
  <div class="splash">
    <div class="splash-ornament">✦ ❧ ✦</div>
    <div class="arev-char">֎</div>
    <h1 class="splash-title">Բառ</h1>
    <p class="splash-sub">Армянский язык</p>
    <div class="splash-btns">
      <button class="splash-btn splash-btn-learn" @click="$emit('go-learn')">
        <span>{{ isArm ? armLearn : ruLearn }}</span>
      </button>
      <button class="splash-btn splash-btn-dict" @click="$emit('go-dict')">
        <span>{{ isArm ? armDict : ruDict }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

defineEmits(['go-dict', 'go-learn'])

const armLearn = 'Սովորենք Հայերեն միասին'
const ruLearn  = 'Учим армянский вместе'
const armDict  = 'Բառարան'
const ruDict   = 'Словарь'

// Proper Armenian
const s = '\u054D', o = '\u0578', v = '\u057E', r = '\u0580'
const e = '\u0565', n = '\u0576', q = '\u0584', H = '\u0540'
const a = '\u0561', y = '\u0575', m = '\u0574', ii= '\u056B'
const ss= '\u057D', B = '\u0532', rr= '\u057C'

const armLearnCorrect = 'Սովորենք Հայերեն միասին'
const armDictCorrect  = 'Բառարան'

const isArm = ref(true)
let timer = null

onMounted(() => {
  timer = setInterval(() => { isArm.value = !isArm.value }, 3000)
})
onUnmounted(() => clearInterval(timer))
</script>

<style scoped>
.splash {
  position: fixed; inset: 0; z-index: 9000;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 0;
}
.splash::after {
  content: ''; position: absolute;
  inset: 24px; pointer-events: none;
  border: 1px solid var(--gold); opacity: .35;
  box-shadow: inset 0 0 0 4px rgba(231,220,208,.6), inset 0 0 0 5px var(--gold);
}
.splash-ornament {
  font-size: 13px; letter-spacing: 12px;
  color: var(--gold); opacity: .7;
  font-family: var(--s); margin-bottom: 16px;
  position: relative; z-index: 1;
}
.arev-char {
  font-size: clamp(100px,18vw,160px); line-height: 1;
  margin-bottom: 24px; color: var(--red);
  display: inline-block; position: relative; z-index: 1;
  animation: arev-appear .8s cubic-bezier(.34,1.56,.64,1) both,
             arev-spin 8s linear .8s infinite;
}
.splash-title {
  font-family: var(--d); font-size: clamp(72px,14vw,120px);
  font-weight: 700; font-style: italic; line-height: 1;
  letter-spacing: -3px; color: var(--red);
  position: relative; z-index: 1;
  animation: fadeUp .6s .5s both;
}
.splash-sub {
  font-family: var(--m); font-size: 11px; letter-spacing: 5px;
  text-transform: uppercase; color: var(--muted);
  margin-top: 10px; margin-bottom: 48px;
  position: relative; z-index: 1;
  animation: fadeUp .6s .7s both;
}
.splash-btns {
  display: flex; flex-direction: column; gap: 14px; align-items: center;
  position: relative; z-index: 1;
  animation: fadeUp .6s .95s both;
}
.splash-btn {
  font-family: var(--d); font-size: clamp(15px,2vw,19px); font-style: italic;
  border: none; padding: 16px 52px; cursor: pointer;
  letter-spacing: .5px; min-width: 300px; text-align: center;
  transition: background .2s, color .2s, transform .15s;
}
.splash-btn span { transition: opacity .2s; display: block; }
.splash-btn:active { transform: scale(.98); }
.splash-btn-learn { color: var(--on-accent); background: var(--red); }
.splash-btn-learn:hover { background: var(--ink); }
.splash-btn-dict {
  color: var(--red); background: transparent;
  border: 2px solid var(--red);
}
.splash-btn-dict:hover { background: var(--red); color: var(--on-accent); }

@keyframes arev-spin   { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
@keyframes arev-appear { from{opacity:0;transform:scale(.5) rotate(-60deg)} to{opacity:1;transform:scale(1) rotate(0deg)} }
@keyframes fadeUp      { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }
</style>
