import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { timeAPI, habitsAPI } from '../../services/api';
import StatsOverview from './StatsOverview';
import ActiveSession from './ActiveSession';
import HabitsSection from './HabitsSection';
import RecentSessions from './RecentSessions';
import { BarChart3, Target, Clock, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [habits, setHabits] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [recentSessions, setRecentSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, habitsRes, activeRes, sessionsRes] = await Promise.all([
        timeAPI.getStats({ period: '7d' }),
        habitsAPI.getAll(),
        timeAPI.getActiveSession(),
        timeAPI.getSessions({ limit: 5 })
      ]);

      setStats(statsRes.data.stats);
      setHabits(habitsRes.data.habits);
      setActiveSession(activeRes.data.session);
      setRecentSessions(sessionsRes.data.sessions);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSessionUpdate = () => {
    loadDashboardData();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors duration-200">
        <div className="text-center">
          <div className="loading-spinner w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const quickStats = [
    {
      title: 'Total Time',
      value: `${Math.floor((stats?.totalTime || 0) / 60)}h ${(stats?.totalTime || 0) % 60}m`,
      icon: Clock,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30'
    },
    {
      title: 'Sessions',
      value: stats?.totalSessions || 0,
      icon: BarChart3,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/30'
    },
    {
      title: 'Active Habits',
      value: habits?.length || 0,
      icon: Target,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30'
    },
    {
      title: 'Avg Session',
      value: `${stats?.avgSessionLength || 0}m`,
      icon: TrendingUp,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-100 dark:bg-orange-900/30'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header - FIXED */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {user?.username}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Here's your productivity overview for today.
          </p>
        </div>

        {/* Quick Stats - FIXED */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => (
            <div key={index} className="card transition-colors duration-200">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.bgColor} mr-4 transition-colors duration-200`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Active Session */}
            <ActiveSession 
              session={activeSession} 
              onUpdate={handleSessionUpdate}
            />

            {/* Stats Overview */}
            <StatsOverview stats={stats} />

            {/* Recent Sessions */}
            <RecentSessions sessions={recentSessions} />
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Habits Section */}
            <HabitsSection 
              habits={habits} 
              onUpdate={loadDashboardData}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
