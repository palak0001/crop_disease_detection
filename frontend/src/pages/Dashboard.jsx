import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { predictionAPI } from '../services/api';
import { TrendingUp, Leaf, Target, AlertCircle } from 'lucide-react';

export const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [statsRes, predictionsRes] = await Promise.all([
        predictionAPI.getUserStats(),
        predictionAPI.getPredictions(),
      ]);

      setStats(statsRes.data);
      setPredictions(predictionsRes.data);
      setError('');
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const statCards = [
    {
      icon: TrendingUp,
      label: 'Total Predictions',
      value: stats?.total_predictions || 0,
      color: 'bg-blue-500',
      delay: 0,
    },
    {
      icon: Leaf,
      label: 'Most Detected',
      value: stats?.most_common_disease ? stats.most_common_disease.split('___')[1] : 'None',
      color: 'bg-green-500',
      delay: 0.1,
    },
    {
      icon: Target,
      label: 'Recent Reports',
      value: predictions?.predictions?.length || 0,
      color: 'bg-orange-500',
      delay: 0.2,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
            Welcome back, <span className="text-primary">{user?.username}</span>!
          </h1>
          <p className="text-xl text-gray-600">Here's your plant disease detection summary</p>
        </motion.div>

        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded flex items-start gap-3"
          >
            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
            <p className="text-red-800">{error}</p>
          </motion.div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {statCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: card.delay, duration: 0.5 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`${card.color} p-3 rounded-lg text-white`}>
                      <Icon size={24} />
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm font-medium mb-2">{card.label}</p>
                  <p className="text-3xl font-bold text-gray-800">{card.value}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Recent Predictions */}
        {predictions?.predictions && predictions.predictions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">Recent Predictions</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Disease</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Confidence</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {predictions.predictions.slice(0, 5).map((pred, index) => (
                    <motion.tr
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 + index * 0.05 }}
                      className="border-b border-gray-200 hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4 text-sm text-gray-800">
                        {pred.predicted_class.replace(/_/g, ' ')}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-green h-2 rounded-full transition-all"
                              style={{ width: `${pred.confidence * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-gray-700 font-semibold">
                            {(pred.confidence * 100).toFixed(1)}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(pred.created_at).toLocaleDateString()}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {predictions?.predictions && predictions.predictions.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-white rounded-2xl shadow-lg"
          >
            <Leaf className="mx-auto mb-4 text-gray-400" size={48} />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No predictions yet</h3>
            <p className="text-gray-600 mb-6">Start by uploading an image to detect plant diseases</p>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="/predict"
              className="inline-block bg-gradient-green text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition"
            >
              Make a Prediction
            </motion.a>
          </motion.div>
        )}
      </div>
    </div>
  );
};
