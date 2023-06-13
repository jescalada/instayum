<script lang="ts" setup>
import MainHeader from '@/components/shared/MainHeader.vue'
import ResultsHero from '@/components/results/ResultsHero.vue'
import RecipeResultCard from '@/components/results/RecipeResultCard.vue'
import { recipes } from '@/stores/recipes'
import { landing } from '@/stores/landing'
</script>

<template>
  <MainHeader />
  <ResultsHero />
  <p class="max-w-2xl text-left text-lg m-2 mx-auto">
    Top {{ recipes.queryResults.length }} matches for
    <strong>{{ landing.query }}</strong
    >:
  </p>
  <p>{{ recipes.queryResults }}</p>
  <RecipeResultCard
    v-for="recipe in recipes.queryResults"
    :key="recipe.recipeId"
    :name="recipe.recipeName"
    :img="recipe.imageFilename"
    :id="recipe.recipeId"
  />
</template>
