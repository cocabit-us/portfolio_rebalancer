import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

export const usePortfolioStore = defineStore('portfolio', () => {
  const investments = ref(JSON.parse(localStorage.getItem('investments') || '[]'))
  const groups = ref(JSON.parse(localStorage.getItem('groups') || '[]'))
  const snapshots = ref(JSON.parse(localStorage.getItem('snapshots') || '[]'))

  // Ensure all investments have a unique ID for deletion.
  // This handles legacy data from localStorage that might not have an ID.
  investments.value.forEach(inv => {
    if (!inv.id) {
      inv.id = crypto.randomUUID()
    }
    if (inv.price === undefined) {
      inv.price = 0
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
  const addInvestment = (name, code, value, shares = 0, price = 0) => {
    const numValue = parseFloat(value)
    if (isNaN(numValue)) return
    investments.value.push({ id: crypto.randomUUID(), name: name || '', code: code || '', value: numValue, shares: parseFloat(shares) || 0, price: parseFloat(price) || 0 })
  }

  const fetchPrice = async (symbol) => {
    if (!symbol) return null
    try {
      // Using a CORS proxy. corsproxy.io's free tier is localhost-only, so using allorigins.win.
      const yahooURL = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`
      const proxyURL = `https://api.allorigins.win/get?url=${encodeURIComponent(yahooURL)}`
      const response = await fetch(proxyURL)
      if (!response.ok) throw new Error('Network response was not ok')
      const data = await response.json()
      const yahooData = JSON.parse(data.contents)
      return yahooData?.chart?.result?.[0]?.meta?.regularMarketPrice || null
    } catch (e) {
      console.error('Failed to fetch price:', e)
      return null
    }
  }

  const refreshPrices = async () => {
    await Promise.all(investments.value.map(async (inv) => {
      if (inv.code && inv.shares) {
        const price = await fetchPrice(inv.code)
        if (price) {
          inv.price = price
          inv.value = inv.shares * price
        }
      }
    }))
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

  // Snapshots
  const saveSnapshot = (name) => {
    snapshots.value.push({
      id: crypto.randomUUID(),
      name: name || new Date().toLocaleString(),
      date: new Date().toISOString(),
      investments: JSON.parse(JSON.stringify(investments.value)),
      groups: JSON.parse(JSON.stringify(groups.value))
    })
  }

  const deleteSnapshot = (id) => {
    snapshots.value = snapshots.value.filter(s => s.id !== id)
  }

  const loadSnapshot = (snapshot) => {
    investments.value = JSON.parse(JSON.stringify(snapshot.investments))
    groups.value = JSON.parse(JSON.stringify(snapshot.groups))
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
  watch([investments, groups, snapshots], () => {
    localStorage.setItem('investments', JSON.stringify(investments.value))
    localStorage.setItem('groups', JSON.stringify(groups.value))
    localStorage.setItem('snapshots', JSON.stringify(snapshots.value))
  }, { deep: true })

  // Refresh prices on load
  refreshPrices()

  return {
    investments,
    groups,
    snapshots,
    addInvestment,
    deleteInvestment,
    addGroup,
    deleteGroup,
    addStockToGroup,
    removeStockFromGroup,
    saveSnapshot,
    deleteSnapshot,
    loadSnapshot,
    currentValue,
    totalPortfolioValue,
    totalTargetPercent,
    groupTargetValue,
    groupCurrentValue,
    groupBuySell,
    totalGroupsValue,
    formatMoney,
    fetchPrice,
    refreshPrices
  }
})
