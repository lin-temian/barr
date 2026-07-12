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
  {arm:"Սենյակ", tr:"Senyak", ru:"Комната"},
  {arm:"Ննջասենյակ", tr:"Nnjasenyak", ru:"Спальня"},
  {arm:"Լոգարան", tr:"Logaran", ru:"Ванная"},
  {arm:"Խոհանոց", tr:"Khohanots", ru:"Кухня"},
  {arm:"Բալկոն", tr:"Balkon", ru:"Балкон"},
  {arm:"Դուռ", tr:"Dur", ru:"Дверь"},
  {arm:"Պատուհան", tr:"Patuhan", ru:"Окно"},
  {arm:"Սեղան", tr:"Seghan", ru:"Стол"},
  {arm:"Աթոռ", tr:"Athor", ru:"Стул"},
  {arm:"Մահճակալ", tr:"Mahchakal", ru:"Кровать"},
  {arm:"Հատակ", tr:"Hatak", ru:"Пол"},
  {arm:"Պատ", tr:"Pat", ru:"Стена"},
  {arm:"Առաստաղ", tr:"Arastagh", ru:"Потолок"},
  {arm:"Բակ", tr:"Bak", ru:"Двор"},
  {arm:"Լամպ", tr:"Lamp", ru:"Лампа"},
]
</script>
<style scoped></style>