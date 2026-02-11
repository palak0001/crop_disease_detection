import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { Mail, Lock, AlertCircle } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || 'Login failed');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-green flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl bg-opacity-95">
          {/* Header */}
          <div className="bg-gradient-green px-8 py-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 100 }}
              className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-primary font-bold text-2xl"
            >
              A
            </motion.div>
            <h1 className="text-3xl font-bold text-white mb-2">AgroGuard AI</h1>
            <p className="text-green-100">Plant Disease Detection System</p>
          </div>

          {/* Form */}
          <div className="px-8 py-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Login</h2>

            {/* Error Alert */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3"
              >
                <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                <p className="text-red-800 text-sm">{error}</p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <label className="block text-gray-700 font-semibold mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary transition"
                    required
                  />
                </div>
              </motion.div>

              {/* Password */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <label className="block text-gray-700 font-semibold mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary transition"
                    required
                  />
                </div>
              </motion.div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-green text-white font-bold py-3 rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <span className="animate-spin mr-2">◐</span>
                    Logging in...
                  </span>
                ) : (
                  'Login'
                )}
              </motion.button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-4">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-gray-500 text-sm">New user?</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* Register Link */}
            <Link to="/register">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                className="w-full border-2 border-primary text-primary font-bold py-3 rounded-lg hover:bg-primary hover:text-white transition"
              >
                Create Account
              </motion.button>
            </Link>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg text-center text-sm text-gray-600">
              <p className="font-semibold text-blue-900 mb-2">Demo Credentials:</p>
              <p>Email: <code className="bg-white px-2 py-1 rounded text-blue-600">demo@agroguard.com</code></p>
              <p>Password: <code className="bg-white px-2 py-1 rounded text-blue-600">demo123</code></p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
