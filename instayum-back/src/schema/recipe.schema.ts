import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Ingredient } from './ingredient';

@Schema()
export class Recipe {
  @Prop()
  name: string;

  @Prop()
  steps: string[];

  @Prop()
  ingredients: Ingredient[];
}
export const RecipeSchema = SchemaFactory.createForClass(Recipe);
