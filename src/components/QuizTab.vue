<template>
  <div class="quiz-wrap">
    <div class="q-stats">
      <div class="qstat"><div class="qsn">{{ score }}</div><div class="qsl">правильно</div></div>
      <div class="qstat"><div class="streak">{{ streak >= 3 ? streak + ' 🔥' : '' }}</div></div>
      <div class="qstat"><div class="qsn" style="font-size:26px;color:var(--muted)">{{ total }}</div><div class="qsl">всего</div></div>
    </div>
    <div class="timer-track"><div class="timer-bar" :style="{width: timerPct+'%', background: timerPct < 35 ? 'var(--red)' : 'var(--ok)'}"></div></div>
    <div class="qcard" v-if="current">
      <div class="qlabel">Переведи на русский</div>
      <div class="qword">{{ current.arm }}
        <button class="qplay" :title="playTitle" @click.stop="playWord(current)">▶</button>
      </div>
      <div class="qtr">{{ current.translit }}</div>
      <div class="qfb" :class="fb.cls">{{ fb.text }}</div>
    </div>
    <div class="q-opts">
      <button v-for="opt in opts" :key="opt.id"
        class="qopt" :class="{ok: answered && opt.id===current.id, bad: answered && chosen===opt.id && opt.id!==current.id}"
        :disabled="answered"
        @click="check(opt)">{{ opt.ru }}</button>
    </div>
    <button class="qnext" v-if="answered" @click="next">Следующее слово →</button>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { useSpeech } from '../composables/useSpeech.js'
const props = defineProps({ words: Array })
const { playWord, hasArmenianVoice } = useSpeech()
const playTitle = computed(() => hasArmenianVoice.value
  ? 'Прослушать произношение'
  : 'Армянский голос не найден в браузере — приближённое произношение')

const score = ref(0), total = ref(0), streak = ref(0)
const current = ref(null), opts = ref([]), answered = ref(false), chosen = ref(null)
const fb = ref({text:'',cls:''})
const timerPct = ref(100)
let timerVal = 15, timerInterval = null

function rand(arr) { return [...arr].sort(() => Math.random()-.5) }

function next() {
  clearInterval(timerInterval)
  answered.value = false; chosen.value = null; fb.value = {text:'',cls:''}
  const pool = rand(props.words)
  current.value = pool[0]
  opts.value = rand([pool[0], ...pool.slice(1,4)])
  playWord(current.value)
  timerVal = 15; timerPct.value = 100
  timerInterval = setInterval(() => {
    timerVal--; timerPct.value = timerVal / 15 * 100
    if (timerVal <= 0) { clearInterval(timerInterval); if (!answered.value) check(null) }
  }, 1000)
}

function check(opt) {
  if (answered.value) return
  answered.value = true; chosen.value = opt?.id; total.value++
  clearInterval(timerInterval)
  if (opt?.id === current.value.id) {
    score.value++; streak.value++
    fb.value = {text: rand(['Правильно!','Верно!','Отлично!'])[0], cls:'ok'}
  } else {
    streak.value = 0
    fb.value = {text: opt ? `Нет — это «${current.value.ru}»` : `Время! Это «${current.value.ru}»`, cls:'bad'}
  }
}

onUnmounted(() => clearInterval(timerInterval))
next()
</script>

<style scoped>
.quiz-wrap { max-width:600px; margin:0 auto; }
.q-stats { display:grid; grid-template-columns:1fr 1fr 1fr; border:1px solid var(--line); margin-bottom:16px; }
.qstat { padding:20px; border-right:1px solid var(--line); text-align:center; }
.qstat:last-child { border-right:none; }
.qsn { font-family:var(--d); font-size:56px; font-weight:700; line-height:1; color:var(--red); }
.qsl { font-family:var(--m); font-size:10px; letter-spacing:2px; text-transform:uppercase; color:var(--muted); margin-top:4px; }
.streak { font-family:var(--d); font-size:18px; font-style:italic; color:var(--gold); }
.timer-track { height:3px; background:var(--line); margin-bottom:20px; }
.timer-bar { height:100%; transition:width .1s linear, background .3s; }
.qcard { border:1px solid var(--line); border-top:3px solid var(--red); padding:32px 20px; text-align:center; background:var(--glass-bg); margin-bottom:20px; position:relative; overflow:hidden; border-color:var(--glass-border);box-shadow:inset 0 1px 0 var(--glass-shine),0 4px 16px var(--glass-shadow);}
.qcard::before,.qcard::after { content:'✦'; position:absolute; font-size:10px; color:var(--gold); opacity:.6; }
.qcard::before { top:8px; left:12px; } .qcard::after { bottom:8px; right:12px; }
.qlabel { font-family:var(--m); font-size:10px; letter-spacing:3px; text-transform:uppercase; color:var(--muted); margin-bottom:20px; }
.qword  { font-family:var(--d); font-size:clamp(36px,10vw,76px); font-weight:700; font-style:italic; line-height:1; color:var(--red); word-break:break-word; overflow-wrap:break-word; max-width:100%; display:flex; align-items:center; justify-content:center; gap:14px; }
.qplay {
  width:36px; height:36px; border-radius:50%; flex-shrink:0;
  border:1px solid var(--line); background:transparent;
  font-size:13px; color:var(--muted); cursor:pointer;
  display:flex; align-items:center; justify-content:center; padding-left:2px;
  transition:.15s var(--spring);
}
.qplay:hover { border-color:var(--gold); color:var(--gold); }
.qtr    { font-family:var(--m); font-size:14px; color:var(--muted); font-style:italic; margin-top:8px; }
.qfb    { font-family:var(--d); font-size:22px; font-style:italic; height:30px; margin-top:10px; transition:.2s var(--spring); }
.qfb.ok { color:var(--ok); } .qfb.bad { color:var(--red); }
.q-opts { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
.qopt { padding:18px 14px; border:1px solid var(--line); background:var(--glass-bg); font-family:var(--s); font-size:16px; color:var(--ink); cursor:pointer; transition:.14s var(--spring); text-align:center; border-color:var(--glass-border);box-shadow:inset 0 1px 0 var(--glass-shine),0 4px 16px var(--glass-shadow);}
.qopt:hover:not(:disabled) { border-color:var(--gold); background:var(--glass-bg); border-color:var(--glass-border);box-shadow:inset 0 1px 0 var(--glass-shine),0 4px 16px var(--glass-shadow);}
.qopt.ok  { border-color:var(--ok);  background:rgba(42,94,58,.08);  color:var(--ok);  }
.qopt.bad { border-color:var(--red); background:rgba(140,28,28,.08); color:var(--red); }
.qopt:disabled { cursor:default; }
.qnext { display:block; width:100%; padding:18px; background:var(--ink); border:none; color:var(--bg); font-family:var(--s); font-size:16px; font-style:italic; cursor:pointer; transition:.15s var(--spring); margin-top:12px; }
.qnext:hover { background:var(--red); }
</style>
