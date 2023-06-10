import { ref } from 'vue'

export const recipes = ref({
  queryResults: {},
  setQueryResults(value) {
    this.queryResults = value
  },
  activeId: 0,
  setActiveId(value: number) {
    this.activeId = value
  },
})
