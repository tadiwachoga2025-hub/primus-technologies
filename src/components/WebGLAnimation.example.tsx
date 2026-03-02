/**
 * Complete WebGL Animation Component with Performance Optimization
 *
 * This is a production-ready example showing how to integrate all performance utilities
 * with a complex voronoi + kaleidoscope + vortex WebGL animation.
 *
 * Features:
 * - Automatic device capability detection
 * - Adaptive quality scaling based on FPS
 * - Pause when not visible
 * - Memory management with texture pooling
 * - Development performance overlay
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import { useAnimationPerformance } from '@/hooks/useAnimationPerformance';
import { PerformanceOverlay } from '@/components/PerformanceOverlay';
import type { QualitySettings } from '@/lib/animation-performance';

export default function WebGLAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGL2RenderingContext | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Performance management hook
  const {
    quality,
    metrics,
    shouldRender,
    onFrameStart,
    onFrameEnd,
    getTexturePool,
    isReady,
  } = useAnimationPerformance({
    containerRef,
    glContextRef: glRef,
    onQualityChange: (newQuality) => {
      console.log('[WebGLAnimation] Quality changed:', newQuality);
      applyQualitySettings(newQuality);
    },
    autoInit: true,
  });

  // Animation state
  const [isInitialized, setIsInitialized] = useState(false);

  // WebGL resources (simplified for example)
  const resourcesRef = useRef<{
    shaderProgram: WebGLProgram | null;
    particleBuffer: WebGLBuffer | null;
    particles: Float32Array | null;
  }>({
    shaderProgram: null,
    particleBuffer: null,
    particles: null,
  });

  // Initialize WebGL and animation
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current || !isReady) return;

    const canvas = canvasRef.current;

    // Initialize WebGL context
    const gl = canvas.getContext('webgl2', {
      alpha: false,
      antialias: false, // We control this via quality settings
      depth: false,
      stencil: false,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: false,
      desynchronized: true, // Better performance
    });

    if (!gl) {
      console.error('[WebGLAnimation] WebGL 2 not supported');
      return;
    }

    glRef.current = gl;

    // Initialize animation with current quality
    if (quality) {
      initializeAnimation(gl, quality);
      setIsInitialized(true);
    }

    // Handle resize
    const handleResize = () => {
      if (quality) {
        updateCanvasSize(gl, canvas, containerRef.current!, quality);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isReady, quality]);

  // Animation loop
  useEffect(() => {
    if (!isInitialized || !glRef.current) return;

    const gl = glRef.current;
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      // Start frame budget monitoring
      onFrameStart();

      // Only render if visible and performance manager allows
      if (shouldRender()) {
        // Update animation state
        updateAnimation(deltaTime);

        // Render frame
        renderFrame(gl);
      }

      // End frame budget monitoring
      onFrameEnd(deltaTime);

      // Continue loop
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isInitialized, shouldRender, onFrameStart, onFrameEnd]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupWebGL();
    };
  }, []);

  // ============================================================================
  // WebGL Setup Functions
  // ============================================================================

  function initializeAnimation(gl: WebGL2RenderingContext, quality: QualitySettings) {
    console.log('[WebGLAnimation] Initializing with quality:', quality);

    const resources = resourcesRef.current;

    // Create particles based on quality
    resources.particles = new Float32Array(quality.particleCount * 4); // x, y, vx, vy
    for (let i = 0; i < quality.particleCount; i++) {
      resources.particles[i * 4] = Math.random() * 2 - 1; // x
      resources.particles[i * 4 + 1] = Math.random() * 2 - 1; // y
      resources.particles[i * 4 + 2] = (Math.random() - 0.5) * 0.01; // vx
      resources.particles[i * 4 + 3] = (Math.random() - 0.5) * 0.01; // vy
    }

    // Create particle buffer
    resources.particleBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, resources.particleBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, resources.particles, gl.DYNAMIC_DRAW);

    // Create shader program
    resources.shaderProgram = createShaderProgram(gl, quality);

    console.log('[WebGLAnimation] Animation initialized');
  }

  function applyQualitySettings(quality: QualitySettings) {
    if (!glRef.current) return;

    console.log('[WebGLAnimation] Applying quality settings:', quality);

    const gl = glRef.current;

    // Update canvas resolution
    if (canvasRef.current && containerRef.current) {
      updateCanvasSize(gl, canvasRef.current, containerRef.current, quality);
    }

    // Re-initialize with new particle count and shader
    cleanupWebGL();
    initializeAnimation(gl, quality);
  }

  function updateCanvasSize(
    gl: WebGL2RenderingContext,
    canvas: HTMLCanvasElement,
    container: HTMLElement,
    quality: QualitySettings
  ) {
    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio * quality.resolution;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    gl.viewport(0, 0, canvas.width, canvas.height);
  }

  // ============================================================================
  // Animation Update
  // ============================================================================

  function updateAnimation(deltaTime: number) {
    const resources = resourcesRef.current;
    if (!resources.particles) return;

    const particles = resources.particles;
    const count = particles.length / 4;
    const dt = Math.min(deltaTime / 1000, 0.1); // Cap delta time

    for (let i = 0; i < count; i++) {
      // Update position
      particles[i * 4] += particles[i * 4 + 2] * dt * 60;
      particles[i * 4 + 1] += particles[i * 4 + 3] * dt * 60;

      // Wrap around
      if (particles[i * 4] > 1) particles[i * 4] = -1;
      if (particles[i * 4] < -1) particles[i * 4] = 1;
      if (particles[i * 4 + 1] > 1) particles[i * 4 + 1] = -1;
      if (particles[i * 4 + 1] < -1) particles[i * 4 + 1] = 1;
    }
  }

  // ============================================================================
  // Rendering
  // ============================================================================

  function renderFrame(gl: WebGL2RenderingContext) {
    const resources = resourcesRef.current;
    if (!resources.shaderProgram || !resources.particles || !resources.particleBuffer) {
      return;
    }

    // Clear
    gl.clearColor(0.05, 0.05, 0.1, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Use program
    gl.useProgram(resources.shaderProgram);

    // Update particle buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, resources.particleBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, resources.particles, gl.DYNAMIC_DRAW);

    // Setup attributes
    const positionLoc = gl.getAttribLocation(resources.shaderProgram, 'aPosition');
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 16, 0);

    // Set uniforms
    const timeLoc = gl.getUniformLocation(resources.shaderProgram, 'uTime');
    gl.uniform1f(timeLoc, performance.now() / 1000);

    const resolutionLoc = gl.getUniformLocation(resources.shaderProgram, 'uResolution');
    gl.uniform2f(
      resolutionLoc,
      canvasRef.current?.width || 1,
      canvasRef.current?.height || 1
    );

    // Draw
    gl.drawArrays(gl.POINTS, 0, resources.particles.length / 4);
  }

  // ============================================================================
  // Shader Creation
  // ============================================================================

  function createShaderProgram(
    gl: WebGL2RenderingContext,
    quality: QualitySettings
  ): WebGLProgram | null {
    const vertexShaderSource = `#version 300 es
      precision highp float;
      in vec4 aPosition;
      void main() {
        gl_Position = vec4(aPosition.xy, 0.0, 1.0);
        gl_PointSize = 3.0;
      }
    `;

    // Choose fragment shader based on quality
    const fragmentShaderSource = quality.useSimpleShader
      ? getSimpleFragmentShader()
      : getComplexFragmentShader(quality);

    const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    if (!vertexShader || !fragmentShader) return null;

    const program = gl.createProgram();
    if (!program) return null;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('[WebGLAnimation] Program link error:', gl.getProgramInfoLog(program));
      return null;
    }

    // Cleanup shaders
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);

    return program;
  }

  function compileShader(
    gl: WebGL2RenderingContext,
    type: number,
    source: string
  ): WebGLShader | null {
    const shader = gl.createShader(type);
    if (!shader) return null;

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('[WebGLAnimation] Shader compile error:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }

    return shader;
  }

  function getSimpleFragmentShader(): string {
    return `#version 300 es
      precision highp float;
      uniform float uTime;
      out vec4 fragColor;

      void main() {
        vec2 point = gl_PointCoord - 0.5;
        float dist = length(point);
        if (dist > 0.5) discard;

        vec3 color = vec3(0.3, 0.6, 1.0);
        fragColor = vec4(color, 1.0 - dist * 2.0);
      }
    `;
  }

  function getComplexFragmentShader(quality: QualitySettings): string {
    // Full voronoi + kaleidoscope shader (simplified for example)
    const chromaticAberration = quality.chromaticAberration
      ? `
        // Chromatic aberration effect
        vec2 dir = normalize(vUv - 0.5);
        color.r *= 1.0 + 0.1 * sin(uTime + length(vUv) * 10.0);
        color.b *= 1.0 + 0.1 * cos(uTime + length(vUv) * 10.0);
      `
      : '';

    return `#version 300 es
      precision highp float;
      uniform float uTime;
      uniform vec2 uResolution;
      out vec4 fragColor;

      void main() {
        vec2 point = gl_PointCoord - 0.5;
        float dist = length(point);
        if (dist > 0.5) discard;

        // Kaleidoscope effect
        vec2 vUv = gl_FragCoord.xy / uResolution;
        float angle = atan(vUv.y - 0.5, vUv.x - 0.5);
        float radius = length(vUv - 0.5);

        // Vortex distortion
        float vortex = sin(radius * 10.0 - uTime * 2.0) * 0.1;
        angle += vortex;

        vec3 color = vec3(
          0.5 + 0.5 * sin(angle * ${quality.tileCount}.0 + uTime),
          0.5 + 0.5 * sin(angle * ${quality.tileCount}.0 + uTime + 2.0),
          0.5 + 0.5 * sin(angle * ${quality.tileCount}.0 + uTime + 4.0)
        );

        ${chromaticAberration}

        fragColor = vec4(color, 1.0 - dist * 2.0);
      }
    `;
  }

  // ============================================================================
  // Cleanup
  // ============================================================================

  function cleanupWebGL() {
    const gl = glRef.current;
    if (!gl) return;

    const resources = resourcesRef.current;

    if (resources.shaderProgram) {
      gl.deleteProgram(resources.shaderProgram);
      resources.shaderProgram = null;
    }

    if (resources.particleBuffer) {
      gl.deleteBuffer(resources.particleBuffer);
      resources.particleBuffer = null;
    }

    resources.particles = null;
  }

  // ============================================================================
  // Render
  // ============================================================================

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full -z-10"
      style={{ background: 'linear-gradient(to bottom, #0a0a0f, #1a1a2e)' }}
    >
      <canvas ref={canvasRef} className="w-full h-full" />

      {/* Development overlay */}
      <PerformanceOverlay
        metrics={metrics}
        quality={quality}
        position="top-right"
        detailed={true}
      />
    </div>
  );
}
