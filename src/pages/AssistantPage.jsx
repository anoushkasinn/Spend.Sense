import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useExpenseStore } from '../store/expenseStore';
import { formatCurrency, getCategoryInfo } from '../utils/formatting';

export const AssistantPage = () => {
  const expenses = useExpenseStore((state) => state.expenses);
  const budget = useExpenseStore((state) => state.budget);
  const getTotalSpent = useExpenseStore((state) => state.getTotalSpent);
  const getExpensesByCategory = useExpenseStore((state) => state.getExpensesByCategory);
  const getMicroSpends = useExpenseStore((state) => state.getMicroSpends);

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hey there! 👋 I'm your AI financial assistant. I can analyze your spending, give you budget tips, and help you save money. What would you like to know?",
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const totalSpent = getTotalSpent();
  const categoryBreakdown = getExpensesByCategory();
  const microSpends = getMicroSpends();

  const suggestedQuestions = [
    "How am I doing this month?",
    "Where is my money going?",
    "How can I save more?",
    "What are micro-spends?",
    "Give me budget tips"
  ];

  const generateResponse = (question) => {
    const q = question.toLowerCase();
    const remaining = budget - totalSpent;
    const today = new Date();
    const daysLeft = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate() - today.getDate();
    const dailyBudget = remaining > 0 ? remaining / daysLeft : 0;

    // Get top category
    const categories = Object.entries(categoryBreakdown).sort((a, b) => b[1].total - a[1].total);
    const topCategory = categories[0] || ['other', { total: 0, count: 0 }];
    const topCategoryInfo = getCategoryInfo(topCategory[0]);

    if (q.includes('doing') || q.includes('status') || q.includes('how am i')) {
      const percentUsed = ((totalSpent / budget) * 100).toFixed(1);
      if (percentUsed <= 50) {
        return `Excellent! 🎉 You're doing great! You've only spent ${formatCurrency(totalSpent)} (${percentUsed}% of your ₹${budget} budget). You have ${formatCurrency(remaining)} left for ${daysLeft} days. That's ${formatCurrency(dailyBudget)}/day - very comfortable!`;
      } else if (percentUsed <= 80) {
        return `Good progress! 👍 You've spent ${formatCurrency(totalSpent)} (${percentUsed}% of budget). You have ${formatCurrency(remaining)} left for ${daysLeft} days. Try to keep daily spending under ${formatCurrency(dailyBudget)} to stay on track.`;
      } else if (percentUsed <= 100) {
        return `⚠️ Heads up! You've used ${percentUsed}% of your budget with ${daysLeft} days left. Only ${formatCurrency(remaining)} remaining - that's ${formatCurrency(dailyBudget)}/day. Consider cutting back on non-essentials!`;
      } else {
        return `🚨 You've exceeded your budget by ${formatCurrency(totalSpent - budget)}! Try to minimize spending for the rest of the month. Consider which expenses are truly necessary.`;
      }
    }

    if (q.includes('where') || q.includes('going') || q.includes('spending') || q.includes('breakdown')) {
      let response = `📊 Here's your spending breakdown:\n\n`;
      categories.slice(0, 5).forEach(([cat, data]) => {
        const info = getCategoryInfo(cat);
        const percent = ((data.total / totalSpent) * 100).toFixed(1);
        response += `${info.icon} ${info.label}: ${formatCurrency(data.total)} (${percent}%)\n`;
      });
      response += `\nYour biggest spending is ${topCategoryInfo.icon} ${topCategoryInfo.label} at ${formatCurrency(topCategory[1].total)}!`;
      return response;
    }

    if (q.includes('save') || q.includes('saving') || q.includes('tips')) {
      const tips = [
        `🎯 Your top spending is ${topCategoryInfo.icon} ${topCategoryInfo.label}. Can you cut it by 20%? That's ${formatCurrency(topCategory[1].total * 0.2)} saved!`,
        `💡 Try the 24-hour rule: Wait a day before any non-essential purchase over ₹500.`,
        `🍳 Cook at home more! A meal out costs 3-4x a home-cooked one.`,
        `📱 Review your subscriptions. Any you forgot about?`,
        `☕ Skip the daily coffee run - that's ${formatCurrency(150 * 30)}/month!`
      ];
      return tips[Math.floor(Math.random() * tips.length)];
    }

    if (q.includes('micro') || q.includes('small')) {
      if (microSpends.count > 0) {
        const percentOfTotal = ((microSpends.total / totalSpent) * 100).toFixed(1);
        return `💸 Micro-spends are purchases under ₹100 that add up!\n\nYou have ${microSpends.count} micro-spends totaling ${formatCurrency(microSpends.total)} - that's ${percentOfTotal}% of your spending!\n\nThese small purchases feel harmless but really add up. Try tracking them consciously for a week!`;
      }
      return `Great news! 🎉 You don't have many micro-spends. Micro-spends are those sneaky purchases under ₹100 that add up over time. Keep being mindful!`;
    }

    if (q.includes('budget') || q.includes('plan')) {
      return `📋 Here's a smart budget allocation (50/30/20 rule):\n\n💰 Needs (50%): ${formatCurrency(budget * 0.5)} - rent, food, bills\n🎮 Wants (30%): ${formatCurrency(budget * 0.3)} - entertainment, shopping\n💎 Savings (20%): ${formatCurrency(budget * 0.2)} - emergency fund, goals\n\nYour current budget is ₹${budget}. Want to optimize it?`;
    }

    // Default response
    return `I understand you're asking about "${question}". Here's what I can help with:\n\n📊 "How am I doing?" - Budget status\n💰 "Where's my money going?" - Spending breakdown\n💡 "How can I save?" - Money tips\n💸 "What are micro-spends?" - Small purchase insights\n📋 "Budget tips" - Planning advice\n\nTry asking one of these!`;
  };

  const handleSend = (question = input) => {
    if (!question.trim()) return;

    setMessages(prev => [...prev, { role: 'user', content: question }]);
    setInput('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const response = generateResponse(question);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      setIsTyping(false);
    }, 1000 + Math.random() * 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white flex flex-col">
      {/* Header */}
      <nav className="flex justify-between items-center px-6 py-4 max-w-4xl mx-auto w-full">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">💰</span>
          <span className="text-xl font-bold">SpendSense</span>
        </Link>
        <Link to="/dashboard" className="text-gray-400 hover:text-white transition-colors">
          ← Back to Dashboard
        </Link>
      </nav>

      <div className="flex-1 max-w-4xl mx-auto px-6 py-8 w-full flex flex-col">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-r from-purple-400 to-violet-600 flex items-center justify-center text-4xl mb-6">
            💬
          </div>
          <h1 className="text-4xl font-bold mb-4">AI Financial Assistant</h1>
          <p className="text-gray-400 text-lg">
            Your personal money coach, powered by your spending data
          </p>
        </motion.div>

        {/* Chat Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex-1 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl flex flex-col overflow-hidden"
        >
          {/* Messages */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-2xl whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-purple-500 to-violet-600 rounded-br-sm'
                      : 'bg-white/10 rounded-bl-sm'
                  }`}
                >
                  {msg.content}
                </div>
              </motion.div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white/10 p-4 rounded-2xl rounded-bl-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Suggested Questions */}
          <div className="px-6 py-3 border-t border-white/10 overflow-x-auto">
            <div className="flex gap-2">
              {suggestedQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(q)}
                  className="flex-shrink-0 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-white/10">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask me anything about your finances..."
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:border-purple-400"
              />
              <button
                onClick={() => handleSend()}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-violet-600 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all"
              >
                Send
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="p-4 bg-white/5 rounded-xl text-center">
            <div className="text-2xl font-bold text-purple-400">{formatCurrency(totalSpent)}</div>
            <div className="text-sm text-gray-400">Total Spent</div>
          </div>
          <div className="p-4 bg-white/5 rounded-xl text-center">
            <div className="text-2xl font-bold text-green-400">{formatCurrency(budget - totalSpent)}</div>
            <div className="text-sm text-gray-400">Remaining</div>
          </div>
          <div className="p-4 bg-white/5 rounded-xl text-center">
            <div className="text-2xl font-bold text-cyan-400">{expenses.length}</div>
            <div className="text-sm text-gray-400">Transactions</div>
          </div>
        </div>
      </div>
    </div>
  );
};
