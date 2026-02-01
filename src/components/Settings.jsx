import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useExpenseStore } from '../store/expenseStore';

export const Settings = () => {
  const darkMode = useExpenseStore((state) => state.darkMode);
  const toggleDarkMode = useExpenseStore((state) => state.toggleDarkMode);
  const exportToCSV = useExpenseStore((state) => state.exportToCSV);
  const expenses = useExpenseStore((state) => state.expenses);
  
  const [isOpen, setIsOpen] = useState(false);

  const handleExport = () => {
    const csvContent = exportToCSV();
    
    if (!csvContent) {
      alert('No expenses to export!');
      return;
    }

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `expenses_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  };

  const handleClearData = () => {
    if (window.confirm('⚠️ This will delete ALL your data including expenses, goals, and settings. This cannot be undone!\n\nAre you sure?')) {
      if (window.confirm('Really? All your expense history will be lost forever!')) {
        localStorage.removeItem('expense-storage');
        window.location.reload();
      }
    }
  };

  return (
    <>
      {/* Settings Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed top-4 right-4 w-10 h-10 rounded-full shadow-lg flex items-center justify-center text-lg z-50 transition-colors ${
          darkMode 
            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
            : 'bg-white text-gray-600 hover:bg-gray-100'
        }`}
        title="Settings"
      >
        ⚙️
      </button>

      {/* Settings Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-xl w-full max-w-md p-6`}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  ⚙️ Settings
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className={`text-2xl ${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  ×
                </button>
              </div>

              {/* Dark Mode Toggle */}
              <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4 mb-4`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      🌙 Dark Mode
                    </h3>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Easier on the eyes at night
                    </p>
                  </div>
                  <button
                    onClick={toggleDarkMode}
                    className={`relative w-14 h-7 rounded-full transition-colors ${
                      darkMode ? 'bg-primary-500' : 'bg-gray-300'
                    }`}
                  >
                    <motion.div
                      initial={false}
                      animate={{ x: darkMode ? 28 : 4 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className="absolute top-1 w-5 h-5 bg-white rounded-full shadow"
                    />
                  </button>
                </div>
              </div>

              {/* Export Data */}
              <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4 mb-4`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      📥 Export Data
                    </h3>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Download expenses as CSV ({expenses.length} records)
                    </p>
                  </div>
                  <button
                    onClick={handleExport}
                    disabled={expenses.length === 0}
                    className="px-4 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Export
                  </button>
                </div>
              </div>

              {/* App Info */}
              <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4 mb-4`}>
                <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'} mb-2`}>
                  📱 App Info
                </h3>
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} space-y-1`}>
                  <p>SpendSense v1.0</p>
                  <p>Total Expenses: {expenses.length}</p>
                  <p>Storage: LocalStorage (data stays on device)</p>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="border-2 border-red-200 rounded-lg p-4">
                <h3 className="font-medium text-red-600 mb-2">⚠️ Danger Zone</h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-3`}>
                  This action cannot be undone
                </p>
                <button
                  onClick={handleClearData}
                  className="w-full px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors"
                >
                  🗑️ Clear All Data
                </button>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className={`w-full mt-4 px-4 py-2 border rounded-lg transition-colors ${
                  darkMode 
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
