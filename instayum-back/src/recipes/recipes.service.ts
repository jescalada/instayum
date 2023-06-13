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

  async createRecipe(createRecipeDto: CreateRecipeDto): Promise<IRecipe> {
    const newRecipe = await new this.recipeModel(createRecipeDto);
    return newRecipe.save();
  }

  async getAllRecipes(): Promise<IRecipe[]> {
    const recipes = await this.recipeModel.find();

    if (!recipes || recipes.length == 0) {
      throw new NotFoundException('Recipes not found!');
    }
    return recipes;
  }

  async getRecipe(recipeId: string): Promise<IRecipe> {
    const existingRecipe = await this.recipeModel
      .findOne({ recipeId: recipeId })
      .exec();

    if (!existingRecipe) {
      throw new NotFoundException(`Recipe #${recipeId} not found!`);
    }
    return existingRecipe;
  }

  async addRecipeDataFromJSON(filename: string): Promise<IRecipe[]> {
    const addedRecipes = await this.recipeModel.insertMany(recipesJson);

    if (!addedRecipes) {
      throw new InternalServerErrorException(`Screwed something up! Whoopsie`);
    }
    return addedRecipes;
  }

  async deleteAll(): Promise<DeleteResult> {
    const deleted = await this.recipeModel.deleteMany({});

    if (!deleted) {
      throw new InternalServerErrorException("Couldn't delete, whoopsie!");
    }
    return deleted;
  }

  async queryRecipes(query: string, resultLimit: number): Promise<IRecipe[]> {
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

  private async processQueryIntoIngredientNames(
    query: string,
  ): Promise<string[]> {
    const validIngredients: string[] = await this.getUniqueIngredients().then(
      (response) => {
        return response[0].uniqueValues;
      },
    );
    const ingredientsInQuery: string[] = [];
    query.split(' ').forEach((keyword) => {
      if (validIngredients.some((ingredient) => ingredient.includes(keyword))) {
        ingredientsInQuery.push(keyword);
      }
    });
    console.log('Ingredients in the query: ', ingredientsInQuery);
    return ingredientsInQuery;
  }

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
