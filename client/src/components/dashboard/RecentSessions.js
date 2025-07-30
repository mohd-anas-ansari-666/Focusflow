import React from 'react';
import { Clock } from 'lucide-react';

const RecentSessions = ({ sessions }) => {
  return (
    <div className="card">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Sessions</h2>
      
      {sessions?.length > 0 ? (
        <div className="space-y-3">
          {sessions.map((session) => (
            <div key={session._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">{session.title}</h3>
                <p className="text-sm text-gray-600">{session.category}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{session.duration}m</p>
                <p className="text-xs text-gray-500">
                  {new Date(session.startTime).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500">
          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p>No recent sessions</p>
        </div>
      )}
    </div>
  );
};

export default RecentSessions;
