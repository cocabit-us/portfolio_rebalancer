<template>
  <v-card class="mb-6" elevation="4">
    <v-card-title>Investments</v-card-title>
    <v-card-text>
      <v-row dense>
        <v-col cols="12" sm="5">
          <v-text-field v-model="name" label="Stock name" outlined dense />
        </v-col>
        <v-col cols="12" sm="5">
          <v-text-field v-model.number="value" label="Value ($)" type="number" outlined dense />
        </v-col>
        <v-col cols="12" sm="2">
          <v-btn color="primary" class="w-100" @click="add">Add</v-btn>
        </v-col>
      </v-row>

      <v-table>
        <thead>
          <tr>
            <th>Stock</th>
            <th>Value ($)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(inv, i) in store.investments" :key="i">
            <td>
              <v-text-field v-model="inv.name" variant="plain" hide-details />
            </td>
            <td>
              <v-text-field v-model.number="inv.value" type="number" variant="plain" hide-details />
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref } from 'vue'
import { useDataStore } from '@/store/dataStore'
const store = useDataStore()
const name = ref('')
const value = ref(0)

const add = () => {
  if (!name.value) return
  store.addInvestment(name.value, value.value)
  name.value = ''
  value.value = 0
}
</script>
