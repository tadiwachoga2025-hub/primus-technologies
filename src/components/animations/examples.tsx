'use client';

/**
 * Animation Examples
 *
 * These components demonstrate how to use the animation infrastructure.
 * Import and use these in your pages/components as needed.
 */

import { useScrollAnimation, animationPresets, StaggerChildren, useMood } from './AnimationProvider';

// ============================================================================
// Example 1: Simple Scroll-Triggered Card
// ============================================================================

export function AnimatedCard({ title, description }: { title: string; description: string }) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <div
      ref={ref as any}
      className={`card-hover p-8 bg-white rounded-xl border border-border ${animationPresets.fadeInUp(isVisible)}`}
    >
      <h3 className="text-2xl font-display mb-3">{title}</h3>
      <p className="text-foreground-muted leading-relaxed">{description}</p>
    </div>
  );
}

// ============================================================================
// Example 2: Staggered Grid
// ============================================================================

interface Feature {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export function FeatureGrid({ features }: { features: Feature[] }) {
  return (
    <StaggerChildren
      staggerDelay={0.08}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {features.map((feature) => (
        <div key={feature.id} className="card-hover-subtle p-6 bg-white rounded-lg border border-border">
          <div className="text-4xl mb-4">{feature.icon}</div>
          <h3 className="text-xl font-display mb-2">{feature.title}</h3>
          <p className="text-foreground-muted text-sm leading-relaxed">{feature.description}</p>
        </div>
      ))}
    </StaggerChildren>
  );
}

// ============================================================================
// Example 3: Quote with Word-by-Word Reveal
// ============================================================================

export function AnimatedQuote({ quote, author }: { quote: string; author: string }) {
  const words = quote.split(' ');

  return (
    <figure className="max-w-3xl mx-auto text-center py-16">
      <blockquote className="animate-quote text-3xl md:text-4xl font-display italic leading-tight">
        {words.map((word, i) => (
          <span
            key={i}
            className="inline-block"
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            {word}{' '}
          </span>
        ))}
      </blockquote>
      <figcaption className="mt-6 text-foreground-muted font-mono text-sm uppercase tracking-wider">
        — {author}
      </figcaption>
    </figure>
  );
}

// ============================================================================
// Example 4: Mood-Reactive Component
// ============================================================================

export function MoodDisplay() {
  const { mood, edition, nextEditionIn } = useMood();

  return (
    <div className="card-hover p-8 bg-white rounded-xl border border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-display">Current Mood</h3>
        <span className="mood-scale text-4xl">✨</span>
      </div>
      <div className="space-y-2 font-mono text-sm">
        <div className="flex justify-between">
          <span className="text-foreground-muted">Value:</span>
          <span className="font-semibold">{mood}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-foreground-muted">Edition:</span>
          <span className="text-xs">{edition}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-foreground-muted">Next in:</span>
          <span>{Math.floor(nextEditionIn / 60)}:{(nextEditionIn % 60).toString().padStart(2, '0')}</span>
        </div>
      </div>
      <div
        className="mt-4 h-2 rounded-full mood-filter"
        style={{
          background: `linear-gradient(90deg,
            hsl(${mood * 0.36}, 60%, 60%),
            hsl(${(mood * 0.36 + 60) % 360}, 60%, 60%)
          )`,
          width: `${(mood / 1000) * 100}%`,
          transition: 'all 2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }}
      />
    </div>
  );
}

// ============================================================================
// Example 5: Hero Section with Stagger
// ============================================================================

export function AnimatedHero() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-accent-gold/10">
      <StaggerChildren staggerDelay={0.15} className="max-w-4xl mx-auto px-6 text-center">
        <h1 className="text-5xl md:text-7xl font-display mb-6 leading-tight">
          Building Tomorrow's
          <br />
          <span className="text-accent-blue">Technology Today</span>
        </h1>
        <p className="text-xl md:text-2xl text-foreground-muted mb-8 leading-relaxed">
          Innovative solutions powered by cutting-edge engineering
        </p>
        <div className="flex gap-4 justify-center">
          <button className="card-hover px-8 py-4 bg-accent-blue text-foreground-white rounded-lg font-semibold">
            Get Started
          </button>
          <button className="card-hover-subtle px-8 py-4 border-2 border-accent-blue text-accent-blue rounded-lg font-semibold">
            Learn More
          </button>
        </div>
      </StaggerChildren>
    </section>
  );
}

// ============================================================================
// Example 6: Multi-Direction Scroll Animations
// ============================================================================

export function DirectionalAnimations() {
  const fadeUp = useScrollAnimation({ threshold: 0.2 });
  const fadeLeft = useScrollAnimation({ threshold: 0.2 });
  const fadeRight = useScrollAnimation({ threshold: 0.2 });
  const scale = useScrollAnimation({ threshold: 0.2 });

  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto space-y-12">
        <div
          ref={fadeUp.ref as any}
          className={animationPresets.fadeInUp(fadeUp.isVisible)}
        >
          <h2 className="text-4xl font-display text-center">Fade Up Animation</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div
            ref={fadeLeft.ref as any}
            className={`card-hover p-8 bg-white rounded-xl ${animationPresets.fadeInLeft(fadeLeft.isVisible)}`}
          >
            <h3 className="text-2xl font-display mb-2">From Left</h3>
            <p className="text-foreground-muted">This card slides in from the left</p>
          </div>

          <div
            ref={fadeRight.ref as any}
            className={`card-hover p-8 bg-white rounded-xl ${animationPresets.fadeInRight(fadeRight.isVisible)}`}
          >
            <h3 className="text-2xl font-display mb-2">From Right</h3>
            <p className="text-foreground-muted">This card slides in from the right</p>
          </div>
        </div>

        <div
          ref={scale.ref as any}
          className={`card-hover-subtle p-12 bg-gradient-to-br from-accent-blue to-accent-navy text-foreground-white rounded-2xl text-center ${animationPresets.scaleIn(scale.isVisible)}`}
        >
          <h3 className="text-3xl font-display mb-3">Scale In Animation</h3>
          <p className="text-lg opacity-90">This element scales up as it appears</p>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// Example 7: Mood-Driven Background
// ============================================================================

export function MoodBackground() {
  const { mood } = useMood();

  return (
    <div
      className="fixed inset-0 -z-10 mood-filter"
      style={{
        background: `radial-gradient(circle at 30% 50%,
          hsl(${mood * 0.36}, 40%, 96%),
          hsl(${(mood * 0.36 + 120) % 360}, 35%, 94%),
          hsl(${(mood * 0.36 + 240) % 360}, 30%, 92%)
        )`,
      }}
    />
  );
}

// ============================================================================
// Example 8: Stats Counter with Scroll Trigger
// ============================================================================

export function StatCard({ value, label, suffix = '' }: { value: number; label: string; suffix?: string }) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.3 });

  return (
    <div
      ref={ref as any}
      className={`card-hover-subtle p-8 bg-white rounded-xl text-center ${animationPresets.scaleIn(isVisible)}`}
    >
      <div className="text-5xl font-display font-bold text-accent-blue mb-2">
        {value}{suffix}
      </div>
      <div className="text-foreground-muted uppercase text-sm tracking-wider">
        {label}
      </div>
    </div>
  );
}

export function StatsSection() {
  return (
    <section className="py-24 px-6 bg-gradient-to-b from-background to-white">
      <StaggerChildren staggerDelay={0.1} className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
        <StatCard value={500} label="Projects" suffix="+" />
        <StatCard value={50} label="Team Members" suffix="+" />
        <StatCard value={98} label="Client Satisfaction" suffix="%" />
        <StatCard value={15} label="Years Experience" suffix="+" />
      </StaggerChildren>
    </section>
  );
}
