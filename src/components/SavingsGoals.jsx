import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useExpenseStore } from '../store/expenseStore';
import { formatCurrency } from '../utils/formatting';

const GOAL_ICONS = [
  { icon: '🎯', label: 'General' },
  { icon: '📱', label: 'Phone' },
  { icon: '💻', label: 'Laptop' },
  { icon: '🎮', label: 'Gaming' },
  { icon: '✈️', label: 'Travel' },
  { icon: '🎓', label: 'Education' },
  { icon: '🏍️', label: 'Vehicle' },
  { icon: '💍', label: 'Gift' },
];

export const SavingsGoals = () => {
  const savingsGoals = useExpenseStore((state) => state.savingsGoals);
  const addSavingsGoal = useExpenseStore((state) => state.addSavingsGoal);
  const addToSavings = useExpenseStore((state) => state.addToSavings);
  const deleteSavingsGoal = useExpenseStore((state) => state.deleteSavingsGoal);
  const darkMode = useExpenseStore((state) => state.darkMode);

  const [isAdding, setIsAdding] = useState(false);
  const [addAmountModal, setAddAmountModal] = useState(null);
  const [saveAmount, setSaveAmount] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    icon: '🎯',
    deadline: ''
  });

  const handleAddGoal = () => {
    if (!formData.name || !formData.targetAmount || parseFloat(formData.targetAmount) <= 0) {
      alert('Please enter a valid goal name and target amount');
      return;
    }

    addSavingsGoal({
      name: formData.name,
      targetAmount: parseFloat(formData.targetAmount),
      icon: formData.icon,
      deadline: formData.deadline || null
    });

    setFormData({ name: '', targetAmount: '', icon: '🎯', deadline: '' });
    setIsAdding(false);
  };

  const handleAddSavings = () => {
    if (!saveAmount || parseFloat(saveAmount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    addToSavings(addAmountModal, parseFloat(saveAmount));
    setSaveAmount('');
    setAddAmountModal(null);
  };

  const getProgress = (goal) => {
    return Math.min((goal.savedAmount / goal.targetAmount) * 100, 100);
  };

  const getDaysLeft = (deadline) => {
    if (!deadline) return null;
    const today = new Date();
    const end = new Date(deadline);
    const diff = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm p-6 mb-6`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          🎯 Savings Goals
        </h2>
        <button
          onClick={() => setIsAdding(true)}
          className="text-sm px-3 py-1.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          + Add Goal
        </button>
      </div>

      {/* Goals List */}
      {savingsGoals.length === 0 && !isAdding ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-2">💰</div>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            No savings goals yet. Start saving for something!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {savingsGoals.map((goal) => {
              const progress = getProgress(goal);
              const daysLeft = getDaysLeft(goal.deadline);
              const isComplete = progress >= 100;

              return (
                <motion.div
                  key={goal.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{goal.icon}</span>
                      <div>
                        <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                          {goal.name}
                          {isComplete && <span className="ml-2 text-green-500">✅</span>}
                        </h3>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {formatCurrency(goal.savedAmount)} / {formatCurrency(goal.targetAmount)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!isComplete && (
                        <button
                          onClick={() => setAddAmountModal(goal.id)}
                          className="text-xs px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                          + Add
                        </button>
                      )}
                      <button
                        onClick={() => {
                          if (window.confirm('Delete this goal?')) {
                            deleteSavingsGoal(goal.id);
                          }
                        }}
                        className="text-xs px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="relative">
                    <div className={`w-full h-3 ${darkMode ? 'bg-gray-600' : 'bg-gray-200'} rounded-full overflow-hidden`}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        className={`h-full rounded-full ${isComplete ? 'bg-green-500' : 'bg-primary-500'}`}
                      />
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {progress.toFixed(0)}% saved
                      </span>
                      {daysLeft !== null && (
                        <span className={`text-xs ${daysLeft <= 7 ? 'text-red-500' : darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {daysLeft} days left
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Remaining */}
                  {!isComplete && (
                    <p className={`text-xs mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Need {formatCurrency(goal.targetAmount - goal.savedAmount)} more to reach goal
                    </p>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Add Goal Form Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-xl w-full max-w-md p-6`}
            >
              <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-4`}>
                🎯 New Savings Goal
              </h3>

              {/* Goal Name */}
              <div className="mb-4">
                <label className={`block text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-1`}>Goal Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., New Phone"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                  }`}
                />
              </div>

              {/* Target Amount */}
              <div className="mb-4">
                <label className={`block text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-1`}>Target Amount (₹)</label>
                <input
                  type="number"
                  value={formData.targetAmount}
                  onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                  placeholder="10000"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                  }`}
                />
              </div>

              {/* Icon Selection */}
              <div className="mb-4">
                <label className={`block text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-1`}>Icon</label>
                <div className="grid grid-cols-4 gap-2">
                  {GOAL_ICONS.map((item) => (
                    <button
                      key={item.icon}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon: item.icon })}
                      className={`p-2 rounded-lg border-2 transition-all text-center ${
                        formData.icon === item.icon
                          ? 'border-primary-500 bg-primary-50'
                          : darkMode ? 'border-gray-600 hover:border-gray-500' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-xl">{item.icon}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Deadline */}
              <div className="mb-4">
                <label className={`block text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-1`}>Deadline (Optional)</label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                  }`}
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => setIsAdding(false)}
                  className={`flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors ${
                    darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddGoal}
                  className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  Create Goal
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Savings Amount Modal */}
      <AnimatePresence>
        {addAmountModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-xl w-full max-w-sm p-6`}
            >
              <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-4`}>
                💰 Add to Savings
              </h3>

              <div className="mb-4">
                <label className={`block text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-1`}>Amount (₹)</label>
                <input
                  type="number"
                  value={saveAmount}
                  onChange={(e) => setSaveAmount(e.target.value)}
                  placeholder="500"
                  autoFocus
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                  }`}
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setAddAmountModal(null);
                    setSaveAmount('');
                  }}
                  className={`flex-1 px-4 py-2 border rounded-lg transition-colors ${
                    darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddSavings}
                  className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
