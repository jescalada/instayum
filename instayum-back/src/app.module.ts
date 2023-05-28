import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RecipesController } from './recipes/recipes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RecipeSchema } from 'src/schema/recipe.schema';
import { RecipesService } from './recipes/recipes.service';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://juan:Rocco123@cluster0.nxfhi.mongodb.net/?retryWrites=true&w=majority',
      { dbName: 'instayum' },
    ),
    MongooseModule.forFeature([{ name: 'Recipe', schema: RecipeSchema }]),
  ],
  controllers: [AppController, RecipesController],
  providers: [AppService, RecipesService],
})
export class AppModule {}
