# Performance Utilities - Quick Reference Card

## 30-Second Integration

```tsx
import { useAnimationPerformance } from '@/hooks/useAnimationPerformance';

const { quality, shouldRender, onFrameStart, onFrameEnd } = useAnimationPerformance({
  containerRef,
  glContextRef,
  onQualityChange: (q) => updateAnimation(q)
});

// In render loop
onFrameStart();
if (shouldRender()) renderFrame();
onFrameEnd(deltaTime);
```

---

## Common Patterns

### Get Device Tier
```ts
import { AnimationPerformance } from '@/lib/animation-performance';
const tier = AnimationPerformance.getDeviceCapability(); // 'high' | 'medium' | 'low'
```

### Apply Quality Settings
```ts
function applyQuality(quality: QualitySettings) {
  canvas.width = width * quality.resolution;
  setParticleCount(quality.particleCount);
  setShader(quality.useSimpleShader ? simpleShader : complexShader);
  setBloom(quality.bloomQuality);
  setChromaticAberration(quality.chromaticAberration);
  setTiles(quality.tileCount);
}
```

### Check Performance
```tsx
const metrics = perfManager.getMetrics();
console.log(`FPS: ${metrics.fps.toFixed(1)}`);
console.log(`Avg: ${metrics.averageFPS.toFixed(1)}`);
```

---

## Quality Levels at a Glance

| Level | Resolution | Particles | FPS Target | Use Case |
|-------|-----------|-----------|-----------|----------|
| High | 100% | 100 | 60 | Desktop + GPU |
| Medium | 75% | 60 | 60 | Desktop integrated |
| Low | 50% | 30 | 30 | Mobile/tablet |
| Minimal | 50% | 15 | 30 | Emergency fallback |

---

## Adaptive Quality Strategy

**When FPS drops below target:**
1. ↓ Resolution (100% → 75% → 50%)
2. ↓ Particles (-20 per step)
3. ✗ Chromatic aberration
4. ↓ Bloom (high → medium → low → none)
5. → Simple shader
6. ↓ Tiles (8 → 6 → 4)

**Cool-down:** 3 seconds between changes

---

## Performance Targets

| Metric | Desktop | Mobile |
|--------|---------|--------|
| Target FPS | 60 | 30 |
| Frame Budget | 16.67ms | 33.33ms |
| Max Resolution | 100% | 50% |
| Max Particles | 150 | 30 |

---

## WebGL Context Setup

```ts
const gl = canvas.getContext('webgl2', {
  alpha: false,
  antialias: false, // Control via quality.antialiasing
  depth: false,
  stencil: false,
  powerPreference: 'high-performance',
  preserveDrawingBuffer: false,
  desynchronized: true, // Better perf
});
```

---

## Memory Management

```ts
// Create pool
const pool = perfManager.getTexturePool();

// Acquire
const texture = pool.acquire();

// Use...
gl.bindTexture(gl.TEXTURE_2D, texture);

// Release
pool.release(texture);

// Check stats
console.log(pool.getStats()); // { total: 16, available: 14, inUse: 2 }
```

---

## Visibility Handling

**Automatic pause when:**
- Tab inactive (Page Visibility API)
- Scrolled out of view (Intersection Observer)

**Savings:** ~90% CPU when not visible

---

## Development Overlay

```tsx
import { PerformanceOverlay } from '@/components/PerformanceOverlay';

<PerformanceOverlay
  metrics={metrics}
  quality={quality}
  position="top-right"
  detailed={true}
/>
```

**Auto-hidden in production** (checks `process.env.NODE_ENV`)

---

## Cleanup Pattern

```tsx
useEffect(() => {
  const perfManager = new AnimationPerformanceManager();
  // ... setup

  return () => {
    perfManager.destroy(); // ← CRITICAL
    gl.getExtension('WEBGL_lose_context')?.loseContext();
  };
}, []);
```

---

## Troubleshooting

| Issue | Check |
|-------|-------|
| Low FPS | `getMetrics()` → profile shader |
| Quality not adapting | Wait 3s, check FPS variance |
| Memory growing | Verify `destroy()`, check pool stats |
| Paused unexpectedly | Check `shouldRender()`, tab active? |

---

## File Locations

| File | Path |
|------|------|
| Core library | `/src/lib/animation-performance.ts` |
| React hooks | `/src/hooks/useAnimationPerformance.ts` |
| Overlay component | `/src/components/PerformanceOverlay.tsx` |
| Full example | `/src/components/WebGLAnimation.example.tsx` |
| API docs | `/docs/animation-performance-guide.md` |

---

## TypeScript Types

```ts
type DeviceCapability = 'high' | 'medium' | 'low';
type QualityLevel = 'ultra' | 'high' | 'medium' | 'low' | 'minimal';

interface QualitySettings {
  resolution: number;        // 0.5 to 1.0
  particleCount: number;     // 15 to 150
  bloomQuality: 'high' | 'medium' | 'low' | 'none';
  chromaticAberration: boolean;
  tileCount: number;         // 4, 6, or 8
  useSimpleShader: boolean;
  antialiasing: boolean;
  shadowQuality: 'high' | 'low' | 'none';
}

interface FrameMetrics {
  fps: number;
  frameTime: number;
  droppedFrames: number;
  averageFPS: number;
}
```

---

## Browser Support

- Chrome 56+ ✓
- Firefox 51+ ✓
- Safari 15+ ✓
- Edge 79+ ✓

(WebGL 2 + Intersection Observer + Page Visibility)

---

## Zero Dependencies

All utilities are vanilla TypeScript with no external dependencies. Tree-shakeable.

**Bundle size:** ~25KB gzipped

---

## Next Steps

1. Copy `/src/components/WebGLAnimation.example.tsx`
2. Replace shaders with your voronoi + kaleidoscope code
3. Test on desktop + mobile
4. Monitor with `<PerformanceOverlay />`
5. Deploy

**Estimated time:** 2-4 hours

---

**Questions?** See `/docs/animation-performance-guide.md` for full API reference
