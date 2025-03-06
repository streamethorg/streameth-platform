import React, { useState, useRef, useEffect } from 'react';
import { useClipPageContext } from './ClipPageContext';

interface SelectionOverlayProps {
  onSelectionChange?: (selection: {
    x: number;
    y: number;
    width: number;
    height: number;
  }) => void;
}

const SelectionOverlay: React.FC<SelectionOverlayProps> = () => {
  const { selection, setSelection } = useClipPageContext();

  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState('');
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const overlayRef = useRef<HTMLDivElement>(null);

  // Initialize selection to full size of container on mount
  useEffect(() => {
    if (overlayRef.current) {
      const rect = overlayRef.current.getBoundingClientRect();
      setSelection({
        x: 0,
        y: 0,
        width: rect.width,
        height: rect.height,
      });
    }
  }, []);

  // Update selection if container size changes
  useEffect(() => {
    const handleResize = () => {
      if (overlayRef.current) {
        const rect = overlayRef.current.getBoundingClientRect();
        setSelection((prev) => ({
          ...prev,
          width: Math.min(prev.width, rect.width - prev.x),
          height: Math.min(prev.height, rect.height - prev.y),
        }));
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle mouse down for dragging or resizing
  const handleMouseDown = (e: React.MouseEvent, direction = '') => {
    if (!overlayRef.current) return;

    const rect = overlayRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setDragStart({ x, y });

    if (direction) {
      setIsResizing(true);
      setResizeDirection(direction);
    } else {
      setIsDragging(true);
    }
  };

  // Handle mouse move for dragging or resizing
  const handleMouseMove = (e: React.MouseEvent) => {
    if ((!isDragging && !isResizing) || !overlayRef.current) return;

    const rect = overlayRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const deltaX = x - dragStart.x;
    const deltaY = y - dragStart.y;

    if (isDragging) {
      setSelection((prev) => ({
        ...prev,
        x: Math.max(0, Math.min(rect.width - prev.width, prev.x + deltaX)),
        y: Math.max(0, Math.min(rect.height - prev.height, prev.y + deltaY)),
      }));
    } else if (isResizing) {
      let newX = selection.x;
      let newY = selection.y;
      let newWidth = selection.width;
      let newHeight = selection.height;

      // Handle different resize directions
      if (resizeDirection.includes('n')) {
        newY = Math.min(
          selection.y + selection.height - 50,
          selection.y + deltaY
        );
        newHeight = selection.height - (newY - selection.y);
      }
      if (resizeDirection.includes('s')) {
        newHeight = Math.max(50, selection.height + deltaY);
      }
      if (resizeDirection.includes('w')) {
        newX = Math.min(
          selection.x + selection.width - 50,
          selection.x + deltaX
        );
        newWidth = selection.width - (newX - selection.x);
      }
      if (resizeDirection.includes('e')) {
        newWidth = Math.max(50, selection.width + deltaX);
      }

      // Apply constraints to keep within bounds
      newWidth = Math.min(newWidth, rect.width - newX);
      newHeight = Math.min(newHeight, rect.height - newY);

      setSelection({
        x: newX,
        y: newY,
        width: newWidth,
        height: newHeight,
      });
    }

    setDragStart({ x, y });
  };

  // Handle mouse up to stop dragging or resizing
  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeDirection('');
  };

  return (
    <div
      ref={overlayRef}
      className="absolute inset-0 z-10"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div
        className="absolute border-2 border-blue-500 bg-blue-500 bg-opacity-20"
        style={{
          left: `${selection.x}px`,
          top: `${selection.y}px`,
          width: `${selection.width}px`,
          height: `${selection.height}px`,
          cursor: isDragging ? 'grabbing' : 'grab',
        }}
        onMouseDown={(e) => handleMouseDown(e)}
      >
        {/* Top edge */}
        <div
          className="absolute top-0 left-0 right-0 h-2 cursor-ns-resize"
          style={{ marginTop: '-2px' }}
          onMouseDown={(e) => {
            e.stopPropagation();
            handleMouseDown(e, 'n');
          }}
        />

        {/* Bottom edge */}
        <div
          className="absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize"
          style={{ marginBottom: '-2px' }}
          onMouseDown={(e) => {
            e.stopPropagation();
            handleMouseDown(e, 's');
          }}
        />

        {/* Left edge */}
        <div
          className="absolute top-0 bottom-0 left-0 w-2 cursor-ew-resize"
          style={{ marginLeft: '-2px' }}
          onMouseDown={(e) => {
            e.stopPropagation();
            handleMouseDown(e, 'w');
          }}
        />

        {/* Right edge */}
        <div
          className="absolute top-0 bottom-0 right-0 w-2 cursor-ew-resize"
          style={{ marginRight: '-2px' }}
          onMouseDown={(e) => {
            e.stopPropagation();
            handleMouseDown(e, 'e');
          }}
        />

        {/* Top-left corner */}
        <div
          className="absolute top-0 left-0 w-4 h-4 bg-blue-500 cursor-nwse-resize"
          onMouseDown={(e) => {
            e.stopPropagation();
            handleMouseDown(e, 'nw');
          }}
        />

        {/* Top-right corner */}
        <div
          className="absolute top-0 right-0 w-4 h-4 bg-blue-500 cursor-nesw-resize"
          onMouseDown={(e) => {
            e.stopPropagation();
            handleMouseDown(e, 'ne');
          }}
        />

        {/* Bottom-left corner */}
        <div
          className="absolute bottom-0 left-0 w-4 h-4 bg-blue-500 cursor-nesw-resize"
          onMouseDown={(e) => {
            e.stopPropagation();
            handleMouseDown(e, 'sw');
          }}
        />

        {/* Bottom-right corner */}
        <div
          className="absolute bottom-0 right-0 w-4 h-4 bg-blue-500 cursor-nwse-resize"
          onMouseDown={(e) => {
            e.stopPropagation();
            handleMouseDown(e, 'se');
          }}
        />
      </div>
    </div>
  );
};

export default SelectionOverlay;
