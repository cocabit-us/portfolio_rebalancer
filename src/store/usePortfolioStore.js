import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

export const usePortfolioStore = defineStore('portfolio', () => {
  const investments = ref(JSON.parse(localStorage.getItem('investments') || '[]'))
  const groups = ref(JSON.parse(localStorage.getItem('groups') || '[]'))

  // Ensure all investments have a unique ID for deletion.
  // This handles legacy data from localStorage that might not have an ID.
  investments.value.forEach(inv => {
    if (!inv.id) {
      inv.id = crypto.randomUUID()
    }
  })

  // Ensure all groups have a unique ID for deletion.
  groups.value.forEach(grp => {
    if (!grp.id) {
      grp.id = crypto.randomUUID()
    }
    if (grp.targetPercent === undefined) {
      grp.targetPercent = 0
    }
    // Migrate stocks from name to ID if necessary (for legacy data)
    grp.stocks.forEach(stock => {
      const invById = investments.value.find(i => i.id === stock.selectedStock)
      if (!invById) {
        const invByName = investments.value.find(i => i.name === stock.selectedStock)
        if (invByName) {
          stock.selectedStock = invByName.id
        }
      }
    })
  })

  // Add investment
  const addInvestment = (name, value) => {
    if (!name || value <= 0) return
    investments.value.push({ id: crypto.randomUUID(), name, value: parseFloat(value) })
  }

  // Delete investment
  const deleteInvestment = (id) => {
    investments.value = investments.value.filter(inv => inv.id !== id)
  }

  // Add group
  const addGroup = (name) => {
    if (!name) return
    groups.value.push({ id: crypto.randomUUID(), name, stocks: [], targetPercent: 0 })
  }

  // Delete group
  const deleteGroup = (id) => {
    groups.value = groups.value.filter(g => g.id !== id)
  }

  // Add stock to group
  const addStockToGroup = (group, stockId = '', percent = 0) => {
    group.stocks.push({ selectedStock: stockId, percent })
  }

  // Remove stock from group
  const removeStockFromGroup = (group, index) => {
    group.stocks.splice(index, 1)
  }

  // Calculations
  const totalPortfolioValue = computed(() => {
    return investments.value.reduce((sum, inv) => sum + inv.value, 0)
  })

  const totalTargetPercent = computed(() => {
    return groups.value.reduce((sum, group) => sum + (group.targetPercent || 0), 0)
  })

  const currentValue = (stockId) => {
    const inv = investments.value.find(i => i.id === stockId)
    return inv ? inv.value : 0
  }

  const groupTargetValue = (group) => {
    return (totalPortfolioValue.value * (group.targetPercent || 0)) / 100
  }

  const groupCurrentValue = (group) => {
    return group.stocks.reduce((sum, stock) => sum + currentValue(stock.selectedStock), 0)
  }

  const groupBuySell = (group) => {
    return groupTargetValue(group) - groupCurrentValue(group)
  }

  const totalGroupsValue = computed(() => {
    return groups.value.reduce((sum, group) => sum + groupCurrentValue(group), 0)
  })

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
    deleteInvestment,
    addGroup,
    deleteGroup,
    addStockToGroup,
    removeStockFromGroup,
    currentValue,
    totalPortfolioValue,
    totalTargetPercent,
    groupTargetValue,
    groupCurrentValue,
    groupBuySell,
    totalGroupsValue,
    formatMoney
  }
})
