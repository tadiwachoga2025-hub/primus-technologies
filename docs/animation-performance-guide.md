# WebGL Animation Performance Guide

Complete guide for optimizing heavy WebGL animations using the `animation-performance.ts` utilities.

## Table of Contents
1. [Quick Start](#quick-start)
2. [Core Concepts](#core-concepts)
3. [API Reference](#api-reference)
4. [Integration Guide](#integration-guide)
5. [Performance Targets](#performance-targets)
6. [Troubleshooting](#troubleshooting)

---

## Quick Start

### Basic Integration

```typescript
import { AnimationPerformanceManager } from '@/lib/animation-performance';

const perfManager = new AnimationPerformanceManager();

// Initialize with your container element and WebGL context
const initialQuality = perfManager.initialize(
  containerElement,
  glContext,
  (newQuality) => {
    // Called when quality auto-adjusts
    console.log('Quality changed:', newQuality);
    applyQualityToAnimation(newQuality);
  }
);

// In your animation loop
function animate(currentTime: number) {
  perfManager.onFrameStart();

  if (perfManager.shouldRender()) {
    // Render your frame
    renderFrame();
  }

  perfManager.onFrameEnd(deltaTime);
  requestAnimationFrame(animate);
}
```

---

## Core Concepts

### 1. Device Capability Detection

Automatically detects device performance tier:

```typescript
import { DeviceCapabilityDetector } from '@/lib/animation-performance';

const detector = DeviceCapabilityDetector.getInstance();
const capability = detector.getDeviceCapability(); // 'high' | 'medium' | 'low'
const isMobile = detector.isMobile();
```

**Scoring System:**
- GPU renderer (NVIDIA/AMD/Apple M1+ = +3 points)
- Max texture size (8192+ = +2, 4096+ = +1)
- Device memory (8GB+ = +2, 4GB+ = +1)
- CPU cores (8+ = +2, 4+ = +1)
- Mobile device (-3 penalty)
- High resolution screen (-1)

### 2. Quality Presets

Five quality levels with pre-configured settings:

| Level | Resolution | Particles | Bloom | CA | Tiles | Use Case |
|-------|-----------|-----------|-------|-----|-------|----------|
| Ultra | 100% | 150 | High | Yes | 8x8 | Desktop, high-end GPU |
| High | 100% | 100 | High | Yes | 8x8 | Desktop, mid-range GPU |
| Medium | 75% | 60 | Medium | Yes | 6x6 | Desktop, integrated GPU |
| Low | 50% | 30 | Low | No | 4x4 | Mobile, older devices |
| Minimal | 50% | 15 | None | No | 4x4 | Emergency fallback |

```typescript
import { QualityPresetManager } from '@/lib/animation-performance';

const settings = QualityPresetManager.getPresetForCapability('high');
// Or for mobile
const mobileSettings = QualityPresetManager.getPresetForMobile();
```

### 3. Adaptive Quality (Auto-scaling)

Automatically adjusts quality based on real-time FPS:

```typescript
import { AdaptiveQualityController } from '@/lib/animation-performance';

const controller = new AdaptiveQualityController(
  initialQuality,
  30, // Target FPS
  (newQuality) => {
    // Apply new quality settings
    updateAnimation(newQuality);
  }
);

// In your animation loop
controller.recordFrame(deltaTime);
```

**Reduction Strategy (when FPS < target):**
1. Reduce resolution (100% → 75% → 50%)
2. Reduce particle count (by 20 per step)
3. Disable chromatic aberration
4. Reduce bloom quality (high → medium → low → none)
5. Switch to simple shader
6. Reduce tile count (8 → 6 → 4)

**Cool-down:** 3 seconds between adjustments

### 4. Visibility Management

Pauses animation when not visible:

```typescript
import { VisibilityHandler } from '@/lib/animation-performance';

const handler = new VisibilityHandler((isVisible) => {
  console.log('Animation visibility:', isVisible);
});

// Observe element (pauses when <10% visible)
handler.observeElement(containerElement, 0.1);

// Check before rendering
if (handler.shouldRender()) {
  renderFrame();
}
```

**Triggers:**
- Page visibility API (tab switch)
- Intersection Observer (scroll out of view)

### 5. Texture Memory Pool

Reusable texture pool to prevent memory leaks:

```typescript
import { TexturePool } from '@/lib/animation-performance';

const pool = new TexturePool(gl, {
  maxTextures: 16,
  textureSize: 512,
  format: gl.RGBA
});

// Acquire texture
const texture = pool.acquire();
if (texture) {
  // Use texture
  gl.bindTexture(gl.TEXTURE_2D, texture);
  // ...
}

// Release when done
pool.release(texture);

// Get stats
console.log(pool.getStats());
// { total: 16, available: 14, inUse: 2 }
```

### 6. Frame Budget Monitoring

Track frame time budget violations:

```typescript
import { FrameBudgetMonitor } from '@/lib/animation-performance';

const monitor = new FrameBudgetMonitor(16.67); // 60fps

// Each frame
monitor.startFrame();
// ... render ...
const withinBudget = monitor.endFrame();

console.log(monitor.getStats());
// { budgetMs: 16.67, violations: 45, totalFrames: 1000, violationRate: 0.045 }
```

---

## API Reference

### AnimationPerformanceManager

Main orchestrator class.

```typescript
class AnimationPerformanceManager {
  constructor()

  // Initialize with element and optional WebGL context
  initialize(
    element: HTMLElement,
    gl?: WebGLRenderingContext | WebGL2RenderingContext,
    onQualityChange?: (settings: QualitySettings) => void
  ): QualitySettings

  // Frame lifecycle
  onFrameStart(): void
  onFrameEnd(deltaTime: number): void

  // Rendering control
  shouldRender(): boolean

  // Getters
  getCurrentQuality(): QualitySettings | null
  getMetrics(): FrameMetrics | null
  getTexturePool(): TexturePool | null

  // Cleanup
  destroy(): void
}
```

### QualitySettings

```typescript
interface QualitySettings {
  resolution: number;           // 0.5 to 1.0
  particleCount: number;         // 15 to 150
  bloomQuality: 'high' | 'medium' | 'low' | 'none';
  chromaticAberration: boolean;
  tileCount: number;             // 4, 6, or 8
  useSimpleShader: boolean;
  antialiasing: boolean;
  shadowQuality: 'high' | 'low' | 'none';
}
```

### FrameMetrics

```typescript
interface FrameMetrics {
  fps: number;              // Current frame rate
  frameTime: number;        // Time to render last frame (ms)
  droppedFrames: number;    // Frames below target in last 10
  averageFPS: number;       // Average over last 60 frames
}
```

---

## Integration Guide

### Step 1: Setup Canvas

```typescript
const canvas = document.createElement('canvas');
const gl = canvas.getContext('webgl2', {
  alpha: false,
  antialias: false,  // Control via quality settings
  depth: false,
  stencil: false,
  powerPreference: 'high-performance',
  preserveDrawingBuffer: false,
});
```

### Step 2: Initialize Performance Manager

```typescript
const perfManager = new AnimationPerformanceManager();

const initialQuality = perfManager.initialize(
  containerElement,
  gl,
  (newQuality) => {
    // Quality changed - update animation
    updateParticleCount(newQuality.particleCount);
    updateShader(newQuality.useSimpleShader);
    updateResolution(newQuality.resolution);
  }
);
```

### Step 3: Apply Initial Quality

```typescript
function applyQuality(quality: QualitySettings) {
  // Update canvas resolution
  const dpr = window.devicePixelRatio * quality.resolution;
  canvas.width = container.clientWidth * dpr;
  canvas.height = container.clientHeight * dpr;

  // Update particles
  particleSystem.setCount(quality.particleCount);

  // Update shader
  if (quality.useSimpleShader) {
    shaderProgram = simpleShader;
  } else {
    shaderProgram = complexShader;
  }

  // Update post-processing
  bloomPass.enabled = quality.bloomQuality !== 'none';
  chromaticAberrationPass.enabled = quality.chromaticAberration;

  // Update kaleidoscope
  setTileCount(quality.tileCount);
}

applyQuality(initialQuality);
```

### Step 4: Animation Loop

```typescript
let lastTime = performance.now();

function animate(currentTime: number) {
  const deltaTime = currentTime - lastTime;
  lastTime = currentTime;

  // Start frame budget
  perfManager.onFrameStart();

  // Check if should render
  if (perfManager.shouldRender()) {
    // Update
    updateParticles(deltaTime);
    updateVortex(deltaTime);
    updateKaleidoscope(deltaTime);

    // Render
    renderVoronoi();
    renderKaleidoscope();
    applyPostProcessing();
  }

  // End frame budget
  perfManager.onFrameEnd(deltaTime);

  // Continue loop
  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
```

### Step 5: Cleanup

```typescript
useEffect(() => {
  // Setup...

  return () => {
    perfManager.destroy();
    gl.getExtension('WEBGL_lose_context')?.loseContext();
  };
}, []);
```

---

## Performance Targets

### Desktop (High-end)
- Target FPS: 60
- Resolution: 100%
- Particles: 100-150
- All effects enabled

### Desktop (Mid-range)
- Target FPS: 60
- Resolution: 75-100%
- Particles: 60-100
- Medium bloom, CA enabled

### Desktop (Low-end)
- Target FPS: 30
- Resolution: 50-75%
- Particles: 30-60
- Low bloom, simple shader

### Mobile
- Target FPS: 30
- Resolution: 50%
- Particles: 15-30
- Minimal effects

---

## Troubleshooting

### Animation Stuttering

**Symptoms:** Choppy animation, low FPS

**Solutions:**
1. Check current quality: `perfManager.getCurrentQuality()`
2. Check metrics: `perfManager.getMetrics()`
3. Manually reduce quality if needed
4. Check for memory leaks with texture pool stats
5. Verify frame budget violations

### Quality Not Adapting

**Symptoms:** Quality stays low/high despite FPS

**Solutions:**
1. Wait 3 seconds (adjustment cooldown)
2. Check if 30+ frames recorded (0.5s warmup)
3. Verify FPS is significantly above/below target (±20%)
4. Check onQualityChange callback is firing

### High Memory Usage

**Symptoms:** Memory grows over time, crashes

**Solutions:**
1. Use texture pool instead of creating textures
2. Verify `destroy()` is called on unmount
3. Check for orphaned WebGL resources
4. Monitor texture pool: `pool.getStats()`

### Animation Paused Unexpectedly

**Symptoms:** Animation stops when visible

**Solutions:**
1. Check `shouldRender()` return value
2. Verify element is in viewport
3. Check tab is active (Page Visibility API)
4. Adjust Intersection Observer threshold

---

## Best Practices

### 1. Always Initialize Early

```typescript
// Good
useEffect(() => {
  const perfManager = new AnimationPerformanceManager();
  const quality = perfManager.initialize(...);
  setupAnimation(quality);
}, []);

// Bad - late initialization
useEffect(() => {
  setupAnimation(defaultQuality);
  setTimeout(() => {
    perfManager.initialize(...); // Too late!
  }, 1000);
}, []);
```

### 2. Respect Quality Changes

```typescript
// Good - apply all settings
const onQualityChange = (quality: QualitySettings) => {
  updateResolution(quality.resolution);
  updateParticles(quality.particleCount);
  updateShader(quality.useSimpleShader);
  updateBloom(quality.bloomQuality);
  updateCA(quality.chromaticAberration);
  updateTiles(quality.tileCount);
};

// Bad - ignore some settings
const onQualityChange = (quality: QualitySettings) => {
  updateResolution(quality.resolution); // Only this!
};
```

### 3. Always Cleanup

```typescript
// Good
useEffect(() => {
  const perfManager = new AnimationPerformanceManager();
  // ...
  return () => {
    perfManager.destroy();
    cleanupWebGL();
  };
}, []);

// Bad - memory leak
useEffect(() => {
  const perfManager = new AnimationPerformanceManager();
  // No cleanup!
}, []);
```

### 4. Monitor in Development

```tsx
{process.env.NODE_ENV === 'development' && (
  <PerformanceOverlay
    metrics={perfManager.getMetrics()}
    quality={perfManager.getCurrentQuality()}
  />
)}
```

---

## Advanced: Custom Quality Logic

If you need custom quality tiers:

```typescript
const customQuality: QualitySettings = {
  resolution: 0.8,
  particleCount: 75,
  bloomQuality: 'medium',
  chromaticAberration: true,
  tileCount: 6,
  useSimpleShader: false,
  antialiasing: true,
  shadowQuality: 'low',
};

const controller = new AdaptiveQualityController(
  customQuality,
  45, // Custom target FPS
  onQualityChange
);
```

---

## Performance Metrics

Expected frame budgets:

| Target FPS | Frame Budget | Use Case |
|-----------|--------------|----------|
| 60 FPS | 16.67ms | Desktop high-end |
| 30 FPS | 33.33ms | Desktop low-end / Mobile |
| 24 FPS | 41.67ms | Cinematic fallback |

Typical render costs:

| Operation | Cost (ms) | Notes |
|-----------|-----------|-------|
| Voronoi calculation | 2-8ms | Depends on particle count |
| Kaleidoscope tiling | 1-4ms | Depends on tile count |
| Vortex distortion | 1-3ms | Shader complexity |
| Bloom pass | 2-6ms | Quality dependent |
| Chromatic aberration | 0.5-2ms | Resolution dependent |

---

## License

MIT License - feel free to use in production applications.
