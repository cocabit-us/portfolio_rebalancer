<template>
  <v-card class="mb-6" elevation="4" rounded>
    <v-card-title>📊 Groups</v-card-title>
    <v-card-text>
      <!-- Add new group -->
      <v-row dense class="mb-3">
        <v-col cols="12" sm="8">
          <v-text-field v-model="groupName" label="Group Name" outlined dense />
        </v-col>
        <v-col cols="12" sm="4">
          <v-btn color="primary" block @click="addGroup">Add Group</v-btn>
        </v-col>
      </v-row>

      <!-- Groups table -->
      <div style="overflow-x:auto;">
        <v-data-table
          :headers="headers"
          :items="store.groups"
          hide-default-footer
          dense
        >
          <template #item.stocks="{ item: group }">
            <div v-for="(stock, idx) in group.stocks" :key="idx" style="margin-bottom:8px;">
              <v-row dense>
                <v-col cols="12" sm="4">
                  <v-select
                    v-model="stock.selectedStock"
                    :items="store.investments.map(i => i.name)"
                    label="Stock"
                    dense
                    outlined
                  />
                </v-col>
                <v-col cols="12" sm="2">
                  <v-text-field
                    v-model.number="stock.percent"
                    type="number"
                    label="%"
                    dense
                    outlined
                  />
                </v-col>
                <v-col cols="12" sm="2">
                  Current: {{ store.formatMoney(store.currentValue(stock.selectedStock)) }}
                </v-col>
                <v-col cols="12" sm="2">
                  Target: {{ store.formatMoney(store.targetValue(stock, group)) }}
                </v-col>
                <v-col cols="12" sm="2">
                  <span :style="{ color: store.buySell(stock, group) > 0 ? 'green' : 'red' }">
                    {{ store.buySell(stock, group) > 0 ? '+' : '' }}{{ store.formatMoney(store.buySell(stock, group)) }}
                  </span>
                </v-col>
              </v-row>
            </div>
            <v-btn small block color="secondary" @click="store.addStockToGroup(group)">+ Add Stock</v-btn>
          </template>
        </v-data-table>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref } from 'vue'
import { usePortfolioStore } from '@/store/usePortfolioStore'

const store = usePortfolioStore()
const groupName = ref('')

const addGroup = () => {
  store.addGroup(groupName.value)
  groupName.value = ''
}

const headers = [
  { text: 'Stocks', value: 'stocks' },
]
</script>
