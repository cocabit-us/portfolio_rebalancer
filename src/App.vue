<template>
  <v-app>
    <v-app-bar app color="primary" dark density="compact">
      <div class="text-h6 ml-4">{{ $t('appTitle') }}</div>
      <v-spacer></v-spacer>
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn icon v-bind="props">
            <v-icon>mdi-translate</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item v-for="lang in langs" :key="lang.value" @click="locale = lang.value">
            <v-list-item-title>{{ lang.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-main>
      <v-container class="py-6" fluid>
        <div style="max-width: 600px; margin: 0 auto;">
          <InvestmentList />
          <GroupList />
          <SnapshotList />
        </div>
      </v-container>
    </v-main>

    <v-footer color="grey-lighten-4" app height="20">
      <div class="text-center w-100 text-caption"
        v-html="$t('footer', { year: new Date().getFullYear(), company: companyLink })"></div>
    </v-footer>
  </v-app>
</template>

<script setup>
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import InvestmentList from './components/InvestmentList.vue'
import GroupList from './components/GroupList.vue'
import SnapshotList from './components/SnapshotList.vue'

const { locale } = useI18n()

onMounted(() => {
  if (!document.querySelector('script[src*="googletagmanager"]')) {
    const script1 = document.createElement('script')
    script1.async = true
    script1.src = "https://www.googletagmanager.com/gtag/js?id=G-JWLXLVKTLP"
    document.head.appendChild(script1)

    const script2 = document.createElement('script')
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-JWLXLVKTLP');
    `
    document.head.appendChild(script2)
  }
})

const companyLink = `<a href="https://github.com/cocabit-us/portfolio_rebalancer" target="_blank" rel="noopener noreferrer" style="text-decoration: none; color: inherit;">Cocabit</a>`

const langs = [
  { title: 'English', value: 'en' },
  { title: '中文', value: 'zh' },
  { title: 'Español', value: 'es' },
  { title: 'Deutsch', value: 'de' },
  { title: '日本語', value: 'ja' },
  { title: '한국어', value: 'ko' }
]
</script>

<style>
body {
  background-color: #f5f5f5;
  font-family: Roboto, system-ui, sans-serif;
}
</style>
