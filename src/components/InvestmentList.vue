<template>
  <v-card class="mb-6" elevation="4" rounded>
    <v-card-title>💰 Investments</v-card-title>
    <v-card-text>
      <!-- Add new investment -->
      <v-row dense>
        <v-col cols="12" sm="5">
          <v-text-field v-model="name" label="Stock Name" outlined dense />
        </v-col>
        <v-col cols="12" sm="5">
          <v-text-field v-model.number="value" label="Value ($)" type="number" outlined dense />
        </v-col>
        <v-col cols="12" sm="2">
          <v-btn color="primary" block @click="add">Add</v-btn>
        </v-col>
      </v-row>

      <!-- Investment table -->
      <div style="overflow-x:auto; margin-top:12px;">
        <v-data-table
          :headers="headers"
          :items="store.investments"
          hide-default-footer
          dense
        >
          <template #item.name="{ item }">
            <v-text-field v-model="item.name" variant="outlined" dense hide-details />
          </template>
          <template #item.value="{ item }">
            <v-text-field v-model.number="item.value" type="number" variant="outlined" dense hide-details />
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
const name = ref('')
const value = ref(0)

const add = () => {
  store.addInvestment(name.value, value.value)
  name.value = ''
  value.value = 0
}

const headers = [
  { text: 'Stock', value: 'name' },
  { text: 'Value ($)', value: 'value' },
]
</script>
