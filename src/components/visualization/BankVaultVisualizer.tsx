import React, { useState, useRef, useEffect } from 'react';
import './BankVaultVisualizer.css';
import Button from '../ui/Button';

interface BankVaultVisualizerProps {
  onApplySalt: (salt: string) => void;
}

const BankVaultVisualizer: React.FC<BankVaultVisualizerProps> = ({ onApplySalt }) => {
  const [combination, setCombination] = useState<number[]>([]);
  const [currentNumber, setCurrentNumber] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastAngleRef = useRef(0);
  
  const handleReset = () => {
    setCombination([]);
    setCurrentNumber(0);
    drawDial(0);
  };

  const handleApply = () => {
    if (combination.length > 0) {
      onApplySalt(combination.join('-'));
    }
  };

  const drawDial = (angle: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 20;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw outer circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = '#6c757d';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Draw dial numbers
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#212529';
    
    for (let i = 0; i < 36; i++) {
      const numberAngle = (i * 10) * Math.PI / 180;
      const numberX = centerX + (radius - 15) * Math.sin(numberAngle);
      const numberY = centerY - (radius - 15) * Math.cos(numberAngle);
      
      if (i % 3 === 0) {
        ctx.fillText(i.toString(), numberX, numberY);
      }
    }
    
    // Draw dial indicator
    const indicatorAngle = angle * Math.PI / 180;
    const indicatorLength = radius - 40;
    
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(
      centerX + indicatorLength * Math.sin(indicatorAngle),
      centerY - indicatorLength * Math.cos(indicatorAngle)
    );
    ctx.strokeStyle = '#4a6cf7';
    ctx.lineWidth = 4;
    ctx.stroke();
    
    // Draw center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 10, 0, Math.PI * 2);
    ctx.fillStyle = '#4a6cf7';
    ctx.fill();
  };

  const getAngleFromPoint = (x: number, y: number): number => {
    const canvas = canvasRef.current;
    if (!canvas) return 0;
    
    const rect = canvas.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const deltaX = x - rect.left - centerX;
    const deltaY = y - rect.top - centerY;
    
    let angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI + 90;
    if (angle < 0) angle += 360;
    
    return angle;
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    lastAngleRef.current = getAngleFromPoint(e.clientX, e.clientY);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length > 0) {
      setIsDragging(true);
      const touch = e.touches[0];
      lastAngleRef.current = getAngleFromPoint(touch.clientX, touch.clientY);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    
    const angle = getAngleFromPoint(e.clientX, e.clientY);
    updateDial(angle);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDragging || e.touches.length === 0) return;
    
    const touch = e.touches[0];
    const angle = getAngleFromPoint(touch.clientX, touch.clientY);
    updateDial(angle);
  };

  const updateDial = (angle: number) => {
    const angleDiff = angle - lastAngleRef.current;
    
    // Handle crossing the 0/360 boundary
    let adjustedDiff = angleDiff;
    if (angleDiff > 180) adjustedDiff -= 360;
    if (angleDiff < -180) adjustedDiff += 360;
    
    let newNumber = currentNumber + Math.round(adjustedDiff / 10);
    
    // Keep within 0-35 range
    while (newNumber < 0) newNumber += 36;
    while (newNumber >= 36) newNumber -= 36;
    
    setCurrentNumber(newNumber);
    drawDial(newNumber * 10);
    lastAngleRef.current = angle;
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      setCombination(prev => [...prev, currentNumber]);
    }
  };

  const handleTouchEnd = () => {
    if (isDragging) {
      setIsDragging(false);
      setCombination(prev => [...prev, currentNumber]);
    }
  };

  useEffect(() => {
    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;
      
      const size = Math.min(container.clientWidth, 300);
      canvas.width = size;
      canvas.height = size;
      
      drawDial(currentNumber * 10);
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  useEffect(() => {
    drawDial(currentNumber * 10);
  }, [currentNumber]);

  return (
    <div className="bank-vault-visualizer">
      <div className="combination-display">
        <span>Current Combination: </span>
        <span className="combination-value">
          {combination.length > 0 ? combination.join('-') : 'None'}
        </span>
      </div>
      
      <div className="vault-container" ref={containerRef}>
        <canvas
          ref={canvasRef}
          className="vault-canvas"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />
      </div>
      
      <div className="vault-instructions">
        Rotate the dial to set the combination
      </div>
      
      <div className="vault-actions">
        <Button onClick={handleReset} variant="secondary">
          Reset Combination
        </Button>
        <Button onClick={handleApply} disabled={combination.length === 0}>
          Apply as Salt
        </Button>
      </div>
    </div>
  );
};

export default BankVaultVisualizer;