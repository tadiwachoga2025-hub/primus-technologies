"use client";
import { useState } from "react";
import { WebGLVortexAnimation } from "@/components/ui/webgl-vortex-animation";
import { GeometricVortexAnimation } from "@/components/ui/geometric-vortex-animation";
import { PerformanceMonitor } from "@/components/ui/performance-monitor";

/**
 * Animation Test Page
 * Interactive demo to compare WebGL vs Canvas2D implementations
 */
export default function AnimationTestPage() {
  const [engine, setEngine] = useState<"webgl" | "canvas">("webgl");
  const [duration, setDuration] = useState(13000);
  const [showOverlay, setShowOverlay] = useState(true);

  const AnimationComponent = engine === "webgl"
    ? WebGLVortexAnimation
    : GeometricVortexAnimation;

  return (
    <div className="relative w-full h-screen">
      <AnimationComponent imageSrc="/vortex-bg.png" duration={duration}>
        <div className="flex flex-col items-center justify-center min-h-screen px-4">
          {/* Hero Content */}
          <div className="max-w-5xl mx-auto text-center space-y-8 mb-16">
            <div className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-4">
              <span className="text-sm font-medium text-white/90">
                5-Stage Cinematic Vortex Animation
              </span>
            </div>

            <h1 className="text-6xl md:text-8xl font-bold text-white tracking-tight leading-none">
              Stirling Interiors
            </h1>

            <p className="text-xl md:text-2xl text-white/90 font-light max-w-2xl mx-auto">
              Enterprise-grade WebGL animation with seamless 60fps performance
            </p>

            <div className="flex flex-wrap gap-4 justify-center pt-6">
              <button className="px-8 py-4 bg-white text-black font-semibold rounded-lg hover:bg-white/90 transition-all hover:scale-105">
                View Projects
              </button>
              <button className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-all hover:scale-105">
                Contact Us
              </button>
            </div>
          </div>

          {/* Animation Stages Timeline */}
          {showOverlay && (
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-lg border border-white/20 rounded-xl p-6 max-w-4xl w-full mx-4">
              <h3 className="text-white font-semibold mb-4 text-center">
                Animation Timeline ({duration / 1000}s loop)
              </h3>

              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <span className="text-white/60 text-sm w-16">0-1s</span>
                  <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 w-[7.7%]"></div>
                  </div>
                  <span className="text-white text-sm w-48">Polygonal Shattering</span>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-white/60 text-sm w-16">2-4s</span>
                  <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 w-[15.4%] ml-[15.4%]"></div>
                  </div>
                  <span className="text-white text-sm w-48">Mosaic Tiling</span>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-white/60 text-sm w-16">5-8s</span>
                  <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 w-[23%] ml-[38.5%]"></div>
                  </div>
                  <span className="text-white text-sm w-48">Liquid Vortex</span>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-white/60 text-sm w-16">9-10s</span>
                  <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-pink-500 to-yellow-500 w-[7.7%] ml-[69.2%]"></div>
                  </div>
                  <span className="text-white text-sm w-48">Chromatic Bloom</span>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-white/60 text-sm w-16">11-13s</span>
                  <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-yellow-500 to-white w-[15.4%] ml-[84.6%]"></div>
                  </div>
                  <span className="text-white text-sm w-48">Starburst Collapse</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </AnimationComponent>

      {/* Control Panel */}
      <div className="fixed top-8 right-8 bg-black/80 backdrop-blur-lg border border-white/20 rounded-xl p-6 space-y-4 min-w-[280px]">
        <h3 className="text-white font-semibold mb-4">Animation Controls</h3>

        {/* Engine Selection */}
        <div className="space-y-2">
          <label className="text-white/70 text-sm">Rendering Engine</label>
          <div className="flex gap-2">
            <button
              onClick={() => setEngine("webgl")}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                engine === "webgl"
                  ? "bg-white text-black"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              WebGL2
            </button>
            <button
              onClick={() => setEngine("canvas")}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                engine === "canvas"
                  ? "bg-white text-black"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              Canvas2D
            </button>
          </div>
          <p className="text-white/50 text-xs">
            {engine === "webgl"
              ? "GPU-accelerated GLSL shaders"
              : "CPU-based pixel manipulation"}
          </p>
        </div>

        {/* Duration Control */}
        <div className="space-y-2">
          <label className="text-white/70 text-sm">
            Loop Duration: {duration / 1000}s
          </label>
          <input
            type="range"
            min="8000"
            max="20000"
            step="1000"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full accent-white"
          />
          <div className="flex justify-between text-white/50 text-xs">
            <span>8s</span>
            <span>20s</span>
          </div>
        </div>

        {/* Overlay Toggle */}
        <div className="flex items-center justify-between pt-2">
          <label className="text-white/70 text-sm">Show Timeline</label>
          <button
            onClick={() => setShowOverlay(!showOverlay)}
            className={`w-12 h-6 rounded-full transition-all ${
              showOverlay ? "bg-white" : "bg-white/20"
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-black transition-transform ${
                showOverlay ? "translate-x-6" : "translate-x-1"
              }`}
            ></div>
          </button>
        </div>

        {/* Performance Info */}
        <div className="pt-4 border-t border-white/10">
          <div className="text-white/50 text-xs space-y-1">
            <p>Target: 60fps</p>
            <p>Resolution: {typeof window !== "undefined" ? `${window.innerWidth}×${window.innerHeight}` : "Loading..."}</p>
            <p>DPR: {typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2) : 1}×</p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="pt-4 border-t border-white/10 space-y-2">
          <a
            href="/animation-test"
            className="block text-white/70 hover:text-white text-sm transition-colors"
          >
            Refresh Animation
          </a>
          <a
            href="/"
            className="block text-white/70 hover:text-white text-sm transition-colors"
          >
            Back to Home
          </a>
        </div>
      </div>

      {/* Performance Monitor */}
      <PerformanceMonitor position="bottom-left" showMemory={true} />
    </div>
  );
}
