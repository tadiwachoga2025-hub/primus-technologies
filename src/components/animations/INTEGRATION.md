# Integration Guide

Quick guide to integrate the animation infrastructure into your Primus Technologies website.

## Step 1: Update Root Layout

Add the `AnimationProvider` to your root layout:

```tsx
// src/app/layout.tsx
import { AnimationProvider } from '@/components/animations';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

## Step 2: Use in Pages/Components

### Basic Scroll Animation

```tsx
'use client';

import { useScrollAnimation, animationPresets } from '@/components/animations';

export function MyComponent() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref as any} className={animationPresets.fadeInUp(isVisible)}>
      <h2>This fades in when scrolled into view</h2>
    </section>
  );
}
```

### Staggered Grid

```tsx
import { StaggerChildren } from '@/components/animations';

export function Features() {
  const features = [
    { id: 1, title: 'Feature 1', description: 'Description 1' },
    { id: 2, title: 'Feature 2', description: 'Description 2' },
    { id: 3, title: 'Feature 3', description: 'Description 3' },
  ];

  return (
    <StaggerChildren className="grid grid-cols-3 gap-6">
      {features.map(feature => (
        <div key={feature.id} className="card-hover p-6 bg-white rounded-lg">
          <h3>{feature.title}</h3>
          <p>{feature.description}</p>
        </div>
      ))}
    </StaggerChildren>
  );
}
```

### Access Mood Data

```tsx
'use client';

import { useMood } from '@/components/animations';

export function MoodWidget() {
  const { mood, edition, nextEditionIn } = useMood();

  return (
    <div className="mood-opacity">
      <p>Mood: {mood}</p>
    </div>
  );
}
```

## Step 3: Use CSS Classes

Add animation classes to any element:

```tsx
export function Hero() {
  return (
    <div className="card-hover p-8 bg-white rounded-xl">
      <h1 className="animate-fade-in-up">Welcome</h1>
      <p className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
        Subtitle
      </p>
    </div>
  );
}
```

## Step 4: Check Examples

See `/src/components/animations/examples.tsx` for complete working examples:

- `<AnimatedCard />` - Simple scroll-triggered card
- `<FeatureGrid />` - Staggered grid of features
- `<AnimatedQuote />` - Word-by-word quote reveal
- `<MoodDisplay />` - Component that reacts to mood changes
- `<AnimatedHero />` - Full hero section with stagger
- `<DirectionalAnimations />` - Different animation directions
- `<StatsSection />` - Stats counter with animations

## Step 5: Customize MoodTicker (Optional)

To hide the mood ticker on specific pages:

```tsx
// src/app/layout.tsx
<AnimationProvider showMoodTicker={false} brandName="PRIMUS">
  {children}
</AnimationProvider>
```

Or show it only on homepage:

```tsx
// src/app/page.tsx
'use client';

import { MoodTicker } from '@/components/animations';

export default function HomePage() {
  return (
    <>
      <MoodTicker brandName="PRIMUS" />
      {/* rest of page */}
    </>
  );
}
```

## Performance Checklist

- ✅ All animations use GPU-accelerated properties (`transform`, `opacity`)
- ✅ Reduced motion preferences respected automatically
- ✅ Intersection Observer used for scroll animations (efficient)
- ✅ Animations trigger once by default (no repeated calculations)
- ✅ Smooth easing curve used throughout
- ✅ Mood transitions are slow (2s) to avoid jarring changes

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile: Full support
- IE11: Graceful degradation (no animations)

## TypeScript

All components are fully typed. Import types as needed:

```tsx
import type { MoodContextValue } from '@/components/animations';
```

## Testing

To test animations:

1. Scroll page to see scroll-triggered animations
2. Wait 60 seconds to see mood change
3. Hover cards to see hover effects
4. Enable "Reduce motion" in OS settings to test accessibility
5. Test on mobile devices for touch interactions

## Troubleshooting

**Animations not triggering:**
- Ensure component is wrapped in `AnimationProvider`
- Check that component is client component (`'use client'`)
- Verify element is actually scrolling into view

**Mood not updating:**
- Check browser console for errors
- Ensure `AnimationProvider` is in layout, not page

**Performance issues:**
- Reduce number of animated elements
- Use `triggerOnce: true` for scroll animations
- Avoid animating large images without optimization

**TypeScript errors:**
- Add `as any` to ref when using with `useScrollAnimation`
- Import types explicitly if needed

## Next Steps

1. Add animations to existing pages
2. Create custom animation presets if needed
3. Adjust timing/easing to match brand
4. Add more mood-reactive effects
5. Consider adding Framer Motion for complex animations
