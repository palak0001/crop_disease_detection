import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { Menu, X, LogOut, Home, Activity, FileText, Info } from 'lucide-react';

export const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/predict', label: 'Predict', icon: Activity },
    { path: '/reports', label: 'Reports', icon: FileText },
    { path: '/about', label: 'About', icon: Info },
  ];

  return (
    <nav className="bg-gradient-green shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to={isAuthenticated ? '/dashboard' : '/'}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-white font-bold text-2xl flex items-center gap-2"
            >
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-primary font-bold">
                A
              </div>
              AgroGuard AI
            </motion.div>
          </Link>

          {/* Desktop Menu */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.path} to={item.path}>
                    <motion.div
                      whileHover={{ y: -2 }}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition ${
                        isActive(item.path)
                          ? 'bg-white bg-opacity-20 text-white'
                          : 'text-white hover:bg-white hover:bg-opacity-10'
                      }`}
                    >
                      <Icon size={18} />
                      {item.label}
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {isAuthenticated && (
              <div className="hidden md:flex items-center gap-4">
                <span className="text-white text-sm">
                  Welcome, <span className="font-semibold">{user?.username}</span>
                </span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-white text-primary px-4 py-2 rounded-lg font-semibold hover:bg-opacity-90 transition"
                >
                  <LogOut size={18} />
                  Logout
                </motion.button>
              </div>
            )}

            {!isAuthenticated && (
              <div className="hidden md:flex gap-4">
                <Link to="/login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-white px-6 py-2 rounded-lg border-2 border-white hover:bg-white hover:text-primary transition font-semibold"
                  >
                    Login
                  </motion.button>
                </Link>
                <Link to="/register">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white text-primary px-6 py-2 rounded-lg font-semibold hover:bg-opacity-90 transition"
                  >
                    Register
                  </motion.button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-white p-2"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden pb-4 space-y-2"
          >
            {isAuthenticated ? (
              <>
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link key={item.path} to={item.path} onClick={() => setIsOpen(false)}>
                      <div
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                          isActive(item.path)
                            ? 'bg-white bg-opacity-20 text-white'
                            : 'text-white hover:bg-white hover:bg-opacity-10'
                        }`}
                      >
                        <Icon size={18} />
                        {item.label}
                      </div>
                    </Link>
                  );
                })}
                <div className="pt-2 border-t border-white border-opacity-20">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 text-white px-4 py-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsOpen(false)}>
                  <div className="text-white px-4 py-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition">
                    Login
                  </div>
                </Link>
                <Link to="/register" onClick={() => setIsOpen(false)}>
                  <div className="text-white px-4 py-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition">
                    Register
                  </div>
                </Link>
              </>
            )}
          </motion.div>
        )}
      </div>
    </nav>
  );
};
