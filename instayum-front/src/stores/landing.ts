import { ref } from 'vue'

export const landing = ref({
  query: '',
  setQuery(value: string) {
    this.query = value
  },
})
