import { useExpenseStore } from '../store/expenseStore';
import { formatCurrency, getCategoryInfo } from '../utils/formatting';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export const SpendingInsights = () => {
  const expenses = useExpenseStore((state) => state.expenses);
  const getExpensesByCategory = useExpenseStore((state) => state.getExpensesByCategory);
  const getTotalSpent = useExpenseStore((state) => state.getTotalSpent);
  const getMicroSpends = useExpenseStore((state) => state.getMicroSpends);
  const darkMode = useExpenseStore((state) => state.darkMode);
  
  const categoryBreakdown = getExpensesByCategory();
  const totalSpent = getTotalSpent();
  const microSpends = getMicroSpends();

  // Handle empty state
  if (expenses.length === 0 || totalSpent === 0) {
    return (
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-md p-6 mb-6`}>
        <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-4`}>Spending Insights</h2>
        <div className="text-center py-8">
          <div className="text-5xl mb-4">📊</div>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Add some expenses to see insights</p>
        </div>
      </div>
    );
  }

  // Prepare data for pie chart
  const chartData = Object.entries(categoryBreakdown)
    .map(([category, data]) => {
      const categoryInfo = getCategoryInfo(category);
      const percentage = totalSpent > 0 ? ((data.total / totalSpent) * 100).toFixed(1) : 0;
      return {
        name: categoryInfo.label,
        value: data.total,
        color: categoryInfo.color,
        icon: categoryInfo.icon,
        percentage,
        count: data.count
      };
    })
    .sort((a, b) => b.value - a.value);

  // Get top 3 categories
  const topCategories = chartData.slice(0, 3);

  // Calculate total transactions
  const totalTransactions = expenses.length;
  
  // Calculate average expense (with safeguard)
  const avgExpense = totalTransactions > 0 ? totalSpent / totalTransactions : 0;

  // Custom label for pie chart
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percentage }) => {
    if (percentage < 5) return null;
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        className="text-xs font-medium"
      >
        {`${percentage}%`}
      </text>
    );
  };

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-md p-6 mb-6`}>
      <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-4`}>Spending Insights</h2>

      {/* Pie Chart */}
      <div className="mb-6">
        <h3 className={`text-md font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-3`}>Category Breakdown</h3>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="w-full sm:w-1/2">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomLabel}
                  outerRadius={80}
                  innerRadius={40}
                  fill="#8884d8"
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={800}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => formatCurrency(value)}
                  contentStyle={{ 
                    borderRadius: '8px', 
                    border: 'none', 
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    backgroundColor: darkMode ? '#374151' : '#fff',
                    color: darkMode ? '#fff' : '#000'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          {/* Legend */}
          <div className="w-full sm:w-1/2 space-y-2">
            {chartData.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{cat.icon} {cat.name}</span>
                </div>
                <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{cat.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Categories */}
      <div className="mb-6">
        <h3 className={`text-md font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-3`}>Top Spending Categories</h3>
        <div className="space-y-3">
          {topCategories.map((cat) => (
            <div key={cat.name} className={`flex items-center justify-between p-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                  style={{ backgroundColor: `${cat.color}20` }}
                >
                  {cat.icon}
                </div>
                <div>
                  <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{cat.name}</div>
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{cat.count} transaction{cat.count !== 1 ? 's' : ''}</div>
                </div>
              </div>
              <div className="text-right">
                <div className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{formatCurrency(cat.value)}</div>
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{cat.percentage}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Micro Spends Alert */}
      {microSpends.count > 0 && (
        <div className={`p-4 rounded-lg mb-6 border ${darkMode ? 'bg-yellow-900/30 border-yellow-700' : 'bg-yellow-50 border-yellow-200'}`}>
          <div className="flex items-start gap-3">
            <div className="text-2xl">💸</div>
            <div className="flex-1">
              <h4 className={`font-semibold ${darkMode ? 'text-yellow-400' : 'text-yellow-800'} mb-1`}>Micro-Spends Detected!</h4>
              <p className={`text-sm ${darkMode ? 'text-yellow-300' : 'text-yellow-700'}`}>
                You made <strong>{microSpends.count}</strong> purchases under ₹100, totaling{' '}
                <strong>{formatCurrency(microSpends.total)}</strong>
              </p>
              <p className={`text-sm ${darkMode ? 'text-yellow-400' : 'text-yellow-600'} mt-1`}>
                That's <strong>{((microSpends.total / totalSpent) * 100).toFixed(1)}%</strong> of your total spending!
              </p>
              <p className={`text-xs ${darkMode ? 'text-yellow-400' : 'text-yellow-600'} mt-2 italic`}>
                💡 Tip: Small daily purchases add up. Try to be mindful of impulse buys!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-primary-900/30' : 'bg-gradient-to-br from-primary-50 to-primary-100'}`}>
          <div className={`text-sm ${darkMode ? 'text-primary-400' : 'text-primary-700'} mb-1`}>Average Expense</div>
          <div className={`text-2xl font-bold ${darkMode ? 'text-primary-300' : 'text-primary-800'}`}>
            {formatCurrency(avgExpense)}
          </div>
        </div>
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-green-900/30' : 'bg-gradient-to-br from-green-50 to-green-100'}`}>
          <div className={`text-sm ${darkMode ? 'text-green-400' : 'text-green-700'} mb-1`}>Total Transactions</div>
          <div className={`text-2xl font-bold ${darkMode ? 'text-green-300' : 'text-green-800'}`}>
            {totalTransactions}
          </div>
        </div>
      </div>

      {/* Spending Tip */}
      {totalSpent > 0 && (
        <div className={`mt-6 p-4 rounded-lg border ${darkMode ? 'bg-blue-900/30 border-blue-700' : 'bg-blue-50 border-blue-200'}`}>
          <div className="flex items-start gap-3">
            <span className="text-xl">💡</span>
            <div>
              <p className={`text-sm ${darkMode ? 'text-blue-300' : 'text-blue-800'}`}>
                <strong>Pro Tip:</strong> Your biggest spending category is{' '}
                <strong>{topCategories[0]?.name}</strong> at{' '}
                <strong>{topCategories[0]?.percentage}%</strong> of total.
                {parseFloat(topCategories[0]?.percentage) > 40 && (
                  <span> Consider if you can reduce spending here!</span>
                )}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
