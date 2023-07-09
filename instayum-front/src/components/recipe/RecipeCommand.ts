/**
 * Represents a RecipeCommand which can be used to control the flow of a recipe.
 */
export enum RecipeCommand {
  Invalid = 'Invalid',
  Start = 'Start',
  Ingredients = 'Ingredients',
  Next = 'Next',
  Previous = 'Previous',
  Repeat = 'Repeat',
  First = 'First',
}
