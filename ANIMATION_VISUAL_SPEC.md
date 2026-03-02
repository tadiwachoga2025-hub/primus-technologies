# Geometric Vortex Animation - Visual Specification

## Animation Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     13-SECOND LOOP TIMELINE                       │
├────┬────┬────┬────┬────┬────┬────┬────┬────┬────┬────┬────┬────┤
│ 0s │ 1s │ 2s │ 3s │ 4s │ 5s │ 6s │ 7s │ 8s │ 9s │10s │11s │12s │13s
└────┴────┴────┴────┴────┴────┴────┴────┴────┴────┴────┴────┴────┘
  ╱▔▔╲    ╱▔▔▔▔╲      ╱▔▔▔▔▔▔▔╲   ╱▔╲     ╱▔▔▔▔╲
 ▕ S1 ▏  ▕  S2  ▏    ▕   S3    ▏ ▕S4▏   ▕  S5  ▏
  ╲__╱    ╲____╱      ╲_______╱   ╲_╱     ╲____╱

S1: Polygonal Shatter
S2: Mosaic Tiling
S3: Liquid Vortex
S4: Chromatic Bloom
S5: Starburst Collapse
```

## Stage Visualization

### Stage 1: Polygonal Shattering (0-1s)
```
Original Image:              After Shatter:
┌─────────────────┐         ┌─────────────────┐
│                 │         │  ╱╲ ╱╲   ╱╲     │
│   ███████████   │   -->   │ ╱  ╲  ╲ ╱  ╲    │
│   ███████████   │         │╱    ╲  ╲    ╲   │
│   ███████████   │         │╲    ╱  ╱    ╱   │
│                 │         │ ╲  ╱  ╱ ╲  ╱    │
└─────────────────┘         └──╲╱─╲╱───╲╱─────┘

- 150+ Voronoi shards
- Random velocity vectors
- 3D depth perception
- Sharp geometric edges
```

### Stage 2: Mosaic Tiling (2-4s)
```
4×4 Grid (2s):              8×8 Grid (4s):
┌───┬───┬───┬───┐         ┌─┬─┬─┬─┬─┬─┬─┬─┐
│ ╱ │ ╲ │ ╱ │ ╲ │         │╱│╲│╱│╲│╱│╲│╱│╲│
├───┼───┼───┼───┤         ├─┼─┼─┼─┼─┼─┼─┼─┤
│ ╲ │ ╱ │ ╲ │ ╱ │   -->   │╲│╱│╲│╱│╲│╱│╲│╱│
├───┼───┼───┼───┤         ├─┼─┼─┼─┼─┼─┼─┼─┤
│ ╱ │ ╲ │ ╱ │ ╲ │         │╱│╲│╱│╲│╱│╲│╱│╲│
├───┼───┼───┼───┤         ├─┼─┼─┼─┼─┼─┼─┼─┤
│ ╲ │ ╱ │ ╲ │ ╱ │         │╲│╱│╲│╱│╲│╱│╲│╱│
└───┴───┴───┴───┘         └─┴─┴─┴─┴─┴─┴─┴─┘

- Kaleidoscopic mirrors
- Grid size increases
- Symmetrical patterns
```

### Stage 3: Liquid Vortex (5-8s)
```
Start (5s):                 Peak (8s):
┌─────────────────┐         ┌─────────────────┐
│   ╭─────────╮   │         │      ╭───╮      │
│  ╱           ╲  │         │     ╱ ╭─╮ ╲     │
│ │     [◉]     │ │   -->   │    │ ╱ ◉ ╲ │    │
│  ╲           ╱  │         │     ╲ ╰─╯ ╱     │
│   ╰─────────╯   │         │      ╰───╯      │
└─────────────────┘         └─────────────────┘

- Spiral distortion
- Center point vortex
- Accelerating rotation
- Motion blur trails
```

### Stage 4: Chromatic Bloom (9-10s)
```
RGB Separation:
┌─────────────────┐
│       R         │  Red offset left
│      G G        │  Green centered
│       B         │  Blue offset right
│                 │
│    ◉◉◉◉◉◉◉     │  White bloom core
│   ◉◉◉◉◉◉◉◉◉    │
│  🌈🌈🌈🌈🌈🌈🌈   │  Rainbow fringe
│   ◉◉◉◉◉◉◉◉◉    │
│    ◉◉◉◉◉◉◉     │
└─────────────────┘

- Chromatic aberration
- Intense white center
- Prismatic rainbow edges
- Overexposure effect
```

### Stage 5: Starburst Collapse (11-13s)
```
Start (11s):                End (13s):
┌─────────────────┐         ┌─────────────────┐
│        *        │         │                 │
│       ***       │         │                 │
│      *****      │         │                 │
│       ***       │   -->   │        ·        │
│        *        │         │                 │
│                 │         │                 │
└─────────────────┘         └─────────────────┘

- Four-pointed star
- Shrinks from 40% to 0%
- Fades to black
- Sharp rays collapse
```

## Color Progression

```
Stage 1: Source Image Colors
         ┌────────────┐
         │ Turquoise  │
         │   Blues    │
         │  Neutrals  │
         └────────────┘
            ↓
Stage 2: Kaleidoscope
         ┌────────────┐
         │  Mirrored  │
         │   Colors   │
         │   Tiles    │
         └────────────┘
            ↓
Stage 3: Vortex Distortion
         ┌────────────┐
         │  Swirled   │
         │   Colors   │
         │  Blurred   │
         └────────────┘
            ↓
Stage 4: Chromatic Explosion
         ┌────────────┐
         │     🔴     │
         │     🟢     │
         │     🔵     │
         │  🌈 WHITE  │
         └────────────┘
            ↓
Stage 5: Collapse to Black
         ┌────────────┐
         │    ⭐️     │
         │     ·      │
         │   BLACK    │
         └────────────┘
```

## Motion Curves

### Velocity Graph
```
Intensity
    ↑
100%│                    ╱╲               Stage 4 Peak
    │                   ╱  ╲
 75%│                  ╱    ╲
    │                 ╱      ╲╲
 50%│          ╱╲    ╱        ╲╲
    │         ╱  ╲  ╱          ╲╲
 25%│  ╱╲    ╱    ╲╱            ╲
    │ ╱  ╲  ╱                    ╲___
  0%├──────────────────────────────────→ Time
    0s  1s  2s  4s  5s  8s  9s 10s 13s
    S1  S2      S3          S4     S5
```

### Easing Functions per Stage
```
Stage 1: ease-out-cubic     (Fast start, slow end)
         ╱─────
        ╱
       ╱

Stage 2: ease-in-out-cubic  (Smooth both ends)
        ╱───╲
       ╱     ╲
      ╱       ╲

Stage 3: ease-in-cubic      (Slow start, fast end)
              ╱────
             ╱
            ╱

Stage 4: ease-in-out-cubic  (Explosive then fade)
        ╱╲
       ╱  ╲
      ╱    ╲

Stage 5: ease-in-cubic      (Gradual collapse)
              ╱────
             ╱
            ╱
```

## Technical Architecture

### Rendering Pipeline (WebGL)
```
┌──────────────────────────────────────────────────┐
│                  Image Load                       │
└────────────────┬─────────────────────────────────┘
                 ↓
┌──────────────────────────────────────────────────┐
│           Upload to GPU Texture                   │
└────────────────┬─────────────────────────────────┘
                 ↓
┌──────────────────────────────────────────────────┐
│      Vertex Shader (Full-screen quad)             │
└────────────────┬─────────────────────────────────┘
                 ↓
┌──────────────────────────────────────────────────┐
│        Fragment Shader (Per-pixel)                │
│  ├─ Calculate stage from u_progress               │
│  ├─ Stage 1: Voronoi shatter                      │
│  ├─ Stage 2: Mosaic tiling                        │
│  ├─ Stage 3: Vortex distortion                    │
│  ├─ Stage 4: Chromatic bloom                      │
│  └─ Stage 5: Starburst collapse                   │
└────────────────┬─────────────────────────────────┘
                 ↓
┌──────────────────────────────────────────────────┐
│          Render to Screen @ 60fps                 │
└──────────────────────────────────────────────────┘
```

### Rendering Pipeline (Canvas2D)
```
┌──────────────────────────────────────────────────┐
│                  Image Load                       │
└────────────────┬─────────────────────────────────┘
                 ↓
┌──────────────────────────────────────────────────┐
│      Draw to Offscreen Canvas                     │
└────────────────┬─────────────────────────────────┘
                 ↓
┌──────────────────────────────────────────────────┐
│      Generate Voronoi Shards (150+)               │
└────────────────┬─────────────────────────────────┘
                 ↓
┌──────────────────────────────────────────────────┐
│           Animation Loop (rAF)                    │
│  ├─ Stage 1: Draw shards with transform           │
│  ├─ Stage 2: Grid tiling with mirrors             │
│  ├─ Stage 3: Pixel displacement                   │
│  ├─ Stage 4: Gradient overlays                    │
│  └─ Stage 5: Star path drawing                    │
└────────────────┬─────────────────────────────────┘
                 ↓
┌──────────────────────────────────────────────────┐
│       Composite to Main Canvas @ 60fps            │
└──────────────────────────────────────────────────┘
```

## Performance Characteristics

### GPU Utilization
```
GPU Load (WebGL)
    ↑
100%│              ╱╲        Stage 3 (Pixel ops)
    │             ╱  ╲
 75%│            ╱    ╲      Stage 4 (Blend heavy)
    │           ╱      ╲
 50%│       ╱╲ ╱        ╲╱╲  Stage 1 & 5
    │      ╱  ╲            ╲
 25%│     ╱    ╲            ╲
    │____╱      ╲____________╲_____
  0%├──────────────────────────────→ Time
    0s  1s  2s  4s  5s  8s  9s 10s 13s
```

### Memory Usage Pattern
```
Memory (MB)
    ↑
100%│
    │
 75%│    ┌────────────────────┐     Texture loaded
    │    │                    │
 50%│    │                    │     Stable usage
    │    │                    │
 25%│    │                    │
    │────┘                    └───  Cleanup
  0%├──────────────────────────────→ Time
    Load                        Unmount
```

## Browser Compatibility Matrix

```
┌──────────────┬─────────┬──────────┬──────────┐
│   Browser    │  WebGL2 │ Canvas2D │  Result  │
├──────────────┼─────────┼──────────┼──────────┤
│ Chrome 56+   │    ✓    │    ✓     │  WebGL   │
│ Firefox 51+  │    ✓    │    ✓     │  WebGL   │
│ Safari 15+   │    ✓    │    ✓     │  WebGL   │
│ Edge 79+     │    ✓    │    ✓     │  WebGL   │
│ Safari 14    │    ✗    │    ✓     │ Canvas2D │
│ IE 11        │    ✗    │    ✓     │ Canvas2D │
│ Opera 43+    │    ✓    │    ✓     │  WebGL   │
└──────────────┴─────────┴──────────┴──────────┘
```

## Shader Architecture (WebGL Only)

### Uniform Variables
```
┌────────────────────────────────────────┐
│ u_time: float      (elapsed seconds)   │
│ u_progress: float  (0.0 - 1.0 loop)    │
│ u_resolution: vec2 (canvas size)       │
│ u_texture: sampler2D (source image)    │
└────────────────────────────────────────┘
```

### Helper Functions
```
┌─────────────────────────────────────────┐
│ hash(vec2) → float                      │
│   Pseudo-random number generation       │
│                                         │
│ voronoi(vec2) → vec2                    │
│   Voronoi cell center calculation       │
│                                         │
│ rotate(float) → mat2                    │
│   2D rotation matrix                    │
│                                         │
│ easeOutCubic/easeInCubic/easeInOutCubic │
│   Timing curve functions                │
└─────────────────────────────────────────┘
```

## Asset Requirements

### Source Image Specifications
```
┌─────────────────────────────────────────┐
│ Dimension:   1920 × 1080 (minimum)      │
│ Format:      JPG, PNG, or WebP          │
│ Size:        < 500KB (optimized)        │
│ Color:       Turquoise/blue preferred   │
│ Subject:     Abstract, landscape, geo   │
│ Orientation: Landscape (horizontal)     │
└─────────────────────────────────────────┘
```

### Recommended Color Palettes
```
Primary (Turquoise/Blue):
  #1a8b9d (Turquoise)
  #0d4d5c (Dark Teal)
  #4db8d4 (Light Cyan)

Secondary (Neutral):
  #111111 (Near Black)
  #2c2c2c (Dark Gray)
  #ffffff (White - bloom)

Accent (Chromatic):
  #ff0000 (Red channel)
  #00ff00 (Green channel)
  #0000ff (Blue channel)
  #ffffff (White core)
```

## Accessibility Considerations

### Color Contrast Overlay
```
Original Animation:      With Overlay:
┌─────────────────┐     ┌─────────────────┐
│   Bright Area   │     │  Darkened for   │
│     [TEXT]      │ --> │     [TEXT]      │
│                 │     │   Readability   │
└─────────────────┘     └─────────────────┘

Overlay Gradient:
  from-[#111111]/80  (Top, 80% opacity)
  to-[#111111]       (Bottom, 100% opacity)
```

### Reduced Motion Alternative
```
Normal:                  Reduced Motion:
┌─────────────────┐     ┌─────────────────┐
│   [ANIMATING]   │     │  [STATIC IMG]   │
│   Vortex FX     │ --> │   No motion     │
│   60fps loop    │     │   Same overlay  │
└─────────────────┘     └─────────────────┘
```

## File Structure Summary

```
stirling-interiors/
├─ src/
│  ├─ components/
│  │  └─ ui/
│  │     ├─ webgl-vortex-animation.tsx     ★ MAIN
│  │     ├─ geometric-vortex-animation.tsx  (Fallback)
│  │     ├─ geometric-vortex-demo.tsx       (Demo)
│  │     ├─ performance-monitor.tsx         (Debug)
│  │     ├─ index.ts                        (Exports)
│  │     └─ VORTEX_ANIMATION_README.md      (Docs)
│  └─ app/
│     └─ animation-test/
│        └─ page.tsx                        (Test UI)
├─ public/
│  └─ vortex-bg.png                         (Source)
├─ ANIMATION_IMPLEMENTATION.md              (Guide)
├─ MIGRATION_GUIDE.md                       (Migration)
└─ ANIMATION_VISUAL_SPEC.md                 (This file)

★ Use WebGLVortexAnimation for production
```

---

**Performance Target**: 60fps constant
**Browser Coverage**: 98%+ of users
**Mobile Optimized**: GPU-accelerated
**Bundle Size**: ~15KB gzipped
**Load Time**: < 100ms (instant)
