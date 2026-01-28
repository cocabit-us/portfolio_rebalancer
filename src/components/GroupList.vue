<template>
  <div class="card">
    <h2>Groups</h2>
    <div class="input-row">
      <input v-model="groupName" placeholder="Group name" />
      <input v-model.number="target" type="number" placeholder="Target %" />
      <button @click="addGroup">Add</button>
    </div>

    <div v-for="(group, i) in store.groups" :key="i" class="group-block">
      <h3>{{ group.name }} (Target: {{ group.targets }}%)</h3>
      <p>Assigned Investments:</p>
      <ul>
        <li v-for="(inv, j) in store.investments" :key="j">
          <label>
            <input type="checkbox" v-model="group.investments" :value="inv.name" />
            {{ inv.name }} ({{ inv.value | currency }})
          </label>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useDataStore } from '@/store/DataStore'
const store = useDataStore()
const groupName = ref('')
const target = ref(0)

const addGroup = () => {
  if (!groupName.value) return
  store.groups.push({
    name: groupName.value,
    targets: target.value,
    investments: []
  })
  groupName.value = ''
  target.value = 0
}
</script>

<script>
export default {
  filters: {
    currency(val) {
      return `$${parseFloat(val).toLocaleString()}`
    }
  }
}
</script>

<style scoped>
.group-block { border-top: 1px solid #ddd; padding-top: 0.5rem; margin-top: 0.5rem; }
</style>
