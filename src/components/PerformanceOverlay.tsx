/**
 * Development Performance Overlay
 *
 * Shows real-time performance metrics and quality settings.
 * Only renders in development mode.
 *
 * @example
 * ```tsx
 * <PerformanceOverlay
 *   metrics={metrics}
 *   quality={quality}
 *   position="top-right"
 * />
 * ```
 */

'use client';

import { useMemo } from 'react';
import type { FrameMetrics, QualitySettings } from '@/lib/animation-performance';

export interface PerformanceOverlayProps {
  /**
   * Current performance metrics
   */
  metrics: FrameMetrics | null;

  /**
   * Current quality settings
   */
  quality: QualitySettings | null;

  /**
   * Position on screen
   */
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

  /**
   * Show detailed stats
   */
  detailed?: boolean;

  /**
   * Custom class name
   */
  className?: string;
}

export function PerformanceOverlay({
  metrics,
  quality,
  position = 'top-right',
  detailed = false,
  className = '',
}: PerformanceOverlayProps) {
  // Only render in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  if (!metrics || !quality) {
    return null;
  }

  const positionClasses = useMemo(() => {
    switch (position) {
      case 'top-left':
        return 'top-4 left-4';
      case 'top-right':
        return 'top-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'bottom-right':
        return 'bottom-4 right-4';
      default:
        return 'top-4 right-4';
    }
  }, [position]);

  const fpsColor = useMemo(() => {
    if (metrics.averageFPS >= 55) return 'text-green-400';
    if (metrics.averageFPS >= 30) return 'text-yellow-400';
    return 'text-red-400';
  }, [metrics.averageFPS]);

  const frameTimeColor = useMemo(() => {
    if (metrics.frameTime <= 16.67) return 'text-green-400';
    if (metrics.frameTime <= 33.33) return 'text-yellow-400';
    return 'text-red-400';
  }, [metrics.frameTime]);

  return (
    <div
      className={`fixed ${positionClasses} z-50 ${className}`}
      style={{ pointerEvents: 'none' }}
    >
      <div className="bg-black/90 backdrop-blur-sm text-white rounded-lg p-4 shadow-lg font-mono text-xs border border-white/10">
        {/* FPS Section */}
        <div className="space-y-1 mb-3 pb-3 border-b border-white/10">
          <div className="flex justify-between gap-4">
            <span className="text-white/60">FPS:</span>
            <span className={`font-bold ${fpsColor}`}>
              {metrics.fps.toFixed(1)}
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-white/60">Avg FPS:</span>
            <span className={fpsColor}>{metrics.averageFPS.toFixed(1)}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-white/60">Frame Time:</span>
            <span className={frameTimeColor}>
              {metrics.frameTime.toFixed(2)}ms
            </span>
          </div>
          {detailed && (
            <div className="flex justify-between gap-4">
              <span className="text-white/60">Dropped:</span>
              <span className="text-red-400">{metrics.droppedFrames}</span>
            </div>
          )}
        </div>

        {/* Quality Section */}
        <div className="space-y-1">
          <div className="text-white/40 text-[10px] uppercase tracking-wider mb-2">
            Quality Settings
          </div>

          <div className="flex justify-between gap-4">
            <span className="text-white/60">Resolution:</span>
            <span>{(quality.resolution * 100).toFixed(0)}%</span>
          </div>

          <div className="flex justify-between gap-4">
            <span className="text-white/60">Particles:</span>
            <span>{quality.particleCount}</span>
          </div>

          <div className="flex justify-between gap-4">
            <span className="text-white/60">Tiles:</span>
            <span>{quality.tileCount}x{quality.tileCount}</span>
          </div>

          {detailed && (
            <>
              <div className="flex justify-between gap-4">
                <span className="text-white/60">Bloom:</span>
                <span className="capitalize">{quality.bloomQuality}</span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-white/60">CA:</span>
                <span>{quality.chromaticAberration ? 'ON' : 'OFF'}</span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-white/60">Shader:</span>
                <span>{quality.useSimpleShader ? 'Simple' : 'Complex'}</span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-white/60">AA:</span>
                <span>{quality.antialiasing ? 'ON' : 'OFF'}</span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-white/60">Shadows:</span>
                <span className="capitalize">{quality.shadowQuality}</span>
              </div>
            </>
          )}
        </div>

        {/* FPS Bar */}
        <div className="mt-3 pt-3 border-t border-white/10">
          <div className="text-white/40 text-[10px] mb-1">FPS Target: 60</div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                metrics.averageFPS >= 55
                  ? 'bg-green-500'
                  : metrics.averageFPS >= 30
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
              }`}
              style={{
                width: `${Math.min((metrics.averageFPS / 60) * 100, 100)}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Minimal FPS counter (less intrusive)
 */
export function FPSCounter({ fps, className = '' }: { fps: number; className?: string }) {
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const color = fps >= 55 ? 'text-green-400' : fps >= 30 ? 'text-yellow-400' : 'text-red-400';

  return (
    <div
      className={`fixed top-4 right-4 bg-black/80 text-white rounded px-2 py-1 font-mono text-xs ${className}`}
      style={{ pointerEvents: 'none' }}
    >
      <span className={color}>{fps.toFixed(1)}</span> FPS
    </div>
  );
}

/**
 * Graph-based performance monitor
 */
export function PerformanceGraph({
  metrics,
  historySize = 60,
  className = '',
}: {
  metrics: FrameMetrics | null;
  historySize?: number;
  className?: string;
}) {
  if (process.env.NODE_ENV !== 'development' || !metrics) {
    return null;
  }

  // This would need a state to track history
  // Simplified version for now
  return (
    <div
      className={`fixed bottom-4 left-4 bg-black/90 backdrop-blur-sm rounded-lg p-4 ${className}`}
      style={{ pointerEvents: 'none' }}
    >
      <div className="text-white font-mono text-xs">
        <div className="text-white/60 mb-2">Frame Time Graph</div>
        <div className="text-sm">Coming soon...</div>
      </div>
    </div>
  );
}

export default PerformanceOverlay;
