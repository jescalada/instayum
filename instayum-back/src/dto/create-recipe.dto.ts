import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsArray,
  ValidateNested,
  ArrayNotEmpty,
} from 'class-validator';
import { IngredientDto } from './ingredient.dto';

export class CreateRecipeDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  readonly name: string;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested()
  readonly ingredients: IngredientDto[];

  @IsArray()
  @ArrayNotEmpty()
  readonly steps: string[];
}
