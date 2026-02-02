<div align="center">

# 💸 Spend.Sense

### Smart Money Management for Students

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Visit_Site-4CAF50?style=for-the-badge)](https://student-money-manager-ten.vercel.app)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)

<img src="https://img.shields.io/badge/Made%20with-❤️-red?style=for-the-badge" />

*Track expenses, scan bills with AI, and get smart financial insights — all in one beautiful app.*

[Live Demo](https://student-money-manager-ten.vercel.app) • [Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started)

</div>

---

## 🌟 Features

### 📊 **Smart Dashboard**
- Real-time expense tracking with visual analytics
- Category-wise spending breakdown
- Monthly budget progress with alerts
- Interactive charts powered by Recharts

### 🧾 **AI Bill Scanner**
- Scan receipts using your camera or upload images
- Automatic text extraction with Tesseract.js OCR
- Smart parsing of store names, dates, and amounts
- One-click expense addition from scanned bills

### 🤖 **AI Financial Assistant**
- Chat-based financial advisor
- Personalized spending insights
- Budget recommendations based on your habits
- Tips for saving money as a student

### 📈 **Spending Insights**
- Beautiful trend visualizations
- Category comparisons
- Weekly/Monthly spending patterns
- Smart predictions and alerts

### 💰 **Savings Goals**
- Set and track savings targets
- Visual progress indicators
- Celebrate milestones 🎉

### ⚙️ **Additional Features**
- 🌙 **Dark Mode** - Easy on the eyes
- 📱 **Fully Responsive** - Works on all devices
- 💾 **Local Storage** - Your data stays private
- 📤 **CSV Export** - Download your expense data
- ⚡ **Fast & Lightweight** - Built with Vite

---

## 🎯 Tech Stack

| Category | Technology |
|----------|------------|
| **Frontend** | React 18, React Router v7 |
| **Styling** | Tailwind CSS, Framer Motion |
| **State Management** | Zustand |
| **Charts** | Recharts |
| **OCR** | Tesseract.js |
| **Build Tool** | Vite |
| **Deployment** | Vercel |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/anoushkasinn/Spend.Sense.git

# Navigate to project directory
cd Spend.Sense

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to see the app running!

### Build for Production

```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── AddExpense.jsx
│   ├── BillScanner.jsx
│   ├── BudgetTracker.jsx
│   ├── ChatAssistant.jsx
│   ├── ExpenseList.jsx
│   ├── SavingsGoals.jsx
│   ├── Settings.jsx
│   ├── SpendingInsights.jsx
│   └── SpendingTrend.jsx
├── pages/               # Page components
│   ├── LandingPage.jsx
│   ├── Dashboard.jsx
│   ├── ScannerPage.jsx
│   ├── AssistantPage.jsx
│   └── InsightsPage.jsx
├── store/               # Zustand state management
│   └── expenseStore.js
├── utils/               # Helper functions
│   └── formatting.js
├── App.jsx              # Main app with routing
├── main.jsx             # Entry point
└── index.css            # Global styles + Tailwind
```

---

## 🎨 Screenshots

| Landing Page | Dashboard |
|:------------:|:---------:|
| Beautiful animated landing | Full expense management |

| Bill Scanner | AI Assistant |
|:------------:|:------------:|
| OCR-powered scanning | Smart financial advice |

---

## 🛠️ Key Implementation Details

### State Management with Zustand
- Persistent storage using localStorage
- Clean, minimal boilerplate
- Easy expense CRUD operations

### AI Bill Scanning
- Tesseract.js for offline OCR processing
- Smart regex patterns for data extraction
- Works with various receipt formats

### Responsive Design
- Mobile-first approach
- Tailwind CSS utility classes
- Smooth animations with Framer Motion

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - UI Library
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Tesseract.js](https://tesseract.projectnaptha.com/) - OCR Engine
- [Recharts](https://recharts.org/) - Charts
- [Zustand](https://zustand-demo.pmnd.rs/) - State Management
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [Vercel](https://vercel.com/) - Deployment

---

<div align="center">

### 💡 Built for students, by a student

**Made with ❤️ for AIBoomi Startup Weekend, Pune**

⭐ Star this repo if you found it helpful!

</div>
