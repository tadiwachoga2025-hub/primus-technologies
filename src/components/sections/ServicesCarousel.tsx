'use client';

import React, { useRef, useEffect, useState } from 'react';
import { ShieldCheck, Cloud, Server, Globe, type LucideIcon } from 'lucide-react';

// ============================================================================
// Types
// ============================================================================

interface ServiceCard {
  icon: LucideIcon;
  title: string;
  description: string;
}

// ============================================================================
// Service Data
// ============================================================================

const services: ServiceCard[] = [
  {
    icon: ShieldCheck,
    title: 'Enterprise Cybersecurity',
    description:
      'Security risk assessments, firewall & endpoint security deployment, threat monitoring, and compliance-driven infrastructure.',
  },
  {
    icon: Cloud,
    title: 'Cloud & Infrastructure Architecture',
    description:
      'Cloud migration and optimization, hybrid cloud deployment, virtualization solutions, and disaster recovery planning.',
  },
  {
    icon: Server,
    title: 'Managed IT Services',
    description:
      'SLA-based support for enterprises, remote monitoring systems, infrastructure lifecycle management, and IT governance.',
  },
  {
    icon: Globe,
    title: 'International Remote Technology Services',
    description:
      'DevOps and system monitoring, infrastructure automation, global cloud management, and 24/7 remote support.',
  },
];

// ============================================================================
// Scroll Animation Hook
// ============================================================================

function useScrollAnimation(threshold = 0.15) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element);
        }
      },
      { threshold }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}

// ============================================================================
// Service Card Component
// ============================================================================

interface ServiceCardProps {
  service: ServiceCard;
  index: number;
  isVisible: boolean;
}

function ServiceCardItem({ service, index, isVisible }: ServiceCardProps) {
  const Icon = service.icon;

  return (
    <article
      className={`
        group flex-shrink-0 flex flex-col gap-5
        w-[320px] md:w-[340px] lg:w-[360px]
        p-8 md:p-10
        bg-[#1A1A1A] border border-[var(--border)]/30
        transition-all duration-700 ease-out
        hover:translate-y-[-4px] hover:shadow-[0_16px_40px_rgba(0,0,0,0.4)]
        hover:border-[var(--accent-gold)]/40
        cursor-pointer
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
      `}
      style={{
        transitionDelay: isVisible ? `${index * 0.1 + 0.2}s` : '0s',
      }}
    >
      {/* Type Label */}
      <span className="font-mono text-[10px] font-medium tracking-[2px] uppercase text-[var(--foreground-light)]/60">
        SERVICE
      </span>

      {/* Icon */}
      <div className="flex items-center justify-center w-12 h-12 bg-[var(--accent-gold)]/10 border border-[var(--accent-gold)]/20 transition-all duration-300 group-hover:bg-[var(--accent-gold)]/20 group-hover:border-[var(--accent-gold)]/40">
        <Icon className="w-6 h-6 text-[var(--accent-gold)]" strokeWidth={1.5} />
      </div>

      {/* Title */}
      <h3 className="font-body text-[20px] font-medium text-white leading-tight">
        {service.title}
      </h3>

      {/* Description */}
      <p className="font-body text-[14px] leading-[1.65] text-[var(--foreground-light)] mt-auto">
        {service.description}
      </p>

      {/* Bottom indicator line */}
      <div className="h-[1px] w-0 bg-[var(--accent-gold)] transition-all duration-500 group-hover:w-full" />
    </article>
  );
}

// ============================================================================
// Main Services Carousel Component
// ============================================================================

export default function ServicesCarousel() {
  const { ref: sectionRef, isVisible } = useScrollAnimation(0.1);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Check scroll position to update arrow states
  const checkScrollPosition = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 10
    );
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener('scroll', checkScrollPosition);
    checkScrollPosition();

    return () => container.removeEventListener('scroll', checkScrollPosition);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const cardWidth = 360;
    const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      className="relative flex flex-col gap-12 md:gap-16 py-20 md:py-24 bg-[var(--background-dark)] border-b border-[var(--border)]/20 overflow-hidden"
    >
      {/* Section Header */}
      <div className="flex flex-col gap-5 px-8 md:px-16 lg:px-20 max-w-[800px]">
        {/* Code Label */}
        <span
          className={`
            font-mono text-[11px] font-medium tracking-[2px] uppercase text-[var(--accent-gold)]/80
            transition-all duration-700
            ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
          `}
        >
          [ EXPERTISE ]
        </span>

        {/* Title */}
        <h2
          className={`
            font-display text-[32px] md:text-[40px] leading-[1.15] text-white
            transition-all duration-700 delay-100
            ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
          `}
        >
          End-to-End Enterprise Solutions
        </h2>

        {/* Description */}
        <p
          className={`
            font-body text-[15px] md:text-[16px] leading-[1.65] text-[var(--foreground-light)] max-w-[600px]
            transition-all duration-700 delay-200
            ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
          `}
        >
          From cybersecurity to global cloud management, we provide the backbone
          for critical operations. Our comprehensive suite of services ensures
          your digital infrastructure is secure, scalable, and future-ready.
        </p>
      </div>

      {/* Carousel Section */}
      <div className="flex flex-col gap-6">
        {/* Collection Header */}
        <div className="flex items-center justify-between px-8 md:px-16 lg:px-20">
          <p
            className={`
              font-body text-[13px] text-[var(--foreground-light)]/70 italic
              transition-all duration-700 delay-300
              ${isVisible ? 'opacity-100' : 'opacity-0'}
            `}
          >
            Swipe or drag to explore our core capabilities.
          </p>

          {/* Navigation Arrows */}
          <div
            className={`
              hidden md:flex items-center gap-2
              transition-all duration-700 delay-300
              ${isVisible ? 'opacity-100' : 'opacity-0'}
            `}
          >
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={`
                w-10 h-10 flex items-center justify-center border border-[var(--border)]/30
                transition-all duration-300
                ${
                  canScrollLeft
                    ? 'text-white hover:bg-white/5 hover:border-[var(--accent-gold)]/40'
                    : 'text-[var(--foreground-light)]/30 cursor-not-allowed'
                }
              `}
              aria-label="Scroll left"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={`
                w-10 h-10 flex items-center justify-center border border-[var(--border)]/30
                transition-all duration-300
                ${
                  canScrollRight
                    ? 'text-white hover:bg-white/5 hover:border-[var(--accent-gold)]/40'
                    : 'text-[var(--foreground-light)]/30 cursor-not-allowed'
                }
              `}
              aria-label="Scroll right"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Horizontal Scroll Strip */}
        <div
          ref={scrollContainerRef}
          className="flex gap-5 md:gap-6 overflow-x-auto scrollbar-hide pl-8 md:pl-16 lg:pl-20 pr-8 pb-4"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {services.map((service, index) => (
            <ServiceCardItem
              key={service.title}
              service={service}
              index={index}
              isVisible={isVisible}
            />
          ))}

          {/* Right edge spacer for bleeding effect */}
          <div className="flex-shrink-0 w-8 md:w-16 lg:w-20" aria-hidden="true" />
        </div>

        {/* Scroll Indicator (mobile) */}
        <div
          className={`
            flex md:hidden items-center justify-center gap-2 px-8
            transition-all duration-700 delay-500
            ${isVisible ? 'opacity-100' : 'opacity-0'}
          `}
        >
          {services.map((_, index) => (
            <div
              key={index}
              className="w-1.5 h-1.5 rounded-full bg-[var(--foreground-light)]/30"
            />
          ))}
        </div>
      </div>

      {/* Subtle gradient overlay on right edge */}
      <div
        className="absolute right-0 top-0 bottom-0 w-24 md:w-32 pointer-events-none bg-gradient-to-l from-[var(--background-dark)] to-transparent"
        aria-hidden="true"
      />
    </section>
  );
}
