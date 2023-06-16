<script setup lang="ts">
import { recipes } from '@/stores/recipes'
import { ref } from 'vue'

const currentStepNumber = ref<number>(0)

const ingredients = recipes.value.activeRecipe.ingredients
const steps = recipes.value.activeRecipe.steps
</script>
<template>
  <div class="max-w-4xl mx-auto block ml-2">
    <h3 class="font-semibold text-2xl my-4">Command:</h3>
    <p>Say: Ingredients - First - Next - Previous - Repeat</p>
    <div
      class="m-3 mb-4 flex flex-col md:flex-row md:space-x-4 justify-between"
    >
      <div>
        <h3 class="font-semibold text-lg text-left mb-2">
          {{
            currentStepNumber > 0 ? 'Step ' + currentStepNumber : 'Ingredients'
          }}
        </h3>
        <p class="text-left">
          {{
            steps[currentStepNumber].substring(
              steps[currentStepNumber].indexOf('.') + 1
            )
          }}
        </p>
      </div>
      <img
        class="md:h-32 md:w-32 h-64 w-64 mx-auto shadow-md p-2"
        :src="recipes.activeRecipe.imageFilename"
      />
    </div>
  </div>
</template>
