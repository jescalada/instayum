<script lang="ts" setup>
import MainHeader from '@/components/shared/MainHeader.vue'
import RecipeHero from '@/components/recipe/RecipeHero.vue'
import HandsFreeSwitch from '@/components/recipe/HandsFreeSwitch.vue'
import { ref } from 'vue'
import IngredientsCard from '@/components/recipe/IngredientsCard.vue'

const handsFree = ref(false)

function toggleHandsFree(value: boolean) {
  handsFree.value = value
  console.log('toggled!')
}
</script>

<template>
  <MainHeader />
  <RecipeHero class="bg-indigo-50" />
  <HandsFreeSwitch @toggle-hands-free="toggleHandsFree" />
  <IngredientsCard />
</template>
