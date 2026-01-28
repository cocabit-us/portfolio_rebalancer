<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-app-bar-title>Portfolio Rebalancing Tool</v-app-bar-title>
    </v-app-bar>

    <v-main>
      <v-container class="py-6">
        <InvestmentList />
        <GroupList />
      </v-container>
    </v-main>

    <v-footer color="grey-lighten-4" app>
      <v-col class="text-center">© {{ new Date().getFullYear() }} Portfolio Tools</v-col>
    </v-footer>
  </v-app>
</template>

<script setup>
import InvestmentList from './components/InvestmentList.vue'
import GroupList from './components/GroupList.vue'
</script>

<style>
body {
  background-color: #f5f5f5;
  font-family: Roboto, system-ui, sans-serif;
}
</style>
