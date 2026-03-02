# Animation Infrastructure - APOSSIBLE Design System

Complete animation system for Primus Technologies website, inspired by APOSSIBLE's dynamic mood-based design.

## Features

1. **Mood System** - Dynamic CSS variables that change every 60 seconds
2. **MoodTicker** - Top bar showing brand name, mood value, edition timestamp, and countdown
3. **Scroll Animations** - Intersection Observer-based animations
4. **Stagger Animations** - Sequential fade-in for lists/grids
5. **Preset Animations** - Reusable animation classes
6. **Accessibility** - Full reduced motion support

## Setup

### 1. Wrap your app with AnimationProvider

```tsx
// app/layout.tsx
import { AnimationProvider } from '@/components/animations';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AnimationProvider showMoodTicker={true} brandName="PRIMUS">
          {children}
        </AnimationProvider>
      </body>
    </html>
  );
}
```

### 2. Use the mood system

```tsx
'use client';

import { useMood } from '@/components/animations';

export function DynamicComponent() {
  const { mood, edition, nextEditionIn } = useMood();

  return (
    <div className="mood-opacity">
      <p>Current mood: {mood}</p>
      <p>Edition: {edition}</p>
    </div>
  );
}
```

## Components

### AnimationProvider

Main wrapper that provides mood context and CSS variables.

**Props:**
- `children` - React nodes to wrap
- `showMoodTicker` - Whether to show the top ticker bar (default: true)
- `brandName` - Brand name to display in ticker (default: "PRIMUS")

**CSS Variables Provided:**
- `--mood-value` - Raw mood value (1-1000)
- `--mood-normalized` - Normalized mood (0-1)
- `--mood-hue` - Mood as hue rotation (0-360deg)
- `--mood-opacity` - Mood-driven opacity (0.3-0.7)
- `--mood-scale` - Mood-driven scale (0.95-1.05)

### MoodTicker

Top bar component showing brand, mood, edition, and countdown.

```tsx
<MoodTicker brandName="PRIMUS" />
```

### useScrollAnimation Hook

Trigger animations when elements enter viewport.

```tsx
'use client';

import { useScrollAnimation, animationPresets } from '@/components/animations';

export function ScrollCard() {
  const { ref, isVisible } = useScrollAnimation({
    threshold: 0.15,
    triggerOnce: true,
  });

  return (
    <div ref={ref as any} className={animationPresets.fadeInUp(isVisible)}>
      <h2>This fades in when scrolled into view</h2>
    </div>
  );
}
```

**Options:**
- `threshold` - Visibility threshold (0-1, default: 0.15)
- `triggerOnce` - Only trigger once (default: true)
- `rootMargin` - Margin around viewport (default: "0px")

### StaggerChildren Component

Apply staggered animations to child elements.

```tsx
import { StaggerChildren } from '@/components/animations';

export function FeatureList({ features }: { features: Feature[] }) {
  return (
    <StaggerChildren staggerDelay={0.075} className="grid grid-cols-3 gap-4">
      {features.map(feature => (
        <div key={feature.id} className="card-hover">
          <h3>{feature.title}</h3>
          <p>{feature.description}</p>
        </div>
      ))}
    </StaggerChildren>
  );
}
```

**Props:**
- `children` - Child elements to animate
- `staggerDelay` - Delay between each child (default: 0.075s)
- `className` - CSS classes for container
- `as` - HTML element type (default: "div")

## Animation Presets

Reusable animation classes for use with scroll hook:

```tsx
import { useScrollAnimation, animationPresets } from '@/components/animations';

const { ref, isVisible } = useScrollAnimation();

// Available presets:
animationPresets.fadeIn(isVisible)        // Simple fade
animationPresets.fadeInUp(isVisible)      // Fade + slide up
animationPresets.fadeInDown(isVisible)    // Fade + slide down
animationPresets.fadeInLeft(isVisible)    // Fade + slide from left
animationPresets.fadeInRight(isVisible)   // Fade + slide from right
animationPresets.scaleIn(isVisible)       // Fade + scale
```

## CSS Classes

### Animation Classes

```html
<!-- Keyframe animations -->
<div class="animate-fade-in">Fades in</div>
<div class="animate-fade-in-up">Fades in from below</div>
<div class="animate-quote-reveal">Quote with clip-path reveal</div>
<div class="animate-scale-in">Scales in</div>

<!-- Quote word-by-word -->
<blockquote class="animate-quote">
  <span>Word</span> <span>by</span> <span>word</span>
</blockquote>
```

### Hover Effects

```html
<!-- Standard card hover -->
<div class="card-hover">Lifts on hover</div>

<!-- Subtle hover -->
<div class="card-hover-subtle">Subtle lift on hover</div>

<!-- Value card (darker shadow) -->
<div class="value-card">Value card with strong shadow</div>
```

### Mood-Driven Effects

```html
<!-- Hue rotation based on mood -->
<div class="mood-filter">Changes hue with mood</div>

<!-- Opacity based on mood -->
<div class="mood-opacity">Opacity changes with mood</div>

<!-- Scale based on mood -->
<div class="mood-scale">Scale changes with mood</div>
```

### Easing Utilities

```html
<div class="transition-all ease-smooth">Smooth easing</div>
<div class="transition-all ease-smooth-in">Smooth ease-in</div>
<div class="transition-all ease-smooth-out">Smooth ease-out</div>
<div class="transition-all ease-smooth-in-out">Smooth ease-in-out</div>
```

## Data Attributes

Use data attributes for scroll-triggered animations:

```html
<div data-animate data-animate-delay="1">Card 1</div>
<div data-animate data-animate-delay="2">Card 2</div>
<div data-animate data-animate-delay="3">Card 3</div>
```

Then add JavaScript to toggle `is-visible` class when in viewport.

## Examples

### Hero Section with Stagger

```tsx
import { StaggerChildren } from '@/components/animations';

export function Hero() {
  return (
    <section className="min-h-screen flex items-center">
      <StaggerChildren staggerDelay={0.1} className="max-w-4xl mx-auto text-center">
        <h1 className="text-6xl font-display">Welcome to Primus</h1>
        <p className="text-xl text-foreground-muted">Building the future</p>
        <button className="card-hover px-8 py-4 bg-accent-blue text-white rounded-lg">
          Get Started
        </button>
      </StaggerChildren>
    </section>
  );
}
```

### Feature Cards with Scroll Animation

```tsx
'use client';

import { useScrollAnimation, animationPresets } from '@/components/animations';

export function FeatureCard({ title, description }: FeatureCardProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <div
      ref={ref as any}
      className={`card-hover p-6 bg-white rounded-lg ${animationPresets.fadeInUp(isVisible)}`}
    >
      <h3 className="text-2xl font-display mb-2">{title}</h3>
      <p className="text-foreground-muted">{description}</p>
    </div>
  );
}
```

### Mood-Reactive Background

```tsx
'use client';

import { useMood } from '@/components/animations';

export function MoodBackground() {
  const { mood } = useMood();

  return (
    <div
      className="fixed inset-0 -z-10 mood-filter"
      style={{
        background: `linear-gradient(135deg,
          hsl(${mood * 0.36}, 50%, 95%),
          hsl(${(mood * 0.36 + 60) % 360}, 50%, 90%)
        )`,
      }}
    />
  );
}
```

### Quote Reveal Animation

```tsx
export function Quote({ text }: { text: string }) {
  const words = text.split(' ');

  return (
    <blockquote className="animate-quote text-3xl font-display italic">
      {words.map((word, i) => (
        <span key={i} style={{ animationDelay: `${i * 0.05}s` }}>
          {word}{' '}
        </span>
      ))}
    </blockquote>
  );
}
```

## Accessibility

All animations automatically respect user preferences:

```css
@media (prefers-reduced-motion: reduce) {
  /* All animations reduced to 0.01ms */
  /* All transforms disabled on hover */
  /* Mood transitions disabled */
}
```

## Performance Tips

1. **Use GPU-accelerated properties**: `transform`, `opacity`
2. **Avoid animating**: `width`, `height`, `top`, `left`
3. **Use `will-change` sparingly**: Only on actively animating elements
4. **Prefer CSS over JS**: Use CSS classes with Intersection Observer
5. **Limit stagger count**: Don't stagger more than 10-12 items

## Timing Guidelines

Based on APOSSIBLE design principles:

- **Micro-interactions**: 150-200ms
- **Simple transitions**: 200-300ms (card hovers)
- **Complex animations**: 300-500ms
- **Scroll reveals**: 600-700ms
- **Mood transitions**: 2000ms
- **Page transitions**: 400-600ms

## Easing Curves

All animations use `cubic-bezier(0.25, 0.46, 0.45, 0.94)` for smooth, natural motion.

Alternative easings available:
- `ease-smooth`: Standard smooth (default)
- `ease-smooth-in`: Accelerate
- `ease-smooth-out`: Decelerate
- `ease-smooth-in-out`: Symmetric
