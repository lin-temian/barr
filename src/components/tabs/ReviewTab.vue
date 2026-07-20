<template>
  <div class="review">
    <button class="rv-back" @click="$emit('go-tab','home')">← На главную</button>

    <div v-if="queue.length === 0" class="rv-empty">
      <div class="rv-empty-icon">✓</div>
      <div class="rv-empty-title">Нечего повторять</div>
      <div class="rv-empty-text">Все выученные слова ещё свежи в памяти. Загляни попозже.</div>
    </div>

    <div v-else-if="done" class="rv-done">
      <div class="rv-done-icon">🎉</div>
      <div class="rv-done-title">Готово!</div>
      <div class="rv-done-text">Повторено слов: {{ queue.length }}</div>
      <button class="rv-done-btn" @click="$emit('go-tab','home')">На главную</button>
    </div>

    <div v-else class="rv-session">
      <div class="rv-progress">
        <span class="rv-progress-lbl">{{ idx+1 }} из {{ queue.length }}</span>
        <div class="rv-bar"><div class="rv-fill" :style="{width: (idx/queue.length*100)+'%'}"></div></div>
      </div>

      <div class="rv-card" @click="!revealed && (revealed = true)">
        <div class="rv-cat">{{ current.cat }}</div>
        <div class="rv-arm">{{ current.arm }}
          <button class="rv-play" v-if="current.audioUrl" title="Прослушать произношение" @click.stop="playWord(current)">▶</button>
        </div>
        <div class="rv-tr">{{ current.translit }}</div>
        <transition name="rv-fade" mode="out-in">
          <div v-if="revealed" key="ru" class="rv-ru">{{ current.ru }}</div>
          <div v-else key="tap" class="rv-tap">нажми — узнай перевод</div>
        </transition>
      </div>

      <div class="rv-actions" :class="{visible: revealed}">
        <button class="rv-btn rv-no" @click="mark(false)">Не помню</button>
        <button class="rv-btn rv-yes" @click="mark(true)">Помню</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onActivated } from 'vue'
import { useSpeech } from '../../composables/useSpeech.js'

const props = defineProps({ words: Array })
const emit  = defineEmits(['review','go-tab'])
const { playWord } = useSpeech()

const queue    = ref([])
const idx      = ref(0)
const revealed = ref(false)

onActivated(() => {
  queue.value = [...props.words]
  idx.value = 0
  revealed.value = false
})

const current = computed(() => queue.value[idx.value])
const done    = computed(() => idx.value >= queue.value.length)

function mark(remembered) {
  emit('review', current.value.id, remembered)
  idx.value++
  revealed.value = false
}
</script>

<style scoped>
.review { padding: 16px; display: flex; flex-direction: column; gap: 18px; min-height: 70vh; }

.rv-back {
  background:var(--glass-bg); border: 1px solid var(--line); border-radius: 20px;
  font-family: var(--m); font-size: 10px;
  letter-spacing: 1px; text-transform: uppercase; color: var(--muted);
  cursor: pointer; padding: 8px 14px; align-self: flex-start; transition:.15s var(--spring);
  border-color:var(--glass-border);box-shadow:inset 0 1px 0 var(--glass-shine),0 4px 16px var(--glass-shadow);
}
.rv-back:hover { color: var(--red); border-color: var(--gold); }

.rv-progress { display:flex; flex-direction:column; gap:8px; }
.rv-progress-lbl { font-family:var(--m); font-size:10px; letter-spacing:1px; text-transform:uppercase; color:var(--muted); }
.rv-bar { height:6px; background:rgba(128,6,19,.15); border-radius:3px; }
.rv-fill { height:100%; background:var(--red); border-radius:3px; transition:width .3s var(--spring-soft); }

.rv-card {
  flex:1; min-height:260px;
  background:var(--glass-bg); border:1px solid var(--line); border-radius:20px;
  padding:32px 24px; cursor:pointer;
  display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; gap:6px;
  border-color:var(--glass-border);box-shadow:inset 0 1px 0 var(--glass-shine),0 4px 16px var(--glass-shadow);
}
.rv-cat { font-family:var(--m); font-size:9px; letter-spacing:2px; text-transform:uppercase; color:var(--gold); margin-bottom:10px; }
.rv-arm { font-family:var(--d); font-size:56px; font-style:italic; color:var(--red); line-height:1; display:flex; align-items:center; justify-content:center; gap:12px; }
.rv-play {
  width:34px; height:34px; border-radius:50%; flex-shrink:0;
  border:1px solid var(--line); background:transparent;
  font-size:13px; color:var(--muted); cursor:pointer;
  display:flex; align-items:center; justify-content:center; padding-left:2px;
  transition:.15s var(--spring);
}
.rv-play:hover { border-color:var(--gold); color:var(--gold); }
.rv-tr  { font-family:var(--m); font-size:13px; color:var(--muted); margin-top:6px; }
.rv-tap { font-family:var(--s); font-size:12px; color:var(--muted); margin-top:14px; font-style:italic; opacity:.7; }
.rv-ru  { font-family:var(--d); font-size:32px; font-weight:700; color:var(--ink); margin-top:14px; }
.rv-fade-enter-active, .rv-fade-leave-active { transition: opacity .18s; }
.rv-fade-enter-from, .rv-fade-leave-to { opacity:0; }

.rv-actions { display:grid; grid-template-columns:1fr 1fr; gap:12px; opacity:0; pointer-events:none; transition:opacity .2s; }
.rv-actions.visible { opacity:1; pointer-events:auto; }
.rv-btn {
  padding:16px; border-radius:14px; border:1px solid var(--line);
  font-family:var(--s); font-size:15px; font-weight:600; cursor:pointer; transition:.15s var(--spring);
  background:var(--glass-bg); border-color:var(--glass-border);
}
.rv-no { color:var(--red); }
.rv-no:hover { border-color:var(--red); }
.rv-yes { color:var(--ok); }
.rv-yes:hover { border-color:var(--ok); }

.rv-empty, .rv-done {
  flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center;
  text-align:center; gap:8px; padding:40px 20px;
}
.rv-empty-icon, .rv-done-icon { font-size:44px; margin-bottom:8px; }
.rv-empty-title, .rv-done-title { font-family:var(--d); font-size:24px; font-style:italic; color:var(--red); }
.rv-empty-text, .rv-done-text { font-family:var(--s); font-size:14px; color:var(--muted); max-width:280px; }
.rv-done-btn {
  margin-top:16px; padding:12px 28px; border-radius:14px; border:none;
  background:var(--ink); color:var(--bg); font-family:var(--s); font-size:14px; font-weight:600;
  cursor:pointer; transition:opacity .2s;
}
.rv-done-btn:hover { opacity:.9; }

[data-theme=dark] .rv-back,
[data-theme=dark] .rv-card,
[data-theme=dark] .rv-btn { background: rgba(24,16,8,.94) !important; border-color: rgba(246,140,54,.2) !important; }
[data-theme=amoled] .rv-back,
[data-theme=amoled] .rv-card,
[data-theme=amoled] .rv-btn { background: rgba(0,0,0,.95) !important; }
</style>
