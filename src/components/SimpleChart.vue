<template>
    <v-card v-if="data.length > 0" class="mt-4 pa-4" variant="outlined">
        <div class="text-subtitle-2 mb-2">{{ title }}</div>
        <svg :viewBox="`0 0 ${width} ${height}`" class="chart-svg">
            <!-- Axes -->
            <line :x1="padding" :y1="height - padding" :x2="width - padding" :y2="height - padding" stroke="#999"
                stroke-width="1" />
            <line :x1="padding" :y1="padding" :x2="padding" :y2="height - padding" stroke="#999" stroke-width="1" />

            <!-- Line -->
            <path :d="linePath" fill="none" stroke="#1976D2" stroke-width="2" />

            <!-- Points -->
            <circle v-for="(p, i) in points" :key="i" :cx="p.x" :cy="p.y" r="4" fill="#1976D2" class="chart-point">
                <title>{{ p.dateLabel }}: {{ p.formattedValue }}</title>
            </circle>

            <!-- Labels (Min/Max Y) -->
            <text :x="padding - 5" :y="padding" text-anchor="end" font-size="10" dominant-baseline="middle">{{
                formatY(maxY) }}</text>
            <text :x="padding - 5" :y="height - padding" text-anchor="end" font-size="10" dominant-baseline="middle">{{
                formatY(minY) }}</text>

            <!-- Labels (Start/End X) -->
            <text :x="padding" :y="height - padding + 15" text-anchor="middle" font-size="10">{{ points[0]?.dateLabel
                }}</text>
            <text v-if="points.length > 1" :x="width - padding" :y="height - padding + 15" text-anchor="middle"
                font-size="10">{{ points[points.length - 1]?.dateLabel }}</text>

        </svg>
    </v-card>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    data: { type: Array, default: () => [] },
    title: { type: String, default: 'Chart' }
})

const width = 400
const height = 200
const padding = 40

const maxY = computed(() => Math.max(...props.data.map(d => d.value)))
const minY = computed(() => Math.min(...props.data.map(d => d.value)))

const points = computed(() => {
    if (!props.data.length) return []
    const values = props.data.map(d => d.value)
    const dates = props.data.map(d => new Date(d.date).getTime())

    const minV = Math.min(...values)
    const maxV = Math.max(...values)
    const rangeV = maxV - minV || (minV * 0.1) || 1

    const minD = Math.min(...dates)
    const maxD = Math.max(...dates)
    const rangeD = maxD - minD || 1

    return props.data.map(d => {
        const t = new Date(d.date).getTime()
        const x = padding + ((t - minD) / rangeD) * (width - 2 * padding)
        const y = maxV === minV
            ? height / 2
            : height - padding - ((d.value - minV) / rangeV) * (height - 2 * padding)
        return {
            x, y,
            value: d.value,
            formattedValue: d.formattedValue,
            dateLabel: new Date(d.date).toLocaleDateString()
        }
    })
})

const linePath = computed(() => {
    if (points.value.length < 2) return ''
    return 'M ' + points.value.map(p => `${p.x},${p.y}`).join(' L ')
})

const formatY = (val) => {
    if (val === undefined) return ''
    return val.toLocaleString(undefined, { notation: 'compact', maximumFractionDigits: 1 })
}
</script>

<style scoped>
.chart-svg {
    width: 100%;
    height: auto;
    max-height: 200px;
}

.chart-point:hover {
    r: 6;
    cursor: pointer;
}
</style>