<template>
  <div class="profile">
    <div class="prof-header">
      <div class="prof-title">Профиль</div>
    </div>
    <div class="prof-body">
      <div class="prof-user">
        <div class="prof-avatar">
          <img v-if="user?.photoURL" :src="user.photoURL" />
          <span v-else>{{ user?.displayName?.[0] || 'Г' }}</span>
        </div>
        <div class="prof-info">
          <div class="prof-name">{{ user?.displayName || 'Гость' }}</div>
          <div class="prof-email">{{ user?.email || 'Без аккаунта' }}</div>
        </div>
        <div class="prof-lvl">{{ level }}</div>
      </div>

      <div class="prof-stats">
        <div class="ps"><div class="ps-n">🔥{{ streak }}</div><div class="ps-l">Streak</div></div>
        <div class="ps-d"></div>
        <div class="ps"><div class="ps-n">{{ learned.size }}</div><div class="ps-l">Выучено</div></div>
        <div class="ps-d"></div>
        <div class="ps"><div class="ps-n">{{ Math.round(learned.size/744*100) }}%</div><div class="ps-l">Прогресс</div></div>
      </div>

      <div class="prof-section-title">Тема</div>
      <div class="theme-row">
        <div v-for="t in themes" :key="t.v"
          class="theme-btn" :class="{active: currentTheme===t.v}"
          @click="setTheme(t.v)">
          <div class="theme-preview" :style="{background: t.color}"></div>
          <div class="theme-name">{{ t.l }}</div>
        </div>
      </div>

      <div class="prof-section-title">Уровень</div>
      <div class="level-row">
        <div v-for="l in levels" :key="l"
          class="level-btn" :class="{active: level===l}"
          @click="$emit('change-level', l)">{{ l }}</div>
      </div>

      <div class="prof-section-title">Аккаунт</div>
      <div class="prof-item danger" v-if="user" @click="$emit('logout')">
        <span>Выйти из аккаунта</span><span>→</span>
      </div>
      <div class="prof-item" v-else>
        <span>Войти через Google</span><span>→</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
defineProps({ user:Object, learned:Object, streak:Number, level:String })
defineEmits(['logout','change-level'])

const levels = ['A1','A2','B1']
const themes = [
  { v:'light',  l:'Светлая', color:'#f2e8d5' },
  { v:'dark',   l:'Тёмная',  color:'#1a1208' },
  { v:'amoled', l:'AMOLED',  color:'#000000' },
]
const currentTheme = ref(localStorage.getItem('barr_theme') || 'light')

function setTheme(t) {
  currentTheme.value = t
  document.documentElement.dataset.theme = t
  localStorage.setItem('barr_theme', t)
}
onMounted(() => document.documentElement.dataset.theme = currentTheme.value)
</script>

<style scoped>
.profile { padding-bottom:20px; }
.prof-header {
  padding:20px; border-bottom:1px solid rgba(176,120,40,.2);
  position:sticky; top:0; z-index:10;
  background:rgba(242,232,213,.88); backdrop-filter:blur(10px);
}
.prof-title { font-family:var(--d); font-size:28px; font-weight:700; font-style:italic; color:var(--red); }
.prof-body  { padding:20px; display:flex; flex-direction:column; gap:16px; }
.prof-user  { display:flex; align-items:center; gap:14px; background:rgba(242,232,213,.88); backdrop-filter:blur(8px); border:1px solid rgba(176,120,40,.2); border-radius:16px; padding:16px; }
.prof-avatar { width:56px; height:56px; border-radius:50%; background:var(--red); color:var(--bg); font-family:var(--d); font-size:24px; font-weight:700; display:flex; align-items:center; justify-content:center; overflow:hidden; flex-shrink:0; }
.prof-avatar img { width:100%; height:100%; object-fit:cover; }
.prof-name  { font-family:var(--d); font-size:20px; font-style:italic; color:var(--ink); }
.prof-email { font-family:var(--m); font-size:11px; color:var(--muted); margin-top:2px; }
.prof-lvl   { margin-left:auto; background:var(--red); color:var(--bg); font-family:var(--m); font-size:12px; font-weight:700; padding:6px 14px; border-radius:20px; flex-shrink:0; }
.prof-stats { background:rgba(242,232,213,.88); backdrop-filter:blur(8px); border:1px solid rgba(176,120,40,.2); border-radius:16px; display:flex; }
.ps { flex:1; padding:16px; text-align:center; }
.ps-n { font-family:var(--d); font-size:26px; font-weight:700; color:var(--red); }
.ps-l { font-family:var(--m); font-size:8px; letter-spacing:1px; text-transform:uppercase; color:var(--muted); margin-top:3px; }
.ps-d { width:1px; height:44px; background:rgba(176,120,40,.2); align-self:center; }
.prof-section-title { font-family:var(--m); font-size:9px; letter-spacing:3px; text-transform:uppercase; color:var(--muted); }
.theme-row { display:grid; grid-template-columns:1fr 1fr 1fr; gap:10px; }
.theme-btn  { border:1.5px solid var(--line); border-radius:12px; padding:12px; text-align:center; cursor:pointer; transition:.15s; background:rgba(242,232,213,.7); }
.theme-btn.active { border-color:var(--red); border-width:2px; }
.theme-preview { height:32px; border-radius:8px; margin-bottom:8px; border:1px solid rgba(0,0,0,.1); }
.theme-name { font-family:var(--m); font-size:11px; color:var(--ink); }
.level-row  { display:flex; gap:10px; }
.level-btn  { flex:1; padding:14px; border:1.5px solid var(--line); border-radius:12px; font-family:var(--m); font-size:14px; font-weight:700; color:var(--muted); cursor:pointer; text-align:center; transition:.15s; background:rgba(242,232,213,.7); }
.level-btn.active { background:var(--red); border-color:var(--red); color:var(--bg); }
.prof-item  { display:flex; align-items:center; justify-content:space-between; padding:16px 18px; border:1px solid var(--line); border-radius:12px; font-family:var(--s); font-size:15px; color:var(--ink); cursor:pointer; background:rgba(242,232,213,.7); transition:.15s; }
.prof-item.danger { color:var(--red); }
.prof-item:hover { border-color:var(--gold); }

[data-theme=dark] .prof-header,
[data-theme=amoled] .prof-header { background:rgba(10,8,4,.92) !important; }
[data-theme=dark] .prof-user, [data-theme=dark] .prof-stats,
[data-theme=dark] .theme-btn, [data-theme=dark] .level-btn, [data-theme=dark] .prof-item { background:rgba(26,18,8,.82) !important; }
[data-theme=amoled] .prof-user, [data-theme=amoled] .prof-stats,
[data-theme=amoled] .theme-btn, [data-theme=amoled] .level-btn, [data-theme=amoled] .prof-item { background:rgba(0,0,0,.85) !important; }
</style>
