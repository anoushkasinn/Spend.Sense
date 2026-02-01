export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
    });
  }
};

export const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const CATEGORIES = [
  { value: 'food', label: 'Food & Dining', icon: '🍕', color: '#f97316' },
  { value: 'transport', label: 'Transport', icon: '🚌', color: '#3b82f6' },
  { value: 'entertainment', label: 'Entertainment', icon: '🎮', color: '#a855f7' },
  { value: 'shopping', label: 'Shopping', icon: '🛍️', color: '#ec4899' },
  { value: 'education', label: 'Education', icon: '📚', color: '#10b981' },
  { value: 'health', label: 'Health', icon: '💊', color: '#ef4444' },
  { value: 'bills', label: 'Bills & Utilities', icon: '💡', color: '#f59e0b' },
  { value: 'other', label: 'Other', icon: '💰', color: '#6b7280' }
];

export const getCategoryInfo = (categoryValue) => {
  return CATEGORIES.find(cat => cat.value === categoryValue) || CATEGORIES[CATEGORIES.length - 1];
};
