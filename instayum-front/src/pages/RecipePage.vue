<script lang="ts" setup>
import MainHeader from '@/components/shared/MainHeader.vue'
import RecipeHero from '@/components/recipe/RecipeHero.vue'
import HandsFreeSwitch from '@/components/recipe/HandsFreeSwitch.vue'
import { ref } from 'vue'
import IngredientsCard from '@/components/recipe/IngredientsCard.vue'
import StepsCard from '@/components/recipe/StepsCard.vue'
import InteractiveSteps from '@/components/recipe/InteractiveSteps.vue'

const handsFree = ref(false)

function toggleHandsFree(value: boolean) {
  handsFree.value = value
  console.log('toggled!')
}
</script>

<template>
  <MainHeader />
  <div class="background bg-indigo-50">
    <div class="flex flex-col max-w-4xl mx-auto">
      <RecipeHero class="bg-indigo-50" />
      <HandsFreeSwitch @toggle-hands-free="toggleHandsFree" />
      <div
        v-if="!handsFree"
        class="bg-white rounded-xl shadow-xl border-2 border-indigo-200"
      >
        <IngredientsCard />
        <StepsCard />
      </div>
      <div
        v-if="handsFree"
        class="bg-white rounded-xl shadow-xl border-2 border-indigo-200"
      >
        <InteractiveSteps />
      </div>
    </div>
  </div>
</template>
