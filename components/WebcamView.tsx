"use client";

import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import { ImageSegmenter, FilesetResolver } from "@mediapipe/tasks-vision";

interface WebcamViewProps {
  color: string; // Hex color
  opacity: number;
}

export interface WebcamRef {
  capture: () => { original: string; colored: string } | null;
}

const WebcamView = forwardRef<WebcamRef, WebcamViewProps>(({ color, opacity }, ref) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [segmenter, setSegmenter] = useState<ImageSegmenter | null>(null);
  const [isWebcamRunning, setIsWebcamRunning] = useState(false);
  const requestRef = useRef<number>(null);

  useImperativeHandle(ref, () => ({
    capture: () => {
      if (videoRef.current && canvasRef.current) {
        // Capture original
        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = videoRef.current.videoWidth;
        tempCanvas.height = videoRef.current.videoHeight;
        const tempCtx = tempCanvas.getContext("2d");
        if (tempCtx) {
          tempCtx.drawImage(videoRef.current, 0, 0);
          const original = tempCanvas.toDataURL("image/png");
          
          // Capture colored (current canvas state)
          const colored = canvasRef.current.toDataURL("image/png");
          
          return { original, colored };
        }
      }
      return null;
    },
  }));

  // Initialize MediaPipe Segmenter
  useEffect(() => {
    const initSegmenter = async () => {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );
      const newSegmenter = await ImageSegmenter.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/image_segmenter/hair_segmenter/float32/1/hair_segmenter.tflite",
          delegate: "GPU",
        },
        runningMode: "VIDEO",
        outputCategoryMask: true,
        outputConfidenceMasks: false,
      });
      setSegmenter(newSegmenter);
    };
    initSegmenter();
  }, []);

  // Start Webcam
  useEffect(() => {
    const startWebcam = async () => {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { width: 1280, height: 720 },
          });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.addEventListener("loadeddata", () => {
              setIsWebcamRunning(true);
            });
          }
        } catch (err) {
          console.error("Error accessing webcam:", err);
        }
      }
    };
    startWebcam();
  }, []);

  // Processing Loop
  const renderLoop = () => {
    if (
      segmenter &&
      videoRef.current &&
      canvasRef.current &&
      isWebcamRunning
    ) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      if (video.videoWidth > 0 && video.videoHeight > 0) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const startTimeMs = performance.now();
        segmenter.segmentForVideo(video, startTimeMs, (result) => {
          if (ctx && result.categoryMask) {
            // Draw original video
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Get mask data
            const mask = result.categoryMask;
            const width = mask.width;
            const height = mask.height;
            const maskData = mask.getAsUint8Array();

            // Create an ImageData object for the mask overlay
            const imageData = ctx.getImageData(0, 0, width, height);
            const data = imageData.data;

            // Parse the hex color
            const r = parseInt(color.slice(1, 3), 16);
            const g = parseInt(color.slice(3, 5), 16);
            const b = parseInt(color.slice(5, 7), 16);

            // Apply color only where the mask indicates hair (index 1 usually, but check model)
            // Hair segmenter: 0 = background, 1 = hair
            for (let i = 0; i < maskData.length; i++) {
              if (maskData[i] === 1) { // Hair detected
                const idx = i * 4;
                // Simple blending: mix original color with target color
                // We can use the alpha channel for opacity
                // But here we are manipulating pixel data directly.
                // A faster way is to draw the mask to a separate canvas/layer and use globalCompositeOperation.
                
                // Let's try a simpler approach with globalCompositeOperation for better performance
                // We will create a mask image first.
              }
            }
            
            // Optimized approach:
            // 1. Create an offscreen canvas or ImageData for the mask
            const maskImage = new ImageData(width, height);
            for (let i = 0; i < maskData.length; i++) {
               if (maskData[i] === 1) {
                 maskImage.data[i * 4] = r;
                 maskImage.data[i * 4 + 1] = g;
                 maskImage.data[i * 4 + 2] = b;
                 maskImage.data[i * 4 + 3] = opacity * 255; // Alpha
               } else {
                 maskImage.data[i * 4 + 3] = 0; // Transparent
               }
            }
            
            // Draw the colored mask on top
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = width;
            tempCanvas.height = height;
            const tempCtx = tempCanvas.getContext('2d');
            tempCtx?.putImageData(maskImage, 0, 0);
            
            ctx.save();
            // Blend mode 'overlay' or 'soft-light' or 'multiply' often looks best for hair
            ctx.globalCompositeOperation = 'overlay'; 
            ctx.drawImage(tempCanvas, 0, 0, canvas.width, canvas.height);
            
            // Maybe add a second pass with 'color' blend mode for hue change
            ctx.globalCompositeOperation = 'color';
            ctx.globalAlpha = 0.5;
            ctx.drawImage(tempCanvas, 0, 0, canvas.width, canvas.height);
            
            ctx.restore();
          }
        });
      }
    }
    requestRef.current = requestAnimationFrame(renderLoop);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(renderLoop);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [segmenter, isWebcamRunning, color, opacity]);

  return (
    <div className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden shadow-2xl border border-zinc-800 bg-zinc-900">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute top-0 left-0 w-full h-full object-cover opacity-0" // Hide video, show canvas
      />
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full object-cover"
      />
      {!isWebcamRunning && (
        <div className="absolute inset-0 flex items-center justify-center text-zinc-500">
          Loading Camera...
        </div>
      )}
    </div>
  );
});

export default WebcamView;
