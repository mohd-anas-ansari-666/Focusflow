import React, { useState, useEffect } from 'react';
import { habitsAPI } from '../../services/api';
import { Plus, Check, Trash, Edit, Flame } from 'lucide-react';
import toast from 'react-hot-toast';

const HabitsPage = () => {
  const [habits, setHabits] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'productivity',
    frequency: 'daily'
  });
  const [loading, setLoading] = useState(false);

  const fetchHabits = async () => {
    try {
      const res = await habitsAPI.getAll();
      setHabits(res.data.habits);
    } catch (err) {
      toast.error('Failed to load habits');
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  const handleAddHabit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Please enter a habit name');
      return;
    }
    setLoading(true);
    try {
      await habitsAPI.create(formData);
      toast.success('Habit created!');
      setShowAddForm(false);
      setFormData({ name: '', description: '', category: 'productivity', frequency: 'daily' });
      fetchHabits();
    } catch (err) {
      toast.error('Failed to create habit');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkComplete = async (habitId) => {
    const today = new Date().toISOString();
    try {
      await habitsAPI.complete(habitId, today);
      fetchHabits();
    } catch (err) {
      toast.error('Failed to mark as complete');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this habit?')) {
      try {
        await habitsAPI.delete(id);
        toast.success('Habit deleted');
        fetchHabits();
      } catch (err) {
        toast.error('Failed to delete habit');
      }
    }
  };

  const isCompletedToday = (habit) => {
    const today = new Date().toISOString().split('T')[0];
    return habit.completions?.some(c => new Date(c.date).toISOString().split('T')[0] === today && c.completed);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Habit Tracker</h1>
          <p className="text-gray-600">Build and track your daily habits</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 mt-4 sm:mt-0 rounded-lg font-medium transition"
        >
          <Plus className="w-4 h-4 mr-1" /> Add Habit
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddHabit} className="bg-gray-50 p-4 rounded-lg mb-8 space-y-4">
          <input
            type="text"
            placeholder="Habit name"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            className="input-field"
            required
          />
          <input
            type="text"
            placeholder="Description (optional)"
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            className="input-field"
          />
          <div className="flex space-x-2">
            <select
              value={formData.category}
              onChange={e => setFormData({ ...formData, category: e.target.value })}
              className="input-field"
            >
              <option value="productivity">Productivity</option>
              <option value="health">Health</option>
              <option value="learning">Learning</option>
              <option value="social">Social</option>
              <option value="other">Other</option>
            </select>
            <select
              value={formData.frequency}
              onChange={e => setFormData({ ...formData, frequency: e.target.value })}
              className="input-field"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
          >
            {loading ? "Saving..." : "Add Habit"}
          </button>
        </form>
      )}

      <div>
        {habits.length === 0 && (
          <div className="text-center text-gray-500 py-12">
            <Plus className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <div>No habits yet.</div>
          </div>
        )}
        {habits.length > 0 && (
          <div className="space-y-4">
            {habits.map(habit => (
              <div key={habit._id} className="bg-white border p-4 rounded-md flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-gray-900">{habit.name}</span>
                    {habit.currentStreak > 0 && (
                      <span className="flex items-center ml-2 text-orange-600">
                        <Flame className="w-4 h-4 mr-1" /> {habit.currentStreak}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500">{habit.description}</div>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs capitalize bg-blue-50 px-2 py-0.5 rounded">{habit.category}</span>
                    <span className="text-xs">{habit.frequency}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleMarkComplete(habit._id)}
                    disabled={isCompletedToday(habit)}
                    title={isCompletedToday(habit) ? "Already completed" : "Mark complete"}
                    className={`p-2 rounded ${isCompletedToday(habit) ? 'bg-green-100 text-green-400' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'}`}
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(habit._id)}
                    className="p-2 rounded bg-red-100 text-red-600 hover:bg-red-200"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HabitsPage;
