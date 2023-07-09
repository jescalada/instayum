<template>
  <div
    class="speech-recognizer"
    :class="{
      error: error,
      active: isRecognizing,
    }"
    @click="start"
  >
    <i class="fa-solid fa-microphone fa-2xl mt-8" style="color: #ffffff"></i>
  </div>
</template>

<script setup lang="ts">
import { landing } from '@/stores/landing'
import { api } from '@/stores/api'
import { ref } from 'vue'
import { recipes } from '@/stores/recipes'

// Define basic recognition variables
const error = ref()
const isRecognizing = ref<boolean>(false)
const runtimeTranscription = ref<string>('')
const transcription = ref()
const requestSent = ref<boolean>(false)

// Define props
const props = withDefaults(
  defineProps<{
    lang: string
    continuous: boolean
    interimResults: boolean
    maxAlternatives: number
  }>(),
  {
    lang: 'en',
    continuous: true,
    interimResults: true,
    maxAlternatives: 1,
  }
)

// Define emits
const emit = defineEmits([
  'start',
  'result',
  'error',
  'transcription',
  'end',
  'audiostart',
  'audioend',
  'soundstart',
  'soundend',
  'speechstart',
  'speechend',
])

// Initialize speech recognition object
const SpeechRecognition =
  window['SpeechRecognition'] || window['webkitSpeechRecognition']
if (!SpeechRecognition) {
  throw new Error('Speech Recognition is not supported in current browser.')
}
const recognition = new SpeechRecognition()

const start = () => {
  if (isRecognizing.value) {
    recognition.abort()
    return
  }
  recognition.start()
}

// Get values from props and set to object
recognition.lang = props.lang
recognition.continuous = props.continuous
recognition.maxAlternatives = props.maxAlternatives
recognition.interimResults = props.interimResults

// Reset the query and start listening
recognition.addEventListener('start', () => {
  error.value = null
  isRecognizing.value = true
  requestSent.value = false
  landing.value.setQuery('')

  emit('start')
})

// Triggered on recognition error
recognition.addEventListener('error', (err: string) => {
  error.value = err
  isRecognizing.value = false
  console.log('Speech Recognition Error: ', err)
  emit('error', error)
})

// Store the runtime captured transcription text
recognition.addEventListener('result', async (event) => {
  const results = Array.from(event.results)
  const text = results
    .map((result) => result[0])
    .map((result) => result.transcript)
    .join('')
  const isFinal = results.some((result: { isFinal: boolean }) => result.isFinal)
  if (text && !isFinal) {
    runtimeTranscription.value = text
    landing.value.setQuery(runtimeTranscription.value)
  }
  // Redirect to results page by fetching recipes from query
  if (isFinal && !requestSent.value) {
    let results
    await fetch(
      api.API_PATH +
        '/recipes?' +
        new URLSearchParams({
          query: runtimeTranscription.value,
        }),
      {
        method: 'GET',
      }
    ).then(async (response) => {
      results = await response.json()
      requestSent.value = true
      recipes.value.setQueryResults(results)
      location.href = '/#/results'
      recognition.stop()
    })
  }
})

// Generic event logging
recognition.addEventListener('nomatch', () => {
  console.error('Speech not recognized')
})

recognition.addEventListener('speechend', () => {
  console.log('Speech has stopped being detected')
})

recognition.addEventListener('soundend', (event) => {
  console.log('Sound has stopped being received')
})

// On recognition end if a good transcription has been captured
// emit the transcription event with the whole transcriptions list
// and the last captured sentence than reset the runtime transcription
recognition.addEventListener('end', () => {
  isRecognizing.value = false

  if (runtimeTranscription.value !== '') {
    transcription.value.push(runtimeTranscription.value)

    emit('transcription', {
      transcription: transcription.value,
      lastSentence: runtimeTranscription.value,
    })
  }

  runtimeTranscription.value = ''
  emit('end')
})
</script>

<style>
.speech-recognizer {
  cursor: pointer;
  position: relative;
  background-color: #ff9c09;
  border-radius: 50%;
  width: 64px;
  height: 64px;
  display: block;
  transition: all ease-in 250ms;
}
.speech-recognizer:hover {
  background-color: #ff6200;
}

.speech-recognizer .error {
  background-color: #ff0000;
}

.speech-recognizer .active {
  background-color: #ef5350;
  -webkit-animation: pulse 1.25s infinite cubic-bezier(0.66, 0, 0, 1);
  -moz-animation: pulse 1.25s infinite cubic-bezier(0.66, 0, 0, 1);
  animation: pulse 1.25s infinite cubic-bezier(0.66, 0, 0, 1);
}
@keyframes pulse {
  from {
    box-shadow: 0 0 0 0 rgba(232, 76, 61, 0.7);
  }

  to {
    box-shadow: 0 0 0 10px rgba(239, 83, 80, 0.1);
    background-color: #e53935;
    transform: scale(0.9);
  }
}
</style>
