<template>
  <main class="container">
    <h1>Portfolio Rebalancing Tool</h1>
    <InvestmentList />
    <GroupList />
  </main>
</template>

<script setup>
import InvestmentList from './components/InvestmentList.vue'
import GroupList from './components/GroupList.vue'
</script>

<style>
body {
  font-family: system-ui, sans-serif;
  background: #f5f7fa;
  margin: 0;
}
.container {
  max-width: 800px;
  margin: auto;
  padding: 1rem;
}
h1 {
  text-align: center;
  margin-bottom: 1rem;
}
</style>
