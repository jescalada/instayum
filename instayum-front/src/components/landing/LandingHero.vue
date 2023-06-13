<script setup lang="ts">
import SearchBox from '../shared/SearchBox.vue'
</script>

<template>
  <div class="mx-auto bg-indigo-50">
    <div class="flex flex-col items-center justify-center p-2 pt-6">
      <SearchBox />
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
        <img src="/instayum logo mouth only.png" />
      </div>
    </div>
  </div>
</template>
