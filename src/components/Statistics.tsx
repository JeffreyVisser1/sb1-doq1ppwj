import React from 'react';
import { Clock, CheckCircle2, BarChart2 } from 'lucide-react';
import type { Statistics } from '../types';

interface StatisticsProps {
  stats: Statistics;
}

export function StatisticsPanel({ stats }: StatisticsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center">
          <Clock className="w-6 h-6 text-blue-500 mr-2" />
          <h3 className="text-lg font-semibold">Average Wait Time</h3>
        </div>
        <p className="text-2xl font-bold mt-2">{stats.averageWaitTime} minutes</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center">
          <BarChart2 className="w-6 h-6 text-purple-500 mr-2" />
          <h3 className="text-lg font-semibold">Estimated Queue Time</h3>
        </div>
        <p className="text-2xl font-bold mt-2">{stats.estimatedQueueTime} minutes</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center">
          <CheckCircle2 className="w-6 h-6 text-green-500 mr-2" />
          <h3 className="text-lg font-semibold">Success Rate</h3>
        </div>
        <p className="text-2xl font-bold mt-2">{stats.successRate}%</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center">
          <BarChart2 className="w-6 h-6 text-orange-500 mr-2" />
          <h3 className="text-lg font-semibold">Total Processed</h3>
        </div>
        <p className="text-2xl font-bold mt-2">{stats.totalProcessed}</p>
      </div>
    </div>
  );
}