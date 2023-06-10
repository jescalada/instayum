<script setup lang="ts">
import LandingPage from './pages/LandingPage.vue'
import ResultsPage from './pages/ResultsPage.vue'
import { ref, computed } from 'vue'
import { recipes } from './stores/recipes'

const routes = {
  '': LandingPage,
  results: ResultsPage,
}

const currentPath = ref(window.location.hash)

window.addEventListener('hashchange', () => {
  currentPath.value = window.location.hash
})

const currentView = computed(() => {
  const routeSplit = currentPath.value.slice(1).split('/')
  recipes.value.setActiveId(+routeSplit?.[2])
  return routes[routeSplit[1] || '']
})
</script>

<template>
  Current component is: {{ currentView }} Current path is: {{ currentPath }}
  <component :is="currentView" />
</template>

<style>
#app {
  @apply antialiased text-center text-default;
}
</style>
