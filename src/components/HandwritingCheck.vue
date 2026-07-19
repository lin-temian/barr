<template>
  <div class="hw">
    <div class="hw-label">✦ Напиши букву пальцем</div>

    <div class="hw-case-tabs" v-if="lower && lower !== upper">
      <button class="hw-case-btn" :class="{on: caseMode==='upper'}" @click="setCase('upper')">Заглавная</button>
      <button class="hw-case-btn" :class="{on: caseMode==='lower'}" @click="setCase('lower')">Строчная</button>
    </div>

    <div class="hw-canvas-wrap">
      <canvas ref="guideCanvasEl" class="hw-canvas hw-guide" width="240" height="240"></canvas>
      <canvas ref="inkCanvasEl" class="hw-canvas hw-ink" width="240" height="240"
        @pointerdown="onDown" @pointermove="onMove" @pointerup="onUp" @pointerleave="onUp" @pointercancel="onUp">
      </canvas>
    </div>

    <div class="hw-btns">
      <button class="hw-btn" @click="clearInk">Очистить</button>
      <button class="hw-btn primary" @click="check" :disabled="empty">Проверить</button>
    </div>

    <transition name="hw-fade">
      <div v-if="result !== null" class="hw-result" :class="resultClass">
        <div class="hw-score">{{ result }}%</div>
        <div class="hw-fb">{{ feedback }}</div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'

const props = defineProps({ upper: String, lower: String })

const caseMode = ref('upper')
const target = computed(() => (caseMode.value === 'lower' && props.lower) ? props.lower : props.upper)

const guideCanvasEl = ref(null)
const inkCanvasEl   = ref(null)
const drawing = ref(false)
const empty   = ref(true)
const result  = ref(null)

function drawGlyph(canvas, letter, color) {
  const ctx = canvas.getContext('2d')
  const w = canvas.width, h = canvas.height
  ctx.clearRect(0, 0, w, h)
  if (!letter) return
  ctx.font = `${Math.floor(h * 0.72)}px "Noto Serif Armenian", serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = color
  ctx.fillText(letter, w / 2, h / 2 + h * 0.02)
}

function renderGuide() {
  if (guideCanvasEl.value) drawGlyph(guideCanvasEl.value, target.value, 'rgba(128,6,19,.16)')
}

function clearInk() {
  if (!inkCanvasEl.value) return
  const ctx = inkCanvasEl.value.getContext('2d')
  ctx.clearRect(0, 0, inkCanvasEl.value.width, inkCanvasEl.value.height)
  empty.value = true
  result.value = null
}

function setCase(c) {
  caseMode.value = c
  clearInk()
  nextTick(renderGuide)
}

let lastX = 0, lastY = 0
function pos(e) {
  const rect = inkCanvasEl.value.getBoundingClientRect()
  const scaleX = inkCanvasEl.value.width / rect.width
  const scaleY = inkCanvasEl.value.height / rect.height
  return [(e.clientX - rect.left) * scaleX, (e.clientY - rect.top) * scaleY]
}
function onDown(e) {
  e.preventDefault()
  inkCanvasEl.value.setPointerCapture(e.pointerId)
  drawing.value = true
  result.value = null
  ;[lastX, lastY] = pos(e)
}
function onMove(e) {
  if (!drawing.value) return
  e.preventDefault()
  const ctx = inkCanvasEl.value.getContext('2d')
  const [x, y] = pos(e)
  ctx.strokeStyle = '#3a2418'
  ctx.lineWidth = 16
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.beginPath()
  ctx.moveTo(lastX, lastY)
  ctx.lineTo(x, y)
  ctx.stroke()
  lastX = x; lastY = y
  empty.value = false
}
function onUp() { drawing.value = false }

function getMask(canvas, threshold = 10) {
  const ctx = canvas.getContext('2d')
  const { width: w, height: h } = canvas
  const data = ctx.getImageData(0, 0, w, h).data
  const mask = new Uint8Array(w * h)
  for (let i = 0, p = 0; i < data.length; i += 4, p++) mask[p] = data[i + 3] > threshold ? 1 : 0
  return mask
}
function dilated(canvas, radius) {
  const out = document.createElement('canvas')
  out.width = canvas.width; out.height = canvas.height
  const octx = out.getContext('2d')
  octx.filter = `blur(${radius}px)`
  octx.drawImage(canvas, 0, 0)
  return out
}

// Сравнение через покрытие (coverage) и точность (precision) —
// оба маска рисунка и маска буквы "размываются" на небольшой радиус,
// чтобы прощать неидеальное совпадение толщины штриха пальцем.
function check() {
  if (empty.value) return
  const targetCanvas = document.createElement('canvas')
  targetCanvas.width = inkCanvasEl.value.width
  targetCanvas.height = inkCanvasEl.value.height
  drawGlyph(targetCanvas, target.value, '#000')

  const targetMask    = getMask(targetCanvas)
  const targetDilMask = getMask(dilated(targetCanvas, 10), 4)
  const userMask       = getMask(inkCanvasEl.value)
  const userDilMask    = getMask(dilated(inkCanvasEl.value, 10), 4)

  let targetCount = 0, coverHits = 0, userCount = 0, precHits = 0
  for (let p = 0; p < targetMask.length; p++) {
    if (targetMask[p]) { targetCount++; if (userDilMask[p]) coverHits++ }
    if (userMask[p])   { userCount++;   if (targetDilMask[p]) precHits++ }
  }
  const coverage  = targetCount ? coverHits / targetCount : 0
  const precision = userCount ? precHits / userCount : 0
  result.value = (coverage + precision) > 0
    ? Math.round(2 * coverage * precision / (coverage + precision) * 100)
    : 0
}

const feedback = computed(() => {
  if (result.value === null) return ''
  if (result.value >= 80) return 'Отлично! Чётко и по форме 🎯'
  if (result.value >= 55) return 'Неплохо — попробуй ещё точнее'
  return 'Не совсем похоже — обведи форму буквы ещё раз'
})
const resultClass = computed(() => result.value === null ? '' : (result.value >= 55 ? 'ok' : 'bad'))

onMounted(() => {
  if (document.fonts?.ready) document.fonts.ready.then(renderGuide)
  else renderGuide()
})
watch(() => [props.upper, props.lower], () => { clearInk(); nextTick(renderGuide) })
</script>

<style scoped>
.hw { background:var(--glass-bg); border:1px solid var(--line); border-radius:16px; padding:20px; margin-top:16px; text-align:center; border-color:var(--glass-border);box-shadow:inset 0 1px 0 var(--glass-shine),0 4px 16px var(--glass-shadow);backdrop-filter:var(--glass-blur);-webkit-backdrop-filter:var(--glass-blur); }
.hw-label { font-family:var(--m); font-size:9px; letter-spacing:2px; text-transform:uppercase; color:var(--blue); margin-bottom:14px; }
.hw-case-tabs { display:flex; justify-content:center; gap:6px; margin-bottom:14px; }
.hw-case-btn { padding:6px 14px; border:1px solid var(--line); border-radius:16px; background:transparent; font-family:var(--m); font-size:10px; letter-spacing:1px; color:var(--muted); cursor:pointer; transition:.15s var(--spring); }
.hw-case-btn.on { background:var(--red); border-color:var(--red); color:var(--on-accent); }
.hw-canvas-wrap { position:relative; width:100%; max-width:240px; aspect-ratio:1/1; margin:0 auto; border-radius:16px; overflow:hidden; border:1.5px dashed var(--line2); background:var(--bg); }
.hw-canvas { position:absolute; inset:0; width:100%; height:100%; touch-action:none; }
.hw-ink { cursor:crosshair; }
.hw-btns { display:flex; gap:10px; justify-content:center; margin-top:16px; }
.hw-btn { padding:10px 20px; border-radius:12px; border:1px solid var(--line); background:var(--glass-bg); font-family:var(--s); font-size:13px; font-weight:600; color:var(--ink); cursor:pointer; transition:.15s var(--spring); }
.hw-btn:hover { border-color:var(--gold); }
.hw-btn.primary { background:var(--red); border-color:var(--red); color:var(--on-accent); }
.hw-btn.primary:hover { opacity:.9; }
.hw-btn:disabled { opacity:.5; cursor:not-allowed; }
.hw-result { margin-top:14px; padding:12px; border-radius:12px; }
.hw-result.ok  { background:rgba(42,94,58,.1); }
.hw-result.bad { background:rgba(128,6,19,.08); }
.hw-score { font-family:var(--d); font-size:28px; font-style:italic; font-weight:700; }
.hw-result.ok .hw-score  { color:var(--ok); }
.hw-result.bad .hw-score { color:var(--red); }
.hw-fb { font-family:var(--s); font-size:12px; color:var(--muted); margin-top:2px; }
.hw-fade-enter-active { transition:opacity .2s; }
.hw-fade-enter-from { opacity:0; }

[data-theme=dark] .hw, [data-theme=amoled] .hw { background:rgba(24,16,8,.94) !important; border-color:rgba(246,140,54,.2) !important; }
[data-theme=dark] .hw-canvas-wrap, [data-theme=amoled] .hw-canvas-wrap { background:#0a0804; border-color:rgba(246,140,54,.25); }
</style>
