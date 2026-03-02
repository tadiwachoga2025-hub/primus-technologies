"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import Image from "next/image";

/* -----------------------------------------------------------------------------
 * Types
 * -------------------------------------------------------------------------- */

export interface CarouselProps {
  /** Code label displayed above the carousel, e.g. "C-1" */
  code: string;
  /** Title text for the collection */
  title: string;
  /** Optional description text */
  description?: string;
  /** Carousel cards as children */
  children: React.ReactNode;
}

export interface CarouselCardProps {
  /** Type label displayed at top-left of card */
  type: "video" | "image" | "article" | "quote" | "note" | "excerpt";
  /** Image URL for the card thumbnail */
  image?: string;
  /** Card title */
  title: string;
  /** Optional description (2-3 lines max) */
  description?: string;
  /** Optional source attribution */
  source?: string;
  /** Optional click handler */
  onClick?: () => void;
}

/* -----------------------------------------------------------------------------
 * CarouselCard Component
 * -------------------------------------------------------------------------- */

export function CarouselCard({
  type,
  image,
  title,
  description,
  source,
  onClick,
}: CarouselCardProps) {
  return (
    <article
      onClick={onClick}
      className="
        group
        flex-shrink-0
        w-[280px]
        sm:w-[300px]
        lg:w-[320px]
        scroll-snap-align-start
        cursor-pointer
        transition-all
        duration-300
        ease-out
        hover:-translate-y-[2px]
        hover:shadow-[var(--shadow-md)]
      "
      style={{ scrollSnapAlign: "start" }}
    >
      {/* Type Label */}
      <span
        className="
          block
          mb-2
          font-mono
          text-[10px]
          font-medium
          uppercase
          tracking-[1px]
          text-[var(--foreground-light)]
        "
      >
        {type}
      </span>

      {/* Thumbnail */}
      <div
        className="
          relative
          w-full
          aspect-[4/3]
          rounded-[4px]
          overflow-hidden
          bg-[var(--border)]
        "
      >
        {image ? (
          <Image
            src={image}
            alt={title}
            fill
            className="
              object-cover
              transition-transform
              duration-300
              ease-out
              group-hover:scale-[1.02]
            "
            sizes="(max-width: 640px) 280px, (max-width: 1024px) 300px, 320px"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-mono text-[11px] text-[var(--foreground-light)]">
              No image
            </span>
          </div>
        )}
      </div>

      {/* Title */}
      <h3
        className="
          mt-3
          font-body
          text-[0.875rem]
          font-medium
          leading-tight
          text-[var(--foreground)]
          line-clamp-2
        "
      >
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p
          className="
            mt-1.5
            font-body
            text-[0.8rem]
            leading-relaxed
            text-[var(--foreground-muted)]
            line-clamp-3
          "
        >
          {description}
        </p>
      )}

      {/* Source */}
      {source && (
        <span
          className="
            block
            mt-2
            font-mono
            text-[10px]
            uppercase
            tracking-[0.5px]
            text-[var(--foreground-light)]
          "
        >
          {source}
        </span>
      )}
    </article>
  );
}

/* -----------------------------------------------------------------------------
 * HorizontalCarousel Component
 * -------------------------------------------------------------------------- */

export function HorizontalCarousel({
  code,
  title,
  description,
  children,
}: CarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const lastX = useRef(0);
  const lastTime = useRef(0);
  const animationRef = useRef<number | null>(null);

  /**
   * Calculate velocity for momentum scrolling
   */
  const updateVelocity = useCallback((currentX: number) => {
    const now = performance.now();
    const dt = now - lastTime.current;
    if (dt > 0) {
      const dx = currentX - lastX.current;
      setVelocity(dx / dt);
    }
    lastX.current = currentX;
    lastTime.current = now;
  }, []);

  /**
   * Apply momentum scroll after drag release
   */
  const applyMomentum = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;

    let currentVelocity = velocity * 15; // Scale velocity
    const friction = 0.95; // Deceleration factor
    const minVelocity = 0.5;

    const animate = () => {
      if (Math.abs(currentVelocity) < minVelocity) {
        animationRef.current = null;
        return;
      }

      container.scrollLeft -= currentVelocity;
      currentVelocity *= friction;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();
  }, [velocity]);

  /**
   * Handle mouse down - start dragging
   */
  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const container = scrollRef.current;
      if (!container) return;

      // Cancel any ongoing momentum animation
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }

      setIsDragging(true);
      setStartX(e.pageX - container.offsetLeft);
      setScrollLeft(container.scrollLeft);
      lastX.current = e.pageX;
      lastTime.current = performance.now();
      setVelocity(0);
    },
    []
  );

  /**
   * Handle mouse move - scroll while dragging
   */
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isDragging) return;
      e.preventDefault();

      const container = scrollRef.current;
      if (!container) return;

      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 1.5; // Scroll multiplier
      container.scrollLeft = scrollLeft - walk;

      updateVelocity(e.pageX);
    },
    [isDragging, startX, scrollLeft, updateVelocity]
  );

  /**
   * Handle mouse up/leave - stop dragging
   */
  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      applyMomentum();
    }
  }, [isDragging, applyMomentum]);

  /**
   * Handle mouse leave
   */
  const handleMouseLeave = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      applyMomentum();
    }
  }, [isDragging, applyMomentum]);

  /**
   * Cleanup animation on unmount
   */
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <section className="w-full py-12 lg:py-16">
      {/* Collection Header */}
      <header className="px-[30px] sm:px-[40px] lg:px-[60px] mb-6">
        {/* Code Label */}
        <span
          className="
            inline-block
            mb-3
            font-mono
            text-[11px]
            font-medium
            uppercase
            tracking-[1px]
            text-[var(--foreground-light)]
          "
        >
          [ {code} ]
        </span>

        {/* Title */}
        <h2
          className="
            font-display
            text-[1.5rem]
            sm:text-[1.75rem]
            lg:text-[2rem]
            font-semibold
            tracking-[0.5px]
            text-[var(--foreground)]
          "
        >
          {title}
        </h2>

        {/* Description */}
        {description && (
          <p
            className="
              mt-2
              max-w-[600px]
              font-body
              text-[1rem]
              leading-relaxed
              text-[var(--foreground-muted)]
            "
          >
            {description}
          </p>
        )}
      </header>

      {/* Carousel Container */}
      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        className={`
          flex
          gap-3
          sm:gap-4
          overflow-x-auto
          scroll-snap-x
          scroll-snap-mandatory
          pl-[30px]
          sm:pl-[40px]
          lg:pl-[60px]
          pr-4
          pb-4
          select-none
          ${isDragging ? "cursor-grabbing" : "cursor-grab"}
        `}
        style={{
          scrollSnapType: "x mandatory",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {/* Hide scrollbar for webkit browsers */}
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        {children}

        {/* Right padding spacer */}
        <div className="flex-shrink-0 w-[30px] sm:w-[40px] lg:w-[60px]" aria-hidden="true" />
      </div>
    </section>
  );
}

/* -----------------------------------------------------------------------------
 * Default Export
 * -------------------------------------------------------------------------- */

export default HorizontalCarousel;
