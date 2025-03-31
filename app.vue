<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="flex items-center justify-between mb-8">
        <div>
          <img 
            src="https://www.alphatronmedical.com/data/pam/public/Logo/alphatron_medical_rgb_680px.png"
            alt="Alphatron Medical" 
            class="h-12 mb-6"
          />
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Study Status Dashboard</h1>
          <p class="text-gray-600">Track your study's progress through the processing pipeline</p>
        </div>
      </div>

      <form @submit.prevent="handleSearch" class="mb-8">
        <div class="flex gap-4">
          <div class="flex-1">
            <input
              type="text"
              v-model="token"
              placeholder="Enter study token"
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center gap-2"
            :disabled="loading"
          >
            <Search class="w-5 h-5" />
            {{ loading ? 'Searching...' : 'Search' }}
          </button>
        </div>
      </form>

      <div v-if="error" class="mb-8 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
        {{ error }}
      </div>

      <div v-if="isSearching" class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div class="bg-white p-6 rounded-lg shadow-sm">
          <h2 class="text-xl font-semibold mb-6">Processing Timeline</h2>
          <Timeline :events="timelineEvents" />
        </div>
        
        <div>
          <h2 class="text-xl font-semibold mb-6">Statistics</h2>
          <StatisticsPanel :stats="statistics" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Search } from 'lucide-vue-next'
import type { TimelineEvent, Statistics, StudyData } from '~/types'

const token = ref('')
const isSearching = ref(false)
const timelineEvents = ref<TimelineEvent[]>([])
const statistics = ref<Statistics>({
  averageWaitTime: 0,
  estimatedQueueTime: 0,
  totalProcessed: 0,
  successRate: 0
})
const error = ref<string | null>(null)
const loading = ref(false)

const statusMap: Record<string, { label: string }> = {
  'send_complete': { label: 'Send Complete' },
  'received_central': { label: 'Received at Central Server' },
  'sent_to_ai': { label: 'Sent to AI' },
  'ai_processing': { label: 'AI Processing' },
  'results_received': { label: 'Results Received' }
}

onMounted(async () => {
  const route = window.location.pathname
  const tokenMatch = route.match(/\/token\/([^\/]+)/)
  if (tokenMatch) {
    token.value = tokenMatch[1]
    await fetchStudyStatus(token.value)
  }
})

const fetchStudyStatus = async (studyToken: string) => {
  loading.value = true
  error.value = null
  
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))

    // Fetch study data from JSON file
    const studiesResponse = await fetch('/data/studies.json')
    const studiesData = await studiesResponse.json()
    
    const studyData: StudyData | undefined = studiesData[studyToken]
    
    if (!studyData) {
      throw new Error('Study not found')
    }

    // Update timeline events based on study data
    const events: TimelineEvent[] = Object.entries(statusMap).map(([status, { label }]) => {
      const historyEntry = studyData.history.find(h => h.status === status)
      return {
        status: status as TimelineEvent['status'],
        label,
        timestamp: historyEntry?.timestamp || '',
        completed: !!historyEntry
      }
    })

    timelineEvents.value = events

    // Fetch statistics from JSON file
    const statsResponse = await fetch('/data/statistics.json')
    const statsData = await statsResponse.json()
    statistics.value = statsData

    isSearching.value = true
  } catch (err) {
    console.error('Error fetching study status:', err)
    error.value = err instanceof Error ? err.message : 'An error occurred'
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  const newUrl = `/token/${encodeURIComponent(token.value)}`
  window.history.pushState({ token: token.value }, '', newUrl)
  fetchStudyStatus(token.value)
}
</script>