<template>
    <v-card class="mb-6" elevation="4" rounded>
        <v-card-title class="d-flex justify-space-between align-center">
            <div class="d-flex align-center">
                <v-btn icon variant="text" size="small" density="compact" class="mr-2"
                    @click="isExpanded = !isExpanded">
                    <v-icon>{{ isExpanded ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
                </v-btn>
                <span>{{ $t('investments') }}</span>
            </div>
            <span style="font-size: 1rem;">{{ $t('total') }}: {{ store.formatMoney(store.totalPortfolioValue) }}</span>
        </v-card-title>
        <v-expand-transition>
            <div v-show="isExpanded">
                <v-card-text>
                    <!-- Add new investment -->
                    <v-row dense>
                        <v-col cols="10">
                            <v-row dense>
                                <v-col cols="6">
                                    <v-text-field v-model="name" :label="$t('stockName')" variant="outlined"
                                        density="compact" hide-details />
                                </v-col>
                                <v-col cols="6">
                                    <v-text-field v-model="code" :label="$t('stockCode')" variant="outlined"
                                        density="compact" hide-details />
                                </v-col>
                                <v-col cols="4">
                                    <v-select v-model="inputMode" :items="inputModes" item-title="title"
                                        item-value="value" density="compact" variant="outlined" hide-details />
                                </v-col>
                                <v-col cols="8">
                                    <v-text-field v-model="amount"
                                        :label="inputMode === 'value' ? $t('value') : $t('shares')" type="number"
                                        variant="outlined" density="compact" hide-details />
                                </v-col>
                            </v-row>
                        </v-col>
                        <v-col cols="2" class="d-flex align-center">
                            <v-btn color="primary" block @click="add" :loading="loading">{{ $t('add') }}</v-btn>
                        </v-col>
                    </v-row>

                    <!-- Investment table -->
                    <div style="overflow-x:auto; margin-top:12px;">
                        <v-data-table :headers="headers" :items="store.investments" :items-per-page="-1"
                            hide-default-footer density="compact" :mobile-breakpoint="0">
                            <template #item.name="{ item }">
                                <div style="min-width: 100px; width: 100%;">
                                    <v-text-field v-model="item.name" variant="outlined" density="compact" hide-details
                                        style="font-size: 14px;" />
                                </div>
                            </template>

                            <template #item.code="{ item }">
                                <div style="min-width: 80px; width: 100%;">
                                    <v-text-field v-model="item.code" variant="outlined" density="compact" hide-details
                                        style="font-size: 14px;" />
                                </div>
                            </template>

                            <template #item.shares="{ item }">
                                <div style="min-width: 80px; width: 100%;">
                                    <v-text-field v-model.number="item.shares" variant="outlined" density="compact"
                                        hide-details style="font-size: 14px; text-align: right;" type="number" />
                                </div>
                            </template>

                            <template #item.price="{ item }">
                                <div style="min-width: 80px; width: 100%; text-align: right; font-size: 14px;">
                                    {{ item.price ? store.formatMoney(item.price) : '' }}
                                </div>
                            </template>

                            <template #item.value="{ item }">
                                <div style="min-width: 100px; max-width: 150px; width: 100%;">
                                    <v-text-field
                                        :model-value="focusedFields[item.id] ? item.value : formatValue(item.value)"
                                        @update:model-value="val => item.value = parseFloat(val.replace(/,/g, '')) || 0"
                                        @focus="focusedFields[item.id] = true" @blur="focusedFields[item.id] = false"
                                        type="text" variant="outlined" density="compact" hide-details
                                        style="font-size: 14px; text-align: right;" />
                                </div>
                            </template>

                            <template #item.actions="{ item }">
                                <v-btn icon flat size="small" @click="deleteInvestment(item)">
                                    <v-icon>mdi-delete</v-icon>
                                </v-btn>
                            </template>
                        </v-data-table>
                    </div>
                </v-card-text>
            </div>
        </v-expand-transition>
    </v-card>
</template>

<script setup>
import { ref, nextTick, computed } from 'vue'
import { usePortfolioStore } from '@/store/usePortfolioStore'
import { useI18n } from 'vue-i18n'

const store = usePortfolioStore()
const { t } = useI18n()
const name = ref('')
const code = ref('')
const amount = ref('')
const loading = ref(false)
const inputMode = ref('value')
const isExpanded = ref(true)
const focusedFields = ref({})

const inputModes = computed(() => [
    { title: t('value'), value: 'value' },
    { title: t('shares'), value: 'shares' }
])

const formatValue = (val) => {
    if (val === null || val === undefined || val === '') return ''
    return Number(val).toLocaleString('en-US')
}

const add = async () => {
    loading.value = true
    let finalValue = 0
    let finalShares = 0
    let currentPrice = 0

    if (inputMode.value === 'value') {
        finalValue = parseFloat(amount.value) || 0
        if (code.value) {
            const price = await store.fetchPrice(code.value)
            if (price) {
                currentPrice = price
                finalShares = finalValue / price
            }
        }
    } else {
        finalShares = parseFloat(amount.value) || 0
        const price = await store.fetchPrice(code.value)
        if (price === null) {
            loading.value = false
            alert('Could not fetch price for ' + code.value)
            return
        }
        currentPrice = price
        finalValue = finalShares * price
    }

    store.addInvestment(name.value, code.value, finalValue, finalShares, currentPrice)
    name.value = ''
    code.value = ''
    amount.value = ''
    loading.value = false
    nextTick(() => {
        // Optional: Scroll to the new item if needed
    })
}

const deleteInvestment = (investment) => {
    store.deleteInvestment(investment.id) // Assuming each investment has a unique 'id'
}

const headers = computed(() => [
    { title: t('stockName'), key: 'name', width: '20%' },
    { title: t('stockCode'), key: 'code', width: '15%' },
    { title: t('price'), key: 'price', width: '15%' },
    { title: t('shares'), key: 'shares', width: '20%' },
    { title: t('value'), key: 'value', width: '20%' },
    { title: t('actions'), key: 'actions', width: '10%', sortable: false },
])
</script>
