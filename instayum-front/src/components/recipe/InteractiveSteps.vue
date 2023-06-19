<script setup lang="ts">
import { recipes } from '@/stores/recipes'
import { WatchStopHandle, ref, watch } from 'vue'
import CommandInterpreter from './CommandInterpreter.vue'
import { RecipeCommand } from './RecipeCommand'
import IngredientsCard from './IngredientsCard.vue'
import { command } from 'yargs'

const currentStepNumber = ref<number>(-1)

const ingredients = recipes.value.activeRecipe.ingredients
const steps = recipes.value.activeRecipe.steps

watch(recipes.value, (recipeState, previousRecipeState) => {
  document.getElementById('command-box')?.scrollIntoView({ behavior: 'smooth' })
  commandTrigger(recipeState.activeRecipeCommand)
})

function commandTrigger(command: RecipeCommand) {
  switch (command) {
    case RecipeCommand.First:
      onFirst()
      break
    case RecipeCommand.Next:
      onNext()
      break
    case RecipeCommand.Previous:
      onPrevious()
      break
    case RecipeCommand.Ingredients:
      onIngredients()
      break
    case RecipeCommand.Repeat:
      onRepeat()
      break
  }
}

function onNext() {
  if (currentStepNumber.value < steps.length - 1) {
    currentStepNumber.value += 1
  }
}

function onPrevious() {
  if (currentStepNumber.value > 0) {
    currentStepNumber.value -= 1
  }
}

function onFirst() {
  currentStepNumber.value = 0
}

function onIngredients() {
  // todo implement ingredient container
  // use conditional rendering?
}

function onRepeat() {
  // todo repeat voice synthesis
}
</script>
<template>
  <div class="max-w-4xl mx-auto block ml-2" id="command-box">
    <h3 class="font-semibold text-2xl my-4">
      Command: {{ recipes.activeRecipeCommand }}
    </h3>
    <p>Say: Ingredients - First - Next - Previous - Repeat</p>
    <div
      class="m-3 mb-4 flex flex-col md:flex-row md:space-x-4 justify-between"
    >
      <div>
        <h3 class="font-semibold text-lg text-left mb-2">
          {{
            currentStepNumber > -1
              ? 'Step ' + (currentStepNumber + 1)
              : 'Ingredients'
          }}
        </h3>
        <p class="text-left" v-if="currentStepNumber >= 0">
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
        v-if="currentStepNumber >= 0"
      />
      <IngredientsCard v-if="currentStepNumber == -1" />
    </div>
    <CommandInterpreter />
  </div>
</template>
