import { IsInt, IsNotEmpty, IsString, Max, MaxLength } from 'class-validator';

export class IngredientDto {
  @IsString()
  @MaxLength(30)
  @IsNotEmpty()
  readonly name: string;

  @IsInt()
  @IsNotEmpty()
  @Max(50000)
  quantity: number;

  @IsString()
  @MaxLength(30)
  @IsNotEmpty()
  unit: string;
}
