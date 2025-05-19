import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import IntentPage from './pages/IntentPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/intent" element={<IntentPage />} />
      </Routes>
    </Router>
  );
}

export default App;