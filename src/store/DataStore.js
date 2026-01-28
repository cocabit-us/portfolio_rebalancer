import { defineStore } from 'pinia'

export const useDataStore = defineStore('dataStore', {
  state: () => ({
    investments: [],
    groups: []
  }),
  actions: {
    addInvestment(name, value) {
      this.investments.push({ name, value: parseFloat(value) || 0 })
    },
    addGroup(name, targets) {
      this.groups.push({ name, targets })
    },
    updateInvestmentValue(index, newValue) {
      this.investments[index].value = parseFloat(newValue) || 0
    }
  },
  persist: true // optional, with pinia-plugin-persistedstate
})
