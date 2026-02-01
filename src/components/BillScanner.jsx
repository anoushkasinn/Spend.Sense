import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useExpenseStore } from '../store/expenseStore';
import { CATEGORIES } from '../utils/formatting';
import Tesseract from 'tesseract.js';

export const BillScanner = () => {
  const addExpense = useExpenseStore((state) => state.addExpense);
  const [isOpen, setIsOpen] = useState(false);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [extractedData, setExtractedData] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    amount: '',
    category: 'other',
    note: '',
    date: new Date().toISOString().split('T')[0]
  });

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setError(null);
      setExtractedData(null);
    }
  };

  const extractAmountFromText = (text) => {
    // Match various currency formats
    const patterns = [
      /(?:Total|Grand Total|Amount|Net|Payable|Bill)[:\s]*(?:Rs\.?|₹|INR)?\s*(\d+(?:,\d{3})*(?:\.\d{2})?)/gi,
      /(?:Rs\.?|₹|INR)\s*(\d+(?:,\d{3})*(?:\.\d{2})?)/gi,
      /(\d+(?:,\d{3})*(?:\.\d{2})?)\s*(?:Rs\.?|₹|INR)/gi,
      /(?:Total|Amount|Payable)[:\s]*(\d+(?:,\d{3})*(?:\.\d{2})?)/gi,
    ];

    const amounts = [];
    
    for (const pattern of patterns) {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const amount = parseFloat(match[1].replace(/,/g, ''));
        if (amount > 0 && amount < 100000) {
          amounts.push(amount);
        }
      }
    }

    // Return the largest reasonable amount (likely the total)
    return amounts.length > 0 ? Math.max(...amounts) : null;
  };

  const extractDateFromText = (text) => {
    const datePatterns = [
      /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/g,
      /(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+(\d{2,4})/gi,
    ];

    for (const pattern of datePatterns) {
      const match = pattern.exec(text);
      if (match) {
        return match[0];
      }
    }
    return null;
  };

  const guessCategoryFromText = (text) => {
    const textLower = text.toLowerCase();
    
    const categoryKeywords = {
      food: ['restaurant', 'cafe', 'coffee', 'pizza', 'burger', 'food', 'meal', 'lunch', 'dinner', 'breakfast', 'biryani', 'dosa', 'thali', 'zomato', 'swiggy'],
      transport: ['uber', 'ola', 'cab', 'taxi', 'metro', 'bus', 'train', 'petrol', 'diesel', 'fuel', 'parking'],
      shopping: ['amazon', 'flipkart', 'myntra', 'store', 'mall', 'shop', 'mart', 'retail', 'clothes'],
      entertainment: ['movie', 'cinema', 'pvr', 'inox', 'netflix', 'spotify', 'game', 'ticket'],
      health: ['pharmacy', 'medical', 'hospital', 'doctor', 'medicine', 'apollo', 'chemist'],
      education: ['book', 'course', 'udemy', 'exam', 'tuition', 'school', 'college'],
      bills: ['electricity', 'water', 'internet', 'mobile', 'recharge', 'jio', 'airtel', 'vodafone'],
    };

    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some(keyword => textLower.includes(keyword))) {
        return category;
      }
    }
    
    return 'other';
  };

  const processBill = async () => {
    if (!image) return;

    setIsProcessing(true);
    setProgress(0);
    setError(null);

    try {
      const result = await Tesseract.recognize(image, 'eng', {
        logger: (info) => {
          if (info.status === 'recognizing text') {
            setProgress(Math.round(info.progress * 100));
          }
        },
      });

      const text = result.data.text;
      console.log('OCR Result:', text);

      const amount = extractAmountFromText(text);
      const date = extractDateFromText(text);
      const category = guessCategoryFromText(text);
      
      // Get first line as potential merchant name
      const lines = text.split('\n').filter(l => l.trim().length > 2);
      const merchant = lines[0]?.trim().slice(0, 50) || '';

      setExtractedData({
        amount,
        date,
        category,
        merchant,
        rawText: text,
      });

      setFormData({
        amount: amount ? amount.toString() : '',
        category,
        note: merchant,
        date: date || new Date().toISOString().split('T')[0],
      });

    } catch (err) {
      console.error('OCR Error:', err);
      setError('Failed to read the bill. Please try again or enter manually.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = () => {
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    addExpense({
      amount: parseFloat(formData.amount),
      category: formData.category,
      note: formData.note || 'Scanned bill',
      date: new Date(formData.date).toISOString(),
    });

    // Reset everything
    setIsOpen(false);
    setImage(null);
    setImagePreview(null);
    setExtractedData(null);
    setFormData({
      amount: '',
      category: 'other',
      note: '',
      date: new Date().toISOString().split('T')[0],
    });
  };

  const handleClose = () => {
    setIsOpen(false);
    setImage(null);
    setImagePreview(null);
    setExtractedData(null);
    setError(null);
    setProgress(0);
  };

  return (
    <>
      {/* Scan Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 bg-green-500 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-2xl hover:bg-green-600 transition-colors z-50"
        title="Scan Bill"
      >
        📷
      </button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 my-4"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">📷 Scan Bill</h2>
                <button
                  onClick={handleClose}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              {/* Upload Section */}
              {!imagePreview && (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-green-500 transition-colors"
                >
                  <div className="text-4xl mb-2">📄</div>
                  <p className="text-gray-600 font-medium">Click to upload bill image</p>
                  <p className="text-sm text-gray-400 mt-1">Supports JPG, PNG</p>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              {/* Image Preview */}
              {imagePreview && !extractedData && !isProcessing && (
                <div className="space-y-4">
                  <img
                    src={imagePreview}
                    alt="Bill preview"
                    className="w-full h-48 object-contain bg-gray-100 rounded-lg"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setImage(null);
                        setImagePreview(null);
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Choose Another
                    </button>
                    <button
                      onClick={processBill}
                      className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                      Scan Bill
                    </button>
                  </div>
                </div>
              )}

              {/* Processing */}
              {isProcessing && (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4 animate-pulse">🔍</div>
                  <p className="text-gray-700 font-medium">Reading bill...</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-2">{progress}%</p>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              {/* Extracted Data / Edit Form */}
              {extractedData && !isProcessing && (
                <div className="space-y-4">
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-700">
                      ✅ Bill scanned! Review and adjust the details below.
                    </p>
                  </div>

                  {/* Amount */}
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Amount (₹)</label>
                    <input
                      type="number"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Enter amount"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.icon} {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Note */}
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Note</label>
                    <input
                      type="text"
                      value={formData.note}
                      onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Merchant name or note"
                    />
                  </div>

                  {/* Date */}
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Date</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={handleClose}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmit}
                      className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                      Add Expense
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
