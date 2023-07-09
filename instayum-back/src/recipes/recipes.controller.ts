/**
 * Recipe-related endpoints
 */
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

  /**
   * Gets the top 20 matches of recipe by query.
   * @param query the raw query for the database
   * @param response the response object
   * @returns a JSON array of recipe objects
   */
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

  /**
   * Adds a new recipe to DB.
   * @param response the response object
   * @param createRecipeDto the data for the recipe (DTO)
   * @returns a JSON response with the new recipe if success
   */
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

  /**
   * Gets a recipe by internal recipeId.
   * @param response the response object
   * @param recipeId the id to obtain
   * @returns a JSON response with the obtained recipe if succeeded
   */
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

  /**
   * Parses a JSON array of recipes and adds them to DB.
   * @param response the response object
   * @returns a JSON response with the result of the operation
   */
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

  /**
   * Deletes all the recipes from database.
   * @param response the response object
   * @returns a JSON response with the result of the operation
   */
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
