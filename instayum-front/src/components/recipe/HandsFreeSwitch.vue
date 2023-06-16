<script setup lang="ts">
import { ref } from 'vue'

const handsFree = ref(false)
const emit = defineEmits(['toggleHandsFree'])

function toggleCheckbox() {
  handsFree.value = !handsFree.value
  emit('toggleHandsFree', handsFree.value)
}
</script>

<template>
  <div class="self-end inline-block float-right">
    <!-- Container for alignment -->
    <div class="flex flex-row w-full m-3">
      <!-- Title -->
      <h3 class="text-lg font-semibold mx-3 mt-1">Hands-free</h3>

      <!-- Switch -->
      <label class="switch w-16">
        <input type="checkbox" @click="toggleCheckbox" />
        <div class="slider round h-9"></div>
      </label>
    </div>
  </div>
</template>

<style>
.switch {
  text-align: center;
  position: relative;
  display: inline-block;
}

.switch input {
  display: none;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.slider:before {
  position: absolute;
  content: '';
  height: 26px;
  width: 26px;
  left: 6px;
  bottom: 5px;
  background-color: white;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

input:checked + .slider {
  background-color: #5731bf;
}

input:focus + .slider {
  box-shadow: 0 0 1px #5731bf;
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>
