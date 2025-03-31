import React from 'react';
import { CheckCircle2, Circle, loader2 } from 'lucide-react';
import type { TimelineEvent } from '../types';

interface TimelineProps {
  events: TimelineEvent[];
}

export function Timeline({ events }: TimelineProps) {
  return (
    <div className="relative">
      {events.map((event, index) => (
        <div key={event.status} className="flex items-start mb-8 relative">
          <div className="flex items-center">
            {event.completed ? (
              <CheckCircle2 className="w-6 h-6 text-green-500" />
            ) : (
              <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
            )}
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold">{event.label}</h3>
            <p className="text-sm text-gray-500">
              {event.timestamp ? new Date(event.timestamp).toLocaleString() : 'Pending'}
            </p>
          </div>
          {index < events.length - 1 && (
            <div className="absolute left-3 top-6 w-0.5 h-8 bg-gray-200" />
          )}
        </div>
      ))}
    </div>
  );
}
