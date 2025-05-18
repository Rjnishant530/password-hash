import React, { useState, useRef, useEffect } from 'react';
import './AndroidPatternVisualizer.css';
import Button from '../ui/Button';

interface AndroidPatternVisualizerProps {
  onApplySalt: (salt: string) => void;
}

interface Point {
  x: number;
  y: number;
  index: number;
}

const AndroidPatternVisualizer: React.FC<AndroidPatternVisualizerProps> = ({ onApplySalt }) => {
  const [pattern, setPattern] = useState<number[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Define the 3x3 grid of points
  const gridSize = 3;
  const points: Point[] = [];
  
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      points.push({
        x: x,
        y: y,
        index: y * gridSize + x
      });
    }
  }

  const handleClear = () => {
    setPattern([]);
    drawGrid();
  };

  const handleApply = () => {
    if (pattern.length > 0) {
      onApplySalt(pattern.join(''));
    }
  };

  const drawGrid = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    const pointRadius = width / 10;
    const spacing = width / 3;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw points
    points.forEach(point => {
      const x = point.x * spacing + spacing / 2;
      const y = point.y * spacing + spacing / 2;
      
      ctx.beginPath();
      ctx.arc(x, y, pointRadius, 0, Math.PI * 2);
      ctx.fillStyle = pattern.includes(point.index) ? '#4a6cf7' : '#ced4da';
      ctx.fill();
      ctx.strokeStyle = '#6c757d';
      ctx.lineWidth = 2;
      ctx.stroke();
    });
    
    // Draw lines between points in the pattern
    if (pattern.length > 1) {
      ctx.beginPath();
      ctx.strokeStyle = '#4a6cf7';
      ctx.lineWidth = 3;
      
      for (let i = 0; i < pattern.length; i++) {
        const pointIndex = pattern[i];
        const point = points[pointIndex];
        const x = point.x * spacing + spacing / 2;
        const y = point.y * spacing + spacing / 2;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      
      ctx.stroke();
    }
  };

  const getPointAtPosition = (x: number, y: number): Point | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const canvasX = (x - rect.left) * scaleX;
    const canvasY = (y - rect.top) * scaleY;
    
    const spacing = canvas.width / 3;
    const pointRadius = canvas.width / 8;
    
    for (const point of points) {
      const pointX = point.x * spacing + spacing / 2;
      const pointY = point.y * spacing + spacing / 2;
      
      const distance = Math.sqrt(
        Math.pow(canvasX - pointX, 2) + Math.pow(canvasY - pointY, 2)
      );
      
      if (distance <= pointRadius) {
        return point;
      }
    }
    
    return null;
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const point = getPointAtPosition(e.clientX, e.clientY);
    if (point && !pattern.includes(point.index)) {
      setPattern([point.index]);
      setIsDrawing(true);
    }
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      const point = getPointAtPosition(touch.clientX, touch.clientY);
      if (point && !pattern.includes(point.index)) {
        setPattern([point.index]);
        setIsDrawing(true);
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const point = getPointAtPosition(e.clientX, e.clientY);
    if (point && !pattern.includes(point.index)) {
      setPattern(prev => [...prev, point.index]);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || e.touches.length === 0) return;
    
    const touch = e.touches[0];
    const point = getPointAtPosition(touch.clientX, touch.clientY);
    if (point && !pattern.includes(point.index)) {
      setPattern(prev => [...prev, point.index]);
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleTouchEnd = () => {
    setIsDrawing(false);
  };

  useEffect(() => {
    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;
      
      // Limit the size to prevent overflow on mobile
      const size = Math.min(container.clientWidth, 280);
      canvas.width = size;
      canvas.height = size;
      
      drawGrid();
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  useEffect(() => {
    drawGrid();
  }, [pattern]);

  return (
    <div className="android-pattern-visualizer">
      <div className="pattern-container" ref={containerRef}>
        <canvas
          ref={canvasRef}
          className="pattern-canvas"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />
      </div>
      
      <div className="pattern-actions">
        <Button onClick={handleClear} variant="secondary">
          Clear Pattern
        </Button>
        <Button onClick={handleApply} disabled={pattern.length === 0}>
          Apply as Salt
        </Button>
      </div>
    </div>
  );
};

export default AndroidPatternVisualizer;