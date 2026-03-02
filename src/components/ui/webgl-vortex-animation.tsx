"use client";
import React, { useRef, useEffect, useState } from "react";

/**
 * WebGLVortexAnimation
 *
 * High-performance WebGL2 implementation with custom fragment shaders.
 * Provides superior visual quality and 60fps performance on all devices.
 *
 * Falls back to Canvas2D on unsupported browsers.
 */

// Vertex Shader - positions texture across viewport
const VERTEX_SHADER = `#version 300 es
in vec2 a_position;
out vec2 v_texCoord;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
  v_texCoord = (a_position + 1.0) / 2.0;
  v_texCoord.y = 1.0 - v_texCoord.y; // Flip Y
}
`;

// Fragment Shader - implements all 5 animation stages
const FRAGMENT_SHADER = `#version 300 es
precision highp float;

in vec2 v_texCoord;
out vec4 fragColor;

uniform sampler2D u_texture;
uniform float u_time;
uniform vec2 u_resolution;
uniform float u_progress;

// Pseudo-random hash function
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

// Voronoi distance for shattering effect
vec2 voronoi(vec2 x) {
  vec2 p = floor(x);
  vec2 f = fract(x);

  float minDist = 1.0;
  vec2 minPoint;

  for (int j = -1; j <= 1; j++) {
    for (int i = -1; i <= 1; i++) {
      vec2 b = vec2(float(i), float(j));
      vec2 r = b + vec2(hash(p + b), hash(p + b + vec2(0.1))) - f;
      float d = length(r);

      if (d < minDist) {
        minDist = d;
        minPoint = p + b;
      }
    }
  }

  return minPoint;
}

// Rotation matrix
mat2 rotate(float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat2(c, -s, s, c);
}

// Easing functions
float easeOutCubic(float t) {
  return 1.0 - pow(1.0 - t, 3.0);
}

float easeInCubic(float t) {
  return t * t * t;
}

float easeInOutCubic(float t) {
  return t < 0.5 ? 4.0 * t * t * t : 1.0 - pow(-2.0 * t + 2.0, 3.0) / 2.0;
}

void main() {
  vec2 uv = v_texCoord;
  vec2 center = vec2(0.5, 0.5);

  // Determine current stage based on progress
  float stage1 = smoothstep(0.0, 0.077, u_progress) - smoothstep(0.077, 0.154, u_progress);
  float stage2 = smoothstep(0.154, 0.231, u_progress) - smoothstep(0.308, 0.385, u_progress);
  float stage3 = smoothstep(0.385, 0.462, u_progress) - smoothstep(0.615, 0.692, u_progress);
  float stage4 = smoothstep(0.692, 0.731, u_progress) - smoothstep(0.769, 0.808, u_progress);
  float stage5 = smoothstep(0.846, 0.885, u_progress) - smoothstep(1.0, 1.0, u_progress);

  vec4 color = vec4(0.0);

  // STAGE 1: Polygonal Shattering
  if (stage1 > 0.0) {
    float stageProgress = (u_progress - 0.0) / 0.077;
    stageProgress = easeOutCubic(stageProgress);

    // Voronoi cell calculation
    vec2 voronoiScale = vec2(15.0, 10.0);
    vec2 voronoiUV = uv * voronoiScale;
    vec2 cellPoint = voronoi(voronoiUV);

    // Random offset and rotation per cell
    float cellHash = hash(cellPoint);
    vec2 offset = (vec2(hash(cellPoint), hash(cellPoint + vec2(0.3))) - 0.5) * stageProgress * 0.3;
    float rotation = cellHash * 6.28318 * stageProgress * 0.5;

    // Apply transformation
    vec2 centeredUV = uv - center;
    centeredUV = rotate(rotation) * centeredUV;
    vec2 sampledUV = centeredUV + center + offset;

    color = texture(u_texture, sampledUV);

    // Add edge highlights
    float edgeGlow = step(0.02, fract(voronoiUV).x) * step(0.02, fract(voronoiUV).y);
    color.rgb += vec3(1.0 - edgeGlow) * 0.3 * stage1;

    color.a = 1.0 - stageProgress * 0.3;
  }

  // STAGE 2: Mosaic Tiling
  else if (stage2 > 0.0) {
    float stageProgress = (u_progress - 0.154) / 0.154;
    stageProgress = easeInOutCubic(stageProgress);

    // Grid size increases from 4 to 8
    float gridSize = 4.0 + stageProgress * 4.0;
    vec2 gridUV = fract(uv * gridSize);

    // Kaleidoscope mirror effect
    vec2 grid = floor(uv * gridSize);
    float mirror = mod(grid.x + grid.y, 4.0);

    if (mirror == 1.0) gridUV.x = 1.0 - gridUV.x;
    else if (mirror == 2.0) gridUV.y = 1.0 - gridUV.y;
    else if (mirror == 3.0) gridUV = 1.0 - gridUV;

    // Add slight rotation
    vec2 centeredGrid = gridUV - 0.5;
    float tileRotation = stageProgress * 0.1 * (mod(mirror, 2.0) == 0.0 ? 1.0 : -1.0);
    centeredGrid = rotate(tileRotation) * centeredGrid;
    gridUV = centeredGrid + 0.5;

    color = texture(u_texture, gridUV);
  }

  // STAGE 3: Liquid Vortex
  else if (stage3 > 0.0) {
    float stageProgress = (u_progress - 0.385) / 0.23;
    stageProgress = easeInCubic(stageProgress);

    vec2 toCenter = uv - center;
    float distance = length(toCenter);
    float angle = atan(toCenter.y, toCenter.x);

    // Vortex strength increases with proximity to center and progress
    float vortexStrength = stageProgress * 3.0;
    float distanceFactor = max(0.0, 1.0 - distance * 1.5);
    float swirl = vortexStrength * distanceFactor * distanceFactor;

    // Apply swirl distortion
    float newAngle = angle + swirl;
    vec2 distortedUV = center + vec2(cos(newAngle), sin(newAngle)) * distance;

    color = texture(u_texture, distortedUV);

    // Add motion blur streaks
    vec3 blurAccum = color.rgb;
    for (float i = 1.0; i < 5.0; i++) {
      float swirlOffset = swirl * (i / 5.0);
      vec2 blurUV = center + vec2(cos(angle + swirlOffset), sin(angle + swirlOffset)) * distance;
      blurAccum += texture(u_texture, blurUV).rgb;
    }
    color.rgb = blurAccum / 5.0;
  }

  // STAGE 4: Chromatic Bloom
  else if (stage4 > 0.0) {
    float stageProgress = (u_progress - 0.692) / 0.077;
    stageProgress = easeInOutCubic(stageProgress);

    vec2 toCenter = uv - center;
    float distance = length(toCenter);

    // Chromatic aberration offset
    float aberration = stageProgress * 0.05;

    // Sample RGB channels separately with offset
    float r = texture(u_texture, uv + toCenter * aberration).r;
    float g = texture(u_texture, uv).g;
    float b = texture(u_texture, uv - toCenter * aberration).b;

    color = vec4(r, g, b, 1.0);

    // White bloom from center
    float bloomRadius = stageProgress * 0.8;
    float bloom = smoothstep(bloomRadius, 0.0, distance);
    color.rgb += vec3(bloom * stageProgress * 2.0);

    // Rainbow fringe on edges
    float edgeDistance = abs(distance - bloomRadius * 0.7);
    float rainbow = smoothstep(0.1, 0.0, edgeDistance);
    vec3 rainbowColor = vec3(
      sin(atan(toCenter.y, toCenter.x) * 3.0) * 0.5 + 0.5,
      sin(atan(toCenter.y, toCenter.x) * 3.0 + 2.094) * 0.5 + 0.5,
      sin(atan(toCenter.y, toCenter.x) * 3.0 + 4.189) * 0.5 + 0.5
    );
    color.rgb += rainbowColor * rainbow * stageProgress;
  }

  // STAGE 5: Starburst Collapse
  else if (stage5 > 0.0) {
    float stageProgress = (u_progress - 0.846) / 0.154;
    stageProgress = easeInCubic(stageProgress);

    vec2 toCenter = uv - center;
    float distance = length(toCenter);
    float angle = atan(toCenter.y, toCenter.x);

    // Four-pointed star shape
    float starAngle = mod(angle + 3.14159, 1.5708) - 0.7854; // 45-degree symmetry
    float starShape = cos(starAngle * 2.0) * 0.5 + 0.5;

    // Star size decreases with progress
    float starSize = (1.0 - stageProgress) * 0.4;
    float star = smoothstep(starSize + 0.02, starSize, distance * starShape);

    // Sharp rays
    float rays = max(0.0, 1.0 - distance / starSize) * starShape;
    rays *= (1.0 - stageProgress);

    color = vec4(vec3(star + rays * 2.0), 1.0);
  }

  // Default: show original texture
  else {
    color = texture(u_texture, uv);
  }

  fragColor = color;
}
`;

export function WebGLVortexAnimation({
  children,
  imageSrc = "/vortex-bg.png",
  duration = 13000,
}: {
  children?: React.ReactNode;
  imageSrc?: string;
  duration?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isWebGLSupported, setIsWebGLSupported] = useState(true);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // Try WebGL2 first
    const gl = canvas.getContext("webgl2", {
      alpha: false,
      antialias: true,
      powerPreference: "high-performance",
    });

    if (!gl) {
      setIsWebGLSupported(false);
      console.warn("WebGL2 not supported, falling back to Canvas2D");
      return;
    }

    // Setup canvas size
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = container.clientWidth;
    let height = container.clientHeight;

    const resizeCanvas = () => {
      width = container.clientWidth;
      height = container.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Compile shader
    const compileShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;

      gl.shaderSource(shader, source);
      gl.compileShader(shader);

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }

      return shader;
    };

    // Create program
    const vertexShader = compileShader(gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragmentShader = compileShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);

    if (!vertexShader || !fragmentShader) {
      setIsWebGLSupported(false);
      return;
    }

    const program = gl.createProgram();
    if (!program) return;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(program));
      setIsWebGLSupported(false);
      return;
    }

    gl.useProgram(program);

    // Setup geometry (full-screen quad)
    const positions = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
       1,  1,
    ]);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Get uniform locations
    const timeLocation = gl.getUniformLocation(program, "u_time");
    const progressLocation = gl.getUniformLocation(program, "u_progress");
    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    const textureLocation = gl.getUniformLocation(program, "u_texture");

    // Load texture
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Temporary 1x1 pixel while loading
    gl.texImage2D(
      gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0,
      gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([20, 140, 157, 255])
    );

    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      setIsLoaded(true);
    };

    img.onerror = () => {
      setIsLoaded(true); // Show with fallback color
    };

    img.src = imageSrc;

    // Animation loop
    let startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = (elapsed % duration) / duration;

      // Clear and draw
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);

      // Set uniforms
      gl.uniform1f(timeLocation, elapsed / 1000);
      gl.uniform1f(progressLocation, progress);
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform1i(textureLocation, 0);

      // Draw
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteTexture(texture);
      gl.deleteBuffer(positionBuffer);
    };
  }, [imageSrc, duration]);

  // Fallback to Canvas2D if WebGL not supported
  if (!isWebGLSupported) {
    // Dynamically import Canvas2D fallback
    const { GeometricVortexAnimation } = require("./geometric-vortex-animation");
    return (
      <GeometricVortexAnimation imageSrc={imageSrc} duration={duration}>
        {children}
      </GeometricVortexAnimation>
    );
  }

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: isLoaded ? 1 : 0, transition: "opacity 0.5s" }}
      />

      {/* Enterprise legibility overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#111111]/80 via-[#111111]/90 to-[#111111] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#111111_100%)] opacity-80 pointer-events-none" />

      {/* Foreground content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
