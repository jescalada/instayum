<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    name: string
    img: string
    id: number
  }>(),
  {
    name: 'Invalid Recipe',
    img: 'instayum logo mouth.png',
    id: 0,
  }
)

const recipeName = props.name
const imageFilename =
  props.img === '/recipedb/static/recipe_temp.jpg'
    ? 'instayum logo mouth.png'
    : props.img

function viewRecipe(recipeId: number) {
  console.log('Attempting to view reipce')
  location.href = `/#/recipe/${recipeId}`
}
</script>
<template>
  <div
    class="flex flex-row mx-auto border-4 border-indigo-600 max-w-2xl rounded-xl p-2 m-2 w-full text-center transition hover:bg-indigo-100 hover:cursor-pointer"
    @click="viewRecipe(id)"
  >
    <img :src="imageFilename" class="h-32 w-32 rounded-md" />

    <h3 class="text-center text-xl font-bold ml-4 text-indigo-800">
      {{ recipeName }}
    </h3>
  </div>
</template>
