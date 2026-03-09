'use client';

import React, { useEffect, useRef, useState, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface IntersectionRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  once?: boolean;
}

/**
 * @fileOverview Universal Scroll Reveal Node.
 * Utilizes Intersection Observer to trigger high-fidelity entry animations.
 */
export function IntersectionReveal({ 
  children, 
  className, 
  delay = 0,
  once = true 
}: IntersectionRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.unobserve(entry.target);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [once]);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        "transition-all duration-1000 ease-out",
        isVisible 
          ? "opacity-100 translate-y-0" 
          : "opacity-0 translate-y-8",
        className
      )}
    >
      {children}
    </div>
  );
}
