import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { predictionAPI, reportAPI } from '../services/api';
import { Upload, Download, AlertCircle, CheckCircle, Loader } from 'lucide-react';

export const Predict = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [uploadingReport, setUploadingReport] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      handleFileSelect(droppedFiles[0]);
    }
  };

  const handleFileSelect = (selectedFile) => {
    if (!selectedFile.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    setFile(selectedFile);
    setError('');

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleFileInput = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

  const handlePredict = async () => {
    if (!file) {
      setError('Please select an image');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await predictionAPI.predict(formData);
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Prediction failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    if (!result?.prediction_id) return;

    setUploadingReport(true);
    try {
      await reportAPI.generateReport(result.prediction_id);
      
      // Download the report
      const reportResponse = await reportAPI.downloadReport(result.prediction_id + 1);
      const url = window.URL.createObjectURL(new Blob([reportResponse]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'agroguard_report.pdf');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      setError('Failed to generate report');
      console.error(err);
    } finally {
      setUploadingReport(false);
    }
  };

  const resetPrediction = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Disease Prediction</h1>
          <p className="text-xl text-gray-600">Upload a plant image to detect diseases</p>
        </motion.div>

        {/* Error Alert */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded flex items-start gap-3"
            >
              <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
              <p className="text-red-800">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {!result ? (
          // Upload Section
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Drag & Drop Area */}
            <motion.div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              whileHover={{ scale: 1.02 }}
              className="border-2 border-dashed border-primary rounded-2xl p-8 md:p-16 text-center bg-white cursor-pointer hover:bg-green-50 transition"
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                className="hidden"
                id="file-input"
              />

              <label htmlFor="file-input" className="cursor-pointer block">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="mb-4"
                >
                  <Upload className="mx-auto text-primary mb-4" size={48} />
                </motion.div>

                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {file ? 'Image selected!' : 'Drag & drop your image here'}
                </h3>
                <p className="text-gray-600 mb-4">
                  or <span className="text-primary font-semibold">click to browse</span>
                </p>
                <p className="text-sm text-gray-500">Supported formats: JPG, PNG, GIF, WebP</p>
              </label>
            </motion.div>

            {/* Image Preview */}
            {preview && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden"
              >
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Preview</h3>
                  <img
                    src={preview}
                    alt="Preview"
                    className="mx-auto max-h-96 rounded-lg"
                  />
                  <div className="mt-4 text-sm text-gray-600">
                    <p className="font-semibold text-gray-800 mb-2">File Details:</p>
                    <p>Name: {file?.name}</p>
                    <p>Size: {(file?.size / 1024).toFixed(2)} KB</p>
                  </div>

                  <div className="flex gap-4 mt-6">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={resetPrediction}
                      className="flex-1 border-2 border-primary text-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary hover:text-white transition"
                    >
                      Change Image
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handlePredict}
                      disabled={loading}
                      className="flex-1 bg-gradient-green text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <span className="animate-spin">◐</span>
                          Analyzing...
                        </>
                      ) : (
                        'Analyze Image'
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        ) : (
          // Results Section
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            {/* Result Card */}
            <motion.div
              className="bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="bg-gradient-green p-8 text-white text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 100 }}
                  className="mb-4"
                >
                  <CheckCircle className="mx-auto" size={64} />
                </motion.div>
                <h2 className="text-3xl font-bold mb-2">Analysis Complete!</h2>
                <p className="text-green-100">Disease detected with high confidence</p>
              </div>

              <div className="p-8 space-y-6">
                {/* Disease Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Disease Name */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl"
                  >
                    <p className="text-sm text-gray-600 font-semibold mb-2">DETECTED DISEASE</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {result.predicted_class_display}
                    </p>
                  </motion.div>

                  {/* Confidence */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl"
                  >
                    <p className="text-sm text-gray-600 font-semibold mb-2">CONFIDENCE SCORE</p>
                    <p className="text-2xl font-bold text-blue-600 mb-3">
                      {(result.confidence * 100).toFixed(2)}%
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${result.confidence * 100}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className="bg-gradient-green h-2 rounded-full"
                      ></motion.div>
                    </div>
                  </motion.div>
                </div>

                {/* Treatment */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="p-6 bg-yellow-50 border-l-4 border-yellow-400 rounded-xl"
                >
                  <h3 className="text-lg font-bold text-gray-800 mb-3">Recommended Treatment</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {result.treatment}
                  </p>
                </motion.div>

                {/* Medicine */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="p-6 bg-orange-50 border-l-4 border-orange-400 rounded-xl"
                >
                  <h3 className="text-lg font-bold text-gray-800 mb-3">Suggested Medicine</h3>
                  <p className="text-2xl font-bold text-orange-600">
                    {result.medicine}
                  </p>
                </motion.div>

                {/* Image Preview */}
                <div className="mt-6">
                  <p className="text-sm text-gray-600 font-semibold mb-3">ANALYZED IMAGE</p>
                  <img
                    src={preview}
                    alt="Analyzed"
                    className="mx-auto max-h-64 rounded-lg shadow-md"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col md:flex-row gap-4 pt-6 border-t border-gray-200">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={resetPrediction}
                    className="flex-1 border-2 border-primary text-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary hover:text-white transition"
                  >
                    Upload Another Image
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleGenerateReport}
                    disabled={uploadingReport}
                    className="flex-1 bg-gradient-green text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {uploadingReport ? (
                      <>
                        <Loader className="animate-spin" size={20} />
                        Generating Report...
                      </>
                    ) : (
                      <>
                        <Download size={20} />
                        Download PDF Report
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
