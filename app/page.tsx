"use client";

import { useState, useRef } from "react";
import WebcamView, { WebcamRef } from "../components/WebcamView";
import ColorControls from "../components/ColorControls";
import ComparisonView from "../components/ComparisonView";

export default function Home() {
  const [color, setColor] = useState("#a855f7"); // Default to Purple
  const [opacity, setOpacity] = useState(0.6);
  const webcamRef = useRef<WebcamRef>(null);
  const [capturedImages, setCapturedImages] = useState<{ original: string; colored: string } | null>(null);

  const handleCapture = () => {
    if (webcamRef.current) {
      const images = webcamRef.current.capture();
      if (images) {
        setCapturedImages(images);
      }
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black">
      <div className="z-10 w-full max-w-5xl flex flex-col items-center gap-8 animate-in fade-in duration-700 slide-in-from-bottom-4">
        {/* Header */}
        <div className="text-center space-y-2 mb-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">
            ColorAIzer
          </h1>
          <p className="text-zinc-400 text-lg">
            Virtual Hair Color Try-On
          </p>
        </div>

        {/* Main View */}
        <div className="relative w-full max-w-4xl">
          <WebcamView ref={webcamRef} color={color} opacity={opacity} />
          
          {/* Capture Button */}
          <button
            onClick={handleCapture}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white text-black rounded-full p-4 shadow-lg hover:scale-110 transition-transform active:scale-95 group"
            title="Capture & Compare"
          >
            <div className="w-6 h-6 rounded-full border-2 border-black group-hover:bg-black transition-colors" />
          </button>
        </div>

        {/* Controls */}
        <ColorControls
          color={color}
          setColor={setColor}
          opacity={opacity}
          setOpacity={setOpacity}
        />
      </div>
      
      {/* Comparison Modal */}
      {capturedImages && (
        <ComparisonView
          original={capturedImages.original}
          colored={capturedImages.colored}
          onClose={() => setCapturedImages(null)}
        />
      )}
      
      {/* Background Ambient Glow */}
      <div 
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] opacity-20 pointer-events-none blur-[100px] transition-colors duration-1000"
        style={{ background: `radial-gradient(circle, ${color} 0%, transparent 70%)` }}
      />
    </main>
  );
}
