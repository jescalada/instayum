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
import { commands } from '@/stores/commands'
import { RecipeCommand } from './RecipeCommand'

const error = ref()
const isRecognizing = ref<boolean>(false)
const runtimeTranscription = ref<string>('')
const transcription = ref()

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
  const isFinal = results.some((result: { isFinal: boolean }) => result.isFinal)
  if (text && !isFinal) {
    runtimeTranscription.value = text
    landing.value.setQuery(runtimeTranscription.value)
  }
  if (isFinal) {
    const command: RecipeCommand = processCommand(runtimeTranscription.value)
    commands.value.setActiveRecipeCommand(RecipeCommand.Invalid)
    commands.value.setActiveRecipeCommand(command)
    recognition.abort()
    setTimeout(() => {
      recognition.start()
    }, 1000)
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
    transcription.value?.push(runtimeTranscription.value)

    emit('transcription', {
      transcription: transcription.value,
      lastSentence: runtimeTranscription.value,
    })
  }

  runtimeTranscription.value = ''
  emit('end')
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
