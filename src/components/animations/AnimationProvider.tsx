'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  type ReactNode,
} from 'react';

// ============================================================================
// Mood Context
// ============================================================================

interface MoodContextValue {
  mood: number;
  edition: string;
  nextEditionIn: number;
}

const MoodContext = createContext<MoodContextValue | undefined>(undefined);

export function useMood(): MoodContextValue {
  const context = useContext(MoodContext);
  if (!context) {
    throw new Error('useMood must be used within AnimationProvider');
  }
  return context;
}

// ============================================================================
// MoodTicker Component
// ============================================================================

interface MoodTickerProps {
  brandName?: string;
}

export function MoodTicker({ brandName = 'PRIMUS' }: MoodTickerProps) {
  const { mood, edition, nextEditionIn } = useMood();

  const formatCountdown = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-foreground text-background-white border-b border-border/20">
      <div className="flex items-center justify-between px-4 py-2 font-mono text-[10px] md:text-[11px] uppercase tracking-wider">
        <div className="flex items-center gap-4 md:gap-6">
          <span className="font-semibold">{brandName}</span>
          <span className="opacity-70">mood {mood}</span>
        </div>
        <div className="flex items-center gap-4 md:gap-6">
          <span className="hidden sm:inline opacity-70">edition {edition}</span>
          <span className="opacity-70">next edition in {formatCountdown(nextEditionIn)}</span>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Animation Provider
// ============================================================================

interface AnimationProviderProps {
  children: ReactNode;
  showMoodTicker?: boolean;
  brandName?: string;
}

export function AnimationProvider({
  children,
  showMoodTicker = true,
  brandName = 'PRIMUS',
}: AnimationProviderProps) {
  const [mood, setMood] = useState<number>(500);
  const [edition, setEdition] = useState<string>('');
  const [nextEditionIn, setNextEditionIn] = useState<number>(60);

  // Initialize mood and edition on mount
  useEffect(() => {
    const now = new Date();
    const initialMood = Math.floor(Math.random() * 1000) + 1;
    const timestamp = now.toISOString().slice(0, 19).replace('T', ' ');

    setMood(initialMood);
    setEdition(timestamp);
  }, []);

  // Update mood every 60 seconds
  useEffect(() => {
    const moodInterval = setInterval(() => {
      const newMood = Math.floor(Math.random() * 1000) + 1;
      const now = new Date();
      const timestamp = now.toISOString().slice(0, 19).replace('T', ' ');

      setMood(newMood);
      setEdition(timestamp);
      setNextEditionIn(60);
    }, 60000);

    return () => clearInterval(moodInterval);
  }, []);

  // Countdown timer (updates every second)
  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setNextEditionIn((prev) => (prev > 0 ? prev - 1 : 60));
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, []);

  const contextValue: MoodContextValue = {
    mood,
    edition,
    nextEditionIn,
  };

  // CSS custom properties based on mood
  const moodStyles = {
    '--mood-value': mood,
    '--mood-normalized': mood / 1000, // 0-1 range
    '--mood-hue': mood * 0.36, // 0-360 degree range
    '--mood-opacity': 0.3 + (mood / 1000) * 0.4, // 0.3-0.7 range
    '--mood-scale': 0.95 + (mood / 1000) * 0.1, // 0.95-1.05 range
  } as React.CSSProperties;

  return (
    <MoodContext.Provider value={contextValue}>
      <div style={moodStyles}>
        {showMoodTicker && <MoodTicker brandName={brandName} />}
        <div className={showMoodTicker ? 'pt-[44px]' : ''}>{children}</div>
      </div>
    </MoodContext.Provider>
  );
}

// ============================================================================
// Scroll Animation Hook
// ============================================================================

interface UseScrollAnimationOptions {
  threshold?: number;
  triggerOnce?: boolean;
  rootMargin?: string;
}

export function useScrollAnimation(options: UseScrollAnimationOptions = {}) {
  const { threshold = 0.15, triggerOnce = true, rootMargin = '0px' } = options;
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, triggerOnce, rootMargin]);

  return { ref, isVisible };
}

// ============================================================================
// Stagger Children Component
// ============================================================================

export interface StaggerChildrenProps {
  children: React.ReactNode;
  staggerDelay?: number; // in seconds
  className?: string;
  as?: React.ElementType;
}

export function StaggerChildren({
  children,
  staggerDelay = 0.075,
  className = '',
  as: Component = 'div',
}: StaggerChildrenProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  const childArray = React.Children.toArray(children);

  return (
    <Component ref={ref as any} className={className}>
      {childArray.map((child, index) => (
        <div
          key={index}
          className={`transition-all duration-700 ease-smooth ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          style={{
            transitionDelay: isVisible ? `${index * staggerDelay}s` : '0s',
          }}
        >
          {child}
        </div>
      ))}
    </Component>
  );
}

// ============================================================================
// Preset Animation Classes (for use with scroll hook)
// ============================================================================

export const animationPresets = {
  fadeIn: (isVisible: boolean) =>
    `transition-all duration-700 ease-smooth ${isVisible ? 'opacity-100' : 'opacity-0'
    }`,

  fadeInUp: (isVisible: boolean) =>
    `transition-all duration-700 ease-smooth ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
    }`,

  fadeInDown: (isVisible: boolean) =>
    `transition-all duration-700 ease-smooth ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
    }`,

  fadeInLeft: (isVisible: boolean) =>
    `transition-all duration-700 ease-smooth ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
    }`,

  fadeInRight: (isVisible: boolean) =>
    `transition-all duration-700 ease-smooth ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
    }`,

  scaleIn: (isVisible: boolean) =>
    `transition-all duration-700 ease-smooth ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
    }`,
};
