<template>
  <div
    style="display: none"
    class="speech-recognizer"
    :class="{
      error: error,
      active: isRecognizing,
    }"
    @click="start"
  ></div>
</template>

<script setup lang="ts">
import { landing } from '@/stores/landing'
import { onUnmounted, ref, watch } from 'vue'
import { recipes } from '@/stores/recipes'
import { RecipeCommand } from './RecipeCommand'

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
const commandProcessed = ref<boolean>(false)

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
  landing.value.setQuery('')

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
  if (isFinal) {
    const command: RecipeCommand = processCommand(runtimeTranscription.value)
    recipes.value.setActiveRecipeCommand(RecipeCommand.Invalid)
    recipes.value.setActiveRecipeCommand(command)
    recognition.abort()
    setTimeout(() => {
      recognition.start()
    }, 1000)
    // let results
    // await fetch(
    //   api.API_PATH +
    //     '/recipes?' +
    //     new URLSearchParams({
    //       query: runtimeTranscription.value,
    //     }),
    //   {
    //     method: 'GET',
    //   }
    // ).then(async (response) => {
    //   results = await response.json()
    //   requestSent.value = true
    //   recipes.value.setQueryResults(results)
    //   location.href = '/#/results'
    //   recognition.stop()
    // })
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
  console.log('Sound has stopped being received. Restarting...')
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

function processCommand(text: string): RecipeCommand {
  // todo: implement intelligent command matching using Natural Language Processing
  // todo: improve matching efficiency
  if (
    text.includes('next') ||
    text.includes('continue') ||
    text.includes('after')
  ) {
    return RecipeCommand.Next
  } else if (text.includes('repeat') || text.includes('again')) {
    return RecipeCommand.Repeat
  } else if (
    text.includes('previous') ||
    text.includes('before') ||
    text.includes('back') ||
    text.includes('last')
  ) {
    return RecipeCommand.Previous
  } else if (text.includes('ingredient')) {
    return RecipeCommand.Ingredients
  } else if (text.includes('first') || text.includes('start')) {
    return RecipeCommand.First
  } else {
    return RecipeCommand.Invalid
  }
}

start()

onUnmounted(() => {
  recognition.abort()
})
</script>