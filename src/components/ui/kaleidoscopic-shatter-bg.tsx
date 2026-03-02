'use client';

import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
  type CSSProperties,
} from 'react';

// =============================================================================
// Types & Interfaces
// =============================================================================

/**
 * Intensity level for the kaleidoscopic shatter animation.
 * - 'low': Subtle, minimal particle count, slower transitions
 * - 'medium': Balanced visual impact with moderate performance
 * - 'high': Maximum visual impact, higher particle count
 */
export type IntensityLevel = 'low' | 'medium' | 'high';

/**
 * Fallback strategy when motion is reduced or WebGL unavailable.
 * - 'gradient': Animated or static CSS gradient
 * - 'static-image': Static background image
 */
export type ReduceMotionFallback = 'gradient' | 'static-image';

/**
 * WebGL context state for internal tracking.
 */
type WebGLContextState = 'initializing' | 'active' | 'lost' | 'restored' | 'unsupported';

/**
 * Props for the KaleidoscopicShatterBg component.
 */
export interface KaleidoscopicShatterBgProps {
  /** Content to render on top of the background */
  children?: ReactNode;
  /** Additional CSS classes for the container */
  className?: string;
  /** Animation intensity level */
  intensity?: IntensityLevel;
  /** Duration of one complete animation loop in seconds */
  loopDuration?: number;
  /** Fallback strategy for reduced motion or unsupported browsers */
  reduceMotionFallback?: ReduceMotionFallback;
  /** Custom static image URL for fallback */
  staticImageSrc?: string;
  /** Primary color for the animation (hex format) */
  primaryColor?: string;
  /** Secondary color for the animation (hex format) */
  secondaryColor?: string;
  /** Accent color for highlights (hex format) */
  accentColor?: string;
  /** Whether to show debug information */
  debug?: boolean;
  /** Callback when animation state changes */
  onStateChange?: (state: WebGLContextState) => void;
  /** Opacity of the gradient overlay (0-1) */
  overlayOpacity?: number;
}

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Checks if WebGL is supported in the current browser.
 * Tests for both WebGL 2 and WebGL 1 contexts.
 */
function checkWebGLSupport(): { supported: boolean; version: 1 | 2 | null } {
  if (typeof window === 'undefined') {
    return { supported: false, version: null };
  }

  try {
    const canvas = document.createElement('canvas');

    // Try WebGL 2 first
    const gl2 = canvas.getContext('webgl2');
    if (gl2) {
      return { supported: true, version: 2 };
    }

    // Fall back to WebGL 1
    const gl1 = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (gl1) {
      return { supported: true, version: 1 };
    }

    return { supported: false, version: null };
  } catch (e) {
    return { supported: false, version: null };
  }
}

/**
 * Checks if the user prefers reduced motion.
 */
function checkReducedMotion(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Converts hex color to RGB array.
 */
function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (result) {
    return [
      parseInt(result[1], 16) / 255,
      parseInt(result[2], 16) / 255,
      parseInt(result[3], 16) / 255,
    ];
  }
  return [0.2, 0.3, 0.5]; // Default fallback
}

/**
 * Maps intensity level to numerical configuration values.
 */
function getIntensityConfig(intensity: IntensityLevel) {
  const configs = {
    low: {
      particleCount: 50,
      shatterFragments: 12,
      animationSpeed: 0.5,
      blurAmount: 2,
    },
    medium: {
      particleCount: 100,
      shatterFragments: 24,
      animationSpeed: 1.0,
      blurAmount: 1,
    },
    high: {
      particleCount: 200,
      shatterFragments: 48,
      animationSpeed: 1.5,
      blurAmount: 0,
    },
  };
  return configs[intensity];
}

// =============================================================================
// WebGL Shaders
// =============================================================================

const VERTEX_SHADER = `
  attribute vec2 a_position;
  attribute vec2 a_texCoord;
  varying vec2 v_texCoord;

  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
    v_texCoord = a_texCoord;
  }
`;

const FRAGMENT_SHADER = `
  precision mediump float;

  varying vec2 v_texCoord;

  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec3 u_primaryColor;
  uniform vec3 u_secondaryColor;
  uniform vec3 u_accentColor;
  uniform float u_intensity;
  uniform float u_loopDuration;

  #define PI 3.14159265359
  #define TAU 6.28318530718

  // Pseudo-random function
  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }

  // 2D Noise
  float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  // Kaleidoscope transformation
  vec2 kaleidoscope(vec2 uv, float segments) {
    vec2 centered = uv - 0.5;
    float angle = atan(centered.y, centered.x);
    float radius = length(centered);

    float segmentAngle = TAU / segments;
    angle = mod(angle, segmentAngle);
    angle = abs(angle - segmentAngle * 0.5);

    return vec2(cos(angle), sin(angle)) * radius + 0.5;
  }

  // Shatter effect
  vec2 shatter(vec2 uv, float time, float fragments) {
    vec2 grid = floor(uv * fragments);
    vec2 localUV = fract(uv * fragments);

    float offset = random(grid) * 0.5;
    float phase = time * 0.5 + offset * TAU;

    vec2 displacement = vec2(
      sin(phase + random(grid + 1.0) * TAU) * 0.1,
      cos(phase + random(grid + 2.0) * TAU) * 0.1
    );

    float shatterPhase = sin(time * 0.3 + offset * PI) * 0.5 + 0.5;
    displacement *= shatterPhase * u_intensity;

    return uv + displacement;
  }

  // Fractal noise for organic movement
  float fbm(vec2 st) {
    float value = 0.0;
    float amplitude = 0.5;
    vec2 shift = vec2(100.0);
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));

    for (int i = 0; i < 5; i++) {
      value += amplitude * noise(st);
      st = rot * st * 2.0 + shift;
      amplitude *= 0.5;
    }
    return value;
  }

  void main() {
    vec2 uv = v_texCoord;
    float time = u_time / u_loopDuration;
    float loopTime = mod(time, 1.0) * TAU;

    // Apply kaleidoscope effect
    float segments = 6.0 + sin(loopTime * 0.5) * 2.0;
    vec2 kaleidoUV = kaleidoscope(uv, segments);

    // Apply shatter effect
    float fragmentCount = 8.0 + u_intensity * 8.0;
    vec2 shatterUV = shatter(kaleidoUV, loopTime, fragmentCount);

    // Create flowing color field
    float n1 = fbm(shatterUV * 3.0 + loopTime * 0.2);
    float n2 = fbm(shatterUV * 5.0 - loopTime * 0.15 + 10.0);
    float n3 = fbm(shatterUV * 2.0 + loopTime * 0.1 + 20.0);

    // Mix colors based on noise
    vec3 color = mix(u_primaryColor, u_secondaryColor, n1);
    color = mix(color, u_accentColor, n2 * 0.5);

    // Add prismatic highlights
    float prismatic = sin(n3 * PI * 4.0 + loopTime) * 0.5 + 0.5;
    vec3 highlight = vec3(prismatic, prismatic * 0.8, 1.0 - prismatic);
    color = mix(color, highlight, n3 * 0.3 * u_intensity);

    // Radial vignette
    float vignette = 1.0 - length(uv - 0.5) * 0.8;
    color *= vignette;

    // Gamma correction
    color = pow(color, vec3(0.8));

    gl_FragColor = vec4(color, 1.0);
  }
`;

// =============================================================================
// Custom Hooks
// =============================================================================

/**
 * Hook to detect user's reduced motion preference.
 * Listens for changes and updates accordingly.
 */
function useReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState<boolean>(false);

  useEffect(() => {
    // Check initial value
    setPrefersReduced(checkReducedMotion());

    // Listen for changes
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReduced(event.matches);
    };

    // Use addEventListener with fallback for older browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  return prefersReduced;
}

/**
 * Hook to manage WebGL context lifecycle.
 */
function useWebGLContext(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  enabled: boolean
) {
  const [contextState, setContextState] = useState<WebGLContextState>('initializing');
  const glRef = useRef<WebGLRenderingContext | WebGL2RenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);

  useEffect(() => {
    if (!enabled || !canvasRef.current) {
      setContextState('unsupported');
      return;
    }

    const canvas = canvasRef.current;

    // Initialize WebGL context
    const initContext = () => {
      const { supported, version } = checkWebGLSupport();

      if (!supported) {
        setContextState('unsupported');
        return;
      }

      try {
        const contextOptions: WebGLContextAttributes = {
          alpha: true,
          antialias: true,
          premultipliedAlpha: false,
          preserveDrawingBuffer: false,
          powerPreference: 'high-performance',
        };

        const gl = version === 2
          ? canvas.getContext('webgl2', contextOptions)
          : canvas.getContext('webgl', contextOptions) ||
            canvas.getContext('experimental-webgl', contextOptions);

        if (!gl) {
          setContextState('unsupported');
          return;
        }

        glRef.current = gl as WebGLRenderingContext;
        setContextState('active');
      } catch (e) {
        console.error('WebGL initialization failed:', e);
        setContextState('unsupported');
      }
    };

    // Handle context loss
    const handleContextLost = (event: Event) => {
      event.preventDefault();
      setContextState('lost');
      glRef.current = null;
      programRef.current = null;
    };

    // Handle context restoration
    const handleContextRestored = () => {
      setContextState('restored');
      initContext();
    };

    canvas.addEventListener('webglcontextlost', handleContextLost as EventListener);
    canvas.addEventListener('webglcontextrestored', handleContextRestored as EventListener);

    initContext();

    return () => {
      canvas.removeEventListener('webglcontextlost', handleContextLost as EventListener);
      canvas.removeEventListener('webglcontextrestored', handleContextRestored as EventListener);

      // Clean up WebGL resources
      if (glRef.current && programRef.current) {
        glRef.current.deleteProgram(programRef.current);
      }
      glRef.current = null;
      programRef.current = null;
    };
  }, [canvasRef, enabled]);

  return {
    gl: glRef,
    program: programRef,
    contextState,
  };
}

// =============================================================================
// Fallback Components
// =============================================================================

/**
 * CSS Gradient fallback component.
 * Uses CSS custom properties for dynamic color values with prefers-reduced-motion support.
 */
function GradientFallback({
  primaryColor,
  secondaryColor,
  accentColor,
  animated = false,
}: {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  animated?: boolean;
}) {
  const gradientStyle: CSSProperties = {
    '--gradient-primary': primaryColor,
    '--gradient-secondary': secondaryColor,
    '--gradient-accent': accentColor,
    background: `
      radial-gradient(ellipse at 20% 20%, ${primaryColor}40 0%, transparent 50%),
      radial-gradient(ellipse at 80% 80%, ${secondaryColor}40 0%, transparent 50%),
      radial-gradient(ellipse at 50% 50%, ${accentColor}30 0%, transparent 70%),
      linear-gradient(135deg, ${primaryColor}20 0%, ${secondaryColor}30 50%, ${accentColor}20 100%)
    `,
  } as CSSProperties;

  // For animated gradients, we use a subtle transform animation
  // that respects prefers-reduced-motion via Tailwind's motion-safe/motion-reduce
  return (
    <div
      className={`absolute inset-0 w-full h-full ${
        animated
          ? 'motion-safe:animate-pulse motion-safe:[animation-duration:10s]'
          : ''
      }`}
      style={gradientStyle}
      aria-hidden="true"
    />
  );
}

/**
 * Static image fallback component.
 */
function StaticImageFallback({
  src,
  alt = 'Background',
}: {
  src: string;
  alt?: string;
}) {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden" aria-hidden="true">
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover opacity-60"
        loading="lazy"
      />
    </div>
  );
}

// =============================================================================
// Main Component
// =============================================================================

/**
 * KaleidoscopicShatterBg - A WebGL-powered background animation component
 * featuring kaleidoscopic patterns with shattering transitions.
 *
 * Features:
 * - WebGL 2/1 support with automatic fallback
 * - Respects prefers-reduced-motion
 * - SSR compatible (no window access during render)
 * - Automatic canvas resizing via ResizeObserver
 * - Context loss handling and recovery
 * - Configurable intensity and colors
 *
 * @example
 * ```tsx
 * <KaleidoscopicShatterBg intensity="medium" loopDuration={30}>
 *   <h1>Your Content Here</h1>
 * </KaleidoscopicShatterBg>
 * ```
 */
export function KaleidoscopicShatterBg({
  children,
  className = '',
  intensity = 'medium',
  loopDuration = 30,
  reduceMotionFallback = 'gradient',
  staticImageSrc = '/kaleidoscopic-fallback.jpg',
  primaryColor = '#384F84',
  secondaryColor = '#1E3A8A',
  accentColor = '#C8B496',
  debug = false,
  onStateChange,
  overlayOpacity = 0.85,
}: KaleidoscopicShatterBgProps) {
  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const uniformLocationsRef = useRef<Record<string, WebGLUniformLocation | null>>({});

  // State
  const [isMounted, setIsMounted] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  // Hooks
  const prefersReducedMotion = useReducedMotion();
  const shouldRenderWebGL = isMounted && !prefersReducedMotion;

  const { gl, program, contextState } = useWebGLContext(canvasRef, shouldRenderWebGL);

  // Memoized values
  const intensityConfig = useMemo(() => getIntensityConfig(intensity), [intensity]);

  const colors = useMemo(() => ({
    primary: hexToRgb(primaryColor),
    secondary: hexToRgb(secondaryColor),
    accent: hexToRgb(accentColor),
  }), [primaryColor, secondaryColor, accentColor]);

  // Effect: Mount detection (SSR safety)
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Effect: Notify state changes
  useEffect(() => {
    onStateChange?.(contextState);
  }, [contextState, onStateChange]);

  // Effect: Canvas resize handling
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        const dpr = Math.min(window.devicePixelRatio || 1, 2); // Cap at 2x for performance

        setCanvasSize({
          width: Math.floor(width * dpr),
          height: Math.floor(height * dpr),
        });

        if (canvasRef.current) {
          canvasRef.current.width = Math.floor(width * dpr);
          canvasRef.current.height = Math.floor(height * dpr);
          canvasRef.current.style.width = `${width}px`;
          canvasRef.current.style.height = `${height}px`;
        }
      }
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Shader compilation helper
  const compileShader = useCallback((
    glContext: WebGLRenderingContext,
    source: string,
    type: number
  ): WebGLShader | null => {
    const shader = glContext.createShader(type);
    if (!shader) return null;

    glContext.shaderSource(shader, source);
    glContext.compileShader(shader);

    if (!glContext.getShaderParameter(shader, glContext.COMPILE_STATUS)) {
      console.error('Shader compilation error:', glContext.getShaderInfoLog(shader));
      glContext.deleteShader(shader);
      return null;
    }

    return shader;
  }, []);

  // Effect: WebGL setup and animation loop
  useEffect(() => {
    if (!shouldRenderWebGL || contextState !== 'active' || !gl.current || !canvasRef.current) {
      return;
    }

    const glContext = gl.current;
    const canvas = canvasRef.current;

    // Compile shaders
    const vertexShader = compileShader(glContext, VERTEX_SHADER, glContext.VERTEX_SHADER);
    const fragmentShader = compileShader(glContext, FRAGMENT_SHADER, glContext.FRAGMENT_SHADER);

    if (!vertexShader || !fragmentShader) {
      console.error('Failed to compile shaders');
      return;
    }

    // Create program
    const shaderProgram = glContext.createProgram();
    if (!shaderProgram) return;

    glContext.attachShader(shaderProgram, vertexShader);
    glContext.attachShader(shaderProgram, fragmentShader);
    glContext.linkProgram(shaderProgram);

    if (!glContext.getProgramParameter(shaderProgram, glContext.LINK_STATUS)) {
      console.error('Program linking error:', glContext.getProgramInfoLog(shaderProgram));
      return;
    }

    program.current = shaderProgram;
    glContext.useProgram(shaderProgram);

    // Set up geometry (fullscreen quad)
    const positions = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
       1,  1,
    ]);

    const texCoords = new Float32Array([
      0, 0,
      1, 0,
      0, 1,
      1, 1,
    ]);

    // Position buffer
    const positionBuffer = glContext.createBuffer();
    glContext.bindBuffer(glContext.ARRAY_BUFFER, positionBuffer);
    glContext.bufferData(glContext.ARRAY_BUFFER, positions, glContext.STATIC_DRAW);

    const positionLocation = glContext.getAttribLocation(shaderProgram, 'a_position');
    glContext.enableVertexAttribArray(positionLocation);
    glContext.vertexAttribPointer(positionLocation, 2, glContext.FLOAT, false, 0, 0);

    // Texture coordinate buffer
    const texCoordBuffer = glContext.createBuffer();
    glContext.bindBuffer(glContext.ARRAY_BUFFER, texCoordBuffer);
    glContext.bufferData(glContext.ARRAY_BUFFER, texCoords, glContext.STATIC_DRAW);

    const texCoordLocation = glContext.getAttribLocation(shaderProgram, 'a_texCoord');
    glContext.enableVertexAttribArray(texCoordLocation);
    glContext.vertexAttribPointer(texCoordLocation, 2, glContext.FLOAT, false, 0, 0);

    // Get uniform locations
    uniformLocationsRef.current = {
      time: glContext.getUniformLocation(shaderProgram, 'u_time'),
      resolution: glContext.getUniformLocation(shaderProgram, 'u_resolution'),
      primaryColor: glContext.getUniformLocation(shaderProgram, 'u_primaryColor'),
      secondaryColor: glContext.getUniformLocation(shaderProgram, 'u_secondaryColor'),
      accentColor: glContext.getUniformLocation(shaderProgram, 'u_accentColor'),
      intensity: glContext.getUniformLocation(shaderProgram, 'u_intensity'),
      loopDuration: glContext.getUniformLocation(shaderProgram, 'u_loopDuration'),
    };

    // Set static uniforms
    const uniforms = uniformLocationsRef.current;
    glContext.uniform3fv(uniforms.primaryColor, colors.primary);
    glContext.uniform3fv(uniforms.secondaryColor, colors.secondary);
    glContext.uniform3fv(uniforms.accentColor, colors.accent);
    glContext.uniform1f(uniforms.intensity, intensityConfig.animationSpeed);
    glContext.uniform1f(uniforms.loopDuration, loopDuration);

    // Animation loop
    startTimeRef.current = performance.now();

    const render = (timestamp: number) => {
      if (!gl.current || contextState !== 'active') return;

      const elapsed = (timestamp - startTimeRef.current) / 1000;

      // Update viewport
      glContext.viewport(0, 0, canvas.width, canvas.height);

      // Update uniforms
      glContext.uniform1f(uniforms.time, elapsed);
      glContext.uniform2f(uniforms.resolution, canvas.width, canvas.height);

      // Clear and draw
      glContext.clearColor(0, 0, 0, 1);
      glContext.clear(glContext.COLOR_BUFFER_BIT);
      glContext.drawArrays(glContext.TRIANGLE_STRIP, 0, 4);

      animationFrameRef.current = requestAnimationFrame(render);
    };

    animationFrameRef.current = requestAnimationFrame(render);

    // Cleanup
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }

      // Clean up buffers
      glContext.deleteBuffer(positionBuffer);
      glContext.deleteBuffer(texCoordBuffer);
      glContext.deleteShader(vertexShader);
      glContext.deleteShader(fragmentShader);
    };
  }, [
    shouldRenderWebGL,
    contextState,
    gl,
    program,
    colors,
    intensityConfig,
    loopDuration,
    compileShader,
  ]);

  // Determine what to render
  const showWebGL = shouldRenderWebGL && contextState === 'active';
  const showFallback = !isMounted || prefersReducedMotion || contextState === 'unsupported' || contextState === 'lost';

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden ${className}`}
    >
      {/* WebGL Canvas Layer */}
      {shouldRenderWebGL && (
        <canvas
          ref={canvasRef}
          className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${
            showWebGL ? 'opacity-100' : 'opacity-0'
          }`}
          aria-hidden="true"
        />
      )}

      {/* Fallback Layer */}
      {showFallback && (
        <>
          {reduceMotionFallback === 'gradient' ? (
            <GradientFallback
              primaryColor={primaryColor}
              secondaryColor={secondaryColor}
              accentColor={accentColor}
              animated={!prefersReducedMotion}
            />
          ) : (
            <StaticImageFallback src={staticImageSrc} />
          )}
        </>
      )}

      {/* Enterprise Legibility Overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(
            to bottom,
            rgba(17, 17, 17, ${overlayOpacity * 0.9}) 0%,
            rgba(17, 17, 17, ${overlayOpacity}) 50%,
            rgba(17, 17, 17, 1) 100%
          )`,
        }}
        aria-hidden="true"
      />

      {/* Radial Vignette Overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, transparent 0%, rgba(17, 17, 17, 0.8) 100%)',
        }}
        aria-hidden="true"
      />

      {/* Content Layer */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>

      {/* Debug Info */}
      {debug && (
        <div className="absolute top-4 left-4 z-50 p-3 bg-black/80 text-white font-mono text-xs rounded">
          <div>State: {contextState}</div>
          <div>Canvas: {canvasSize.width} x {canvasSize.height}</div>
          <div>Reduced Motion: {prefersReducedMotion ? 'Yes' : 'No'}</div>
          <div>Intensity: {intensity}</div>
          <div>Loop Duration: {loopDuration}s</div>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// Named Exports
// =============================================================================

export default KaleidoscopicShatterBg;
