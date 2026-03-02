/**
 * Example: How to integrate AnimationPerformance with your WebGL animation
 *
 * This shows the complete integration for a heavy voronoi + kaleidoscope animation
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import {
  AnimationPerformanceManager,
  QualitySettings,
  FrameMetrics,
} from './animation-performance';

export default function OptimizedWebGLAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const performanceManagerRef = useRef<AnimationPerformanceManager | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const [qualitySettings, setQualitySettings] = useState<QualitySettings | null>(null);
  const [metrics, setMetrics] = useState<FrameMetrics | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;

    // Initialize WebGL context
    const gl = canvas.getContext('webgl2', {
      alpha: false,
      antialias: false, // We'll control this via quality settings
      depth: false,
      stencil: false,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: false,
    });

    if (!gl) {
      console.error('WebGL 2 not supported');
      return;
    }

    // Initialize performance manager
    const perfManager = new AnimationPerformanceManager();
    performanceManagerRef.current = perfManager;

    // Initialize with quality callback
    const initialQuality = perfManager.initialize(
      container,
      gl,
      (newQuality) => {
        console.log('Quality adjusted:', newQuality);
        setQualitySettings(newQuality);
        // Apply quality changes to your animation
        applyQualitySettings(newQuality);
      }
    );

    setQualitySettings(initialQuality);

    // Setup canvas size based on quality
    const updateCanvasSize = () => {
      const quality = perfManager.getCurrentQuality();
      if (!quality) return;

      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio * quality.resolution;

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    // Animation state
    let lastTime = performance.now();
    let shaderProgram: WebGLProgram | null = null;
    let particleBuffer: WebGLBuffer | null = null;
    let particles: Float32Array | null = null;

    // Initialize animation resources based on quality
    const initializeAnimation = (quality: QualitySettings) => {
      // Create particles based on quality settings
      particles = new Float32Array(quality.particleCount * 4); // x, y, vx, vy
      for (let i = 0; i < quality.particleCount; i++) {
        particles[i * 4] = Math.random() * 2 - 1;
        particles[i * 4 + 1] = Math.random() * 2 - 1;
        particles[i * 4 + 2] = (Math.random() - 0.5) * 0.01;
        particles[i * 4 + 3] = (Math.random() - 0.5) * 0.01;
      }

      // Create particle buffer
      particleBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, particleBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, particles, gl.DYNAMIC_DRAW);

      // Create shader program (simplified for example)
      shaderProgram = createShaderProgram(gl, quality);
    };

    const applyQualitySettings = (quality: QualitySettings) => {
      // Re-initialize with new quality
      cleanup();
      initializeAnimation(quality);
      updateCanvasSize();
    };

    initializeAnimation(initialQuality);

    // Main animation loop
    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      // Frame budget monitoring
      perfManager.onFrameStart();

      // Check if we should render (visibility check)
      if (perfManager.shouldRender() && shaderProgram && particles) {
        // Update particles
        updateParticles(particles, deltaTime);

        // Render frame
        renderFrame(gl, shaderProgram, particleBuffer!, particles, qualitySettings!);
      }

      // Frame budget end
      perfManager.onFrameEnd(deltaTime);

      // Update metrics (every 30 frames)
      if (Math.random() < 0.033) {
        const newMetrics = perfManager.getMetrics();
        if (newMetrics) {
          setMetrics(newMetrics);
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    // Cleanup
    const cleanup = () => {
      if (shaderProgram) {
        gl.deleteProgram(shaderProgram);
        shaderProgram = null;
      }
      if (particleBuffer) {
        gl.deleteBuffer(particleBuffer);
        particleBuffer = null;
      }
    };

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      cleanup();
      perfManager.destroy();
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full -z-10"
      style={{ background: '#000' }}
    >
      <canvas ref={canvasRef} className="w-full h-full" />

      {/* Performance overlay (dev only) */}
      {process.env.NODE_ENV === 'development' && metrics && qualitySettings && (
        <div className="fixed top-4 right-4 bg-black/80 text-white p-4 rounded font-mono text-xs">
          <div>FPS: {metrics.fps.toFixed(1)}</div>
          <div>Avg FPS: {metrics.averageFPS.toFixed(1)}</div>
          <div>Frame Time: {metrics.frameTime.toFixed(2)}ms</div>
          <div>Dropped: {metrics.droppedFrames}</div>
          <div className="mt-2 border-t border-white/20 pt-2">
            <div>Resolution: {(qualitySettings.resolution * 100).toFixed(0)}%</div>
            <div>Particles: {qualitySettings.particleCount}</div>
            <div>Bloom: {qualitySettings.bloomQuality}</div>
            <div>CA: {qualitySettings.chromaticAberration ? 'ON' : 'OFF'}</div>
            <div>Tiles: {qualitySettings.tileCount}x{qualitySettings.tileCount}</div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Helper Functions (Simplified for Example)
// ============================================================================

function createShaderProgram(
  gl: WebGL2RenderingContext,
  quality: QualitySettings
): WebGLProgram | null {
  // Choose shader based on quality
  const vertexShaderSource = `#version 300 es
    in vec4 aPosition;
    void main() {
      gl_Position = aPosition;
      gl_PointSize = 2.0;
    }
  `;

  const fragmentShaderSource = quality.useSimpleShader
    ? getSimpleFragmentShader(quality)
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
    console.error('Program link error:', gl.getProgramInfoLog(program));
    return null;
  }

  return program;
}

function getSimpleFragmentShader(quality: QualitySettings): string {
  return `#version 300 es
    precision highp float;
    out vec4 fragColor;
    void main() {
      fragColor = vec4(0.5, 0.7, 1.0, 1.0);
    }
  `;
}

function getComplexFragmentShader(quality: QualitySettings): string {
  // Full voronoi + kaleidoscope + vortex shader
  const chromaticAberration = quality.chromaticAberration
    ? `
      // Chromatic aberration
      vec2 dir = normalize(vUv - 0.5);
      vec3 color;
      color.r = texture(uTexture, vUv + dir * 0.005).r;
      color.g = texture(uTexture, vUv).g;
      color.b = texture(uTexture, vUv - dir * 0.005).b;
    `
    : `
      vec3 color = texture(uTexture, vUv).rgb;
    `;

  return `#version 300 es
    precision highp float;
    uniform float uTime;
    uniform vec2 uResolution;
    out vec4 fragColor;

    void main() {
      vec2 vUv = gl_FragCoord.xy / uResolution;

      // Voronoi + kaleidoscope logic here
      ${chromaticAberration}

      fragColor = vec4(color, 1.0);
    }
  `;
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
    console.error('Shader compile error:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function updateParticles(particles: Float32Array, deltaTime: number): void {
  const count = particles.length / 4;
  for (let i = 0; i < count; i++) {
    particles[i * 4] += particles[i * 4 + 2] * deltaTime;
    particles[i * 4 + 1] += particles[i * 4 + 3] * deltaTime;

    // Wrap around
    if (particles[i * 4] > 1) particles[i * 4] = -1;
    if (particles[i * 4] < -1) particles[i * 4] = 1;
    if (particles[i * 4 + 1] > 1) particles[i * 4 + 1] = -1;
    if (particles[i * 4 + 1] < -1) particles[i * 4 + 1] = 1;
  }
}

function renderFrame(
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  buffer: WebGLBuffer,
  particles: Float32Array,
  quality: QualitySettings
): void {
  gl.useProgram(program);

  // Clear
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Update buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, particles, gl.DYNAMIC_DRAW);

  // Draw
  const positionLoc = gl.getAttribLocation(program, 'aPosition');
  gl.enableVertexAttribArray(positionLoc);
  gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 16, 0);

  gl.drawArrays(gl.POINTS, 0, particles.length / 4);
}
