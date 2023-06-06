<template>
  <div
    class="speech-recognizer"
    :class="{
      error: error,
      active: isRecognizing,
    }"
    @click="start"
  ></div>

  <span></span>
  <div>
    <h1>Variables</h1>
    <p>error: {{ error }}</p>
    <p>isRecognizing: {{ isRecognizing }}</p>
    <p>runtimeTranscription: {{ runtimeTranscription }}</p>
    <p>transcription: {{ transcription }}</p>
  </div>
</template>

<script setup lang="ts">
import { landing } from '@/stores/landing'
import { api } from '@/stores/api'
import { ref, watch } from 'vue'

const redirectedEvents = [
  'audiostart',
  'audioend',
  'soundstart',
  'soundend',
  'speechstart',
  'speechend',
]

const error = ref()
const isRecognizing = ref<boolean>(false)
const runtimeTranscription = ref<string>('')
const transcription = ref<Array>([])
const requestSent = ref<boolean>(false)

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

watch(props, (newValue, oldValue) => {
  for (var key in props) {
    if (props.hasOwnProperty(key) && typeof props[key] !== 'undefined') {
      recognition[key] = props[key]
    }
  }
})

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

recognition.lang = props.lang
recognition.continuous = props.continuous
recognition.maxAlternatives = props.maxAlternatives
recognition.interimResults = props.interimResults

recognition.addEventListener('start', () => {
  error.value = null
  isRecognizing.value = true
  console.log('Starting...')
  emit('start')
})

recognition.addEventListener('error', (err: string) => {
  error.value = err
  isRecognizing.value = false
  console.log('Error: ', err)
  emit('error', error)
})

// Store the runtime captured transciption text
recognition.addEventListener('result', async (event) => {
  const results = Array.from(event.results)
  const text = results
    .map((result) => result[0])
    .map((result) => result.transcript)
    .join('')
  const isFinal = results.some((result) => result.isFinal)
  if (text && !isFinal) {
    runtimeTranscription.value = text
    landing.value.setQuery(runtimeTranscription.value)
  }
  if (isFinal && !requestSent.value) {
    await fetch(
      api.API_PATH +
        '/recipes?' +
        new URLSearchParams({
          query: runtimeTranscription.value,
        })
    ).then((response) => {
      requestSent.value = response.ok
    })
    // todo: make the recording stop at this point (otherwise speech continues to be recorded)
  }
  console.log(event, isFinal)
})

recognition.addEventListener('nomatch', () => {
  console.error('Speech not recognized')
})

recognition.addEventListener('speechend', () => {
  console.log('Speech has stopped being detected')
})

recognition.addEventListener('soundend', (event) => {
  console.log('Sound has stopped being received')
})
// On recognition end if a good transciption has been captured
// emit the transcription event with the whole transciptions list
// and the last captured sentence than reset the runtime transciption
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

// Redirect standard events as Vue component events
redirectedEvents.forEach((eName): void => {
  recognition.addEventListener(eName, () => {
    emit(eName)
  })
})
</script>

<style>
.speech-recognizer {
  cursor: pointer;
  position: relative;
  background-color: #4db6ac;
  border-radius: 50%;
  width: 64px;
  height: 64px;
  display: block;
  transition: all ease-in 250ms;
}
.speech-recognizer:hover {
  background-color: #26a69a;
}

.speech-recognizer .error {
  background-color: #bdbdbd;
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
