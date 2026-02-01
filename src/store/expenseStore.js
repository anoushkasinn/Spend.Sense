import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useExpenseStore = create(
  persist(
    (set, get) => ({
      // State
      expenses: [],
      budget: 10000, // Default budget ₹10,000
      darkMode: false,
      savingsGoals: [],
      
      // Actions
      addExpense: (expense) => set((state) => ({
        expenses: [
          ...state.expenses,
          {
            ...expense,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
            isMicroSpend: expense.amount < 100
          }
        ]
      })),
      
      updateExpense: (id, updatedExpense) => set((state) => ({
        expenses: state.expenses.map((expense) =>
          expense.id === id
            ? { ...expense, ...updatedExpense, isMicroSpend: updatedExpense.amount < 100 }
            : expense
        )
      })),
      
      deleteExpense: (id) => set((state) => ({
        expenses: state.expenses.filter((expense) => expense.id !== id)
      })),
      
      setBudget: (amount) => set({ budget: amount }),
      
      // Dark Mode
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      
      // Savings Goals
      addSavingsGoal: (goal) => set((state) => ({
        savingsGoals: [
          ...state.savingsGoals,
          {
            ...goal,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
            savedAmount: 0
          }
        ]
      })),
      
      updateSavingsGoal: (id, updates) => set((state) => ({
        savingsGoals: state.savingsGoals.map((goal) =>
          goal.id === id ? { ...goal, ...updates } : goal
        )
      })),
      
      deleteSavingsGoal: (id) => set((state) => ({
        savingsGoals: state.savingsGoals.filter((goal) => goal.id !== id)
      })),
      
      addToSavings: (goalId, amount) => set((state) => ({
        savingsGoals: state.savingsGoals.map((goal) =>
          goal.id === goalId
            ? { ...goal, savedAmount: goal.savedAmount + amount }
            : goal
        )
      })),
      
      // Computed values
      getTotalSpent: () => {
        return get().expenses.reduce((sum, expense) => sum + expense.amount, 0);
      },
      
      getExpensesByCategory: () => {
        const expenses = get().expenses;
        const breakdown = {};
        
        expenses.forEach((expense) => {
          if (!breakdown[expense.category]) {
            breakdown[expense.category] = {
              total: 0,
              count: 0,
              expenses: []
            };
          }
          breakdown[expense.category].total += expense.amount;
          breakdown[expense.category].count += 1;
          breakdown[expense.category].expenses.push(expense);
        });
        
        return breakdown;
      },
      
      getMicroSpends: () => {
        const expenses = get().expenses;
        const microSpends = expenses.filter(e => e.isMicroSpend);
        const totalMicro = microSpends.reduce((sum, e) => sum + e.amount, 0);
        
        return {
          count: microSpends.length,
          total: totalMicro,
          expenses: microSpends
        };
      },
      
      getBudgetStatus: () => {
        const spent = get().getTotalSpent();
        const budget = get().budget;
        const percentage = (spent / budget) * 100;
        
        if (percentage <= 70) return { status: 'safe', color: 'green', message: 'On track!' };
        if (percentage <= 90) return { status: 'warning', color: 'yellow', message: 'Be careful!' };
        return { status: 'risk', color: 'red', message: 'Over budget!' };
      },
      
      // Spending trends (last N days)
      getSpendingTrend: (days = 7) => {
        const expenses = get().expenses;
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        
        const trend = [];
        
        for (let i = days - 1; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          date.setHours(0, 0, 0, 0);
          
          const nextDate = new Date(date);
          nextDate.setDate(nextDate.getDate() + 1);
          
          const dayExpenses = expenses.filter(e => {
            const expenseDate = new Date(e.date);
            return expenseDate >= date && expenseDate < nextDate;
          });
          
          const total = dayExpenses.reduce((sum, e) => sum + e.amount, 0);
          
          trend.push({
            date: date.toISOString().split('T')[0],
            day: date.toLocaleDateString('en-IN', { weekday: 'short' }),
            amount: total,
            count: dayExpenses.length
          });
        }
        
        return trend;
      },
      
      // Export expenses to CSV
      exportToCSV: () => {
        const expenses = get().expenses;
        if (expenses.length === 0) return null;
        
        const headers = ['Date', 'Category', 'Amount', 'Note', 'Is Micro-Spend'];
        const rows = expenses.map(e => [
          new Date(e.date).toLocaleDateString('en-IN'),
          e.category,
          e.amount,
          e.note || '',
          e.isMicroSpend ? 'Yes' : 'No'
        ]);
        
        const csvContent = [
          headers.join(','),
          ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');
        
        return csvContent;
      }
    }),
    {
      name: 'expense-storage', // LocalStorage key
    }
  )
);
