<script setup lang="ts">
import { landing } from '@/stores/landing'

function search() {
  console.log('Searching for: ' + landing.value.query)
}
</script>

<template>
  <div class="sm:container sm:mx-auto bg-rose-300">
    <div class="flex flex-col items-center justify-center p-2 py-8">
      <h2 class="text-2xl font-bold text-red-800 p-2">
        What's on the menu, chef?
      </h2>
      <input
        id="search-bar"
        v-model="landing.query"
        name="search-bar"
        class="border-4 border-red-700 rounded-xl p-2 m-2 w-full"
      />
      <button
        class="grow-0 text-center p-2 bg-red-700 border-4 border-red-700 text-lg font-semibold text-rose-100 rounded-xl m-2"
        @click="search()"
      >
        SUBMIT
      </button>
      <p>Searching for: {{ landing.query }}</p>
    </div>
  </div>
</template>
