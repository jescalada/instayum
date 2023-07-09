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

// Watches for changes in the command, and automatically triggers them
watch(commands.value, (commandsState, previousCommandsState) => {
  document.getElementById('command-box')?.scrollIntoView({ behavior: 'smooth' })
  commandTrigger(commandsState.activeRecipeCommand)
})

// Triggers the ingredient command on component mounted
onMounted(() => {
  commandTrigger(RecipeCommand.Ingredients)
})

/**
 * Triggers a recipe command
 * @param command the RecipeCommand to trigger
 */
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
    default:
      return
  }
  synthesize()
}

/**
 * Generates voice using voice synthesis depending on the current step number.
 */
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
  synthesizer.value?.speak(recipes.value.stepText)
}


/**
 * Triggers the Next command (Next Step)
 */
function onNext() {
  if (currentStepNumber.value < steps.length - 1) {
    currentStepNumber.value += 1
  }
}

/**
 * Triggers the Previous command (Previous Step)
 */
function onPrevious() {
  if (currentStepNumber.value > 0) {
    currentStepNumber.value -= 1
  }
}

/**
 * Triggers the First command (Step 0)
 */
function onFirst() {
  currentStepNumber.value = 0
}

/**
 * Triggers the Ingredients command (Step -1)
 */
function onIngredients() {
  currentStepNumber.value = -1
}

/**
 * Repeats the previous command.
 */
function onRepeat() {
  // Doesn't need to do anything, repeat works by default
}

/**
 * Formats an ingredient to its human-readable plural form.
 * Example: formatPluralIngredientUnits(3, "", "onion") -> "3 onions"
 * @param units the number of units for this ingredient. Ex: 3, 500, 1/2
 * @param unitName the name of the units: Ex: pieces, grams, liters
 * @param ingredientName the name of the ingredient, in singular. Ex: onion, tomato, pear
 */
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

/**
 * Helper function to trim the right portion based on a character
 */
function rtrim(word: string, char: string) {
  var end = word.length - 1
  while (char.indexOf(word[end]) >= 0) {
    end -= 1
  }
  return word.substr(0, end + 1)
}

// Initialize a reactive reference of the voice synthesizer object
const synthesizer = ref()
</script>
<template>
  <!-- Main container -->
  <div class="max-w-4xl mx-auto block ml-2" id="command-box">
    
    <!-- Active Command display -->
    <h3 class="font-semibold text-2xl m-4 text-left text-indigo-700">
      Command: {{ commands.activeRecipeCommand }}
    </h3>
    <p class="text-left ml-4 text-indigo-700">
      Example commands: <br>What's the <b>First</b> step?<br>What's the <b>Next</b> step?<br>What's the <b>Previous</b> step?<br>Can you <b>Repeat</b> that?<br>
      What are the <b>Ingredients</b>?
    </p>

    <!-- Interactive content -->
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
    
    <!-- Interpreter and Synthesizer initialized as well (hidden) -->
    <CommandInterpreter />
    <SpeechSynthesizer ref="synthesizer" />
  </div>
</template>
