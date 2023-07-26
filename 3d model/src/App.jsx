import React, { useState, useRef, useEffect } from 'react';
import './ModelViewer.css'; // Import the created CSS file for styling

const ModelViewer = () => {
  const totalImages = 119;
  const [currentImage, setCurrentImage] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [hoverArrow, setHoverArrow] = useState(null);

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

  // Handle arrow key presses
  const handleArrowKeyPress = (e) => {
    if (e.key === 'ArrowLeft') {
      setCurrentImage((currentImage - 1 + totalImages) % totalImages);
      setHoverArrow('left'); 
    } else if (e.key === 'ArrowRight') {
      setCurrentImage((currentImage + 1) % totalImages);
      setHoverArrow('right'); 
    }
  };

  useEffect(() => {
    // Add event listener for arrow key presses
    window.addEventListener('keydown', handleArrowKeyPress);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('keydown', handleArrowKeyPress);
    };
  }, [currentImage]);

  return (
    <div
      className="model-container"
      ref={containerRef}
      onMouseDown={handleImageDragStart}
      onMouseUp={handleImageDragEnd}
      onMouseMove={handleImageDragMove}
      // Add tabIndex to make the container focusable for arrow key press
      tabIndex="0"
    >
      {/* Left Arrow */}
      
      
     <div className="arrow-wrapper">

          <div className="arrow-container left-arrow">
              <div
                 className={`arrow ${hoverArrow === 'left' ? 'hovered' : ''}`}
                onClick={() =>
                  {
                    setCurrentImage((currentImage - 1) % totalImages);
                    setHoverArrow(null);
                }
              }
              >
                &larr;
              </div>
            </div>
        
            {/* Right Arrow */}
            <div className="arrow-container right-arrow">
              <div
                className={`arrow ${hoverArrow === 'right' ? 'hovered' : ''}`}
                onClick={() => 

                  {
                    setCurrentImage((currentImage + 1) % totalImages);
                    setHoverArrow(null);
                }
                
                }
              >
                &rarr;
              </div>

      </div>

     </div>
  
      <img
        className="model-image"
        src={`/images/${currentImage}.jpg`}
        alt="3D Model"
      />
    </div>
  );
  
  
};

export default ModelViewer;
