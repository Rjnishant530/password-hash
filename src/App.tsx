import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import HomePage from './pages/HomePage';
import IntentPage from './pages/IntentPage';
import SplashScreen from './components/splash/SplashScreen';
import './App.css';

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Splash screen will automatically hide after its minDisplayTime
    // This is just to clean it up from the DOM after it's hidden
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500); // slightly longer than the minDisplayTime in SplashScreen

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {showSplash && <SplashScreen />}
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/intent" element={<IntentPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;