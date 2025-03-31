<template>
  <div class="relative">
    <div v-for="(event, index) in events" :key="event.status" class="flex items-start mb-8 relative">
      <div class="flex items-center">
        <CheckCircle2 v-if="event.completed" class="w-6 h-6 text-green-500" />
        <Circle v-else class="w-6 h-6 text-gray-300" />
      </div>
      <div class="ml-4">
        <h3 class="text-lg font-semibold">{{ event.label }}</h3>
        <p class="text-sm text-gray-500">
          {{ event.timestamp ? new Date(event.timestamp).toLocaleString() : 'Pending' }}
        </p>
      </div>
      <div
        v-if="index < events.length - 1"
        class="absolute left-3 top-6 w-0.5 h-8 bg-gray-200"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { CheckCircle2, Circle } from 'lucide-vue-next'
import type { TimelineEvent } from '~/types'

defineProps<{
  events: TimelineEvent[]
}>()</script>