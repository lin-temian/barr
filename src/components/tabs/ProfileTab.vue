<template>
  <div class="profile">
    <div class="prof-header">
      <div class="prof-title">Профиль</div>
    </div>
    <div class="prof-body">
      <!-- USER -->
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

      <!-- STATS -->
      <div class="prof-stats">
        <div class="ps"><div class="ps-n">🔥 {{ streak }}</div><div class="ps-l">Streak</div></div>
        <div class="ps-d"></div>
        <div class="ps"><div class="ps-n">{{ learned.size }}</div><div class="ps-l">Выучено</div></div>
        <div class="ps-d"></div>
        <div class="ps"><div class="ps-n">{{ Math.round(learned.size/744*100) }}%</div><div class="ps-l">Прогресс</div></div>
      </div>

      <!-- ДОСТИЖЕНИЯ -->
      <div class="prof-section-title">Достижения</div>
      <div class="achievements-grid">
        <div v-for="b in ALL_BADGES" :key="b.id"
          class="ach-card"
          :class="{earned: earnedSet.has(b.id), locked: !earnedSet.has(b.id)}">
          <div class="ach-icon">{{ b.icon }}</div>
          <div class="ach-name">{{ b.name }}</div>
          <div class="ach-desc">{{ b.desc }}</div>
          <div class="ach-lock" v-if="!earnedSet.has(b.id)">🔒</div>
        </div>
      </div>

      <!-- ПРОГРЕСС АЛФАВИТА -->
      <div class="prof-section-title">Алфавит</div>
      <div class="alpha-progress-card">
        <div class="apc-row">
          <span class="apc-label">Выучено букв</span>
          <span class="apc-val">{{ alphaCount }} / 39</span>
        </div>
        <div class="apc-bar"><div class="apc-fill" :style="{width: alphaPercent+'%'}"></div></div>
        <div class="apc-pct">{{ alphaPercent }}%</div>
      </div>

      <!-- ТЕМА -->
      <div class="prof-section-title">Тема</div>
      <div class="theme-row">
        <div v-for="t in themes" :key="t.v"
          class="theme-btn" :class="{active: currentTheme===t.v}"
          @click="setTheme(t.v)">
          <div class="theme-preview" :style="{background: t.color}"></div>
          <div class="theme-name">{{ t.l }}</div>
        </div>
      </div>

      <!-- УРОВЕНЬ -->
      <div class="prof-section-title">Уровень</div>
      <div class="level-row">
        <div v-for="l in levels" :key="l"
          class="level-btn" :class="{active: level===l}"
          @click="$emit('change-level', l)">{{ l }}</div>
      </div>

      <!-- АККАУНТ -->
      <div class="prof-section-title">Аккаунт</div>
      <div class="prof-item danger" v-if="user" @click="$emit('logout')">
        <span>Выйти из аккаунта</span><span>→</span>
      </div>
      <div class="prof-item" v-else @click="$emit('login')">
        <span>Войти через Google</span><span>→</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({ user:Object, learned:Object, streak:Number, level:String, learnedAlpha:Object })
defineEmits(['logout','change-level','login'])

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

const alphaCount   = computed(() => props.learnedAlpha?.size || 0)
const alphaPercent = computed(() => Math.round(alphaCount.value / 39 * 100))

const ALL_BADGES = [
  { id:'first',   icon:'🌱', name:'Первый шаг',      desc:'Выучил первую букву алфавита'  },
  { id:'five',    icon:'⭐', name:'Пять звёзд',       desc:'Выучил 5 букв'                 },
  { id:'ten',     icon:'🔟', name:'Десятка',           desc:'Выучил 10 букв'                },
  { id:'vowels',  icon:'🎵', name:'Гласные звуки',     desc:'Выучил все гласные буквы'      },
  { id:'half',    icon:'🏅', name:'Половина пути',     desc:'Выучил 20 букв алфавита'       },
  { id:'master',  icon:'👑', name:'Мастер алфавита',   desc:'Выучил все 39 букв!'            },
  { id:'words10', icon:'📖', name:'Первые слова',      desc:'Выучил 10 слов из словаря'     },
  { id:'words50', icon:'📚', name:'Словарный запас',   desc:'Выучил 50 слов из словаря'     },
  { id:'streak3', icon:'🔥', name:'Горячая серия',     desc:'3 дня подряд занятий'          },
  { id:'streak7', icon:'💫', name:'Недельная серия',   desc:'7 дней подряд занятий'         },
  { id:'lesson1', icon:'🎓', name:'Первый урок',       desc:'Завершил первый урок'           },
  { id:'lesson5', icon:'🏆', name:'Прилежный ученик',  desc:'Завершил 5 уроков'             },
]

const VOWEL_IDX = new Set([0,4,6,7,10,23,33,36,37])

const earnedSet = computed(() => {
  const alpha   = props.learnedAlpha || new Set()
  const learned = props.learned || new Set()
  const streak  = props.streak || 0
  const completed = new Set(JSON.parse(localStorage.getItem('barr_lessons') || '[]'))
  const earned = new Set()

  if (alpha.size >= 1)  earned.add('first')
  if (alpha.size >= 5)  earned.add('five')
  if (alpha.size >= 10) earned.add('ten')
  if (alpha.size >= 20) earned.add('half')
  if (alpha.size >= 39) earned.add('master')
  if ([...VOWEL_IDX].every(i => alpha.has(i))) earned.add('vowels')

  if (learned.size >= 10) earned.add('words10')
  if (learned.size >= 50) earned.add('words50')

  if (streak >= 3) earned.add('streak3')
  if (streak >= 7) earned.add('streak7')

  if (completed.size >= 1) earned.add('lesson1')
  if (completed.size >= 5) earned.add('lesson5')

  return earned
})
</script>

<style scoped>
.profile { padding-bottom: 80px; }
.prof-header {
  padding: 20px; border-bottom: 1px solid var(--line);
  background:var(--glass-bg-strong);
border-color:var(--glass-border);}
.prof-title { font-family: var(--d); font-size: 28px; font-weight: 700; font-style: italic; color: var(--red); }
.prof-body  { padding: 16px; display: flex; flex-direction: column; gap: 14px; }

.prof-user {
  display: flex; align-items: center; gap: 14px;
  background:var(--glass-bg-strong); border: 1px solid var(--line); border-radius: 16px;
  padding: 16px;
border-color:var(--glass-border);box-shadow:inset 0 1px 0 var(--glass-shine),0 4px 16px var(--glass-shadow);}
.prof-avatar {
  width: 52px; height: 52px; border-radius: 50%; background: var(--red);
  display: flex; align-items: center; justify-content: center;
  font-family: var(--d); font-size: 24px; font-weight: 700; color: var(--on-accent);
  flex-shrink: 0; overflow: hidden;
}
.prof-avatar img { width: 100%; height: 100%; object-fit: cover; }
.prof-info  { flex: 1; }
.prof-name  { font-family: var(--s); font-size: 17px; font-weight: 700; color: var(--ink); }
.prof-email { font-family: var(--m); font-size: 11px; color: var(--muted); margin-top: 2px; }
.prof-lvl   { background: var(--red); color: var(--on-accent); font-family: var(--m); font-size: 11px; font-weight: 700; padding: 5px 12px; border-radius: 12px; }

.prof-stats {
  display: flex; align-items: center;
  background:var(--glass-bg-strong); border: 1px solid var(--line); border-radius: 14px;
  padding: 16px;
border-color:var(--glass-border);box-shadow:inset 0 1px 0 var(--glass-shine),0 4px 16px var(--glass-shadow);}
.ps     { flex: 1; text-align: center; }
.ps-n   { font-family: var(--d); font-size: 26px; font-weight: 700; color: var(--ink); }
.ps-l   { font-family: var(--m); font-size: 9px; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); margin-top: 2px; }
.ps-d   { width: 1px; background: var(--line); align-self: stretch; }

.prof-section-title {
  font-family: var(--m); font-size: 9px; letter-spacing: 3px;
  text-transform: uppercase; color: var(--gold); padding: 4px 0 0;
}

/* ДОСТИЖЕНИЯ */
.achievements-grid {
  display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;
}
.ach-card {
  background:var(--glass-bg); border: 1px solid var(--line);
  border-radius: 14px; padding: 14px; position: relative;
  transition: all .2s;
border-color:var(--glass-border);box-shadow:inset 0 1px 0 var(--glass-shine),0 4px 16px var(--glass-shadow);}
.ach-card.earned {
  border-color: var(--gold);
  background: rgba(176,120,40,.08);
}
.ach-card.locked .ach-icon,
.ach-card.locked .ach-name,
.ach-card.locked .ach-desc { opacity: .5; }
.ach-icon { font-size: 28px; line-height: 1; margin-bottom: 6px; }
.ach-name { font-family: var(--d); font-size: 15px; font-style: italic; color: var(--ink); margin-bottom: 3px; }
.ach-desc { font-family: var(--s); font-size: 11px; color: var(--muted); line-height: 1.4; }
.ach-lock { position: absolute; top: 10px; right: 12px; font-size: 14px; opacity: .4; }

/* ПРОГРЕСС АЛФАВИТА */
.alpha-progress-card {
  background:var(--glass-bg); border: 1px solid var(--line);
  border-radius: 14px; padding: 16px;
border-color:var(--glass-border);box-shadow:inset 0 1px 0 var(--glass-shine),0 4px 16px var(--glass-shadow);}
.apc-row   { display: flex; justify-content: space-between; margin-bottom: 10px; }
.apc-label { font-family: var(--s); font-size: 14px; color: var(--ink); }
.apc-val   { font-family: var(--m); font-size: 13px; color: var(--gold); font-weight: 700; }
.apc-bar   { height: 6px; background: var(--line2); border-radius: 3px; margin-bottom: 6px; }
.apc-fill  { height: 100%; background: var(--red); border-radius: 3px; transition: width .5s; }
.apc-pct   { font-family: var(--m); font-size: 10px; color: var(--muted); text-align: right; }

/* ТЕМА */
.theme-row { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; }
.theme-btn {
  background:var(--glass-bg); border: 2px solid var(--line);
  border-radius: 12px; padding: 12px 8px; cursor: pointer;
  text-align: center; transition: all .15s;
border-color:var(--glass-border);box-shadow:inset 0 1px 0 var(--glass-shine),0 4px 16px var(--glass-shadow);}
.theme-btn.active { border-color: var(--red); }
.theme-preview { width: 100%; height: 28px; border-radius: 6px; margin-bottom: 8px; border: 1px solid rgba(0,0,0,.1); }
.theme-name { font-family: var(--m); font-size: 10px; color: var(--ink); }

/* УРОВЕНЬ */
.level-row { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; }
.level-btn {
  background:var(--glass-bg); border: 2px solid var(--line);
  border-radius: 12px; padding: 14px; cursor: pointer;
  font-family: var(--m); font-size: 14px; font-weight: 700;
  color: var(--muted); text-align: center; transition: all .15s;
border-color:var(--glass-border);box-shadow:inset 0 1px 0 var(--glass-shine),0 4px 16px var(--glass-shadow);}
.level-btn.active { background: var(--red); border-color: var(--red); color: var(--on-accent); }
.level-btn:hover:not(.active) { border-color: var(--gold); color: var(--ink); }

.prof-item {
  background:var(--glass-bg); border: 1px solid var(--line);
  border-radius: 14px; padding: 16px 18px;
  display: flex; justify-content: space-between; align-items: center;
  font-family: var(--s); font-size: 15px; color: var(--ink);
  cursor: pointer; transition:.15s var(--spring);
border-color:var(--glass-border);box-shadow:inset 0 1px 0 var(--glass-shine),0 4px 16px var(--glass-shadow);}
.prof-item:hover { border-color: var(--gold); }
.prof-item.danger { color: var(--red); }

[data-theme=dark] .prof-header,
[data-theme=dark] .prof-user,
[data-theme=dark] .prof-stats,
[data-theme=dark] .ach-card,
[data-theme=dark] .alpha-progress-card,
[data-theme=dark] .theme-btn,
[data-theme=dark] .level-btn,
[data-theme=dark] .prof-item {
  background: rgba(24,16,8,.94) !important;
  border-color: rgba(176,120,40,.2) !important;
}

[data-theme=amoled] .prof-header,
[data-theme=amoled] .prof-user,
[data-theme=amoled] .prof-stats,
[data-theme=amoled] .ach-card,
[data-theme=amoled] .alpha-progress-card,
[data-theme=amoled] .theme-btn,
[data-theme=amoled] .level-btn,
[data-theme=amoled] .prof-item {
  background: rgba(0,0,0,.95) !important;
}
</style>
