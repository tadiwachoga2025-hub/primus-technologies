"use client";
import { GeometricVortexAnimation } from "./geometric-vortex-animation";

/**
 * Demo component showcasing the GeometricVortexAnimation
 * Use this to test the animation with sample content overlay
 */
export function GeometricVortexDemo() {
  return (
    <div className="w-full h-screen">
      <GeometricVortexAnimation imageSrc="/vortex-bg.png">
        <div className="flex flex-col items-center justify-center min-h-screen px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight">
              Stirling Interiors
            </h1>
            <p className="text-xl md:text-2xl text-white/90 font-light">
              Enterprise-grade geometric vortex animation
            </p>
            <div className="flex gap-4 justify-center pt-8">
              <button className="px-8 py-3 bg-white text-black font-semibold rounded-lg hover:bg-white/90 transition-colors">
                View Projects
              </button>
              <button className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors">
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </GeometricVortexAnimation>
    </div>
  );
}
