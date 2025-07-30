import React from 'react';
import { BarChart3 } from 'lucide-react';

const StatsOverview = ({ stats }) => {
  return (
    <div className="card">
      <div className="flex items-center mb-4">
        <BarChart3 className="w-6 h-6 text-primary-600 mr-2" />
        <h2 className="text-xl font-semibold text-gray-900">Weekly Overview</h2>
      </div>
      
      <div className="text-center text-gray-500">
        <p>Statistics charts will be displayed here</p>
        <p className="text-sm mt-2">Total time: {stats?.totalTime || 0} minutes</p>
      </div>
    </div>
  );
};

export default StatsOverview;
