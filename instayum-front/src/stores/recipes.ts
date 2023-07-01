import { RecipeCommand } from '@/components/recipe/RecipeCommand'
import { ref } from 'vue'

export const recipes = ref({
  queryResults: {},
  setQueryResults(value) {
    this.queryResults = value
  },
  activeId: 0,
  setActiveId(value: number) {
    this.activeId = value
  },
  activeRecipe: {},
  setActiveRecipe(value) {
    this.activeRecipe = value
  },
  activeRecipeCommand: RecipeCommand.Invalid,
  setActiveRecipeCommand(value: RecipeCommand) {
    this.activeRecipeCommand = value
  },
  stepText: '',
  setStepText(value: string) {
    this.stepText = value
  },
})
