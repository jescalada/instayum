<script setup lang="ts">
import { recipes } from '@/stores/recipes'
import SearchBox from '../shared/SearchBox.vue'
import { landing } from '@/stores/landing'

const query = landing.value.query
</script>

<template>
  <div class="mx-auto bg-indigo-50">
    <div class="flex flex-col items-center justify-center p-2 pt-6">
      <SearchBox />
    </div>
  </div>
</template>
