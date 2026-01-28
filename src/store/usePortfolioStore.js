import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

export const usePortfolioStore = defineStore('portfolio', () => {
  const investments = ref(JSON.parse(localStorage.getItem('investments') || '[]'))
  const groups = ref(JSON.parse(localStorage.getItem('groups') || '[]'))

  // Add investment
  const addInvestment = (name, value) => {
    if (!name || value <= 0) return
    investments.value.push({ name, value: parseFloat(value) })
  }

  // Add group
  const addGroup = (name) => {
    if (!name) return
    groups.value.push({ name, stocks: [] })
  }

  // Add stock to group
  const addStockToGroup = (group, stockName = '', percent = 0) => {
    group.stocks.push({ selectedStock: stockName, percent })
  }

  // Calculations
  const currentValue = (stockName) => {
    const inv = investments.value.find(i => i.name === stockName)
    return inv ? inv.value : 0
  }

  const targetValue = (stock, group) => {
    if (!stock.selectedStock) return 0
    const total = group.stocks.reduce((sum, s) => sum + currentValue(s.selectedStock), 0)
    return (total * stock.percent) / 100
  }

  const buySell = (stock, group) => targetValue(stock, group) - currentValue(stock.selectedStock)

  const formatMoney = (val) => `$${(val || 0).toLocaleString()}`

  // Persist
  watch([investments, groups], () => {
    localStorage.setItem('investments', JSON.stringify(investments.value))
    localStorage.setItem('groups', JSON.stringify(groups.value))
  }, { deep: true })

  return {
    investments,
    groups,
    addInvestment,
    addGroup,
    addStockToGroup,
    currentValue,
    targetValue,
    buySell,
    formatMoney
  }
})
