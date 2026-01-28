<template>
  <div class="card">
    <h2>Investments</h2>
    <div class="input-row">
      <input v-model="name" placeholder="Stock name" />
      <input v-model.number="value" type="number" placeholder="Value ($)" />
      <button @click="add">Add</button>
    </div>
    <ul>
      <li v-for="(item, i) in store.investments" :key="i">
        <input v-model="item.name" />
        <input v-model.number="item.value" type="number" />
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useDataStore } from '@/store/DataStore'
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

<style scoped>
.card { background: white; padding: 1rem; border-radius: 12px; margin-bottom: 1rem; }
.input-row { display: flex; gap: 0.5rem; }
input { border: 1px solid #ccc; border-radius: 6px; padding: 0.5rem; flex: 1; }
button { background: #007bff; color: white; border: none; border-radius: 6px; padding: 0.5rem 1rem; cursor: pointer; }
@media (max-width: 600px) { .input-row { flex-direction: column; } }
</style>
