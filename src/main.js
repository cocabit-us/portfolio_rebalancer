import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import { createVuetify } from 'vuetify'
import { createI18n } from 'vue-i18n'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

const messages = {
  en: {
    appTitle: 'Portfolio Rebalancing',
    investments: '💰 Investments',
    groups: '📊 Groups',
    total: 'Total',
    stockName: 'Stock Name',
    value: 'Value ($)',
    add: 'Add',
    stock: 'Stock',
    actions: 'Actions',
    groupName: 'Group Name',
    target: 'Target',
    buy: 'Buy',
    sell: 'Sell',
    addStock: '+ Add Stock',
    deleteGroup: 'Delete Group',
    footer: '© {year} Cocabit'
  },
  zh: {
    appTitle: '投资组合再平衡',
    investments: '💰 投资',
    groups: '📊 组合',
    total: '总计',
    stockName: '股票名称',
    value: '价值 ($)',
    add: '添加',
    stock: '股票',
    actions: '操作',
    groupName: '组合名称',
    target: '目标',
    buy: '买入',
    sell: '卖出',
    addStock: '+ 添加股票',
    deleteGroup: '删除组合',
    footer: '© {year} Cocabit'
  },
  es: {
    appTitle: 'Reequilibrio de Cartera',
    investments: '💰 Inversiones',
    groups: '📊 Grupos',
    total: 'Total',
    stockName: 'Nombre de Acción',
    value: 'Valor ($)',
    add: 'Añadir',
    stock: 'Acción',
    actions: 'Acciones',
    groupName: 'Nombre del Grupo',
    target: 'Objetivo',
    buy: 'Comprar',
    sell: 'Vender',
    addStock: '+ Añadir Acción',
    deleteGroup: 'Eliminar Grupo',
    footer: '© {year} Cocabit'
  },
  de: {
    appTitle: 'Portfolio-Rebalancing',
    investments: '💰 Investitionen',
    groups: '📊 Gruppen',
    total: 'Gesamt',
    stockName: 'Aktienname',
    value: 'Wert ($)',
    add: 'Hinzufügen',
    stock: 'Aktie',
    actions: 'Aktionen',
    groupName: 'Gruppenname',
    target: 'Ziel',
    buy: 'Kaufen',
    sell: 'Verkaufen',
    addStock: '+ Aktie hinzufügen',
    deleteGroup: 'Gruppe löschen',
    footer: '© {year} Cocabit'
  },
  ja: {
    appTitle: 'ポートフォリオ・リバランス',
    investments: '💰 投資',
    groups: '📊 グループ',
    total: '合計',
    stockName: '銘柄名',
    value: '評価額 ($)',
    add: '追加',
    stock: '銘柄',
    actions: '操作',
    groupName: 'グループ名',
    target: '目標',
    buy: '買い',
    sell: '売り',
    addStock: '+ 銘柄を追加',
    deleteGroup: 'グループを削除',
    footer: '© {year} Cocabit'
  },
  ko: {
    appTitle: '포트폴리오 리밸런싱',
    investments: '💰 투자',
    groups: '📊 그룹',
    total: '합계',
    stockName: '종목명',
    value: '가치 ($)',
    add: '추가',
    stock: '주식',
    actions: '작업',
    groupName: '그룹명',
    target: '목표',
    buy: '매수',
    sell: '매도',
    addStock: '+ 주식 추가',
    deleteGroup: '그룹 삭제',
    footer: '© {year} Cocabit'
  }
}

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages
})

const pinia = createPinia()
const vuetify = createVuetify()

createApp(App).use(pinia).use(vuetify).use(i18n).mount('#app')
