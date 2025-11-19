"use client";

import React, { useState } from "react";
import Image from "next/image";

interface ComparisonViewProps {
  original: string; // Data URL
  colored: string; // Data URL
  onClose: () => void;
}

export default function ComparisonView({
  original,
  colored,
  onClose,
}: ComparisonViewProps) {
  const [sliderPosition, setSliderPosition] = useState(50);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-4xl aspect-video bg-zinc-900 rounded-2xl overflow-hidden shadow-2xl border border-zinc-800">
        {/* Images */}
        <div className="absolute inset-0 w-full h-full">
          {/* Colored Image (Background) */}
          <img
            src={colored}
            alt="Colored Hair"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Original Image (Foreground, clipped) */}
          <div
            className="absolute inset-0 w-full h-full overflow-hidden border-r-2 border-white"
            style={{ width: `${sliderPosition}%` }}
          >
            <img
              src={original}
              alt="Original Hair"
              className="absolute top-0 left-0 max-w-none h-full w-[100vw] max-w-[100vw] md:w-[calc(100vw-2rem)] md:max-w-[56rem]" // Approximate width matching the container
              // Actually, to make the slider work perfectly, the inner image needs to be the same size as the container
              // and positioned relatively.
              // A better way is to set the width of the inner image to the container width.
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
             {/* Correction: The inner image needs to maintain the aspect ratio and size of the outer container 
                 regardless of the clipping div's width. 
                 Since we are using object-cover on the background, we should use it here too.
                 But 'width: 100%' on the img inside the clipped div will make it shrink.
                 We need to set the img width to the container's width.
             */}
          </div>
           {/* Re-implementation of the slider logic for better robustness */}
           <div 
             className="absolute inset-0 pointer-events-none"
           >
             {/* This is just a placeholder to show we need a better implementation below */}
           </div>
        </div>

        {/* Better Slider Implementation */}
        <div className="absolute inset-0 select-none group cursor-ew-resize">
           {/* Colored Layer (Bottom) */}
           <img 
             src={colored} 
             className="absolute inset-0 w-full h-full object-cover pointer-events-none" 
             alt="After"
           />
           
           {/* Original Layer (Top, Clipped) */}
           <div 
             className="absolute inset-0 overflow-hidden pointer-events-none"
             style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
           >
             <img 
               src={original} 
               className="absolute inset-0 w-full h-full object-cover" 
               alt="Before"
             />
           </div>

           {/* Slider Handle */}
           <div 
             className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-[0_0_10px_rgba(0,0,0,0.5)]"
             style={{ left: `${sliderPosition}%` }}
           >
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg text-black font-bold text-xs">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
               </svg>
             </div>
           </div>

           {/* Input Range for Interaction */}
           <input
             type="range"
             min="0"
             max="100"
             value={sliderPosition}
             onChange={(e) => setSliderPosition(parseFloat(e.target.value))}
             className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
           />
        </div>

        {/* Labels */}
        <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-md pointer-events-none z-10">
          Original
        </div>
        <div className="absolute top-4 right-4 bg-primary/80 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-md pointer-events-none z-10">
          Colored
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-md transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
