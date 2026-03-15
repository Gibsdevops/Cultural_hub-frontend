import React from 'react';

/**
 * SlideIndicator — dot indicators showing current slide position
 *
 * Props:
 *   total    {number}   — total number of slides
 *   current  {number}   — index of active slide (0-based)
 *   onDotClick {func}   — called with index when dot is clicked
 */
const SlideIndicator = ({ total, current, onDotClick }) => {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, index) => (
        <button
          key={index}
          onClick={() => onDotClick(index)}
          aria-label={`Go to slide ${index + 1}`}
          className={`rounded-full transition-all duration-500 ${
            index === current
              ? 'w-8 h-2 bg-amber-DEFAULT opacity-100'   // active: wide pill
              : 'w-2 h-2 bg-white opacity-40 hover:opacity-70' // inactive: small dot
          }`}
          style={index === current ? { backgroundColor: '#C8651B' } : {}}
        />
      ))}
    </div>
  );
};

export default SlideIndicator;