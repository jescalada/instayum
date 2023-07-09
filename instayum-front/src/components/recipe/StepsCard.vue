<script setup lang="ts">
import { recipes } from '@/stores/recipes'
</script>
<template>
  <!-- Steps Container for Static recipe view -->
  <div class="max-w-4xl md:mx-auto text-left block ml-2">
    <h3 class="font-semibold text-2xl my-4 text-indigo-700 ml-6">Steps</h3>
    <div
      v-for="(step, index) in recipes.activeRecipe.steps"
      :key="step"
      class="m-2 mb-4 flex flex-col md:flex-row md:space-x-4 space-y-4 justify-start"
    >
      <div class="md:mx-4 mt-2">
        <h3 class="font-semibold text-lg text-left md:mb-2 text-indigo-500">
          Step {{ index + 1 }}
        </h3>
        <p class="text-left text-indigo-500">
          {{ step.substring(step.indexOf('.') + 1) }}
        </p>
      </div>
      <img
        class="md:h-32 md:w-32 h-64 w-64 mx-auto shadow-md p-2 md:order-first"
        :src="recipes.activeRecipe.imageFilename"
      />
    </div>
  </div>
</template>
