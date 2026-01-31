<template>
    <v-card class="mb-6" elevation="4" rounded>
        <v-card-title class="d-flex justify-space-between align-center">
            <div class="d-flex align-center">
                <v-btn icon variant="text" size="small" density="compact" class="mr-2"
                    @click="isExpanded = !isExpanded">
                    <v-icon>{{ isExpanded ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
                </v-btn>
                <span>{{ $t('snapshots') }}</span>
            </div>
        </v-card-title>
        <v-expand-transition>
            <div v-show="isExpanded">
                <v-card-text>
                    <v-row dense>
                        <v-col cols="8">
                            <v-text-field v-model="name" :label="$t('snapshotName')" variant="outlined"
                                density="compact" hide-details @keyup.enter="save" />
                        </v-col>
                        <v-col cols="4">
                            <v-btn color="primary" block @click="save">{{ $t('save') }}</v-btn>
                        </v-col>
                    </v-row>

                    <v-list v-if="store.snapshots.length" density="compact" class="mt-2">
                        <v-list-item v-for="item in store.snapshots" :key="item.id" :title="item.name"
                            :subtitle="new Date(item.date).toLocaleString(locale)">
                            <template #append>
                                <v-btn icon flat size="small" color="primary" class="mr-1" @click="load(item)">
                                    <v-icon>mdi-restore</v-icon>
                                </v-btn>
                                <v-btn icon flat size="small" color="error" @click="remove(item)">
                                    <v-icon>mdi-delete</v-icon>
                                </v-btn>
                            </template>
                        </v-list-item>
                    </v-list>
                    <div v-else class="text-center mt-4 text-caption text-grey">
                        {{ $t('noSnapshots') }}
                    </div>
                </v-card-text>
            </div>
        </v-expand-transition>
    </v-card>
</template>

<script setup>
import { ref } from 'vue'
import { usePortfolioStore } from '@/store/usePortfolioStore'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()
const store = usePortfolioStore()
const name = ref('')
const isExpanded = ref(true)

const save = () => {
    store.saveSnapshot(name.value)
    name.value = ''
}

const load = (item) => {
    if (confirm(t('confirmLoadSnapshot'))) {
        store.loadSnapshot(item)
    }
}

const remove = (item) => {
    if (confirm(t('confirmDeleteSnapshot'))) {
        store.deleteSnapshot(item.id)
    }
}
</script>