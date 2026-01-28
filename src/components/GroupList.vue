<template>
  <v-card class="mb-6" elevation="4">
    <v-card-title>Groups</v-card-title>
    <v-card-text>
      <v-row dense>
        <v-col cols="12" sm="6">
          <v-text-field v-model="groupName" label="Group name" outlined dense />
        </v-col>
        <v-col cols="12" sm="4">
          <v-text-field v-model.number="target" label="Target %" type="number" outlined dense />
        </v-col>
        <v-col cols="12" sm="2">
          <v-btn color="primary" class="w-100" @click="addGroup">Add</v-btn>
        </v-col>
      </v-row>

      <v-expansion-panels>
        <v-expansion-panel v-for="(group, i) in store.groups" :key="i">
          <v-expansion-panel-title>
            {{ group.name }} — Target: {{ group.targets }}%
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-checkbox
              v-for="(inv, j) in store.investments"
              :key="j"
              v-model="group.investments"
              :label="`${inv.name} ($${inv.value})`"
              :value="inv.name"
            />
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref } from 'vue'
import { useDataStore } from '@/store/dataStore'
const store = useDataStore()
const groupName = ref('')
const target = ref(0)

const addGroup = () => {
  if (!groupName.value) return
  store.groups.push({ name: groupName.value, targets: target.value, investments: [] })
  groupName.value = ''
  target.value = 0
}
</script>
