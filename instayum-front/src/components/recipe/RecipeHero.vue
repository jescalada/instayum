<script setup lang="ts">
import { recipes } from '@/stores/recipes'
import { api } from '@/stores/api'
import { onMounted, ref } from 'vue'
import { tsConstructSignatureDeclaration } from '@babel/types'
import { diff } from 'jest-diff'

const recipe = ref({ recipeName: 'Default Recipe' })
const difficultyColor = ref('text-green-600')
const difficultyText = ref('Easy')

// Compute difficulty of recipe
// Currently handles this naively by checking the number of steps in the recipe
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

async function fetchRecipe() {
  fetch(`${api.API_PATH}/recipes/${recipes.value.activeId}`).then(
    async (response) => {
      recipe.value = await response.json()
      recipe.value.imageFilename =
        recipe.value.imageFilename === '/recipedb/static/recipe_temp.jpg'
          ? 'instayum logo mouth.png'
          : recipe.value.imageFilename
      setDifficultyColor(recipe.value)
      console.log(recipe.value)
    }
  )
}

onMounted(() => {
  fetchRecipe()
})
</script>

<template>
  <div
    class="flex flex-col items-center justify-center p-2 pt-6 mx-auto max-w-2xl text-center bg-indigo-50"
  >
    <div class="flex md:flex-row flex-col rounded-xl">
      <img
        :src="recipe.imageFilename"
        class="h-64 w-full object-cover rounded-md p-2"
      />
      <div class="flex flex-col">
        <h2 class="text-2xl font-bold p-2 mb-2 md:mt-2">
          {{ recipe.recipeName }}
        </h2>
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
