import { useState } from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { useExpenseStore } from '../store/expenseStore';
import { formatCurrency } from '../utils/formatting';

// Custom Tooltip component defined outside of main component
const CustomTooltipContent = ({ active, payload, label, darkMode }) => {
  if (active && payload && payload.length) {
    return (
      <div className={`${darkMode ? 'bg-gray-700' : 'bg-white'} p-3 rounded-lg shadow-lg border ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
        <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{label}</p>
        <p className="text-primary-500 font-bold">{formatCurrency(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

export const SpendingTrend = () => {
  const getSpendingTrend = useExpenseStore((state) => state.getSpendingTrend);
  const darkMode = useExpenseStore((state) => state.darkMode);
  const [period, setPeriod] = useState(7);

  const trendData = getSpendingTrend(period);
  const totalSpent = trendData.reduce((sum, d) => sum + d.amount, 0);
  const avgDaily = totalSpent / period;
  const maxDay = trendData.reduce((max, d) => d.amount > max.amount ? d : max, { amount: 0 });

  if (trendData.every(d => d.amount === 0)) {
    return (
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm p-6 mb-6`}>
        <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-4`}>
          📈 Spending Trend
        </h2>
        <div className="text-center py-8">
          <div className="text-4xl mb-2">📊</div>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Add some expenses to see your spending trends
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm p-6 mb-6`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          📈 Spending Trend
        </h2>
        
        <div className="flex gap-2">
          <button
            onClick={() => setPeriod(7)}
            className={`px-3 py-1 text-sm rounded-lg transition-colors ${
              period === 7
                ? 'bg-primary-500 text-white'
                : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
            }`}
          >
            7 Days
          </button>
          <button
            onClick={() => setPeriod(14)}
            className={`px-3 py-1 text-sm rounded-lg transition-colors ${
              period === 14
                ? 'bg-primary-500 text-white'
                : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
            }`}
          >
            14 Days
          </button>
          <button
            onClick={() => setPeriod(30)}
            className={`px-3 py-1 text-sm rounded-lg transition-colors ${
              period === 30
                ? 'bg-primary-500 text-white'
                : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
            }`}
          >
            30 Days
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-3 text-center`}>
          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total ({period}d)</p>
          <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{formatCurrency(totalSpent)}</p>
        </div>
        <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-3 text-center`}>
          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Daily Avg</p>
          <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{formatCurrency(avgDaily)}</p>
        </div>
        <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-3 text-center`}>
          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Peak Day</p>
          <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{formatCurrency(maxDay.amount)}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trendData}>
            <defs>
              <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
            <XAxis 
              dataKey="day" 
              tick={{ fontSize: 12, fill: darkMode ? '#9ca3af' : '#6b7280' }}
              axisLine={{ stroke: darkMode ? '#374151' : '#e5e7eb' }}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: darkMode ? '#9ca3af' : '#6b7280' }}
              axisLine={{ stroke: darkMode ? '#374151' : '#e5e7eb' }}
              tickFormatter={(value) => `₹${value}`}
            />
            <Tooltip content={(props) => <CustomTooltipContent {...props} darkMode={darkMode} />} />
            <Area 
              type="monotone" 
              dataKey="amount" 
              stroke="#0ea5e9" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorAmount)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
