import { useState } from 'react';
import { motion } from 'framer-motion';
import { useExpenseStore } from '../store/expenseStore';
import { CATEGORIES } from '../utils/formatting';

export const AddExpense = () => {
  const addExpense = useExpenseStore((state) => state.addExpense);
  const darkMode = useExpenseStore((state) => state.darkMode);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    category: 'food',
    note: '',
    date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    addExpense({
      amount: parseFloat(formData.amount),
      category: formData.category,
      note: formData.note,
      date: new Date(formData.date).toISOString()
    });

    // Reset form
    setFormData({
      amount: '',
      category: 'food',
      note: '',
      date: new Date().toISOString().split('T')[0]
    });
    
    setIsOpen(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <>
      {/* Add Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-primary-600 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-2xl hover:bg-primary-700 transition-colors z-50"
      >
        +
      </motion.button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl w-full max-w-md p-6 my-4`}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Add Expense</h2>
              <button
                onClick={() => setIsOpen(false)}
                className={`text-2xl ${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Amount */}
              <div className="mb-4">
                <label className={`block font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Amount (₹)
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="0"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-lg ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'
                  }`}
                  autoFocus
                  step="0.01"
                  required
                />
              </div>

              {/* Category */}
              <div className="mb-4">
                <label className={`block font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Category
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, category: cat.value })}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        formData.category === cat.value
                          ? 'border-primary-500 bg-primary-50'
                          : darkMode ? 'border-gray-600 hover:border-gray-500' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-2xl mb-1">{cat.icon}</div>
                      <div className={`text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {cat.label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Note */}
              <div className="mb-4">
                <label className={`block font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Note (Optional)
                </label>
                <input
                  type="text"
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                  placeholder="e.g., Lunch with friends"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'
                  }`}
                />
              </div>

              {/* Date */}
              <div className="mb-6">
                <label className={`block font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                  }`}
                  required
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className={`flex-1 px-4 py-2 border rounded-lg transition-colors ${
                    darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Add Expense
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </>
  );
};
