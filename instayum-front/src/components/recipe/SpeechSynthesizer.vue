<script setup lang="ts">
let voices: SpeechSynthesisVoice[]

// Create a new utterance for the specified text and add it to
// the queue.
const speak = async (text: string) => {
  voices = await speechSynthesis.getVoices()

  if (speechSynthesis?.speaking) {
    speechSynthesis.cancel()
  }

  let msg = new SpeechSynthesisUtterance(text)
  console.log(msg)
  msg.voice = voices.find(voice => voice.name.includes('Google US English'))

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
</script>
