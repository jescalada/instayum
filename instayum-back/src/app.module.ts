import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RecipesController } from './recipes/recipes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RecipeSchema } from 'src/schema/recipe.schema';
import { RecipesService } from './recipes/recipes.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_URI}`,
      { dbName: process.env.MONGODB_DBNAME },
    ),
    MongooseModule.forFeature([{ name: 'Recipe', schema: RecipeSchema }]),
  ],
  controllers: [AppController, RecipesController],
  providers: [AppService, RecipesService],
})
export class AppModule {}
