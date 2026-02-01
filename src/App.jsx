import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { ScannerPage } from './pages/ScannerPage';
import { AssistantPage } from './pages/AssistantPage';
import { InsightsPage } from './pages/InsightsPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/scanner" element={<ScannerPage />} />
        <Route path="/assistant" element={<AssistantPage />} />
        <Route path="/insights" element={<InsightsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
