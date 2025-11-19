"use client";

import React from "react";

interface ColorControlsProps {
  color: string;
  setColor: (color: string) => void;
  opacity: number;
  setOpacity: (opacity: number) => void;
}

const NATURAL_PRESETS = [
  { name: "Jet Black", value: "#09090b" },
  { name: "Dark Brown", value: "#3e2723" },
  { name: "Medium Brown", value: "#5d4037" },
  { name: "Light Brown", value: "#8d6e63" },
  { name: "Auburn", value: "#795548" },
  { name: "Dark Blonde", value: "#bcaaa4" },
  { name: "Golden Blonde", value: "#ffd54f" },
  { name: "Platinum Blonde", value: "#fff9c4" },
  { name: "Redhead", value: "#d84315" },
  { name: "Grey", value: "#9e9e9e" },
];

const VIBRANT_PRESETS = [
  { name: "Ruby Red", value: "#ef4444" },
  { name: "Sunset Orange", value: "#f97316" },
  { name: "Emerald Green", value: "#22c55e" },
  { name: "Ocean Blue", value: "#3b82f6" },
  { name: "Royal Purple", value: "#a855f7" },
  { name: "Hot Pink", value: "#ec4899" },
];

export default function ColorControls({
  color,
  setColor,
  opacity,
  setOpacity,
}: ColorControlsProps) {
  return (
    <div className="glass-panel w-full max-w-4xl p-6 rounded-2xl mt-6 flex flex-col gap-6">
      {/* Natural Shades */}
      <div>
        <h3 className="text-sm font-medium text-zinc-400 mb-3 uppercase tracking-wider">
          Natural Shades
        </h3>
        <div className="flex flex-wrap gap-3">
          {NATURAL_PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => setColor(preset.value)}
              className={`w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                color === preset.value
                  ? "border-white scale-110 shadow-lg shadow-white/20"
                  : "border-transparent hover:scale-105"
              }`}
              style={{ backgroundColor: preset.value }}
              title={preset.name}
            />
          ))}
        </div>
      </div>

      {/* Vibrant Shades */}
      <div>
        <h3 className="text-sm font-medium text-zinc-400 mb-3 uppercase tracking-wider">
          Vibrant Shades
        </h3>
        <div className="flex flex-wrap gap-3">
          {VIBRANT_PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => setColor(preset.value)}
              className={`w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                color === preset.value
                  ? "border-white scale-110 shadow-lg shadow-white/20"
                  : "border-transparent hover:scale-105"
              }`}
              style={{ backgroundColor: preset.value }}
              title={preset.name}
            />
          ))}
          
          {/* Custom Color Picker */}
          <div className="relative group">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
            />
            <div
              className="w-10 h-10 rounded-full border-2 border-zinc-600 flex items-center justify-center bg-zinc-800 group-hover:border-zinc-400 transition-colors"
              style={{
                background:
                  "conic-gradient(from 180deg at 50% 50%, #FF0000 0deg, #00FFFF 180deg, #FF0000 360deg)",
              }}
            >
              <span className="sr-only">Custom</span>
            </div>
          </div>
        </div>
      </div>

      {/* Intensity Slider */}
      <div className="w-full pt-4 border-t border-zinc-800">
        <div className="flex justify-between mb-2">
          <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">
            Intensity
          </h3>
          <span className="text-sm text-zinc-300">
            {Math.round(opacity * 100)}%
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={opacity}
          onChange={(e) => setOpacity(parseFloat(e.target.value))}
          className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-primary hover:accent-primary/80"
        />
      </div>
    </div>
  );
}
