import React, { useState } from 'react';
import { Play, Square, Clock, Edit3 } from 'lucide-react';
import { timeAPI } from '../../services/api';
import toast from 'react-hot-toast';

const ActiveSession = ({ session, onUpdate }) => {
  const [showStartForm, setShowStartForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'work',
    type: 'manual'
  });
  const [loading, setLoading] = useState(false);

  const categories = [
    { value: 'work', label: 'Work' },
    { value: 'study', label: 'Study' },
    { value: 'exercise', label: 'Exercise' },
    { value: 'reading', label: 'Reading' },
    { value: 'coding', label: 'Coding' },
    { value: 'other', label: 'Other' }
  ];

  const handleStartSession = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Please enter a session title');
      return;
    }

    setLoading(true);
    try {
      await timeAPI.startSession(formData);
      toast.success('Session started successfully!');
      setShowStartForm(false);
      setFormData({ title: '', description: '', category: 'work', type: 'manual' });
      onUpdate(); // Refresh dashboard data
    } catch (error) {
      console.error('Start session error:', error);
      toast.error(error.response?.data?.message || 'Failed to start session');
    } finally {
      setLoading(false);
    }
  };

  const handleEndSession = async () => {
    if (!session) return;
    
    setLoading(true);
    try {
      await timeAPI.endSession(session._id);
      toast.success('Session ended successfully!');
      onUpdate(); // Refresh dashboard data
    } catch (error) {
      console.error('End session error:', error);
      toast.error(error.response?.data?.message || 'Failed to end session');
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (startTime) => {
    const now = new Date();
    const start = new Date(startTime);
    const diffInMinutes = Math.floor((now - start) / (1000 * 60));
    const hours = Math.floor(diffInMinutes / 60);
    const minutes = diffInMinutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Active Session</h2>
        {!session && (
          <button
            onClick={() => setShowStartForm(!showStartForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors duration-200"
          >
            <Play className="w-4 h-4" />
          </button>
        )}
      </div>
      
      {session ? (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900">{session.title}</h3>
                {session.description && (
                  <p className="text-sm text-blue-700 mt-1">{session.description}</p>
                )}
                <div className="flex items-center mt-2 space-x-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {session.category}
                  </span>
                  <div className="flex items-center text-sm text-blue-600">
                    <Clock className="w-4 h-4 mr-1" />
                    {formatDuration(session.startTime)}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <button
            onClick={handleEndSession}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2 w-full justify-center"
          >
            {loading ? (
              <div className="loading-spinner w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <>
                <Square className="w-4 h-4" />
                <span>End Session</span>
              </>
            )}
          </button>
        </div>
      ) : showStartForm ? (
        <form onSubmit={handleStartSession} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Session Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="What are you working on?"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description (Optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Add session details..."
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2 flex-1"
            >
              {loading ? (
                <div className="loading-spinner w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Start Session</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => setShowStartForm(false)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-900 px-4 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="text-center text-gray-500 py-8">
          <Play className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="mb-4">No active session</p>
          <button
            onClick={() => setShowStartForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
          >
            Start New Session
          </button>
        </div>
      )}
    </div>
  );
};

export default ActiveSession;
