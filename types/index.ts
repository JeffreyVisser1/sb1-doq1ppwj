export interface StudyStatus {
  status: 'send_complete' | 'received_central' | 'sent_to_ai' | 'ai_processing' | 'results_received';
  timestamp: string;
}

export interface StudyHistory {
  status: StudyStatus['status'];
  timestamp: string;
}

export interface StudyData {
  status: StudyStatus['status'];
  timestamp: string;
  history: StudyHistory[];
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