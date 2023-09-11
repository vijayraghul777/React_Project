import React, { useState } from 'react';
//import React, { useState, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';
import './BottomSheet.css';

const BottomSheet = () => {
  const [position, setPosition] = useState('closed');
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartY, setDragStartY] = useState(0);

  const snapPoints = {
    closed: 60, // Height of the closed position
    halfOpen: window.innerHeight * 0.5, // Half of the viewport height
    fullyOpen: window.innerHeight - 60, // Height of fully open position
  };

  const springConfig = {
    stiffness: 300, // Adjust the stiffness to control the springiness
    damping: 25, // Adjust the damping to control the oscillation
  };

  const handleDragStart = (e) => {
    setIsDragging(true);
    setDragStartY(e.clientY);
  };

  const handleDrag = (e) => {
    if (isDragging) {
      const deltaY = e.clientY - dragStartY;
      const newPosition = calculatePosition(snapPoints[position], deltaY);
      setPosition(newPosition);
      setDragStartY(e.clientY);
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    snapToNearestPosition();
  };

  const calculatePosition = (currentPosition, deltaY) => {
    const newPosition = currentPosition + deltaY;

    if (newPosition < snapPoints.closed) return 'closed';
    if (newPosition < snapPoints.halfOpen) return 'halfOpen';
    if (newPosition < snapPoints.fullyOpen) return 'fullyOpen';
    return 'fullyOpen'; // Default to fully open if beyond fully open position
  };

  const snapToNearestPosition = () => {
    const targetPosition = Object.keys(snapPoints).reduce((closest, point) => {
      const distance = Math.abs(snapPoints[point] - snapPoints[position]);
      if (distance < Math.abs(snapPoints[closest] - snapPoints[position])) {
        return point;
      }
      return closest;
    }, position);

    animateToPosition(targetPosition);
  };

  const animateToPosition = (targetPosition) => {
    const startHeight = snapPoints[position];
    const endHeight = snapPoints[targetPosition];
    const duration = 300; // Animation duration in milliseconds

    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(1, elapsedTime / duration);

      const newPosition =
        startHeight + (endHeight - startHeight) * easeOutElastic(progress);

      setPosition(calculatePosition(newPosition, 0));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  };

  const easeOutElastic = (t) => {
    const p = 0.4;
    return (
      Math.pow(2, -10 * t) * Math.sin((t - p / 4) * (2 * Math.PI) / p) + 1
    );
  };

  const handleManualSnap = (snapPosition) => {
    setPosition(snapPosition);
  };

  //useEffect(() => {
    // Update the component when the position changes
   // snapToNearestPosition();
  //}, [position]);

  return (
    <div
      className={`bottom-sheet ${position}`}
      style={{ height: `${snapPoints[position]}px` }}
    >
      <div className="handle" onMouseDown={handleDragStart} onMouseUp={handleDragEnd} onMouseMove={handleDrag}></div>
      <div className="content">
        {/* Your content for the bottom sheet */}
      </div>
      <div className="snap-points">
        <button onClick={() => handleManualSnap('fullyOpen')}>Fully Open</button>
        <button onClick={() => handleManualSnap('halfOpen')}>Half Open</button>
        <button onClick={() => handleManualSnap('closed')}>Closed</button>
      </div>
    </div>
  );
};

export default BottomSheet;