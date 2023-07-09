<script setup lang="ts">
import LandingPage from './pages/LandingPage.vue'
import ResultsPage from './pages/ResultsPage.vue'
import { ref, computed } from 'vue'
import { recipes } from './stores/recipes'
import RecipePage from './pages/RecipePage.vue'

const routes = {
  '': LandingPage,
  results: ResultsPage,
  recipe: RecipePage,
}

const currentPath = ref(window.location.hash)

window.addEventListener('hashchange', () => {
  currentPath.value = window.location.hash
})

/**
 * Dynamically computes the current view based on the current route value.
 */
const currentView = computed(() => {
  const routeSplit = currentPath.value.slice(1).split('/')
  recipes.value.setActiveId(+routeSplit?.[2])
  return routes[routeSplit[1] || '']
})

</script>

<template>
  <component :is="currentView" />
</template>

<style>
#app {
  @apply antialiased text-center text-default;
}
</style>
