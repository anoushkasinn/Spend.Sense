import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useExpenseStore } from '../store/expenseStore';
import { BudgetTracker } from '../components/BudgetTracker';
import { AddExpense } from '../components/AddExpense';
import { ExpenseList } from '../components/ExpenseList';
import { SpendingInsights } from '../components/SpendingInsights';
import { SpendingTrend } from '../components/SpendingTrend';
import { SavingsGoals } from '../components/SavingsGoals';
import { Settings } from '../components/Settings';

export const Dashboard = () => {
  const darkMode = useExpenseStore((state) => state.darkMode);
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'expenses', label: 'Expenses', icon: '💰' },
    { id: 'goals', label: 'Goals', icon: '🎯' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors`}>
      {/* Header */}
      <header className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b sticky top-0 z-40`}>
        <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">💰</span>
            <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              SpendSense
            </h1>
          </Link>
          
          <div className="flex items-center gap-3">
            <Link 
              to="/scanner"
              className="p-2 rounded-lg bg-green-500 hover:bg-green-600 text-white transition-colors"
              title="Scan Bill"
            >
              📷
            </Link>
            <Link 
              to="/assistant"
              className="p-2 rounded-lg bg-purple-500 hover:bg-purple-600 text-white transition-colors"
              title="AI Assistant"
            >
              💬
            </Link>
            <Link 
              to="/insights"
              className="p-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors"
              title="Analytics"
            >
              📈
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto pb-px">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? darkMode
                      ? 'bg-gray-900 text-white border-b-2 border-primary-500'
                      : 'bg-gray-50 text-primary-600 border-b-2 border-primary-500'
                    : darkMode
                      ? 'text-gray-400 hover:text-gray-200'
                      : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <span className="mr-1">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <BudgetTracker />
              <SpendingTrend />
              <SpendingInsights />
            </div>
          )}

          {activeTab === 'expenses' && (
            <ExpenseList />
          )}

          {activeTab === 'goals' && (
            <SavingsGoals />
          )}

          {activeTab === 'settings' && (
            <Settings />
          )}
        </motion.div>
      </main>

      {/* Add Expense FAB */}
      <AddExpense />

      {/* Quick Action Buttons */}
      <div className="fixed bottom-6 left-6 flex flex-col gap-3 z-40">
        <Link
          to="/scanner"
          className="w-12 h-12 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg flex items-center justify-center text-xl transition-transform hover:scale-110"
          title="Scan Bill"
        >
          📷
        </Link>
        <Link
          to="/assistant"
          className="w-12 h-12 bg-purple-500 hover:bg-purple-600 text-white rounded-full shadow-lg flex items-center justify-center text-xl transition-transform hover:scale-110"
          title="AI Assistant"
        >
          💬
        </Link>
      </div>
    </div>
  );
};
