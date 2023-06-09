<script setup lang="ts">
import { recipes } from '@/stores/recipes'
import { api } from '@/stores/api'
import { onMounted, ref } from 'vue'

// Define reactive parameters
const recipe = ref({
  recipeName: 'Default Recipe',
  imageFilename: 'Default',
})
const difficultyColor = ref('text-green-600')
const difficultyText = ref('Easy')

/**
 * Compute difficulty of recipe. (Currently handles this naively by checking the number of steps in the recipe) 
 */ 
function setDifficultyColor(recipe) {
  if (recipe.steps.length > 6) {
    difficultyColor.value = 'text-red-700'
    difficultyText.value = 'Hard'
  } else if (recipe.steps.length > 3) {
    difficultyColor.value = 'text-yellow-600'
    difficultyText.value = 'Medium'
  } else {
    difficultyColor.value = 'text-green-600'
    difficultyText.value = 'Easy'
  }
}

/**
 * Fetch a recipe from our backend API
 */
async function fetchRecipe() {
  // Logging added to make sure the right API_PATH is being used in production
  console.log('fetching recipe at API_PATH: ', api.API_PATH)
  fetch(`${api.API_PATH}/recipes/${recipes.value.activeId}`).then(
    async (response) => {
      recipe.value = await response.json()
      recipe.value.imageFilename =
        recipe.value.imageFilename === '/recipedb/static/recipe_temp.jpg'
          ? '/instayum_logo_mouth.png'
          : recipe.value.imageFilename
      setDifficultyColor(recipe.value)
      recipes.value.setActiveRecipe(recipe)
    }
  )
}

// Fetch recipe details immediately on mount
onMounted(() => {
  fetchRecipe()
})
</script>

<template>
  <!-- Recipe Hero Container -->
  <div
    class="flex flex-col items-center justify-center p-2 pt-8 mx-auto w-full text-center"
  >
  <!-- Recipe Details -->
    <div class="flex md:flex-row flex-col rounded-xl">
      <img
        :src="recipe.imageFilename"
        class="h-64 w-full object-cover rounded-md p-2 shadow-md"
      />
      <div class="flex flex-col">
        <h2 class="text-2xl font-bold p-2 mb-2 md:mt-2 text-indigo-700">
          {{ recipe.recipeName }}
        </h2>
        <!-- Extra details -->
        <div class="flex flex-col self-end align-bottom m-2">
          <div class="flex flex-row font-semibold">
            <i class="fa-solid fa-gauge p-1 mr-2"></i>
            <p :class="difficultyColor">{{ difficultyText }}</p>
          </div>
          <div class="flex flex-row">
            <i class="fa-solid fa-hourglass p-1 mr-3"></i>
            <p>20 min.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
