/**
 * React Hook for WebGL Animation Performance Management
 *
 * Simplifies integration of AnimationPerformanceManager with React components.
 *
 * @example
 * ```tsx
 * const { quality, metrics, shouldRender, onFrameStart, onFrameEnd } = useAnimationPerformance({
 *   containerRef,
 *   glContextRef,
 *   onQualityChange: (quality) => updateAnimation(quality),
 * });
 * ```
 */

import { useEffect, useRef, useState, useCallback, RefObject } from 'react';
import {
  AnimationPerformanceManager,
  QualitySettings,
  FrameMetrics,
} from '@/lib/animation-performance';

export interface UseAnimationPerformanceOptions {
  /**
   * Ref to the container element (for Intersection Observer)
   */
  containerRef: RefObject<HTMLElement>;

  /**
   * Optional ref to WebGL context (for texture pooling)
   */
  glContextRef?: RefObject<WebGLRenderingContext | WebGL2RenderingContext>;

  /**
   * Callback when quality settings change
   */
  onQualityChange?: (quality: QualitySettings) => void;

  /**
   * Enable automatic initialization (default: true)
   */
  autoInit?: boolean;

  /**
   * Enable development overlay (default: false)
   */
  showDevOverlay?: boolean;
}

export interface UseAnimationPerformanceReturn {
  /**
   * Current quality settings
   */
  quality: QualitySettings | null;

  /**
   * Current performance metrics
   */
  metrics: FrameMetrics | null;

  /**
   * Whether animation should render this frame
   */
  shouldRender: () => boolean;

  /**
   * Call at start of each frame
   */
  onFrameStart: () => void;

  /**
   * Call at end of each frame
   */
  onFrameEnd: (deltaTime: number) => void;

  /**
   * Get texture pool (if available)
   */
  getTexturePool: () => any;

  /**
   * Manual re-initialization
   */
  reinitialize: () => void;

  /**
   * Is manager ready
   */
  isReady: boolean;
}

export function useAnimationPerformance(
  options: UseAnimationPerformanceOptions
): UseAnimationPerformanceReturn {
  const {
    containerRef,
    glContextRef,
    onQualityChange,
    autoInit = true,
    showDevOverlay = false,
  } = options;

  const managerRef = useRef<AnimationPerformanceManager | null>(null);
  const [quality, setQuality] = useState<QualitySettings | null>(null);
  const [metrics, setMetrics] = useState<FrameMetrics | null>(null);
  const [isReady, setIsReady] = useState(false);
  const frameCountRef = useRef(0);

  // Initialize performance manager
  const initialize = useCallback(() => {
    if (!containerRef.current) {
      console.warn('[useAnimationPerformance] Container ref not ready');
      return;
    }

    // Cleanup existing manager
    if (managerRef.current) {
      managerRef.current.destroy();
    }

    // Create new manager
    const manager = new AnimationPerformanceManager();
    managerRef.current = manager;

    // Initialize with quality callback
    const initialQuality = manager.initialize(
      containerRef.current,
      glContextRef?.current || undefined,
      (newQuality) => {
        setQuality(newQuality);
        if (onQualityChange) {
          onQualityChange(newQuality);
        }
      }
    );

    setQuality(initialQuality);
    setIsReady(true);

    console.log('[useAnimationPerformance] Initialized with quality:', initialQuality);
  }, [containerRef, glContextRef, onQualityChange]);

  // Auto-initialize on mount
  useEffect(() => {
    if (autoInit) {
      // Small delay to ensure refs are populated
      const timer = setTimeout(() => {
        initialize();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [autoInit, initialize]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (managerRef.current) {
        managerRef.current.destroy();
        managerRef.current = null;
      }
      setIsReady(false);
    };
  }, []);

  // Frame start
  const onFrameStart = useCallback(() => {
    managerRef.current?.onFrameStart();
  }, []);

  // Frame end
  const onFrameEnd = useCallback((deltaTime: number) => {
    managerRef.current?.onFrameEnd(deltaTime);

    // Update metrics every 30 frames
    frameCountRef.current++;
    if (frameCountRef.current % 30 === 0) {
      const newMetrics = managerRef.current?.getMetrics();
      if (newMetrics) {
        setMetrics(newMetrics);
      }
    }
  }, []);

  // Should render check
  const shouldRender = useCallback(() => {
    return managerRef.current?.shouldRender() ?? true;
  }, []);

  // Get texture pool
  const getTexturePool = useCallback(() => {
    return managerRef.current?.getTexturePool();
  }, []);

  return {
    quality,
    metrics,
    shouldRender,
    onFrameStart,
    onFrameEnd,
    getTexturePool,
    reinitialize: initialize,
    isReady,
  };
}

/**
 * Hook for simple FPS monitoring without full performance management
 *
 * @example
 * ```tsx
 * const { fps, averageFPS } = useFPSMonitor();
 * ```
 */
export function useFPSMonitor(historySize = 60) {
  const [fps, setFps] = useState(60);
  const [averageFPS, setAverageFPS] = useState(60);
  const fpsHistory = useRef<number[]>([]);
  const lastTime = useRef(performance.now());

  const recordFrame = useCallback(() => {
    const now = performance.now();
    const deltaTime = now - lastTime.current;
    lastTime.current = now;

    const currentFPS = 1000 / deltaTime;
    fpsHistory.current.push(currentFPS);

    if (fpsHistory.current.length > historySize) {
      fpsHistory.current.shift();
    }

    const avg =
      fpsHistory.current.reduce((sum, fps) => sum + fps, 0) / fpsHistory.current.length;

    setFps(currentFPS);
    setAverageFPS(avg);
  }, [historySize]);

  return { fps, averageFPS, recordFrame };
}

/**
 * Hook for visibility detection only
 *
 * @example
 * ```tsx
 * const { isVisible } = useAnimationVisibility(containerRef);
 * if (isVisible) {
 *   renderFrame();
 * }
 * ```
 */
export function useAnimationVisibility(
  elementRef: RefObject<HTMLElement>,
  threshold = 0.1
) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!elementRef.current) return;

    // Page visibility
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Intersection observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting);
        });
      },
      { threshold }
    );

    observer.observe(elementRef.current);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      observer.disconnect();
    };
  }, [elementRef, threshold]);

  return { isVisible };
}

/**
 * Hook for device capability detection
 *
 * @example
 * ```tsx
 * const { capability, isMobile } = useDeviceCapability();
 * if (capability === 'low') {
 *   useSimpleShader();
 * }
 * ```
 */
export function useDeviceCapability() {
  const [capability, setCapability] = useState<'high' | 'medium' | 'low'>('medium');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Dynamic import to avoid SSR issues
    import('@/lib/animation-performance').then(({ DeviceCapabilityDetector }) => {
      const detector = DeviceCapabilityDetector.getInstance();
      setCapability(detector.getDeviceCapability());
      setIsMobile(detector.isMobile());
    });
  }, []);

  return { capability, isMobile };
}
