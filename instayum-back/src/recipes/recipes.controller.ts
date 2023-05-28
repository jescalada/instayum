import { Controller, Get, Param, Post } from '@nestjs/common';

@Controller('recipes')
export class RecipesController {
  @Get()
  findAll(): string {
    return 'There are no recipes right now. Epic fail!';
  }

  @Post()
  create(): string {
    return 'Attempting to add a recipe...';
  }

  @Get(':id')
  findOne(@Param() params: any): string {
    console.log(`Request recipeId: ${params.id}`);
    return `Attempting to retrieve recipeId ${params.id}`;
  }

  @Get(':id/first')
  getFirstStep(@Param() params: any): string {
    console.log(`Request recipeId: ${params.id}`);
    return `Attempting to fetch the first step for recipeId ${params.id}`;
  }

  @Get(':id/next')
  getNextStep(@Param() params: any): string {
    console.log(`Request recipeId: ${params.id}`);
    return `Attempting to fetch the next step for recipeId ${params.id}`;
  }

  @Get(':id/previous')
  getPreviousStep(@Param() params: any): string {
    console.log(`Request recipeId: ${params.id}`);
    return `Attempting to fetch the previous step for recipeId ${params.id}`;
  }

  @Get(':id/current')
  getCurrentStep(@Param() params: any): string {
    console.log(`Request recipeId: ${params.id}`);
    return `Attempting to fetch the current step for recipeId ${params.id}`;
  }

  @Get(':id/ingredients')
  getIngredients(@Param() params: any): string {
    console.log(`Request recipeId: ${params.id}`);
    return `Attempting to fetch the ingredients for recipeId ${params.id}`;
  }
}
