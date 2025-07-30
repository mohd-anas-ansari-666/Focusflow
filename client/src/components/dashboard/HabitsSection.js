import React, { useState } from 'react';
import { Target, Plus, Check, Flame } from 'lucide-react';
import { habitsAPI } from '../../services/api';
import toast from 'react-hot-toast';

const HabitsSection = ({ habits, onUpdate }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'productivity',
    frequency: 'daily'
  });
  const [loading, setLoading] = useState(false);

  const categories = [
    { value: 'health', label: '🏃‍♂️ Health', color: 'bg-green-100 text-green-800' },
    { value: 'productivity', label: '⚡ Productivity', color: 'bg-blue-100 text-blue-800' },
    { value: 'learning', label: '📚 Learning', color: 'bg-purple-100 text-purple-800' },
    { value: 'social', label: '👥 Social', color: 'bg-pink-100 text-pink-800' },
    { value: 'other', label: '🎯 Other', color: 'bg-gray-100 text-gray-800' }
  ];

  const handleAddHabit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Please enter a habit name');
      return;
    }

    setLoading(true);
    try {
      await habitsAPI.create(formData);
      toast.success('Habit created successfully!');
      setShowAddForm(false);
      setFormData({ name: '', description: '', category: 'productivity', frequency: 'daily' });
      onUpdate(); // Refresh dashboard data
    } catch (error) {
      console.error('Create habit error:', error);
      toast.error(error.response?.data?.message || 'Failed to create habit');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkComplete = async (habitId) => {
    const today = new Date().toISOString();
    try {
      await habitsAPI.complete(habitId, today);
      toast.success('Habit marked as complete!');
      onUpdate(); // Refresh dashboard data
    } catch (error) {
      console.error('Mark habit complete error:', error);
      toast.error(error.response?.data?.message || 'Failed to mark habit complete');
    }
  };

  const isCompletedToday = (habit) => {
    const today = new Date().toISOString().split('T')[0];
    return habit.completions?.some(completion => {
      const completionDate = new Date(completion.date).toISOString().split('T')[0];
      return completionDate === today && completion.completed;
    });
  };

  const getCategoryInfo = (categoryValue) => {
    return categories.find(cat => cat.value === categoryValue) || categories[categories.length - 1];
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Today's Habits</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors duration-200"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      
      {showAddForm && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <form onSubmit={handleAddHabit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Habit Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Morning Exercise, Read 30 minutes"
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
                Frequency
              </label>
              <select
                value={formData.frequency}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description (Optional)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Add details about your habit..."
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
                    <Plus className="w-4 h-4" />
                    <span>Create Habit</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-900 px-4 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      
      {habits?.length > 0 ? (
        <div className="space-y-3">
          {habits.slice(0, 5).map((habit) => {
            const categoryInfo = getCategoryInfo(habit.category);
            const completedToday = isCompletedToday(habit);
            
            return (
              <div
                key={habit._id}
                className={`flex items-center justify-between p-3 rounded-lg border transition-colors duration-200 ${
                  completedToday 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center space-x-3 flex-1">
                  <Target className={`w-5 h-5 ${completedToday ? 'text-green-600' : 'text-gray-400'}`} />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className={`font-medium ${completedToday ? 'text-green-900 line-through' : 'text-gray-900'}`}>
                        {habit.name}
                      </span>
                      {habit.currentStreak > 0 && (
                        <div className="flex items-center space-x-1">
                          <Flame className="w-4 h-4 text-orange-500" />
                          <span className="text-sm font-medium text-orange-600">
                            {habit.currentStreak}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${categoryInfo.color}`}>
                        {categoryInfo.label}
                      </span>
                      <span className="text-xs text-gray-500">
                        {habit.frequency}
                      </span>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => handleMarkComplete(habit._id)}
                  disabled={completedToday}
                  className={`p-2 rounded-lg transition-colors duration-200 ${
                    completedToday
                      ? 'bg-green-100 text-green-600 cursor-not-allowed'
                      : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                  }`}
                  title={completedToday ? 'Already completed today' : 'Mark as complete'}
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-8">
          <Target className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="mb-4">No habits yet</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
          >
            Create First Habit
          </button>
        </div>
      )}
    </div>
  );
};

export default HabitsSection;
