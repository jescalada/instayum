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
    const existingRecipe = await this.recipeModel.findById(recipeId).exec();

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
}
