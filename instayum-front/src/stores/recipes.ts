/**
 * Store for recipe related values
 */
import { ref } from 'vue'

export const recipes = ref({
  queryResults: null,
  setQueryResults(value) {
    this.queryResults = value
  },
  activeId: 0,
  setActiveId(value: number) {
    this.activeId = value
  },
  activeRecipe: {
    recipeName: 'Default Recipe',
    imageFilename: 'Default Recipe',
    ingredients: [
      {
        ingredientName: 'Default Ingredient',
        unit: 'pieces',
        quantity: 1,
      },
    ],
    steps: ['Default Step'],
  },
  setActiveRecipe(value) {
    this.activeRecipe = value
  },
  stepText: '',
  setStepText(value: string) {
    this.stepText = value
  },
})
