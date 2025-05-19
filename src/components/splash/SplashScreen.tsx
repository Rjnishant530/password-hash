import React, { useEffect, useState } from 'react';
import './SplashScreen.css';

interface SplashScreenProps {
  minDisplayTime?: number;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ minDisplayTime = 2000 }) => {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHidden(true);
    }, minDisplayTime);

    return () => clearTimeout(timer);
  }, [minDisplayTime]);

  return (
    <div className={`splash-screen ${hidden ? 'hidden' : ''}`}>
      <img src="/logo.png" alt="App Logo" className="splash-logo" />
      <div className="splash-title">Password Hash</div>
      <div className="splash-spinner"></div>
    </div>
  );
};

export default SplashScreen;