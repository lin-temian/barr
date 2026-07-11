<template>
  <div class="inline-tab">
    <div class="it-title">Дом и быт — Տուն</div>
    <div class="it-grid">
      <div v-for="w in WORDS" :key="w.tr" class="it-wcard">
        <div class="it-arm">{{ w.arm }}</div>
        <div class="it-tr">{{ w.tr }}</div>
        <div class="it-ru">{{ w.ru }}</div>
      </div>
    </div>
  </div>
</template>
<script setup>
const WORDS = [
  {arm:"Տուն", tr:"Tun", ru:"Дом"},
  {arm:"խոհլի", tr:"Khokhli", ru:"Комната"},
  {arm:"սևնյaկ", tr:"Senyak", ru:"Спальня"},
  {arm:"լոգարլ", tr:"Logar", ru:"Ванная"},
  {arm:"խոհaնaկ", tr:"Khokhanak", ru:"Кухня"},
  {arm:"baլկոն", tr:"Balkon", ru:"Балкон"},
  {arm:"դուր", tr:"Dour", ru:"Дверь"},
  {arm:"Լուսակ", tr:"Lousak", ru:"Окно"},
  {arm:"սenկլ", tr:"Sengkl", ru:"Стол"},
  {arm:"աթոռ", tr:"Athor", ru:"Стул"},
  {arm:"լինկ", tr:"Link", ru:"Кровать"},
  {arm:"կaհկ", tr:"Kahk", ru:"Пол"},
  {arm:"սիրaկ", tr:"Sirak", ru:"Стена"},
  {arm:"հaտկ", tr:"Hatk", ru:"Потолок"},
  {arm:"baկկ", tr:"Bakk", ru:"Двор"},
  {arm:"Լուսa", tr:"Lousa", ru:"Лампа"},
]
</script>
<style scoped></style>