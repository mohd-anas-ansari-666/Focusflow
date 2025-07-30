import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Clock, 
  Target, 
  TrendingUp, 
  Calendar,
  Activity,
  Flame,
  Award
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { timeAPI, habitsAPI } from '../../services/api';
import toast from 'react-hot-toast';

const StatsPage = () => {
  const [timeStats, setTimeStats] = useState(null);
  const [habits, setHabits] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [loading, setLoading] = useState(true);

  // Fetch data based on selected period
  const fetchStats = async (period = selectedPeriod) => {
    setLoading(true);
    try {
      const [statsRes, habitsRes] = await Promise.all([
        timeAPI.getStats({ period }),
        habitsAPI.getAll()
      ]);
      
      setTimeStats(statsRes.data.stats);
      setHabits(habitsRes.data.habits);
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [selectedPeriod]);

  // Process daily time data for charts
  const getDailyTimeData = () => {
    if (!timeStats?.dailyTime) return [];
    
    const today = new Date();
    const days = [];
    
    for (let i = parseInt(selectedPeriod) - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      
      days.push({
        date: dateStr,
        day: dayName,
        minutes: timeStats.dailyTime[dateStr] || 0,
        hours: Math.round((timeStats.dailyTime[dateStr] || 0) / 60 * 10) / 10
      });
    }
    
    return days;
  };

  // Process category breakdown for pie chart
  const getCategoryData = () => {
    if (!timeStats?.categoryBreakdown) return [];
    
    const colors = {
      work: '#3b82f6',
      study: '#8b5cf6',
      exercise: '#10b981',
      reading: '#f59e0b',
      coding: '#ef4444',
      other: '#6b7280'
    };

    return Object.entries(timeStats.categoryBreakdown).map(([category, minutes]) => ({
      name: category.charAt(0).toUpperCase() + category.slice(1),
      value: minutes,
      hours: Math.round(minutes / 60 * 10) / 10,
      color: colors[category] || '#6b7280'
    }));
  };

  // Calculate habit statistics
  const getHabitStats = () => {
    if (!habits.length) return { totalHabits: 0, activeStreaks: 0, completedToday: 0, longestStreak: 0 };
    
    const today = new Date().toISOString().split('T')[0];
    const completedToday = habits.filter(habit => 
      habit.completions?.some(c => 
        new Date(c.date).toISOString().split('T')[0] === today && c.completed
      )
    ).length;

    const activeStreaks = habits.filter(h => h.currentStreak > 0).length;
    const longestStreak = Math.max(...habits.map(h => h.longestStreak || 0));

    return {
      totalHabits: habits.length,
      activeStreaks,
      completedToday,
      longestStreak
    };
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const dailyData = getDailyTimeData();
  const categoryData = getCategoryData();
  const habitStats = getHabitStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="loading-spinner w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Loading your statistics...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header - FIXED */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Statistics</h1>
            <p className="text-gray-600 dark:text-gray-400">View your productivity analytics and insights</p>
          </div>
          
          {/* Period Selector - FIXED */}
          <div className="mt-4 sm:mt-0">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="24h">Last 24 Hours</option>
            </select>
          </div>
        </div>

        {/* Quick Stats Cards - FIXED */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-4 transition-colors duration-200">
                <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Time</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatTime(timeStats?.totalTime || 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg mr-4 transition-colors duration-200">
                <BarChart3 className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Sessions</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {timeStats?.totalSessions || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg mr-4 transition-colors duration-200">
                <Target className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Habits</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {habitStats.totalHabits}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg mr-4 transition-colors duration-200">
                <TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Session</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatTime(timeStats?.avgSessionLength || 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid - FIXED */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Daily Time Chart */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
              Daily Time Tracking
            </h3>
            {dailyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                  <XAxis 
                    dataKey="day" 
                    tick={{ fill: 'currentColor' }}
                    className="text-gray-600 dark:text-gray-400"
                  />
                  <YAxis 
                    tick={{ fill: 'currentColor' }}
                    className="text-gray-600 dark:text-gray-400"
                  />
                  <Tooltip 
                    formatter={(value) => [`${value} minutes`, 'Time']}
                    labelFormatter={(label) => `Day: ${label}`}
                    contentStyle={{
                      backgroundColor: 'var(--tooltip-bg)',
                      border: '1px solid var(--tooltip-border)',
                      borderRadius: '8px'
                    }}
                    className="dark:bg-gray-800 dark:border-gray-600"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="minutes" 
                    stroke="#3b82f6" 
                    fill="#3b82f6" 
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
                No time tracking data for selected period
              </div>
            )}
          </div>

          {/* Category Breakdown */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
              Time by Category
            </h3>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, hours }) => `${name}: ${hours}h`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${Math.round(value / 60 * 10) / 10} hours`, 'Time']}
                    contentStyle={{
                      backgroundColor: 'var(--tooltip-bg)',
                      border: '1px solid var(--tooltip-border)',
                      borderRadius: '8px'
                    }}
                    className="dark:bg-gray-800 dark:border-gray-600"
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
                No category data available
              </div>
            )}
          </div>
        </div>

        {/* Habit Statistics - FIXED */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Habit Overview */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
              Habit Overview
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg transition-colors duration-200">
                <span className="text-gray-700 dark:text-gray-300">Total Habits</span>
                <span className="font-semibold text-gray-900 dark:text-white">{habitStats.totalHabits}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg transition-colors duration-200">
                <span className="text-gray-700 dark:text-gray-300">Completed Today</span>
                <span className="font-semibold text-green-900 dark:text-green-400">{habitStats.completedToday}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg transition-colors duration-200">
                <span className="text-gray-700 dark:text-gray-300">Active Streaks</span>
                <span className="font-semibold text-orange-900 dark:text-orange-400 flex items-center">
                  <Flame className="w-4 h-4 mr-1" />
                  {habitStats.activeStreaks}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg transition-colors duration-200">
                <span className="text-gray-700 dark:text-gray-300">Longest Streak</span>
                <span className="font-semibold text-blue-900 dark:text-blue-400 flex items-center">
                  <Award className="w-4 h-4 mr-1" />
                  {habitStats.longestStreak} days
                </span>
              </div>
            </div>
          </div>

          {/* Top Habits */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Flame className="w-5 h-5 mr-2 text-orange-600 dark:text-orange-400" />
              Top Habit Streaks
            </h3>
            {habits.length > 0 ? (
              <div className="space-y-3">
                {habits
                  .sort((a, b) => (b.currentStreak || 0) - (a.currentStreak || 0))
                  .slice(0, 5)
                  .map((habit) => (
                    <div key={habit._id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg transition-colors duration-200">
                      <div>
                        <span className="font-medium text-gray-900 dark:text-white">{habit.name}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2 capitalize">
                          {habit.category}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {habit.currentStreak || 0} days
                        </span>
                        {(habit.currentStreak || 0) > 0 && (
                          <Flame className="w-4 h-4 text-orange-500 dark:text-orange-400" />
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                <Target className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-2" />
                <p>No habits created yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsPage;
