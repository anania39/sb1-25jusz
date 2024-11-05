import React, { useRef, useEffect, useState } from 'react';

interface ScratchCardProps {
  onReveal: (percentage: number) => void;
  width: number;
  height: number;
}

export const ScratchCard: React.FC<ScratchCardProps> = ({ onReveal, width, height }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = width;
    canvas.height = height;

    // Fill with initial gray color
    ctx.fillStyle = '#CCCCCC';
    ctx.fillRect(0, 0, width, height);

    // Add scratch here text
    ctx.font = '20px Inter';
    ctx.fillStyle = '#999999';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Scratch here!', width / 2, height / 2);
  }, [width, height]);

  const calculateScratchedPercentage = (ctx: CanvasRenderingContext2D) => {
    const imageData = ctx.getImageData(0, 0, width, height);
    const pixels = imageData.data;
    let transparentPixels = 0;

    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) transparentPixels++;
    }

    return (transparentPixels / (width * height)) * 100;
  };

  const handleScratch = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas || !isDrawing) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) 
      ? e.touches[0].clientX - rect.left 
      : (e as React.MouseEvent).clientX - rect.left;
    const y = ('touches' in e)
      ? e.touches[0].clientY - rect.top
      : (e as React.MouseEvent).clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, 2 * Math.PI);
    ctx.fill();

    const percentage = calculateScratchedPercentage(ctx);
    onReveal(percentage);
  };

  return (
    <canvas
      ref={canvasRef}
      className="cursor-pointer"
      onMouseDown={() => setIsDrawing(true)}
      onMouseUp={() => setIsDrawing(false)}
      onMouseMove={handleScratch}
      onTouchStart={() => setIsDrawing(true)}
      onTouchEnd={() => setIsDrawing(false)}
      onTouchMove={handleScratch}
    />
  );
};