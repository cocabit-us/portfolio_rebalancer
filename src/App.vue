<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-app-bar-title>Portfolio Rebalancing</v-app-bar-title>
    </v-app-bar>

    <v-main>
      <v-container class="py-6" fluid>
        <div style="max-width: 600px; margin: 0 auto;">
          <InvestmentList />
          <GroupList />
        </div>
      </v-container>
    </v-main>

    <v-footer color="grey-lighten-4" app height="20">
      <div class="text-center w-100 text-caption">© {{ new Date().getFullYear() }} Cocabit</div>
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
