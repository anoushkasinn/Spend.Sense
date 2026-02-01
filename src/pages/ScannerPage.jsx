import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import Tesseract from 'tesseract.js';
import { useExpenseStore } from '../store/expenseStore';
import { CATEGORIES } from '../utils/formatting';

export const ScannerPage = () => {
  const navigate = useNavigate();
  const addExpense = useExpenseStore((state) => state.addExpense);
  const fileInputRef = useRef(null);
  
  const [image, setImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [extractedData, setExtractedData] = useState(null);
  const [formData, setFormData] = useState({
    amount: '',
    category: 'other',
    note: '',
    date: new Date().toISOString().split('T')[0]
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        processImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = async (imageData) => {
    setIsProcessing(true);
    setProgress(0);

    try {
      const result = await Tesseract.recognize(imageData, 'eng', {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round(m.progress * 100));
          }
        }
      });

      const text = result.data.text;
      const extracted = extractDataFromText(text);
      setExtractedData(extracted);
      
      setFormData({
        amount: extracted.amount || '',
        category: extracted.category || 'other',
        note: extracted.merchant || '',
        date: extracted.date || new Date().toISOString().split('T')[0]
      });
    } catch (error) {
      console.error('OCR Error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const extractDataFromText = (text) => {
    const lines = text.toLowerCase();
    
    // Amount patterns
    const amountPatterns = [
      /(?:total|amount|grand total|net amount|payable)[:\s]*(?:rs\.?|₹|inr)?\s*(\d+(?:,\d{3})*(?:\.\d{2})?)/i,
      /(?:rs\.?|₹|inr)\s*(\d+(?:,\d{3})*(?:\.\d{2})?)/i,
      /(\d+(?:,\d{3})*(?:\.\d{2})?)\s*(?:rs\.?|₹|inr)/i,
    ];
    
    let amount = null;
    for (const pattern of amountPatterns) {
      const match = text.match(pattern);
      if (match) {
        amount = match[1].replace(/,/g, '');
        break;
      }
    }

    // Date patterns
    const datePatterns = [
      /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/,
      /(\d{1,2})\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+(\d{2,4})/i
    ];
    
    let date = null;
    for (const pattern of datePatterns) {
      const match = text.match(pattern);
      if (match) {
        try {
          const parsed = new Date(match[0]);
          if (!isNaN(parsed)) {
            date = parsed.toISOString().split('T')[0];
          }
        } catch (e) {}
        break;
      }
    }

    // Category detection
    const categoryKeywords = {
      food: ['restaurant', 'cafe', 'food', 'pizza', 'burger', 'zomato', 'swiggy', 'dominos', 'mcdonalds', 'kfc', 'biryani', 'coffee'],
      transport: ['uber', 'ola', 'rapido', 'metro', 'bus', 'petrol', 'diesel', 'fuel', 'parking'],
      shopping: ['amazon', 'flipkart', 'myntra', 'mall', 'store', 'mart', 'retail', 'fashion'],
      entertainment: ['movie', 'cinema', 'pvr', 'inox', 'netflix', 'spotify', 'game', 'concert'],
      education: ['book', 'course', 'tuition', 'school', 'college', 'university', 'udemy', 'coursera'],
      health: ['pharmacy', 'medical', 'hospital', 'doctor', 'medicine', 'apollo', 'clinic'],
      bills: ['electricity', 'water', 'internet', 'mobile', 'recharge', 'airtel', 'jio', 'wifi']
    };

    let category = 'other';
    for (const [cat, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some(keyword => lines.includes(keyword))) {
        category = cat;
        break;
      }
    }

    // Merchant extraction
    const firstLine = text.split('\n')[0].trim();
    const merchant = firstLine.length > 3 && firstLine.length < 50 ? firstLine : '';

    return { amount, date, category, merchant, rawText: text };
  };

  const handleSave = () => {
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

    navigate('/dashboard');
  };

  const resetScanner = () => {
    setImage(null);
    setExtractedData(null);
    setFormData({
      amount: '',
      category: 'other',
      note: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-gray-900 text-white">
      {/* Header */}
      <nav className="flex justify-between items-center px-6 py-4 max-w-4xl mx-auto">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">💰</span>
          <span className="text-xl font-bold">SpendSense</span>
        </Link>
        <Link to="/dashboard" className="text-gray-400 hover:text-white transition-colors">
          ← Back to Dashboard
        </Link>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-r from-green-400 to-emerald-600 flex items-center justify-center text-4xl mb-6">
            📷
          </div>
          <h1 className="text-4xl font-bold mb-4">AI Bill Scanner</h1>
          <p className="text-gray-400 text-lg">
            Upload a receipt and let AI extract the details automatically
          </p>
        </motion.div>

        {/* Scanner Interface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8"
        >
          {!image ? (
            /* Upload Area */
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-white/30 rounded-xl p-12 text-center cursor-pointer hover:border-green-400 hover:bg-white/5 transition-all"
            >
              <div className="text-6xl mb-4">📤</div>
              <h3 className="text-xl font-semibold mb-2">Upload Receipt</h3>
              <p className="text-gray-400">Click or drag & drop your bill image</p>
              <p className="text-sm text-gray-500 mt-2">Supports JPG, PNG, WEBP</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          ) : (
            /* Processing / Results */
            <div className="space-y-6">
              {/* Image Preview */}
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/2">
                  <h3 className="text-lg font-semibold mb-3">Uploaded Image</h3>
                  <img
                    src={image}
                    alt="Receipt"
                    className="w-full rounded-lg border border-white/20"
                  />
                  <button
                    onClick={resetScanner}
                    className="mt-3 text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    ↻ Upload Different Image
                  </button>
                </div>

                <div className="md:w-1/2">
                  {isProcessing ? (
                    /* Processing State */
                    <div className="text-center py-12">
                      <div className="animate-spin text-5xl mb-4">⚙️</div>
                      <h3 className="text-xl font-semibold mb-2">Processing...</h3>
                      <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-green-400 to-emerald-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                        />
                      </div>
                      <p className="text-gray-400 mt-2">{progress}% complete</p>
                    </div>
                  ) : extractedData ? (
                    /* Extracted Data Form */
                    <div>
                      <h3 className="text-lg font-semibold mb-4">✅ Extracted Data</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm text-gray-400 mb-1">Amount (₹)</label>
                          <input
                            type="number"
                            value={formData.amount}
                            onChange={(e) => setFormData({...formData, amount: e.target.value})}
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-green-400"
                            placeholder="0"
                          />
                        </div>

                        <div>
                          <label className="block text-sm text-gray-400 mb-1">Category</label>
                          <select
                            value={formData.category}
                            onChange={(e) => setFormData({...formData, category: e.target.value})}
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-green-400"
                          >
                            {CATEGORIES.map(cat => (
                              <option key={cat.value} value={cat.value} className="bg-gray-800">
                                {cat.icon} {cat.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm text-gray-400 mb-1">Note / Merchant</label>
                          <input
                            type="text"
                            value={formData.note}
                            onChange={(e) => setFormData({...formData, note: e.target.value})}
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-green-400"
                            placeholder="Store name or note"
                          />
                        </div>

                        <div>
                          <label className="block text-sm text-gray-400 mb-1">Date</label>
                          <input
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({...formData, date: e.target.value})}
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-green-400"
                          />
                        </div>

                        <button
                          onClick={handleSave}
                          className="w-full py-4 bg-gradient-to-r from-green-400 to-emerald-600 rounded-lg font-semibold text-lg hover:shadow-lg hover:shadow-green-500/30 transition-all"
                        >
                          ✅ Save Expense
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* How it works */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-12 grid md:grid-cols-3 gap-6"
        >
          {[
            { icon: '📤', title: 'Upload', desc: 'Take a photo or upload receipt' },
            { icon: '🤖', title: 'AI Extract', desc: 'OCR extracts amount, date, merchant' },
            { icon: '✅', title: 'Save', desc: 'Review and save to your expenses' }
          ].map((step, i) => (
            <div key={i} className="text-center p-6 bg-white/5 rounded-xl">
              <div className="text-4xl mb-3">{step.icon}</div>
              <h4 className="font-semibold mb-1">{step.title}</h4>
              <p className="text-sm text-gray-400">{step.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};
