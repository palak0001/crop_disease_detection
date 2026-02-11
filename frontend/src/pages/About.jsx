import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Leaf, Target, Eye, Zap, Shield } from 'lucide-react';

export const About = () => {
  const features = [
    {
      icon: Eye,
      title: 'AI-Powered Detection',
      description: 'Advanced machine learning models trained on thousands of plant images for accurate disease detection',
      delay: 0,
    },
    {
      icon: Zap,
      title: 'Instant Results',
      description: 'Get predictions in seconds with detailed confidence scores and detailed analysis',
      delay: 0.1,
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data is encrypted and secure. We never store your images after analysis',
      delay: 0.2,
    },
    {
      icon: Target,
      title: 'Precise Treatment',
      description: 'Receive specific, evidence-based treatment recommendations for detected diseases',
      delay: 0.3,
    },
    {
      icon: Leaf,
      title: 'Eco-Friendly',
      description: 'Reduce pesticide use with targeted treatment recommendations based on accurate diagnosis',
      delay: 0.4,
    },
    {
      icon: BarChart3,
      title: 'Detailed Reports',
      description: 'Generate PDF reports with images, predictions, and treatment plans for documentation',
      delay: 0.5,
    },
  ];

  const steps = [
    {
      number: 1,
      title: 'Upload Image',
      description: 'Take a photo of your plant leaf or upload an existing image',
    },
    {
      number: 2,
      title: 'AI Analysis',
      description: 'Our AI model analyzes the image and identifies any diseases present',
    },
    {
      number: 3,
      title: 'Get Diagnosis',
      description: 'Receive detailed diagnosis with confidence score and disease classification',
    },
    {
      number: 4,
      title: 'Treatment Plan',
      description: 'Get specific, evidence-based treatment recommendations and medicines',
    },
    {
      number: 5,
      title: 'Generate Report',
      description: 'Download a comprehensive PDF report for your records',
    },
  ];

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      {/* Hero Section */}
      <section className="pt-16 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4">
              About <span className="text-primary">AgroGuard AI</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Empowering farmers and gardeners with cutting-edge AI technology to detect plant diseases early and save crops
            </p>
          </motion.div>

          {/* Main Info */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 md:p-12">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Mission</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  AgroGuard AI is dedicated to revolutionizing agricultural disease management through artificial intelligence and machine learning. We believe that early detection and proper treatment can save millions of crops annually.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Our platform combines state-of-the-art deep learning models with expert agricultural knowledge to provide farmers with reliable, accessible, and actionable insights about plant health.
                </p>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Choose Us?</h2>
                <ul className="space-y-3">
                  {[
                    'Advanced CNN-based disease detection',
                    'Covers 15+ plant disease types',
                    '95%+ accuracy in detection',
                    'Instant results within seconds',
                    'Detailed treatment recommendations',
                    'Comprehensive PDF reports',
                  ].map((point, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.05 }}
                      className="flex items-center gap-3 text-gray-700"
                    >
                      <span className="w-6 h-6 bg-gradient-green text-white rounded-full flex items-center justify-center text-sm font-bold">
                        ✓
                      </span>
                      {point}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-center text-gray-800 mb-12"
          >
            How It Works
          </motion.h2>

          <div className="space-y-6">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center gap-6 ${index % 2 !== 0 ? 'flex-row-reverse' : ''}`}
              >
                <div className="w-20 h-20 bg-gradient-green text-white rounded-full flex items-center justify-center flex-shrink-0 text-3xl font-bold shadow-lg">
                  {step.number}
                </div>
                <div className="flex-1 bg-white rounded-xl shadow-md p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-green-50 to-green-100">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-center text-gray-800 mb-12"
          >
            Key Features
          </motion.h2>

          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  variants={item}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition"
                >
                  <div className="w-12 h-12 bg-gradient-green text-white rounded-lg flex items-center justify-center mb-4">
                    <Icon size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Supported Crops */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-center text-gray-800 mb-12"
          >
            Supported Crops
          </motion.h2>

          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              {
                crop: 'Potato',
                diseases: ['Early Blight', 'Late Blight', 'Healthy'],
              },
              {
                crop: 'Tomato',
                diseases: [
                  'Early Blight',
                  'Late Blight',
                  'Leaf Mold',
                  'Septoria Leaf Spot',
                  'Spider Mites',
                  'Bacterial Spot',
                  'Target Spot',
                  'Mosaic Virus',
                  'Yellow Leaf Curl Virus',
                  'Healthy',
                ],
              },
              {
                crop: 'Bell Pepper',
                diseases: ['Bacterial Spot', 'Healthy'],
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={item}
                className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-lg p-6"
              >
                <h3 className="text-2xl font-bold text-primary mb-4">{item.crop}</h3>
                <ul className="space-y-2">
                  {item.diseases.map((disease, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-gray-700">
                      <span className="text-primary font-bold">•</span>
                      {disease}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-green">
        <div className="max-w-4xl mx-auto text-center text-white">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold mb-6"
          >
            Ready to Protect Your Crops?
          </motion.h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Start using AgroGuard AI today and make smarter decisions for your plants
          </p>
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="/predict"
            className="inline-block bg-white text-primary px-10 py-4 rounded-lg font-bold text-lg hover:shadow-lg transition"
          >
            Start Predicting Now
          </motion.a>
        </div>
      </section>
    </div>
  );
};
