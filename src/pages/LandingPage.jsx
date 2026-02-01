import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export const LandingPage = () => {
  const features = [
    {
      icon: '📷',
      title: 'AI Bill Scanner',
      description: 'Snap a photo of any receipt and our AI instantly extracts amount, date, and category. No manual entry needed!',
      color: 'from-green-400 to-emerald-600',
      link: '/scanner'
    },
    {
      icon: '💬',
      title: 'AI Financial Assistant',
      description: 'Get personalized spending insights, budget advice, and savings tips from your smart money coach.',
      color: 'from-purple-400 to-violet-600',
      link: '/assistant'
    },
    {
      icon: '📊',
      title: 'Smart Analytics',
      description: 'Beautiful charts showing spending trends, category breakdowns, and micro-spend detection.',
      color: 'from-blue-400 to-cyan-600',
      link: '/insights'
    }
  ];

  const allFeatures = [
    { icon: '💰', text: 'Expense Tracking' },
    { icon: '🎯', text: 'Budget Goals' },
    { icon: '📈', text: 'Trend Charts' },
    { icon: '🌙', text: 'Dark Mode' },
    { icon: '📥', text: 'Export CSV' },
    { icon: '💸', text: 'Micro-Spend Alerts' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }} />
      </div>

      {/* Header */}
      <nav className="relative z-10 flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <span className="text-3xl">💰</span>
          <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            SpendSense
          </span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Link 
            to="/dashboard"
            className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-all border border-white/20"
          >
            Open App →
          </Link>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Smart Money
            </span>
            <br />
            <span className="text-white">For Students</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10">
            AI-powered expense tracking designed for students. Scan bills, get insights, 
            and take control of your finances with zero effort.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/dashboard"
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full font-semibold text-lg hover:shadow-lg hover:shadow-purple-500/30 transition-all transform hover:scale-105"
            >
              🚀 Get Started Free
            </Link>
            <a 
              href="#features"
              className="px-8 py-4 bg-white/10 hover:bg-white/20 rounded-full font-semibold text-lg backdrop-blur-sm border border-white/20 transition-all"
            >
              Learn More ↓
            </a>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto"
        >
          {[
            { value: '100%', label: 'Free' },
            { value: '0', label: 'API Keys Needed' },
            { value: '∞', label: 'Offline Support' }
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl font-bold text-cyan-400">{stat.value}</div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* AI Features Section */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              AI-Powered Features
            </span>
          </h2>
          <p className="text-gray-400 text-lg">Built for the future of personal finance</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
            >
              <Link to={feature.link}>
                <div className="group h-full p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/30 transition-all hover:transform hover:scale-105 cursor-pointer">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                  <div className="mt-4 text-cyan-400 font-medium group-hover:translate-x-2 transition-transform inline-block">
                    Explore →
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* All Features Grid */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Everything You Need</h2>
          <p className="text-gray-400">Comprehensive tools for student finance management</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {allFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 text-center hover:bg-white/10 transition-all"
            >
              <div className="text-3xl mb-2">{feature.icon}</div>
              <div className="text-sm font-medium">{feature.text}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center p-12 rounded-3xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 backdrop-blur-sm border border-white/20"
        >
          <h2 className="text-4xl font-bold mb-4">Ready to Take Control?</h2>
          <p className="text-gray-300 mb-8 text-lg">
            Join thousands of students managing their money smarter.
          </p>
          <Link 
            to="/dashboard"
            className="inline-block px-10 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full font-semibold text-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all transform hover:scale-105"
          >
            🎯 Launch Dashboard
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-8 mt-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">💰</span>
            <span className="font-bold text-lg">SpendSense</span>
          </div>
          <div className="text-gray-400 text-sm">
            Built with ❤️ for Hackathon 2026
          </div>
          <div className="flex gap-6 text-gray-400">
            <Link to="/scanner" className="hover:text-white transition-colors">Scanner</Link>
            <Link to="/assistant" className="hover:text-white transition-colors">Assistant</Link>
            <Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
