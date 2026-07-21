<template>
  <div class="cloze-wrap" v-if="pool.length">
    <div class="cz-hd"><h2>Предложения</h2><p>Вставь пропущенное слово по смыслу</p></div>
    <div class="czcard" v-if="current">
      <div class="czlabel">Заполни пропуск</div>
      <div class="czsent" v-html="blankedSentence"></div>
      <div class="czru">{{ current.exampleRu }}</div>
      <div class="czfb" :class="fb.cls">{{ fb.text }}</div>
    </div>
    <div class="cz-opts">
      <button v-for="opt in opts" :key="opt.id"
        class="czopt" :class="{ok: answered && opt.id===current.id, bad: answered && chosen===opt.id && opt.id!==current.id}"
        :disabled="answered"
        @click="check(opt)">{{ opt.arm }}</button>
    </div>
    <button class="cznext" v-if="answered" @click="next">Следующее предложение →</button>
  </div>

  <div class="cloze-empty" v-else>
    <div class="cloze-empty-icon">✍️</div>
    <div class="cloze-empty-text">Упражнения с предложениями скоро появятся</div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
const props = defineProps({ words: Array })

// только слова с примером-предложением, где само слово реально встречается в тексте
const pool = computed(() => props.words.filter(w => w.exampleAm && w.exampleAm.includes(w.arm)))

const current  = ref(null)
const opts     = ref([])
const answered = ref(false)
const chosen   = ref(null)
const fb       = ref({ text: '', cls: '' })

function rand(arr) { return [...arr].sort(() => Math.random() - .5) }

function distractorsFor(word) {
  const sameCat = pool.value.filter(w => w.cat === word.cat && w.id !== word.id)
  const source  = sameCat.length >= 3 ? sameCat : pool.value.filter(w => w.id !== word.id)
  return rand(source).slice(0, 3)
}

function next() {
  answered.value = false; chosen.value = null; fb.value = { text: '', cls: '' }
  if (!pool.value.length) { current.value = null; return }
  current.value = rand(pool.value)[0]
  opts.value = rand([current.value, ...distractorsFor(current.value)])
}

const blankedSentence = computed(() => {
  if (!current.value) return ''
  return current.value.exampleAm.split(current.value.arm).join('<span class="cz-blank">______</span>')
})

function check(opt) {
  if (answered.value) return
  answered.value = true
  chosen.value = opt.id
  fb.value = opt.id === current.value.id
    ? { text: rand(['Правильно!', 'Верно!', 'Отлично!'])[0], cls: 'ok' }
    : { text: `Нет — правильно «${current.value.arm}»`, cls: 'bad' }
}

if (pool.value.length) next()
</script>

<style scoped>
.cloze-wrap { max-width: 600px; margin: 0 auto; }
.cz-hd { margin-bottom: 16px; }
.cz-hd h2 { font-family: var(--d); font-size: clamp(22px,3vw,32px); font-weight: 400; color: var(--red); }
.cz-hd p  { font-size: 13px; color: var(--muted); font-style: italic; margin-top: 4px; }

.czcard {
  border: 1.5px solid var(--line2); border-top: 3px solid var(--blue); border-radius: 20px;
  padding: 28px 20px; text-align: center; background: var(--glass-bg); margin-bottom: 16px;
  position: relative; overflow: hidden;
  box-shadow: inset 0 1px 0 var(--glass-shine), 0 4px 16px var(--glass-shadow);
  backdrop-filter: var(--glass-blur); -webkit-backdrop-filter: var(--glass-blur);
}
.czlabel { font-family: var(--m); font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: var(--muted); margin-bottom: 18px; }
.czsent  { font-family: var(--d); font-size: clamp(18px,3.5vw,26px); font-style: italic; color: var(--ink); line-height: 1.6; }
.czsent :deep(.cz-blank) { color: var(--blue); font-weight: 700; border-bottom: 2px solid var(--blue); }
.czru    { font-family: var(--s); font-size: 13px; color: var(--muted); margin-top: 10px; }
.czfb    { font-family: var(--d); font-size: 20px; font-style: italic; height: 28px; margin-top: 10px; transition: .2s var(--spring); }
.czfb.ok { color: var(--ok); } .czfb.bad { color: var(--red); }

.cz-opts { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.czopt {
  padding: 16px 14px; border: 1.5px solid var(--line2); border-radius: 14px;
  background: var(--glass-bg); font-family: var(--d); font-size: 18px; font-style: italic; color: var(--ink);
  cursor: pointer; transition: .14s var(--spring); text-align: center;
  box-shadow: inset 0 1px 0 var(--glass-shine), 0 4px 16px var(--glass-shadow);
  backdrop-filter: var(--glass-blur); -webkit-backdrop-filter: var(--glass-blur);
}
.czopt:hover:not(:disabled) { border-color: var(--blue); box-shadow: 0 0 0 2px rgba(35,88,138,.18), inset 0 1px 0 var(--glass-shine), 0 4px 16px var(--glass-shadow); }
.czopt.ok  { border-color: var(--ok);  background: rgba(42,94,58,.08);  color: var(--ok);  box-shadow: 0 0 0 2px rgba(42,94,58,.2); }
.czopt.bad { border-color: var(--red); background: rgba(128,6,19,.08); color: var(--red); box-shadow: 0 0 0 2px rgba(128,6,19,.15); }
.czopt:disabled { cursor: default; }

.cznext {
  display: block; width: 100%; padding: 16px; background: var(--ink); border: 1.5px solid var(--ink);
  border-radius: 14px; color: var(--bg); font-family: var(--s); font-size: 15px; font-style: italic;
  cursor: pointer; transition: .15s var(--spring); margin-top: 12px;
}
.cznext:hover { background: var(--blue); border-color: var(--blue); }

.cloze-empty { text-align: center; padding: 32px 20px; color: var(--muted); }
.cloze-empty-icon { font-size: 32px; margin-bottom: 8px; }
.cloze-empty-text { font-family: var(--s); font-size: 13px; font-style: italic; }
</style>
