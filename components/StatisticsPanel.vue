<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div class="bg-white p-6 rounded-lg shadow-sm">
      <div class="flex items-center">
        <Clock class="w-6 h-6 text-blue-500 mr-2" />
        <h3 class="text-lg font-semibold">Average Wait Time</h3>
      </div>
      <p class="text-2xl font-bold mt-2">{{ stats.averageWaitTime }} minutes</p>
    </div>
    
    <div class="bg-white p-6 rounded-lg shadow-sm">
      <div class="flex items-center">
        <BarChart2 class="w-6 h-6 text-purple-500 mr-2" />
        <h3 class="text-lg font-semibold">Estimated Queue Time</h3>
      </div>
      <p class="text-2xl font-bold mt-2">{{ stats.estimatedQueueTime }} minutes</p>
    </div>
    
    <div class="bg-white p-6 rounded-lg shadow-sm">
      <div class="flex items-center">
        <CheckCircle2 class="w-6 h-6 text-green-500 mr-2" />
        <h3 class="text-lg font-semibold">Success Rate</h3>
      </div>
      <p class="text-2xl font-bold mt-2">{{ stats.successRate }}%</p>
    </div>
    
    <div class="bg-white p-6 rounded-lg shadow-sm">
      <div class="flex items-center">
        <BarChart2 class="w-6 h-6 text-orange-500 mr-2" />
        <h3 class="text-lg font-semibold">Total Processed</h3>
      </div>
      <p class="text-2xl font-bold mt-2">{{ stats.totalProcessed }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Clock, BarChart2, CheckCircle2 } from 'lucide-vue-next'
import type { Statistics } from '~/types'

defineProps<{
  stats: Statistics
}>()</script>