import { useState } from 'react';
import { motion } from 'framer-motion';
import { useExpenseStore } from '../store/expenseStore';
import { formatCurrency } from '../utils/formatting';

export const BudgetTracker = () => {
  const budget = useExpenseStore((state) => state.budget);
  const setBudget = useExpenseStore((state) => state.setBudget);
  const getTotalSpent = useExpenseStore((state) => state.getTotalSpent);
  const getBudgetStatus = useExpenseStore((state) => state.getBudgetStatus);
  const darkMode = useExpenseStore((state) => state.darkMode);
  
  const [isEditing, setIsEditing] = useState(false);
  const [newBudget, setNewBudget] = useState(budget.toString());
  
  const totalSpent = getTotalSpent();
  const remaining = budget - totalSpent;
  const percentage = Math.min((totalSpent / budget) * 100, 100);
  const actualPercentage = (totalSpent / budget) * 100;
  const status = getBudgetStatus();

  // Calculate days left in month
  const today = new Date();
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const daysLeft = lastDayOfMonth.getDate() - today.getDate();
  
  // Calculate daily budget remaining
  const dailyBudgetRemaining = remaining > 0 && daysLeft > 0 
    ? remaining / daysLeft 
    : 0;

  // Calculate average daily spending
  const daysPassed = today.getDate();
  const avgDailySpending = totalSpent / daysPassed;

  const handleSave = () => {
    const amount = parseFloat(newBudget);
    if (amount > 0) {
      setBudget(amount);
      setIsEditing(false);
    } else {
      alert('Please enter a valid budget amount');
    }
  };

  const getStatusColor = () => {
    if (status.status === 'safe') return 'bg-green-500';
    if (status.status === 'warning') return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStatusBgColor = () => {
    if (darkMode) {
      if (status.status === 'safe') return 'bg-green-900/30 border-green-700';
      if (status.status === 'warning') return 'bg-yellow-900/30 border-yellow-700';
      return 'bg-red-900/30 border-red-700';
    }
    if (status.status === 'safe') return 'bg-green-50 border-green-200';
    if (status.status === 'warning') return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  const getStatusTextColor = () => {
    if (status.status === 'safe') return 'text-green-600';
    if (status.status === 'warning') return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusIcon = () => {
    if (status.status === 'safe') return '✅';
    if (status.status === 'warning') return '⚠️';
    return '🚨';
  };

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-md p-6 mb-6 transition-colors`}>
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Monthly Budget</h2>
          <div className={`flex items-center gap-2 mt-1`}>
            <span className="text-lg">{getStatusIcon()}</span>
            <p className={`text-sm font-medium ${getStatusTextColor()}`}>
              {status.message}
            </p>
          </div>
        </div>
        {!isEditing ? (
          <button
            onClick={() => {
              setIsEditing(true);
              setNewBudget(budget.toString());
            }}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium px-3 py-1 rounded-lg hover:bg-primary-50 transition-colors"
          >
            Edit Budget
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="text-sm text-green-600 hover:text-green-700 font-medium px-3 py-1 rounded-lg hover:bg-green-50 transition-colors"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className={`text-sm font-medium px-3 py-1 rounded-lg transition-colors ${darkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Budget Input */}
      {isEditing && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-4"
        >
          <div className="flex gap-2">
            <span className={`flex items-center px-3 ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'} rounded-l-lg font-medium`}>₹</span>
            <input
              type="number"
              value={newBudget}
              onChange={(e) => setNewBudget(e.target.value)}
              className={`flex-1 px-4 py-2 border rounded-r-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-lg font-semibold ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
              }`}
              placeholder="Enter budget amount"
              autoFocus
            />
          </div>
        </motion.div>
      )}

      {/* Progress Bar */}
      <div className="mb-6">
        <div className={`flex justify-between text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
          <span>Spent: {formatCurrency(totalSpent)}</span>
          <span>{actualPercentage.toFixed(1)}% used</span>
        </div>
        <div className={`w-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-4 overflow-hidden`}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className={`h-full ${getStatusColor()} transition-colors duration-300 relative`}
          >
            {actualPercentage > 100 && (
              <div className="absolute right-0 top-0 h-full w-1 bg-red-700 animate-pulse" />
            )}
          </motion.div>
        </div>
      </div>

      {/* Budget Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <div className={`text-center p-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
          <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-1`}>Budget</div>
          <div className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {formatCurrency(budget)}
          </div>
        </div>
        
        <div className={`text-center p-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
          <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-1`}>Spent</div>
          <div className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {formatCurrency(totalSpent)}
          </div>
        </div>
        
        <div className={`text-center p-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
          <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-1`}>Remaining</div>
          <div className={`text-lg font-bold ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {remaining >= 0 ? formatCurrency(remaining) : `-${formatCurrency(Math.abs(remaining))}`}
          </div>
        </div>
        
        <div className={`text-center p-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
          <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-1`}>Days Left</div>
          <div className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {daysLeft}
          </div>
        </div>
      </div>

      {/* Daily Insights */}
      <div className={`p-4 rounded-lg border ${getStatusBgColor()}`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Daily Budget (to stay on track)</div>
            <div className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {dailyBudgetRemaining > 0 
                ? formatCurrency(dailyBudgetRemaining) + '/day'
                : 'Budget exceeded!'
              }
            </div>
          </div>
          <div>
            <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Your Avg. Daily Spending</div>
            <div className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {formatCurrency(avgDailySpending)}/day
            </div>
          </div>
        </div>
      </div>

      {/* Warning/Alert Messages */}
      {totalSpent > budget && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-4 p-4 rounded-lg border ${darkMode ? 'bg-red-900/30 border-red-700' : 'bg-red-50 border-red-200'}`}
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl">🚨</span>
            <div>
              <p className={`font-semibold ${darkMode ? 'text-red-400' : 'text-red-800'}`}>
                Budget Exceeded!
              </p>
              <p className={`text-sm ${darkMode ? 'text-red-300' : 'text-red-700'} mt-1`}>
                You've overspent by {formatCurrency(totalSpent - budget)}. 
                Try to reduce spending for the remaining {daysLeft} days.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {status.status === 'warning' && totalSpent <= budget && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-4 p-4 rounded-lg border ${darkMode ? 'bg-yellow-900/30 border-yellow-700' : 'bg-yellow-50 border-yellow-200'}`}
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className={`font-semibold ${darkMode ? 'text-yellow-400' : 'text-yellow-800'}`}>
                Approaching Budget Limit
              </p>
              <p className={`text-sm ${darkMode ? 'text-yellow-300' : 'text-yellow-700'} mt-1`}>
                Only {formatCurrency(remaining)} left for {daysLeft} days. 
                That's {formatCurrency(dailyBudgetRemaining)}/day to stay on track.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {status.status === 'safe' && totalSpent > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-4 p-4 rounded-lg border ${darkMode ? 'bg-green-900/30 border-green-700' : 'bg-green-50 border-green-200'}`}
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl">🎉</span>
            <div>
              <p className={`font-semibold ${darkMode ? 'text-green-400' : 'text-green-800'}`}>
                You're doing great!
              </p>
              <p className={`text-sm ${darkMode ? 'text-green-300' : 'text-green-700'} mt-1`}>
                You have {formatCurrency(remaining)} left and {daysLeft} days remaining. 
                Keep up the good work!
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
