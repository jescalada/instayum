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
      <div class="text-indigo-700 max-w-xl">
        <h2 class="mt-6 text-2xl">How to use:</h2>
        <p class="mt-4 mb-4 text-left">
          <strong>1) Say something</strong>, press record or type in the box<br />
          <strong>2)</strong> Tell us what <strong>ingredients</strong> you have
          available<br />
          <strong>3) Get AI recommendations </strong> on what to cook next!
        </p>
        <p class="text-left mb-16">
          <strong>Note: Google Chrome is required</strong> to make use of the
          voice recognition feature. We're working hard to have this working on
          all platforms!<br /><br /><strong
            >Please enable your microphone</strong
          >
          when prompted to enjoy all the features in the app.
        </p>
        <img src="instayum logo mouth only.png" />
      </div>
    </div>
  </div>
</template>
