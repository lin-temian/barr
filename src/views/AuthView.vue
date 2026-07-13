<template>
  <div class="auth">
    <div class="auth-inner">
      <div class="auth-logo">
        <div class="auth-letter">Բ</div>
        <h2 class="auth-title">Сохрани прогресс</h2>
        <p class="auth-desc">Войди чтобы твои достижения были доступны на всех устройствах</p>
      </div>

      <div class="auth-benefits">
        <div class="auth-benefit" v-for="b in benefits" :key="b.text">
          <span class="auth-benefit-icon">{{ b.icon }}</span>
          <span>{{ b.text }}</span>
        </div>
      </div>

      <button class="auth-google-btn" @click="handleGoogle" :disabled="loading">
        <svg width="20" height="20" viewBox="0 0 24 24" style="flex-shrink:0">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        <span>{{ loading ? 'Входим...' : 'Войти через Google' }}</span>
      </button>

      <div class="auth-divider"><span>или</span></div>

      <button class="auth-skip-btn" @click="$emit('skip')">
        Продолжить без входа
      </button>

      <p class="auth-terms">
        Нажимая, ты соглашаешься с условиями использования
      </p>
    </div>

    <div class="ob-frame ob-frame-tl"></div>
    <div class="ob-frame ob-frame-tr"></div>
    <div class="ob-frame ob-frame-bl"></div>
    <div class="ob-frame ob-frame-br"></div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { loginWithGoogle } from '../firebase'

const emit = defineEmits(['done', 'skip'])
const loading = ref(false)

const benefits = [
  { icon: '🔥', text: 'Streak и прогресс сохраняются' },
  { icon: '📱', text: 'Доступно на всех устройствах' },
  { icon: '📚', text: 'Личный словарь и статистика' },
]

async function handleGoogle() {
  loading.value = true
  try {
    const result = await loginWithGoogle()
    emit('done', result.user)
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth {
  position: fixed; inset: 0;
  background: var(--bg);
  display: flex; align-items: center; justify-content: center;
  padding: 24px; overflow: hidden;
}
.auth-inner {
  width: 100%; max-width: 400px;
  position: relative; z-index: 1;
}
.auth-logo { text-align: center; margin-bottom: 32px; }
.auth-letter {
  font-family: var(--d); font-size: 80px; font-weight: 700;
  font-style: italic; color: var(--red); line-height: 1;
}
.auth-title {
  font-family: var(--d); font-size: 28px; font-weight: 700;
  font-style: italic; color: var(--ink); margin-top: 8px;
}
.auth-desc {
  font-family: var(--s); font-size: 14px; color: var(--muted);
  margin-top: 8px; line-height: 1.5;
}
.auth-benefits {
  display: flex; flex-direction: column; gap: 10px;
  margin-bottom: 28px;
}
.auth-benefit {
  display: flex; align-items: center; gap: 12px;
  font-family: var(--s); font-size: 15px; color: var(--ink);
  padding: 10px 14px;
  background:var(--glass-bg);
  border-radius: 10px;
  border: 1px solid var(--line);
border-color:var(--glass-border);box-shadow:inset 0 1px 0 var(--glass-shine),0 4px 16px var(--glass-shadow);}
.auth-benefit-icon { font-size: 20px; }
.auth-google-btn {
  width: 100%; padding: 14px 20px;
  background: white; border: 1.5px solid #ddd;
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center; gap: 12px;
  font-family: var(--s); font-size: 16px; font-weight: 500; color: #333;
  cursor: pointer; transition: all .2s; margin-bottom: 16px;
}
.auth-google-btn:hover { border-color: #aaa; box-shadow: 0 2px 8px rgba(0,0,0,.1); }
.auth-google-btn:disabled { opacity: .6; cursor: default; }
.auth-divider {
  text-align: center; position: relative; margin: 0 0 16px;
  font-family: var(--m); font-size: 11px; color: var(--muted);
}
.auth-divider::before {
  content: ''; position: absolute;
  top: 50%; left: 0; right: 0; height: 1px;
  background: var(--line);
}
.auth-divider span {
  position: relative; background: var(--bg); padding: 0 12px;
}
.auth-skip-btn {
  width: 100%; padding: 14px;
  background: transparent; border: 1.5px solid var(--line);
  border-radius: 12px;
  font-family: var(--s); font-size: 15px; color: var(--muted);
  cursor: pointer; transition: all .2s;
}
.auth-skip-btn:hover { border-color: var(--gold); color: var(--ink); }
.auth-terms {
  font-family: var(--s); font-size: 11px; color: var(--muted);
  text-align: center; margin-top: 16px; line-height: 1.5;
}
.ob-frame {
  position: absolute; width: 40px; height: 40px;
  border-color: var(--gold); border-style: solid; opacity: .4;
}
.ob-frame-tl { top: 20px; left: 20px; border-width: 2px 0 0 2px; }
.ob-frame-tr { top: 20px; right: 20px; border-width: 2px 2px 0 0; }
.ob-frame-bl { bottom: 20px; left: 20px; border-width: 0 0 2px 2px; }
.ob-frame-br { bottom: 20px; right: 20px; border-width: 0 2px 2px 0; }
</style>
