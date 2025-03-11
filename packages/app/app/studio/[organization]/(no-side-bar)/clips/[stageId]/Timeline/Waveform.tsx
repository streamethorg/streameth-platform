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
  const { timelineRef, timelineWidth } = useTimelineContext();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [width, setWidth] = useState(timelineWidth); // Default width

  // Update width when timeline width changes
  useEffect(() => {
    setWidth(timelineWidth);
  }, [timelineWidth]);

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

      // Set fixed bar height instead of scaling with amplitude
      const fixedBarHeight = height * 0.3; // 50% of the canvas height
      const accentBarHeight = height * 0.7; // 70% of the canvas height for every 10th bar

      // Draw each bar of the waveform
      data.forEach((amplitude, index) => {
        const x = index * (barWidth + barGap);
        const isAccentBar = index % 10 === 0;
        const barHeight = isAccentBar ? accentBarHeight : fixedBarHeight;
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
