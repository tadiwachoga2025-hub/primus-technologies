"use client";
import { useEffect, useState, useRef } from "react";

/**
 * PerformanceMonitor
 *
 * Real-time FPS counter and performance metrics for animation debugging.
 * Shows frame rate, frame time, and memory usage (if available).
 */

interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  memory?: number;
}

export function PerformanceMonitor({
  position = "top-left",
  showMemory = true,
}: {
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  showMemory?: boolean;
}) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    frameTime: 0,
  });
  const [isVisible, setIsVisible] = useState(false);

  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const frameTimesRef = useRef<number[]>([]);

  useEffect(() => {
    let animationId: number;

    const measurePerformance = (currentTime: number) => {
      frameCountRef.current++;

      // Calculate frame time
      const frameTime = currentTime - lastTimeRef.current;
      frameTimesRef.current.push(frameTime);

      // Keep last 60 frames for averaging
      if (frameTimesRef.current.length > 60) {
        frameTimesRef.current.shift();
      }

      // Update metrics every 500ms
      if (frameCountRef.current % 30 === 0) {
        const avgFrameTime =
          frameTimesRef.current.reduce((a, b) => a + b, 0) /
          frameTimesRef.current.length;
        const fps = Math.round(1000 / avgFrameTime);

        const newMetrics: PerformanceMetrics = {
          fps: Math.min(fps, 60),
          frameTime: Math.round(avgFrameTime * 100) / 100,
        };

        // Memory usage (Chrome/Edge only)
        if (showMemory && "memory" in performance) {
          const memoryInfo = (performance as any).memory;
          newMetrics.memory = Math.round(
            memoryInfo.usedJSHeapSize / 1048576
          );
        }

        setMetrics(newMetrics);
      }

      lastTimeRef.current = currentTime;
      animationId = requestAnimationFrame(measurePerformance);
    };

    animationId = requestAnimationFrame(measurePerformance);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [showMemory]);

  // Toggle visibility with keyboard shortcut
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Press 'P' to toggle performance monitor
      if (e.key === "p" || e.key === "P") {
        setIsVisible((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className={`fixed ${getPositionClasses(position)} bg-black/40 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-1 z-50 hover:bg-black/60 transition-colors`}
        title="Press 'P' to toggle performance monitor"
      >
        <span className="text-white/60 text-xs font-mono">FPS</span>
      </button>
    );
  }

  // Color code FPS
  const fpsColor =
    metrics.fps >= 55
      ? "text-green-400"
      : metrics.fps >= 30
      ? "text-yellow-400"
      : "text-red-400";

  return (
    <div
      className={`fixed ${getPositionClasses(position)} bg-black/80 backdrop-blur-lg border border-white/20 rounded-xl p-4 z-50 min-w-[180px]`}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white text-xs font-semibold uppercase tracking-wider">
          Performance
        </h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-white/40 hover:text-white/80 text-xs"
          title="Press 'P' to close"
        >
          ✕
        </button>
      </div>

      <div className="space-y-2">
        {/* FPS */}
        <div className="flex justify-between items-baseline">
          <span className="text-white/60 text-xs">FPS</span>
          <span className={`text-xl font-bold font-mono ${fpsColor}`}>
            {metrics.fps}
          </span>
        </div>

        {/* Frame Time */}
        <div className="flex justify-between items-baseline">
          <span className="text-white/60 text-xs">Frame Time</span>
          <span className="text-white text-sm font-mono">
            {metrics.frameTime}ms
          </span>
        </div>

        {/* Memory (if available) */}
        {showMemory && metrics.memory !== undefined && (
          <div className="flex justify-between items-baseline">
            <span className="text-white/60 text-xs">Memory</span>
            <span className="text-white text-sm font-mono">
              {metrics.memory}MB
            </span>
          </div>
        )}

        {/* Target FPS indicator */}
        <div className="pt-2 border-t border-white/10">
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  metrics.fps >= 55
                    ? "bg-green-400"
                    : metrics.fps >= 30
                    ? "bg-yellow-400"
                    : "bg-red-400"
                }`}
                style={{ width: `${(metrics.fps / 60) * 100}%` }}
              ></div>
            </div>
            <span className="text-white/40 text-xs font-mono">60</span>
          </div>
        </div>
      </div>

      {/* Help text */}
      <p className="text-white/30 text-xs mt-3 text-center">
        Press <kbd className="text-white/50">P</kbd> to toggle
      </p>
    </div>
  );
}

function getPositionClasses(
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right"
): string {
  switch (position) {
    case "top-left":
      return "top-4 left-4";
    case "top-right":
      return "top-4 right-4";
    case "bottom-left":
      return "bottom-4 left-4";
    case "bottom-right":
      return "bottom-4 right-4";
  }
}
