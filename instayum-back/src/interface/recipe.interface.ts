import { Document } from 'mongoose';
import { Ingredient } from 'src/schema/ingredient';

export interface IRecipe extends Document {
  readonly name: string;
  readonly steps: string[];
  readonly ingredients: Ingredient[];
}
