<script setup lang="ts">
import { landing } from '@/stores/landing'
import SpeechRecognizer from './SpeechRecognizer.vue'

function search() {
  console.log('Searching for: ' + landing.value.query)
}
</script>

<template>
  <div class="mx-auto bg-indigo-50">
    <div class="flex flex-col items-center justify-center p-2 pt-6">
      <div class="flex flex-row">
        <h2 class="text-2xl font-bold text-indigo-400 p-4">
          What's in the fridge?
        </h2>

        <SpeechRecognizer
          class="justify-center mb-2 z-5"
          :lang="'en'"
          :continuous="true"
          :interim-results="true"
          :max-alternatives="1"
        />
      </div>

      <input
        id="search-bar"
        v-model="landing.query"
        name="search-bar"
        class="border-4 border-indigo-600 max-w-2xl rounded-xl p-2 m-2 w-full"
      />
      <div class="flex flex-row">
        <button
          class="grow-0 text-center p-2 bg-orange-400 border-4 border-orange-600 text-lg font-semibold text-white rounded-xl m-2 hover:drop-shadow-lg hover:bg-indigo-400 hover:border-indigo-700 transition-all"
          @click="search()"
        >
          SUBMIT
        </button>
      </div>
    </div>
  </div>
</template>
