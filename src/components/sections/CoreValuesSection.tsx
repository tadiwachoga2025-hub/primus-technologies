'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ShieldCheck, Lightbulb, Users, Lock, type LucideIcon } from 'lucide-react';

// ============================================================================
// Types
// ============================================================================

interface CoreValue {
  icon: LucideIcon;
  title: string;
  desc: string;
}

// ============================================================================
// Values Data
// ============================================================================

const coreValues: CoreValue[] = [
  {
    icon: ShieldCheck,
    title: 'Integrity',
    desc: 'Unwavering commitment to honesty and ethical standards in every digital infrastructure project.',
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    desc: 'Redefining urban landscapes with innovative, eco-friendly tech solutions built for the future.',
  },
  {
    icon: Users,
    title: 'Client-Centric',
    desc: 'Delivering excellence in design and functionality while prioritizing the unique needs of our partners.',
  },
  {
    icon: Lock,
    title: 'Security Excellence',
    desc: 'Protecting critical infrastructure with enterprise-grade security and robust threat mitigation.',
  },
];

// ============================================================================
// Quote Animation Component
// ============================================================================

interface AnimatedQuoteProps {
  text: string;
  author: string;
}

function AnimatedQuote({ text, author }: AnimatedQuoteProps) {
  const [isVisible, setIsVisible] = useState(false);
  const quoteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (quoteRef.current) {
      observer.observe(quoteRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Split text into words for animation
  const words = text.split(' ');

  return (
    <div ref={quoteRef} className="flex flex-col items-center gap-4 max-w-[900px] text-center">
      <blockquote className="font-display text-[2.5rem] md:text-[3rem] font-light leading-[1.1] text-[#E8E4DF]">
        <span className="inline">&ldquo;</span>
        {words.map((word, index) => (
          <span
            key={index}
            className="inline-block transition-all duration-500 ease-out"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
              transitionDelay: isVisible ? `${index * 0.05}s` : '0s',
            }}
          >
            {word}
            {index < words.length - 1 ? '\u00A0' : ''}
          </span>
        ))}
        <span className="inline">&rdquo;</span>
      </blockquote>
      <cite
        className="font-mono text-[12px] tracking-[1px] text-[#6B6B6B] not-italic transition-opacity duration-700"
        style={{
          opacity: isVisible ? 1 : 0,
          transitionDelay: isVisible ? `${words.length * 0.05 + 0.2}s` : '0s',
        }}
      >
        &mdash; {author}
      </cite>
    </div>
  );
}

// ============================================================================
// Value Card Component
// ============================================================================

interface ValueCardProps {
  value: CoreValue;
  index: number;
  isVisible: boolean;
}

function ValueCard({ value, index, isVisible }: ValueCardProps) {
  const Icon = value.icon;

  return (
    <div
      data-animate
      data-animate-delay={index + 1}
      className="value-card flex flex-col items-center gap-5 w-[280px] md:w-[300px] p-[40px] bg-[#1A1A1A] border border-[rgba(255,255,255,0.08)] transition-all duration-600 ease-out"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transitionDelay: isVisible ? `${index * 0.1}s` : '0s',
      }}
    >
      <Icon className="w-8 h-8 text-[var(--accent-gold)]" />
      <h3 className="font-display text-[18px] text-[#E8E4DF] text-center">{value.title}</h3>
      <p className="font-body text-[14px] leading-[1.5] text-[#6B6B6B] text-center">{value.desc}</p>
    </div>
  );
}

// ============================================================================
// Core Values Section Component
// ============================================================================

export function CoreValuesSection() {
  const [cardsVisible, setCardsVisible] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCardsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (carouselRef.current) {
      observer.observe(carouselRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="flex flex-col items-center gap-[60px] p-[80px_60px] bg-[var(--background-dark)] border-b border-[var(--border)]">
      {/* Opening Quote */}
      <AnimatedQuote
        text="The mind, once stretched by a new idea, never returns to its original dimensions"
        author="Ralph Waldo Emerson"
      />

      {/* Collection Header */}
      <div className="flex flex-col items-center gap-3 w-full">
        <span className="font-mono text-[11px] font-medium tracking-[2px] uppercase text-[#6B6B6B]">
          [ OUR CORE VALUES ]
        </span>
        <div className="flex items-center gap-4">
          <span className="font-mono text-[11px] tracking-[1px] text-[var(--accent-gold)]">
            [ VALUES ]
          </span>
          <p className="font-body text-[15px] leading-[1.5] text-[#E8E4DF]">
            The four pillars that guide every Primus project.
          </p>
        </div>
      </div>

      {/* Horizontal Carousel Strip */}
      <div
        ref={carouselRef}
        className="scroll-strip gap-6 w-full px-4 md:justify-center"
        style={{
          display: 'flex',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {coreValues.map((value, i) => (
          <ValueCard key={i} value={value} index={i} isVisible={cardsVisible} />
        ))}
      </div>
    </section>
  );
}

export default CoreValuesSection;
