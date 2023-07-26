import React, { useState, useRef } from 'react';
// import './ModelViewer.css'; // Create this CSS file for styling

const ModelViewer = () => {
  const totalImages = 119;
  const [currentImage, setCurrentImage] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [pins, setPins] = useState([]);
  const [lastClickedPoint, setLastClickedPoint] = useState(null);  // State for storing pins

  const containerRef = useRef(null);

  const handleImageDragStart = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handleImageDragEnd = (e) => {
    e.preventDefault();
    setIsDragging(false);
    setStartX(0); // Reset startX after dragging is finished
  };

  const handleImageDragMove = (e) => {
    if (isDragging && e.buttons === 1) {
      // Check if the left mouse button is pressed while dragging
      const containerWidth = containerRef.current.clientWidth;
      const deltaX = e.clientX - startX;
      // Calculate the new image index based on deltaX and container width
      const rotationStep = 360 / totalImages;
      const rotationDelta = (deltaX / containerWidth) * 360;
      const newImage = (currentImage - Math.floor(rotationDelta / rotationStep) + totalImages) % totalImages;

      setCurrentImage(newImage);
      if (Math.abs(deltaX) >= containerWidth / totalImages) {
        setStartX(e.clientX);
      }
      // Update startX for continuous rotation
    }
  };

  const handlePinClick = (e) => {
    // Get the click coordinates relative to the container
    const containerRect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - containerRect.left;
    const y = e.clientY - containerRect.top;

    // Add a new pin at the clicked position
    addPin(x, y);
  };

  const addPin = (x, y) => {
    if (lastClickedPoint && Math.abs(lastClickedPoint.x - x) < 5 && Math.abs(lastClickedPoint.y - y) < 5) {
      return; // Don't add a new pin if the click is too close to the last clicked point
    }
    // Function to add a new pin to the pins array
    setPins((prevPins) => [...prevPins, { x, y }]);
    // Update the last clicked point
    setLastClickedPoint({ x, y });
  };

  return (
    <div
      className="model-container"
      ref={containerRef}
      onMouseDown={handleImageDragStart}
      onMouseUp={handleImageDragEnd}
      onMouseMove={handleImageDragMove}
      onClick={handlePinClick} // Add onClick event for the whole container to handle pin clicks
    >
      <img
        className="model-image"
        src={`/images/${currentImage}.jpg`}
        alt="3D Model"
      />
      {/* Render SVG pins here */}
      <div >
        {pins.map((pin, index) => (
          <svg
            key={index}
            className="pin"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            style={{position: 'absolute', left: pin.x, top: pin.y, pointerEvents: 'none' }}
            onClick={handlePinClick} // Add onClick event to call handlePinClick
          >
         <rect x="-0.5" y="-0.25" width="1" height="0.5" fill="rgba(255, 255, 255, 0.5)" />

          </svg>
        ))}
      </div>
      {/* More pins can be added here */}
    </div>
  );
};

export default ModelViewer;