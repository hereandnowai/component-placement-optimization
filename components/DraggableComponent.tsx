
import React, { useState, useCallback } from 'react';
import { Component as PcbComponentType } from '../types'; 

interface DraggableComponentProps {
  component: PcbComponentType;
  onUpdatePosition: (id: string, x: number, y: number) => void;
  onLockComponent: (id: string) => void;
  boundary: { top: number; left: number; right: number; bottom: number };
  onClick?: (component: PcbComponentType) => void; // New optional prop
}

export const DraggableComponent: React.FC<DraggableComponentProps> = ({ component, onUpdatePosition, onLockComponent, boundary, onClick }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [clickCount, setClickCount] = useState(0); // To differentiate single click from double click

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (component.locked) return;
    // Only set dragging if it's not a double-click attempt for locking
    // This logic might need refinement if simple click is also to be drag-initiating
    if (e.detail === 1) { // e.detail is mouse click count
        setIsDragging(true);
        setOffset({
        x: e.clientX - component.x,
        y: e.clientY - component.y,
        });
        e.currentTarget.classList.add('cursor-grabbing', 'shadow-2xl', 'ring-2', 'ring-primary');
    }
  }, [component.x, component.y, component.locked]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || component.locked) return;
    let newX = e.clientX - offset.x;
    let newY = e.clientY - offset.y;

    newX = Math.max(boundary.left, Math.min(newX, boundary.right));
    newY = Math.max(boundary.top, Math.min(newY, boundary.bottom));
    
    onUpdatePosition(component.id, newX, newY);
  }, [isDragging, offset, onUpdatePosition, component.id, component.locked, boundary]);

  const handleMouseUp = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (component.locked && !onClick) return; // If locked and no special click, do nothing
    
    if (isDragging) {
        setIsDragging(false);
        e.currentTarget.classList.remove('cursor-grabbing', 'shadow-2xl', 'ring-2', 'ring-primary');
    }
  }, [component.locked, isDragging, onClick]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    // This allows the double-click to lock/unlock to still work,
    // while a single click can be handled by the onClick prop.
    // We prevent onClick from firing if it's part of a double-click.
    
    setClickCount(prev => prev + 1);
    setTimeout(() => {
        if(clickCount === 0 && onClick) { // If after timeout, clickCount is still 0 (reset by double-click or another single click), it means this was a single click.
             // Check if it was a drag operation. If not, then it's a click.
            if (!isDragging && e.detail === 1) { // e.detail helps confirm it's a single click event
                onClick(component);
            }
        }
        setClickCount(0); // Reset for next interaction
    }, 250); // Typical double click timeout

  }, [onClick, component, isDragging, clickCount]);


  const handleDoubleClick = useCallback(() => {
    setClickCount(2); // Mark as double click
    onLockComponent(component.id);
  }, [onLockComponent, component.id]);

  return (
    <div
      className={`absolute p-1 border-2 text-white text-xs text-center flex items-center justify-center rounded transition-all duration-100 ease-in-out select-none
                  ${component.locked ? 'border-red-500 cursor-not-allowed opacity-80' : 'border-gray-700 dark:border-gray-400 cursor-grab hover:shadow-lg'}
                  ${component.color}
                  ${component.thermalHotspot ? 'ring-2 ring-offset-2 ring-red-500 animate-pulse' : ''}
                `}
      style={{
        left: `${component.x}px`,
        top: `${component.y}px`,
        width: `${component.width}px`,
        height: `${component.height}px`,
        transform: `rotate(${component.rotation || 0}deg)`
      }}
      onMouseDown={!component.locked ? handleMouseDown : undefined}
      onMouseMove={isDragging ? handleMouseMove : undefined} 
      onMouseUp={handleMouseUp} // Simplified, as dragging state handles most
      onMouseLeave={isDragging ? handleMouseUp : undefined} 
      onClick={onClick ? handleClick : undefined} // Attach the new click handler
      onDoubleClick={handleDoubleClick}
      title={`${component.name} (${component.type})${component.locked ? ' - Locked (Double-click to unlock)' : (onClick && component.id === 'ss_sensor' ? ' (Click for sensor data, Double-click to lock/unlock)' : ' (Double-click to lock/unlock)')}`}
    >
      <div className="truncate px-1">
        {component.name}
        {component.locked && (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3 inline-block ml-1">
                <path fillRule="evenodd" d="M8 1a3.5 3.5 0 0 0-3.5 3.5V7A1.5 1.5 0 0 0 3.5 8.5v4A1.5 1.5 0 0 0 5 14h6a1.5 1.5 0 0 0 1.5-1.5v-4A1.5 1.5 0 0 0 9.5 7V4.5A3.5 3.5 0 0 0 8 1Zm2 6V4.5a2 2 0 1 0-4 0V7h4Z" clipRule="evenodd" />
            </svg>
        )}
      </div>
    </div>
  );
};
