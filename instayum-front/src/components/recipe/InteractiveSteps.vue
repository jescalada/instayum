<script setup lang="ts">
import { recipes } from '@/stores/recipes'
import { commands } from '@/stores/commands'
import { onMounted, ref, toRaw, watch } from 'vue'
import CommandInterpreter from './CommandInterpreter.vue'
import { RecipeCommand } from './RecipeCommand'
import IngredientsCard from './IngredientsCard.vue'
import SpeechSynthesizer from './SpeechSynthesizer.vue'

const currentStepNumber = ref<number>(-1)

const ingredients = recipes.value.activeRecipe.ingredients
const steps = recipes.value.activeRecipe.steps

watch(commands.value, (commandsState, previousCommandsState) => {
  document.getElementById('command-box')?.scrollIntoView({ behavior: 'smooth' })
  console.log('command, previous command', commandsState, previousCommandsState)
  commandTrigger(commandsState.activeRecipeCommand)
})

onMounted(() => {
  commandTrigger(RecipeCommand.Ingredients)
})

function commandTrigger(command: RecipeCommand) {
  console.log(
    '*** current value, command before trigger: ',
    currentStepNumber.value,
    command
  )
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
    default:
      return
  }
  synthesize()
}

async function synthesize() {
  if (currentStepNumber.value == -1) {
    let ingredientSpeech = 'Ingredients: '
    ingredients.forEach((ingredient) => {
      ingredientSpeech += formatPluralIngredientUnits(
        ingredient.quantity,
        ingredient.unit,
        ingredient.ingredientName
      )
      ingredientSpeech += ', '
    })
    recipes.value.setStepText(ingredientSpeech)
  } else {
    const stepsRaw: string[] = toRaw(recipes.value.activeRecipe.steps)
    const step: string = stepsRaw[currentStepNumber.value]
    const stepText = step.substring(
      steps[currentStepNumber.value].indexOf('.') + 1
    )
    recipes.value.setStepText(
      `Step ${currentStepNumber.value + 1}: ${stepText}`
    )
  }
  console.log('synthesizing...')
  synthesizer.value?.speak(recipes.value.stepText)
}

function onNext() {
  if (currentStepNumber.value < steps.length - 1) {
    console.log('current Step: ', currentStepNumber)
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
  currentStepNumber.value = -1
}

function onRepeat() {
  // todo repeat voice synthesis
}

function formatPluralIngredientUnits(
  units: number,
  unitName: string,
  ingredientName: string
): string {
  if (!unitName) {
    return `${units} ${ingredientName}${units > 1 ? 's' : ''}`
  }
  return `${units} ${rtrim(unitName, 's')}${
    units > 1 ? 's' : ''
  } ${ingredientName}`
}

function rtrim(word: string, char: string) {
  var end = word.length - 1
  while (char.indexOf(word[end]) >= 0) {
    end -= 1
  }
  return word.substr(0, end + 1)
}

const synthesizer = ref()
</script>
<template>
  <div class="max-w-4xl mx-auto block ml-2" id="command-box">
    <h3 class="font-semibold text-2xl m-4 text-left text-indigo-700">
      Command: {{ commands.activeRecipeCommand }}
    </h3>
    <p class="text-left ml-4 text-indigo-700">
      Example commands: <br>What's the <b>First</b> step?<br>What's the <b>Next</b> step?<br>What's the <b>Previous</b> step?<br>Can you <b>Repeat</b> that?<br>
      What are the <b>Ingredients</b>?
    </p>
    <div
      v-if="currentStepNumber >= 0"
      class="ml-3 my-4 flex flex-col md:flex-row md:space-x-4 justify-between"
    >
      <div>
        <h3 class="font-semibold text-2xl my-2 mb-4 text-left text-indigo-700">
          {{ 'Step ' + (currentStepNumber + 1) }}
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
    <IngredientsCard v-if="currentStepNumber == -1" />
    <CommandInterpreter />
    <SpeechSynthesizer ref="synthesizer" />
  </div>
</template>
