<script setup lang="ts">
import { recipes } from '@/stores/recipes'

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
</script>
<template>
  <!-- List of ingredients -->
  <div class="max-w-4xl mx-auto my-4">
    <h3 class="text-left font-semibold text-2xl m-3 ml-4 text-indigo-700">
      Ingredients
    </h3>
    <ul class="text-left list-disc ml-8 text-indigo-500">
      <li
        v-for="ingredient in recipes.activeRecipe.ingredients"
        :key="ingredient.ingredientName"
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
