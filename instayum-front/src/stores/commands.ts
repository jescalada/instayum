/**
 * Store for active recipe command
 */

import { RecipeCommand } from '@/components/recipe/RecipeCommand'
import { ref } from 'vue'

export const commands = ref({
  activeRecipeCommand: RecipeCommand.Invalid,
  setActiveRecipeCommand(value: RecipeCommand) {
    this.activeRecipeCommand = value
  },
})
