import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { CreateRecipeDto } from 'src/dto/create-recipe.dto';
import { RecipesService } from './recipes.service';
import { Response } from 'express';

@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Get()
  async getRecipes(@Query() query, @Res() response: Response) {
    try {
      const recipeData = await this.recipesService.queryRecipes(
        query.query,
        20,
      );
      return response.send(recipeData);
    } catch (err) {
      console.log('There was an error in getting the recipes: ', err);
    }
  }

  @Post()
  async createRecipe(
    @Res() response,
    @Body() createRecipeDto: CreateRecipeDto,
  ) {
    try {
      const newRecipe = await this.recipesService.createRecipe(createRecipeDto);
      console.log('New recipe DTO: ', createRecipeDto);
      return response.status(HttpStatus.CREATED).json({
        message: 'Recipe has been created successfully.',
        newRecipe: newRecipe,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Error: Recipe not created.',
        error: 'Bad Request',
      });
    }
  }

  @Get('/:id')
  async getRecipe(@Res() response, @Param('id') recipeId: string) {
    try {
      const existingRecipe = await this.recipesService.getRecipe(recipeId);
      return response.send(existingRecipe);
    } catch (err) {
      return response.status(HttpStatus.NOT_FOUND).json({
        statusCode: HttpStatus.NOT_FOUND,
        message: `No recipe with recipeId #${recipeId}!`,
        error: 'Not Found',
      });
    }
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

  @Post('addRecipeDataFromFile')
  async addRecipeDataFromFile(@Res() response) {
    try {
      const addedRecipes = await this.recipesService.addRecipeDataFromJSON(
        './recipes.json',
      );
      return response.status(HttpStatus.OK).json({
        message: 'Recipes added!',
        addedRecipes: addedRecipes,
      });
    } catch (err) {
      return response.status(HttpStatus.NOT_FOUND).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Something went wrong... Error: ${err}`,
        error: 'Server Error',
      });
    }
  }

  @Post('deleteAll')
  async deleteAll(@Res() response) {
    try {
      const deleted = await this.recipesService.deleteAll();
      return response.status(HttpStatus.OK).json({
        message: 'Recipes nuked!',
        deleted: deleted,
      });
    } catch (err) {
      return response.status(HttpStatus.NOT_FOUND).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Something went wrong... Error: ${err}`,
        error: 'Server Error',
      });
    }
  }
}
