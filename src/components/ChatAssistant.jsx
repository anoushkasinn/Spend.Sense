import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useExpenseStore } from '../store/expenseStore';
import { formatCurrency } from '../utils/formatting';

const SUGGESTED_QUESTIONS = [
  "Why am I always out of money?",
  "How can I save ₹2,000 this month?",
  "Is my food spending too high?",
  "What are my biggest expenses?",
  "Give me tips to reduce spending",
  "Help me create a budget plan",
];

export const ChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm your SpendSense assistant 🤖 I can help you understand your spending and give personalized advice. What would you like to know?",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Get spending data from store
  const expenses = useExpenseStore((state) => state.expenses);
  const budget = useExpenseStore((state) => state.budget);
  const getTotalSpent = useExpenseStore((state) => state.getTotalSpent);
  const getExpensesByCategory = useExpenseStore((state) => state.getExpensesByCategory);
  const getMicroSpends = useExpenseStore((state) => state.getMicroSpends);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getSpendingContext = () => {
    const totalSpent = getTotalSpent();
    const categoryBreakdown = getExpensesByCategory();
    const microSpends = getMicroSpends();
    
    // Get top category
    const categories = Object.entries(categoryBreakdown)
      .map(([name, data]) => ({ name, total: data.total, count: data.count }))
      .sort((a, b) => b.total - a.total);
    
    const topCategory = categories[0] || { name: 'None', total: 0 };
    
    // Calculate days left in month
    const today = new Date();
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const daysLeft = lastDay.getDate() - today.getDate();
    
    return {
      budget,
      spent: totalSpent,
      remaining: budget - totalSpent,
      topCategory,
      categories,
      microSpends: {
        total: microSpends.total,
        count: microSpends.count,
      },
      daysLeft,
      totalExpenses: expenses.length,
    };
  };

  const generateLocalResponse = (userMessage) => {
    const context = getSpendingContext();
    const msgLower = userMessage.toLowerCase();
    
    // Pattern matching for common questions
    if (msgLower.includes('out of money') || msgLower.includes('where did my money go')) {
      if (context.microSpends.count > 0) {
        return `Based on your spending data, you've made ${context.microSpends.count} small purchases under ₹100, totaling ${formatCurrency(context.microSpends.total)}. These "micro-spends" often go unnoticed but add up quickly! Your biggest expense category is ${context.topCategory.name} at ${formatCurrency(context.topCategory.total)}. Try setting a daily limit for small purchases.`;
      }
      return `Your biggest expense category is ${context.topCategory.name} at ${formatCurrency(context.topCategory.total)}. I'd suggest tracking each purchase for a week to identify hidden spending patterns.`;
    }
    
    if (msgLower.includes('save') || msgLower.includes('saving')) {
      const savingTips = [];
      if (context.microSpends.total > 500) {
        savingTips.push(`Cutting micro-spends by 50% could save ${formatCurrency(context.microSpends.total * 0.5)}`);
      }
      if (context.topCategory.total > context.budget * 0.3) {
        savingTips.push(`${context.topCategory.name} takes ${((context.topCategory.total / context.budget) * 100).toFixed(0)}% of your budget - try reducing it by 20%`);
      }
      savingTips.push(`You have ${context.daysLeft} days left this month. Budget ${formatCurrency(context.remaining / context.daysLeft)}/day to stay on track.`);
      
      return `Here's how you can save more:\n\n${savingTips.map((tip, i) => `${i + 1}. ${tip}`).join('\n\n')}`;
    }
    
    if (msgLower.includes('food') || msgLower.includes('eating')) {
      const foodData = context.categories.find(c => c.name === 'food');
      if (foodData) {
        const percentage = ((foodData.total / context.spent) * 100).toFixed(0);
        const isHigh = percentage > 35;
        return `You've spent ${formatCurrency(foodData.total)} on food (${percentage}% of total). ${isHigh ? "That's on the higher side! Consider meal prepping or cooking at home more often to save ₹1,500-2,000/month." : "That's reasonable! Keep tracking to maintain control."}`;
      }
      return "I don't see any food expenses yet. Add some expenses to get personalized insights!";
    }
    
    if (msgLower.includes('biggest') || msgLower.includes('top') || msgLower.includes('most')) {
      if (context.categories.length === 0) {
        return "You haven't added any expenses yet. Start tracking to see where your money goes!";
      }
      const top3 = context.categories.slice(0, 3);
      return `Your top spending categories:\n\n${top3.map((c, i) => `${i + 1}. ${c.name}: ${formatCurrency(c.total)} (${c.count} transactions)`).join('\n')}\n\nFocus on reducing your highest category to make the biggest impact!`;
    }
    
    if (msgLower.includes('budget') || msgLower.includes('plan')) {
      const suggestedBudget = {
        food: Math.round(context.budget * 0.3),
        transport: Math.round(context.budget * 0.15),
        entertainment: Math.round(context.budget * 0.1),
        shopping: Math.round(context.budget * 0.15),
        other: Math.round(context.budget * 0.3),
      };
      
      return `Here's a suggested budget plan based on ₹${context.budget}:\n\n🍕 Food: ${formatCurrency(suggestedBudget.food)} (30%)\n🚌 Transport: ${formatCurrency(suggestedBudget.transport)} (15%)\n🎮 Entertainment: ${formatCurrency(suggestedBudget.entertainment)} (10%)\n🛍️ Shopping: ${formatCurrency(suggestedBudget.shopping)} (15%)\n📦 Other/Savings: ${formatCurrency(suggestedBudget.other)} (30%)\n\nAdjust these based on your priorities!`;
    }
    
    if (msgLower.includes('tip') || msgLower.includes('advice') || msgLower.includes('reduce')) {
      const tips = [
        "Wait 24 hours before making purchases over ₹500",
        "Use the 50/30/20 rule: 50% needs, 30% wants, 20% savings",
        "Track every expense, no matter how small",
        "Set a daily spending limit and stick to it",
        "Review your subscriptions - cancel unused ones",
        "Cook at home more often - it's healthier too!",
        "Use public transport or walk for short distances",
      ];
      const randomTips = tips.sort(() => Math.random() - 0.5).slice(0, 3);
      return `Here are some money-saving tips:\n\n${randomTips.map((tip, i) => `💡 ${tip}`).join('\n\n')}\n\nRemember: Small changes add up to big savings!`;
    }
    
    // Default response with summary
    return `Here's your spending summary:\n\n💰 Budget: ${formatCurrency(context.budget)}\n💸 Spent: ${formatCurrency(context.spent)} (${((context.spent / context.budget) * 100).toFixed(0)}%)\n✨ Remaining: ${formatCurrency(context.remaining)}\n📅 Days left: ${context.daysLeft}\n\nTop category: ${context.topCategory.name} (${formatCurrency(context.topCategory.total)})\n\nWhat specific aspect would you like help with?`;
  };

  const handleSend = async (message = input) => {
    if (!message.trim()) return;
    
    const userMessage = message.trim();
    setInput('');
    
    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);
    
    // Simulate thinking delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Generate response locally (no API key needed for hackathon demo)
    const response = generateLocalResponse(userMessage);
    
    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    setIsLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 bg-purple-500 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-2xl hover:bg-purple-600 transition-colors z-50"
        title="Chat with AI"
      >
        💬
      </button>

      {/* Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] bg-white rounded-xl shadow-2xl z-50 overflow-hidden"
            style={{ maxHeight: 'calc(100vh - 200px)' }}
          >
            {/* Header */}
            <div className="bg-purple-500 text-white p-4 flex justify-between items-center">
              <div>
                <h3 className="font-bold">SpendSense AI 🤖</h3>
                <p className="text-xs text-purple-200">Your financial assistant</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-purple-200 text-xl"
              >
                ×
              </button>
            </div>

            {/* Messages */}
            <div className="h-80 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg text-sm whitespace-pre-line ${
                      msg.role === 'user'
                        ? 'bg-purple-500 text-white rounded-br-none'
                        : 'bg-white text-gray-800 shadow-sm border rounded-bl-none'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white text-gray-800 shadow-sm border p-3 rounded-lg rounded-bl-none">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Questions */}
            {messages.length <= 2 && (
              <div className="px-4 py-2 border-t bg-white">
                <p className="text-xs text-gray-500 mb-2">Try asking:</p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_QUESTIONS.slice(0, 3).map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleSend(question)}
                      className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded-full hover:bg-purple-100 transition-colors"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-3 border-t bg-white">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about your spending..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  disabled={isLoading}
                />
                <button
                  onClick={() => handleSend()}
                  disabled={isLoading || !input.trim()}
                  className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Send
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
