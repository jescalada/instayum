<script lang="ts" setup>
import SpeechRecognizer from '@/components/landing/SpeechRecognizer.vue'
import LandingHero from '../components/landing/LandingHero.vue'
</script>

<template>
  <LandingHero />
  <SpeechRecognizer
    :lang="'en'"
    :continuous="true"
    :interim-results="true"
    :max-alternatives="1"
  />
</template>
