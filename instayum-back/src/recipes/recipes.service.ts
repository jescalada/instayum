/**
 * Middleware class for performing operations in the DB.
 */
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRecipeDto } from 'src/dto/create-recipe.dto';
import { IRecipe } from 'src/interface/recipe.interface';
import recipesJson from './recipes.json';
import { DeleteResult } from 'mongodb';

@Injectable()
export class RecipesService {
  constructor(@InjectModel('Recipe') private recipeModel: Model<IRecipe>) {}

  /**
   * Creates a recipe
   * @param createRecipeDto the DTO for creating recipe
   * @returns the new recipe in JSON format if succeeded
   */
  async createRecipe(createRecipeDto: CreateRecipeDto): Promise<IRecipe> {
    const newRecipe = await new this.recipeModel(createRecipeDto);
    return newRecipe.save();
  }

  /**
   * Gets all the recipes.
   * @returns all the recipes in JSON format if succeeded
   * @throws NotFoundException if no recipes in DB
   */
  async getAllRecipes(): Promise<IRecipe[]> {
    const recipes = await this.recipeModel.find();

    if (!recipes || recipes.length == 0) {
      throw new NotFoundException('Recipes not found!');
    }
    return recipes;
  }

  /**
   * Gets a recipe by recipeId
   * @param recipeId the id of the recipe
   * @returns the recipe in JSON format if succeeded
   * @throws NotFoundException if failed to find
   */
  async getRecipe(recipeId: string): Promise<IRecipe> {
    const existingRecipe = await this.recipeModel
      .findOne({ recipeId: recipeId })
      .exec();

    if (!existingRecipe) {
      throw new NotFoundException(`Recipe #${recipeId} not found!`);
    }
    return existingRecipe;
  }

  /**
   * Adds the recipe data from a JSON file.
   * @param filename the filename to open
   * @returns the added recipes if succeeded
   * @throws InternalServerErrorException when something went wrong
   */
  async addRecipeDataFromJSON(filename: string): Promise<IRecipe[]> {
    const addedRecipes = await this.recipeModel.insertMany(recipesJson);

    if (!addedRecipes) {
      throw new InternalServerErrorException(`Screwed something up! Whoopsie`);
    }
    return addedRecipes;
  }

  /**
   * Deletes all the recipes
   * @returns an empty JSON array if succeeded
   * @throws InternalServerErrorException if something went wrong
   */
  async deleteAll(): Promise<DeleteResult> {
    const deleted = await this.recipeModel.deleteMany({});

    if (!deleted) {
      throw new InternalServerErrorException("Couldn't delete, whoopsie!");
    }
    return deleted;
  }

  /**
   * Gets the most relevant recipes using MongoDB aggregation magic
   * @param query the raw query
   * @param resultLimit the number of results we want to fetch
   * @returns the most relevant matches in JSON format
   */
  async queryRecipes(query: string, resultLimit: number): Promise<IRecipe[]> {
    // Note: this is a naive/simplified solution.
    // If I had more time, I would implement a smarter algorithm that uses relative weights for each ingredient

    // For example, we would like to add extra weight to ingredients that make up most of the recipe,
    // and reduce weights for spices and small ingredients.
    const ingredientsInQuery = await this.processQueryIntoIngredientNames(
      query,
    );

    return this.recipeModel.aggregate([
      {
        $addFields: {
          weight: {
            $size: {
              $setIntersection: [
                '$ingredients.ingredientName',
                ingredientsInQuery,
              ],
            },
          },
        },
      },
      {
        $sort: {
          weight: -1,
        },
      },
      {
        $limit: resultLimit,
      },
    ]);
  }

  /**
   * Processes a raw query into valid ingredient names.
   * Ex: "I have some cheese, some beef and some lettuce", returns ["cheese", "beef", "lettuce"]
   * @param query the raw query
   * @returns an array of identified ingredient names
   */
  private async processQueryIntoIngredientNames(
    query: string,
  ): Promise<string[]> {
    // Gets the valid ingredients currently in our DB
    const validIngredients: string[] = await this.getUniqueIngredients().then(
      (response) => {
        return response[0].uniqueValues;
      },
    );
    // Naively checks if the ingredient is in the query string
    // NOTE: If I had more time, I would implement a Natural Language Processing algorithm to enhance the matching.
    const ingredientsInQuery: string[] = [];
    query.split(' ').forEach((keyword) => {
      if (validIngredients.some((ingredient) => ingredient.includes(keyword))) {
        ingredientsInQuery.push(keyword);
      }
    });
    return ingredientsInQuery;
  }

  /**
   * Gets the unique ingredients currently available in DB using MongoDB aggregation magic
   * @returns an array of strings with all the valid ingredient names
   */
  private async getUniqueIngredients(): Promise<any> {
    return await this.recipeModel.aggregate([
      {
        $unwind: '$ingredients',
      },
      {
        $group: {
          _id: null,
          ingredients: {
            $addToSet: '$ingredients',
          },
        },
      },
      {
        $group: {
          _id: null,
          ingredients: {
            $first: '$ingredients',
          },
        },
      },
      {
        $unwind: '$ingredients',
      },
      {
        $group: {
          _id: null,
          uniqueValues: { $addToSet: '$ingredients.ingredientName' },
        },
      },
    ]);
  }
}
