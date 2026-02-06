<template>
    <v-card class="mb-6" elevation="4" rounded>
        <v-card-title class="d-flex justify-space-between align-center">
            <span>{{ $t('groups') }} : {{ store.formatMoney(store.totalGroupsValue) }}</span>
            <span :style="{ color: store.totalTargetPercent === 100 ? 'green' : 'red', fontSize: '1rem' }">
                {{ $t('total') }}: {{ store.totalTargetPercent }}%
            </span>
        </v-card-title>
        <v-card-text>
            <!-- Add new group -->
            <v-row dense class="mb-3">
                <v-col cols="8">
                    <v-text-field v-model="groupName" :label="$t('groupName')" variant="outlined" density="compact"
                        hide-details />
                </v-col>
                <v-col cols="4">
                    <v-btn color="primary" block @click="addGroup">{{ $t('add') }}</v-btn>
                </v-col>
            </v-row>

            <!-- Groups table -->
            <div class="mt-2">
                <template v-for="(group, index) in store.groups" :key="group.id">
                    <div>
                        <div class="d-flex flex-wrap justify-space-between align-center mb-3">
                            <div class="d-flex align-center">
                                <v-btn icon variant="text" size="small" density="compact" class="mr-1"
                                    @click="toggleExpand(group.id)">
                                    <v-icon>{{ isExpanded(group.id) ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
                                </v-btn>
                                <div style="font-weight: bold; font-size: 1.1em;" class="mr-2">{{ group.name }}</div>
                            </div>
                            <div class="d-flex align-center my-1">
                                <div style="width: 100px;" class="mr-2">
                                    <v-text-field v-model.number="group.targetPercent" :label="$t('target')"
                                        type="number" suffix="%" density="compact" hide-details variant="outlined" />
                                </div>
                                <div style="font-weight: bold; white-space: nowrap;"
                                    :style="{ color: getActionColor(group) }">
                                    {{ store.groupBuySell(group) >= 0 ? $t('buy') : $t('sell') }}: {{
                                        store.formatMoney(Math.abs(store.groupBuySell(group))) }}
                                    <span class="ml-1">({{ getPercentage(group).toFixed(1) }}%)</span>
                                </div>
                            </div>
                        </div>
                        <div v-show="isExpanded(group.id)">
                            <div class="d-flex justify-space-between align-center mb-2 px-2 py-1"
                                style="background-color: #f5f5f5; border-radius: 4px;">
                                <div>
                                    <strong>{{ $t('total') }}:</strong> {{
                                        store.formatMoney(store.groupCurrentValue(group)) }}
                                </div>
                                <div>
                                    <strong>{{ $t('target') }}:</strong> {{
                                        store.formatMoney(store.groupTargetValue(group)) }}
                                </div>
                            </div>
                            <div v-for="(stock, idx) in group.stocks" :key="idx" style="margin-bottom:8px;">
                                <v-row dense align="center">
                                    <v-col cols="6">
                                        <v-select v-model="stock.selectedStock"
                                            :items="availableStocks(stock.selectedStock)" item-title="name"
                                            item-value="id" :label="$t('stock')" density="compact" variant="outlined"
                                            hide-details />
                                    </v-col>
                                    <v-col cols="4" class="text-right">
                                        {{ store.formatMoney(store.currentValue(stock.selectedStock)) }}
                                    </v-col>
                                    <v-col cols="2" class="text-center px-0">
                                        <v-btn icon flat size="small" density="compact"
                                            @click="store.removeStockFromGroup(group, idx)">
                                            <v-icon size="small">mdi-close</v-icon>
                                        </v-btn>
                                    </v-col>
                                </v-row>
                            </div>
                            <div class="d-flex align-center mt-2">
                                <v-btn size="small" color="secondary" class="mr-2"
                                    @click="store.addStockToGroup(group)">
                                    {{ $t('addStock') }}</v-btn>
                                <v-btn size="small" color="error" variant="text" @click="deleteGroup(group)">
                                    {{ $t('deleteGroup') }}
                                </v-btn>
                            </div>
                        </div>
                    </div>
                    <v-divider v-if="index < store.groups.length - 1" class="my-4"></v-divider>
                </template>
            </div>
        </v-card-text>
    </v-card>
</template>

<script setup>
import { ref, computed } from 'vue'
import { usePortfolioStore } from '@/store/usePortfolioStore'

const store = usePortfolioStore()
const groupName = ref('')

const expanded = ref([])

const toggleExpand = (id) => {
    if (expanded.value.includes(id)) {
        expanded.value = expanded.value.filter(i => i !== id)
    } else {
        expanded.value.push(id)
    }
}

const isExpanded = (id) => expanded.value.includes(id)

const usedStockIds = computed(() => {
    const used = new Set()
    store.groups.forEach(g => {
        g.stocks.forEach(s => {
            if (s.selectedStock) used.add(s.selectedStock)
        })
    })
    return used
})

const availableStocks = (currentStockId) => {
    return store.investments
        .filter(i => !usedStockIds.value.has(i.id) || i.id === currentStockId)
}

const addGroup = () => {
    store.addGroup(groupName.value)
    groupName.value = ''
}

const deleteGroup = (group) => {
    store.deleteGroup(group.id)
}

const getPercentage = (group) => {
    if (!store.totalPortfolioValue) return 0
    return (Math.abs(store.groupBuySell(group)) / store.totalPortfolioValue) * 100
}

const getActionColor = (group) => {
    const amount = store.groupBuySell(group)
    const percent = getPercentage(group)

    if (amount < 0) { // Sell
        if (percent > 20) return 'darkred'
        if (percent > 10) return 'red'
    } else { // Buy
        if (percent > 10) return 'darkgreen'
    }
    return 'grey'
}
</script>
