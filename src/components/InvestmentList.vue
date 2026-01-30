<template>
    <v-card class="mb-6" elevation="4" rounded>
        <v-card-title class="d-flex justify-space-between align-center">
            <span>{{ $t('investments') }}</span>
            <span style="font-size: 1rem;">{{ $t('total') }}: {{ store.formatMoney(store.totalPortfolioValue) }}</span>
        </v-card-title>
        <v-card-text>
            <!-- Add new investment -->
            <v-row dense>
                <v-col cols="5">
                    <v-text-field v-model="name" :label="$t('stockName')" variant="outlined" density="compact" />
                </v-col>
                <v-col cols="5">
                    <v-text-field v-model.number="value" :label="$t('value')" type="number" variant="outlined"
                        density="compact" />
                </v-col>
                <v-col cols="2">
                    <v-btn color="primary" block @click="add">{{ $t('add') }}</v-btn>
                </v-col>
            </v-row>

            <!-- Investment table -->
            <div style="overflow-x:auto; margin-top:12px;">
                <v-data-table :headers="headers" :items="store.investments" hide-default-footer density="compact"
                    :mobile-breakpoint="0">
                    <template #item.name="{ item }">
                        <div style="min-width: 120px; width: 100%;">
                            <v-text-field v-model="item.name" variant="outlined" density="compact" hide-details
                                style="font-size: 14px;" />
                        </div>
                    </template>

                    <template #item.value="{ item }">
                        <div style="min-width: 90px; max-width: 120px; width: 100%;">
                            <v-text-field v-model.number="item.value" type="number" variant="outlined" density="compact"
                                hide-details style="font-size: 14px; text-align: right;" />
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
    </v-card>
</template>

<script setup>
import { ref, nextTick, computed } from 'vue'
import { usePortfolioStore } from '@/store/usePortfolioStore'
import { useI18n } from 'vue-i18n'

const store = usePortfolioStore()
const { t } = useI18n()
const name = ref('')
const value = ref(0)

const add = () => {
    store.addInvestment(name.value, value.value)
    name.value = ''
    value.value = 0
    nextTick(() => {
        // Optional: Scroll to the new item if needed
    })
}

const deleteInvestment = (investment) => {
    store.deleteInvestment(investment.id) // Assuming each investment has a unique 'id'
}

const headers = computed(() => [
    { title: t('stockName'), key: 'name', width: '45%' },
    { title: t('value'), key: 'value', width: '45%' },
    { title: t('actions'), key: 'actions', width: '10%', sortable: false },
])
</script>
