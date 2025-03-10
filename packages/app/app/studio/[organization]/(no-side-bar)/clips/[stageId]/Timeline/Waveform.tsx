import React, { useEffect, useRef, useState } from 'react';
import { useClipPageContext } from '../ClipPageContext';
import { useTimelineContext } from './TimelineContext';

const WaveformFromHLS = ({
  height = 50,
  barWidth = 3,
  barGap = 1,
  barColor = '#3b82f6',
}) => {
  const { metadata } = useClipPageContext();
  const { timelineRef } = useTimelineContext();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [width, setWidth] = useState(800); // Default width

  // Update width based on timelineRef
  useEffect(() => {
    if (!timelineRef.current) return;

    const updateWidth = () => {
      if (timelineRef.current) {
        setWidth(timelineRef.current.clientWidth);
      }
    };

    // Set initial width
    updateWidth();

    // Update width on resize
    const resizeObserver = new ResizeObserver(updateWidth);
    resizeObserver.observe(timelineRef.current);

    return () => {
      if (timelineRef.current) {
        resizeObserver.unobserve(timelineRef.current);
      }
    };
  }, [timelineRef]);

  // Generate fake waveform data
  useEffect(() => {
    const generateFakeWaveformData = () => {
      const numberOfBars = Math.floor(width / (barWidth + barGap));
      const fakeData = [];

      for (let i = 0; i < numberOfBars; i++) {
        // Generate random amplitude between 0.1 and 0.8
        // Using sine wave pattern with some randomness for more natural look
        const baseAmplitude = 0.3 + 0.2 * Math.sin(i * 0.1);
        const randomFactor = 0.3 * Math.random();
        fakeData.push(baseAmplitude + randomFactor);
      }

      return fakeData;
    };

    // Draw the fake waveform
    const drawWaveform = (data: number[]) => {
      if (!canvasRef.current) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      if (!ctx) return;

      // Clear the canvas
      ctx.clearRect(0, 0, width, height);

      // Set the drawing style
      ctx.fillStyle = barColor;

      // Draw each bar of the waveform
      data.forEach((amplitude, index) => {
        const x = index * (barWidth + barGap);
        const barHeight = Math.max(2, amplitude * height);
        const y = (height - barHeight) / 2;

        ctx.fillRect(x, y, barWidth, barHeight);
      });
    };

    // Generate and draw fake waveform
    const fakeWaveformData = generateFakeWaveformData();
    drawWaveform(fakeWaveformData);
  }, [width, height, barWidth, barGap, barColor]);

  return (
    <div className="w-full h-full absolute top-0 left-0">
      <canvas 
        ref={canvasRef} 
        width={width} 
        height={height} 
        className="w-full"
      />
    </div>
  );
};

export default WaveformFromHLS;
