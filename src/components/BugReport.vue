<template>
  <div>
    <!-- Кнопка-триггер -->
    <button class="bug-btn" @click="open=true" title="Сообщить об ошибке">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
        <line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    </button>

    <!-- Модалка -->
    <Teleport to="body">
      <div v-if="open" class="bug-overlay" @click.self="close">
        <div class="bug-modal">
          <button class="bug-close" @click="close">✕</button>

          <div class="bug-title">Нашёл ошибку?</div>
          <p class="bug-sub">Сообщи нам — мы исправим как можно быстрее</p>

          <div class="bug-field">
            <label class="bug-label">Что за ошибка?</label>
            <div class="bug-types">
              <button v-for="t in types" :key="t.v"
                class="bug-type" :class="{active: type===t.v}"
                @click="type=t.v">{{ t.l }}</button>
            </div>
          </div>

          <div class="bug-field">
            <label class="bug-label">Опиши подробнее</label>
            <textarea class="bug-textarea" v-model="text"
              placeholder="Например: слово 'mard' переводится как 'Человек', но написано 'Камень'..."
              rows="4"></textarea>
          </div>

          <div class="bug-field" v-if="type==='word'">
            <label class="bug-label">Армянское слово (если знаешь)</label>
            <input class="bug-input" v-model="wordArm" placeholder="Например: մարդ" />
          </div>

          <div class="bug-status ok"  v-if="status==='ok'">✓ Спасибо! Мы получили твоё сообщение.</div>
          <div class="bug-status err" v-if="status==='err'">Что-то пошло не так. Попробуй ещё раз.</div>

          <button class="bug-send" @click="send" :disabled="!text.trim() || sending">
            {{ sending ? 'Отправляем...' : 'Отправить' }}
          </button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { db, auth } from '../firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

const open    = ref(false)
const type    = ref('translation')
const text    = ref('')
const wordArm = ref('')
const sending = ref(false)
const status  = ref('')

const types = [
  { v: 'translation', l: 'Неверный перевод' },
  { v: 'translit',    l: 'Транскрипция' },
  { v: 'grammar',     l: 'Грамматика' },
  { v: 'ui',          l: 'Интерфейс' },
  { v: 'other',       l: 'Другое' },
]

function close() {
  open.value   = false
  status.value = ''
  text.value   = ''
  wordArm.value= ''
  type.value   = 'translation'
}

async function send() {
  if (!text.value.trim()) return
  sending.value = true
  status.value  = ''
  try {
    await addDoc(collection(db, 'reports'), {
      type:      type.value,
      text:      text.value.trim(),
      wordArm:   wordArm.value.trim(),
      userId:    auth.currentUser?.uid || 'anonymous',
      userEmail: auth.currentUser?.email || '',
      createdAt: serverTimestamp(),
      status:    'new',
    })
    status.value  = 'ok'
    text.value    = ''
    wordArm.value = ''
    setTimeout(() => close(), 2000)
  } catch (e) {
    console.error(e)
    status.value = 'err'
  } finally {
    sending.value = false
  }
}
</script>

<style scoped>
.bug-btn {
  position: fixed; bottom: 76px; right: 16px; z-index: 50;
  width: 40px; height: 40px; border-radius: 50%;
  background:var(--glass-bg); 
  border: 1px solid rgba(246,140,54,.3);
  color: var(--muted); cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all .2s; box-shadow: 0 2px 8px rgba(0,0,0,.1);
border-color:var(--glass-border);backdrop-filter:var(--glass-blur);-webkit-backdrop-filter:var(--glass-blur);}
.bug-btn:hover { border-color: var(--gold); color: var(--red); transform: scale(1.05); }

.bug-overlay {
  position: fixed; inset: 0; z-index: 300;
  background: rgba(26,16,8,.5); 
  display: flex; align-items: flex-end;
}
.bug-modal {
  width: 100%; max-height: 90vh; overflow-y: auto;
  background: var(--bg); border-radius: 24px 24px 0 0;
  padding: 28px 20px 48px; position: relative;
}
.bug-close {
  position: absolute; top: 16px; right: 16px;
  width: 32px; height: 32px; border-radius: 50%;
  background: rgba(0,0,0,.08); border: none; cursor: pointer;
  font-size: 14px; color: var(--muted);
}
.bug-title { font-family: var(--d); font-size: 28px; font-weight: 700; font-style: italic; color: var(--red); margin-bottom: 6px; }
.bug-sub   { font-family: var(--s); font-size: 14px; color: var(--muted); margin-bottom: 20px; }
.bug-field { margin-bottom: 16px; }
.bug-label { font-family: var(--m); font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); display: block; margin-bottom: 8px; }
.bug-types { display: flex; flex-wrap: wrap; gap: 8px; }
.bug-type  { padding: 7px 14px; border: 1.5px solid var(--line); border-radius: 20px; background:var(--glass-bg); font-family: var(--s); font-size: 13px; color: var(--ink); cursor: pointer; transition:.15s var(--spring); border-color:var(--glass-border);box-shadow:inset 0 1px 0 var(--glass-shine),0 4px 16px var(--glass-shadow);backdrop-filter:var(--glass-blur);-webkit-backdrop-filter:var(--glass-blur);}
.bug-type.active { background: var(--red); border-color: var(--red); color: var(--on-accent); }
.bug-textarea {
  width: 100%; padding: 12px 14px;
  border: 1.5px solid var(--line); border-radius: 12px;
  background:var(--glass-bg); font-family: var(--s); font-size: 15px;
  color: var(--ink); resize: none; outline: none; line-height: 1.5;
border-color:var(--glass-border);box-shadow:inset 0 1px 0 var(--glass-shine),0 4px 16px var(--glass-shadow);backdrop-filter:var(--glass-blur);-webkit-backdrop-filter:var(--glass-blur);}
.bug-textarea:focus { border-color: var(--gold); }
.bug-input {
  width: 100%; padding: 10px 14px;
  border: 1.5px solid var(--line); border-radius: 12px;
  background:var(--glass-bg); font-family: var(--d); font-size: 18px;
  font-style: italic; color: var(--red); outline: none;
border-color:var(--glass-border);box-shadow:inset 0 1px 0 var(--glass-shine),0 4px 16px var(--glass-shadow);backdrop-filter:var(--glass-blur);-webkit-backdrop-filter:var(--glass-blur);}
.bug-input:focus { border-color: var(--gold); }
.bug-status { text-align: center; padding: 12px; border-radius: 10px; font-family: var(--s); font-size: 14px; margin-bottom: 12px; }
.bug-status.ok  { background: rgba(42,94,58,.1); color: #2a5e3a; }
.bug-status.err { background: rgba(128,6,19,.1); color: var(--red); }
.bug-send {
  width: 100%; padding: 16px; background: var(--red); border: none;
  border-radius: 14px; color: var(--on-accent);
  font-family: var(--d); font-size: 18px; font-style: italic;
  cursor: pointer; transition:.2s var(--spring); margin-top: 4px;
}
.bug-send:hover { opacity: .88; }
.bug-send:disabled { opacity: .5; cursor: default; }
</style>
