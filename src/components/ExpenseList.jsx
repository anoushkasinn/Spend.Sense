import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useExpenseStore } from '../store/expenseStore';
import { formatCurrency, formatDate, getCategoryInfo, CATEGORIES } from '../utils/formatting';

export const ExpenseList = () => {
  const expenses = useExpenseStore((state) => state.expenses);
  const deleteExpense = useExpenseStore((state) => state.deleteExpense);
  const updateExpense = useExpenseStore((state) => state.updateExpense);
  const darkMode = useExpenseStore((state) => state.darkMode);
  const [expandedId, setExpandedId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState(null);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  // Filter expenses
  let filteredExpenses = [...expenses];
  if (filter !== 'all') {
    filteredExpenses = filteredExpenses.filter(e => e.category === filter);
  }

  // Sort expenses
  const sortedExpenses = filteredExpenses.sort((a, b) => {
    if (sortBy === 'date') return new Date(b.date) - new Date(a.date);
    if (sortBy === 'amount') return b.amount - a.amount;
    if (sortBy === 'category') return a.category.localeCompare(b.category);
    return 0;
  });

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      deleteExpense(id);
      setExpandedId(null);
    }
  };

  const handleEdit = (expense) => {
    setEditingId(expense.id);
    setEditData({
      amount: expense.amount.toString(),
      category: expense.category,
      note: expense.note || '',
      date: expense.date.split('T')[0]
    });
  };

  const handleSaveEdit = () => {
    if (!editData.amount || parseFloat(editData.amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    updateExpense(editingId, {
      amount: parseFloat(editData.amount),
      category: editData.category,
      note: editData.note,
      date: new Date(editData.date).toISOString()
    });

    setEditingId(null);
    setEditData(null);
    setExpandedId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData(null);
  };

  if (expenses.length === 0) {
    return (
      <div className="text-center py-12 animate-fade-in">
        <div className="text-6xl mb-4">💸</div>
        <h3 className={`text-xl font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
          No expenses yet
        </h3>
        <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
          Tap the + button to add your first expense
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Recent Expenses ({expenses.length})
        </h2>
        
        <div className="flex gap-2 flex-wrap">
          {/* Category Filter */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className={`text-sm px-3 py-1.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
            }`}
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.icon} {cat.label}</option>
            ))}
          </select>
          
          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={`text-sm px-3 py-1.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
            }`}
          >
            <option value="date">Newest First</option>
            <option value="amount">Highest Amount</option>
            <option value="category">By Category</option>
          </select>
        </div>
      </div>
      
      <AnimatePresence>
        {sortedExpenses.map((expense) => {
          const categoryInfo = getCategoryInfo(expense.category);
          const isExpanded = expandedId === expense.id;
          const isEditing = editingId === expense.id;
          
          return (
            <motion.div
              key={expense.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className={`rounded-lg shadow-sm border overflow-hidden ${
                darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}
            >
              {isEditing ? (
                /* Edit Mode */
                <div className="p-4">
                  <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'} mb-3`}>Edit Expense</h3>
                  
                  {/* Amount */}
                  <div className="mb-3">
                    <label className={`block text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-1`}>Amount (₹)</label>
                    <input
                      type="number"
                      value={editData.amount}
                      onChange={(e) => setEditData({...editData, amount: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                      }`}
                      step="0.01"
                    />
                  </div>
                  
                  {/* Category */}
                  <div className="mb-3">
                    <label className={`block text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-1`}>Category</label>
                    <div className="grid grid-cols-4 gap-2">
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat.value}
                          type="button"
                          onClick={() => setEditData({...editData, category: cat.value})}
                          className={`p-2 rounded-lg border-2 transition-all text-center ${
                            editData.category === cat.value
                              ? 'border-primary-500 bg-primary-50'
                              : darkMode ? 'border-gray-600 hover:border-gray-500' : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="text-xl">{cat.icon}</div>
                          <div className={`text-xs truncate ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{cat.label.split(' ')[0]}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Note */}
                  <div className="mb-3">
                    <label className={`block text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-1`}>Note</label>
                    <input
                      type="text"
                      value={editData.note}
                      onChange={(e) => setEditData({...editData, note: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                      }`}
                      placeholder="Optional note"
                    />
                  </div>
                  
                  {/* Date */}
                  <div className="mb-4">
                    <label className={`block text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-1`}>Date</label>
                    <input
                      type="date"
                      value={editData.date}
                      onChange={(e) => setEditData({...editData, date: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                      }`}
                    />
                  </div>
                  
                  {/* Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={handleCancelEdit}
                      className={`flex-1 px-4 py-2 border rounded-lg transition-colors text-sm ${
                        darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveEdit}
                      className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                /* View Mode */
                <>
                  <div
                    onClick={() => setExpandedId(isExpanded ? null : expense.id)}
                    className={`p-4 cursor-pointer transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0"
                          style={{ backgroundColor: `${categoryInfo.color}20` }}
                        >
                          {categoryInfo.icon}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                              {categoryInfo.label}
                            </h3>
                            {expense.isMicroSpend && (
                              <span className={`text-xs px-2 py-0.5 rounded ${darkMode ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-800'}`}>
                                Micro
                              </span>
                            )}
                          </div>
                          {expense.note && (
                            <p className={`text-sm truncate ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {expense.note}
                            </p>
                          )}
                          <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                            {formatDate(expense.date)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right flex-shrink-0 ml-2">
                        <div className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {formatCurrency(expense.amount)}
                        </div>
                        <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                          {isExpanded ? '▲' : '▼'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className={`border-t px-4 py-3 ${darkMode ? 'border-gray-700 bg-gray-700/50' : 'border-gray-200 bg-gray-50'}`}
                      >
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            <div>Added: {new Date(expense.createdAt).toLocaleString('en-IN')}</div>
                            {expense.note && <div className="mt-1">Note: {expense.note}</div>}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(expense);
                              }}
                              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(expense.id);
                              }}
                              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
