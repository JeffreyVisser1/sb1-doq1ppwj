export interface StudyStatus {
  id: string;
  status: 'send_complete' | 'received_central' | 'sent_to_ai' | 'ai_processing' | 'results_received';
  timestamp: string;
}

export interface TimelineEvent {
  status: StudyStatus['status'];
  label: string;
  timestamp: string;
  completed: boolean;
}

export interface Statistics {
  averageWaitTime: number;
  estimatedQueueTime: number;
  totalProcessed: number;
  successRate: number;
}