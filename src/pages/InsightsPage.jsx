import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useExpenseStore } from '../store/expenseStore';
import { formatCurrency, getCategoryInfo } from '../utils/formatting';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';

export const InsightsPage = () => {
  const expenses = useExpenseStore((state) => state.expenses);
  const getExpensesByCategory = useExpenseStore((state) => state.getExpensesByCategory);
  const getTotalSpent = useExpenseStore((state) => state.getTotalSpent);
  const getMicroSpends = useExpenseStore((state) => state.getMicroSpends);
  const budget = useExpenseStore((state) => state.budget);

  const categoryBreakdown = getExpensesByCategory();
  const totalSpent = getTotalSpent();
  const microSpends = getMicroSpends();
  const remaining = budget - totalSpent;

  // Prepare pie chart data
  const pieData = Object.entries(categoryBreakdown)
    .map(([category, data]) => {
      const info = getCategoryInfo(category);
      return {
        name: info.label,
        value: data.total,
        color: info.color,
        icon: info.icon,
        count: data.count,
        percentage: ((data.total / totalSpent) * 100).toFixed(1)
      };
    })
    .sort((a, b) => b.value - a.value);

  // Prepare trend data (last 7 days)
  const getTrendData = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayExpenses = expenses.filter(e => e.date.split('T')[0] === dateStr);
      const total = dayExpenses.reduce((sum, e) => sum + e.amount, 0);
      days.push({
        day: date.toLocaleDateString('en-IN', { weekday: 'short' }),
        amount: total,
        date: dateStr
      });
    }
    return days;
  };

  const trendData = getTrendData();
  const avgDaily = trendData.reduce((sum, d) => sum + d.amount, 0) / 7;
  const maxDay = trendData.reduce((max, d) => d.amount > max.amount ? d : max, trendData[0]);

  if (expenses.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white">
        <nav className="flex justify-between items-center px-6 py-4 max-w-4xl mx-auto">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">💰</span>
            <span className="text-xl font-bold">SpendSense</span>
          </Link>
          <Link to="/dashboard" className="text-gray-400 hover:text-white transition-colors">
            ← Back to Dashboard
          </Link>
        </nav>
        <div className="text-center py-20">
          <div className="text-6xl mb-6">📊</div>
          <h2 className="text-3xl font-bold mb-4">No Data Yet</h2>
          <p className="text-gray-400 mb-8">Add some expenses to see your spending insights</p>
          <Link to="/dashboard" className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full font-semibold">
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white">
      {/* Header */}
      <nav className="flex justify-between items-center px-6 py-4 max-w-6xl mx-auto">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">💰</span>
          <span className="text-xl font-bold">SpendSense</span>
        </Link>
        <Link to="/dashboard" className="text-gray-400 hover:text-white transition-colors">
          ← Back to Dashboard
        </Link>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-r from-blue-400 to-cyan-600 flex items-center justify-center text-4xl mb-6">
            📊
          </div>
          <h1 className="text-4xl font-bold mb-4">Smart Analytics</h1>
          <p className="text-gray-400 text-lg">
            Deep insights into your spending patterns
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl text-center">
            <div className="text-3xl font-bold text-blue-400">{formatCurrency(totalSpent)}</div>
            <div className="text-gray-400 text-sm mt-1">Total Spent</div>
          </div>
          <div className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl text-center">
            <div className={`text-3xl font-bold ${remaining >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {formatCurrency(Math.abs(remaining))}
            </div>
            <div className="text-gray-400 text-sm mt-1">{remaining >= 0 ? 'Remaining' : 'Over Budget'}</div>
          </div>
          <div className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl text-center">
            <div className="text-3xl font-bold text-cyan-400">{expenses.length}</div>
            <div className="text-gray-400 text-sm mt-1">Transactions</div>
          </div>
          <div className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl text-center">
            <div className="text-3xl font-bold text-purple-400">{formatCurrency(avgDaily)}</div>
            <div className="text-gray-400 text-sm mt-1">Avg/Day (7d)</div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Pie Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
          >
            <h2 className="text-xl font-bold mb-6">Spending by Category</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                  animationDuration={800}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => formatCurrency(value)}
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Legend */}
            <div className="mt-4 space-y-2">
              {pieData.slice(0, 5).map((cat, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span>{cat.icon} {cat.name}</span>
                  </div>
                  <span className="text-gray-400">{cat.percentage}%</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Trend Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
          >
            <h2 className="text-xl font-bold mb-6">7-Day Spending Trend</h2>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="day" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" tickFormatter={(v) => `₹${v}`} />
                <Tooltip
                  formatter={(value) => formatCurrency(value)}
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#06b6d4"
                  strokeWidth={3}
                  fill="url(#colorAmount)"
                />
              </AreaChart>
            </ResponsiveContainer>
            
            <div className="mt-4 flex justify-between text-sm">
              <div>
                <span className="text-gray-400">Peak Day:</span>
                <span className="ml-2 text-cyan-400">{maxDay.day} ({formatCurrency(maxDay.amount)})</span>
              </div>
              <div>
                <span className="text-gray-400">Daily Avg:</span>
                <span className="ml-2 text-cyan-400">{formatCurrency(avgDaily)}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Micro Spends Alert */}
        {microSpends.count > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 p-6 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-2xl"
          >
            <div className="flex items-start gap-4">
              <div className="text-4xl">💸</div>
              <div>
                <h3 className="text-xl font-bold text-yellow-400 mb-2">Micro-Spend Alert!</h3>
                <p className="text-gray-300">
                  You have <strong>{microSpends.count}</strong> purchases under ₹100, 
                  totaling <strong>{formatCurrency(microSpends.total)}</strong> 
                  ({((microSpends.total / totalSpent) * 100).toFixed(1)}% of total spending).
                </p>
                <p className="text-gray-400 mt-2 text-sm">
                  💡 Small daily purchases add up quickly! Try being more mindful of impulse buys.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Top Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
        >
          <h2 className="text-xl font-bold mb-6">Top Spending Categories</h2>
          <div className="space-y-4">
            {pieData.slice(0, 5).map((cat, i) => (
              <div key={i} className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                  style={{ backgroundColor: `${cat.color}30` }}
                >
                  {cat.icon}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">{cat.name}</span>
                    <span className="text-gray-400">{formatCurrency(cat.value)}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: `${cat.percentage}%`,
                        backgroundColor: cat.color
                      }}
                    />
                  </div>
                </div>
                <div className="text-sm text-gray-400">{cat.count} txns</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center"
        >
          <Link
            to="/dashboard"
            className="inline-block px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full font-semibold text-lg hover:shadow-lg hover:shadow-cyan-500/30 transition-all"
          >
            📊 View Full Dashboard
          </Link>
        </motion.div>
      </div>
    </div>
  );
};
