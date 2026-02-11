import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { reportAPI } from '../services/api';
import { Download, AlertCircle, FileText, Loader } from 'lucide-react';

export const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await reportAPI.getReports();
      setReports(response.data.reports || []);
      setError('');
    } catch (err) {
      setError('Failed to load reports');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (reportId) => {
    try {
      setDownloading(reportId);
      const response = await reportAPI.downloadReport(reportId);
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report_${reportId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to download report');
      console.error(err);
    } finally {
      setDownloading(null);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Reports</h1>
          <p className="text-xl text-gray-600">Download and view your prediction reports</p>
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

        {/* Reports Grid */}
        {reports.length > 0 ? (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {reports.map((report, index) => (
              <motion.div
                key={report.id}
                variants={item}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition"
              >
                {/* Card Header */}
                <div className="bg-gradient-green p-6 text-white">
                  <div className="flex items-center gap-3 mb-2">
                    <FileText size={24} />
                    <span className="font-semibold">Report #{report.id}</span>
                  </div>
                  <p className="text-green-100 text-sm">
                    {new Date(report.created_at).toLocaleDateString()}
                  </p>
                </div>

                {/* Card Body */}
                <div className="p-6 space-y-4">
                  {/* Disease */}
                  <div>
                    <p className="text-sm text-gray-600 font-semibold mb-1">Detected Disease</p>
                    <p className="text-lg font-bold text-gray-800">
                      {report.predicted_class.replace(/_/g, ' ')}
                    </p>
                  </div>

                  {/* Confidence */}
                  <div>
                    <p className="text-sm text-gray-600 font-semibold mb-1">Confidence Score</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-green h-2 rounded-full"
                          style={{ width: `${report.confidence * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-lg font-bold text-primary">
                        {(report.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600 mb-3">
                      Generated on {new Date(report.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDownload(report.id)}
                      disabled={downloading === report.id}
                      className="w-full bg-gradient-green text-white py-2 rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {downloading === report.id ? (
                        <>
                          <Loader className="animate-spin" size={18} />
                          Downloading...
                        </>
                      ) : (
                        <>
                          <Download size={18} />
                          Download PDF
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-white rounded-2xl shadow-lg"
          >
            <FileText className="mx-auto mb-4 text-gray-400" size={64} />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Reports Yet</h3>
            <p className="text-gray-600 mb-6">
              Start by making predictions to generate reports
            </p>
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
