<script setup lang="ts">
import { recipes } from '@/stores/recipes'

function rtrim(word: string, char: string) {
  var end = word.length - 1
  while (char.indexOf(word[end]) >= 0) {
    end -= 1
  }
  return word.substr(0, end + 1)
}

function formatPluralIngredientUnits(
  units: int,
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
</script>
<template>
  <div class="max-w-2xl mx-auto inline-block float-left ml-2">
    <h3 class="font-semibold text-lg mb-2">Ingredients</h3>
    <ul class="text-left">
      <li
        v-for="ingredient in recipes.activeRecipe.ingredients"
        :key="ingredient"
        class=""
      >
        {{
          formatPluralIngredientUnits(
            ingredient.quantity,
            ingredient.unit,
            ingredient.ingredientName
          )
        }}
      </li>
    </ul>
  </div>
</template>
