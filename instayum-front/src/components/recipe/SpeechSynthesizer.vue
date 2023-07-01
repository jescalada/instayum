<script setup lang="ts">
// Create a new utterance for the specified text and add it to
// the queue.
const speak = (text: string) => {
  console.log(`triggered: ${text}`)
  // Create a new instance of SpeechSynthesisUtterance.
  let msg = new SpeechSynthesisUtterance(text)

  // msg.voice = {
  //   default: true,
  //   lang: 'en-us',
  //   name: 'Google US English',
  //   localService: true,
  //   voiceURI: 'Google US English',
  // }

  // Queue this utterance.
  speechSynthesis.speak(msg)
}

defineExpose({
  speak,
})

const speechSynthesis =
  window['speechSynthesis'] || window['webkitSpeechSynthesis']
if (!speechSynthesis) {
  throw new Error('Speech Recognition is not supported in current browser.')
}

const voices = await speechSynthesis.getVoices()
const defaultVoice = voices.find((voice) => voice.name == 'Google US English')
</script>
