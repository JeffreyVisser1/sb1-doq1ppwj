import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Timeline } from './components/Timeline';
import { StatisticsPanel } from './components/Statistics';
import type { TimelineEvent, Statistics } from './types';

const statusMap: Record<string, TimelineEvent> = {
  'send_complete': { status: 'send_complete', label: 'Send Complete', timestamp: '', completed: false },
  'received_central': { status: 'received_central', label: 'Received at Central Server', timestamp: '', completed: false },
  'sent_to_ai': { status: 'sent_to_ai', label: 'Sent to AI', timestamp: '', completed: false },
  'ai_processing': { status: 'ai_processing', label: 'AI Processing', timestamp: '', completed: false },
  'results_received': { status: 'results_received', label: 'Results Received', timestamp: '', completed: false },
};

// Mock data for different study tokens
const mockStudyData: Record<string, { status: string; timestamp: string }> = {
  'STUDY001': { status: 'results_received', timestamp: new Date(Date.now() - 10 * 60000).toISOString() },
  'STUDY002': { status: 'ai_processing', timestamp: new Date(Date.now() - 5 * 60000).toISOString() },
  'STUDY003': { status: 'send_complete', timestamp: new Date(Date.now() - 5 * 60000).toISOString() },
  'STUDY007': { status: 'results_received', timestamp: new Date(Date.now() - 5 * 60000).toISOString() }
};

// Mock statistics data
const mockStatistics: Statistics = {
  averageWaitTime: 45,
  estimatedQueueTime: 30,
  totalProcessed: 128,
  successRate: 98.5
};

function App() {
  const [token, setToken] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [statistics, setStatistics] = useState<Statistics>(mockStatistics);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check for token in URL path
    const pathSegments = window.location.pathname.split('/');
    const tokenIndex = pathSegments.indexOf('token');
    if (tokenIndex !== -1 && pathSegments[tokenIndex + 1]) {
      const tokenFromUrl = pathSegments[tokenIndex + 1];
      setToken(tokenFromUrl);
      fetchStudyStatus(tokenFromUrl);
    }
  }, []);

  const fetchStudyStatus = async (studyToken: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const studyData = mockStudyData[studyToken];
      
      if (!studyData) {
        throw new Error('Study not found');
      }

      // Update timeline events based on mock data
      const currentStatus = studyData.status;
      const events: TimelineEvent[] = Object.entries(statusMap).map(([status, event]) => ({
        ...event,
        timestamp: status === currentStatus ? studyData.timestamp : '',
        completed: Object.keys(statusMap).indexOf(status) <= Object.keys(statusMap).indexOf(currentStatus),
      }));

      setTimelineEvents(events);
      setStatistics(mockStatistics);
      setIsSearching(true);
    } catch (err) {
      console.error('Error fetching study status:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Update URL with the token in the path
    const newUrl = `/token/${encodeURIComponent(token)}`;
    window.history.pushState({ token }, '', newUrl);
    fetchStudyStatus(token);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <img 
              src="https://www.alphatronmedical.com/data/pam/public/Logo/alphatron_medical_rgb_680px.png"
              alt="Alphatron Medical" 
              className="h-12 mb-6"
            />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Study Status Dashboard</h1>
            <p className="text-gray-600">Track your study's progress through the processing pipeline</p>
          </div>
        </div>

        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Enter study token"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center gap-2"
              disabled={loading}
            >
              <Search className="w-5 h-5" />
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>

        {error && (
          <div className="mb-8 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {isSearching && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-6">Processing Timeline</h2>
              <Timeline events={timelineEvents} />
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-6">Statistics</h2>
              <StatisticsPanel stats={statistics} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;