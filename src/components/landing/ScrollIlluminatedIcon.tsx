'use client';

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface ScrollIlluminatedIconProps {
  children: React.ReactNode;
  className?: string;
  activeClassName?: string;
  color?: 'primary' | 'accent' | 'destructive';
}

/**
 * @fileOverview Narrative-Driven Icon Illuminator.
 * Uses IntersectionObserver to trigger a pulse effect when the icon enters the "Action Zone" (screen center).
 */
export function ScrollIlluminatedIcon({ 
  children, 
  className, 
  activeClassName,
  color = 'primary'
}: ScrollIlluminatedIconProps) {
  const [isActive, setIsActive] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsActive(entry.isIntersecting);
      },
      { 
        threshold: 0.1,
        // Target the center area of the viewport to guide the eye during scroll
        rootMargin: '-35% 0px -35% 0px' 
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const defaultActiveClasses = {
    primary: "border-primary/50 text-primary shadow-[0_0_25px_rgba(63,81,181,0.4)] scale-110 animate-icon-illumination",
    accent: "border-accent/50 text-accent shadow-[0_0_25px_rgba(0,255,120,0.4)] scale-110 animate-icon-illumination",
    destructive: "border-destructive/50 text-destructive shadow-[0_0_25px_rgba(255,0,0,0.4)] scale-110 animate-icon-illumination"
  };

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-700 ease-in-out inline-flex items-center justify-center rounded-lg bg-background border border-white/5",
        className,
        isActive ? (activeClassName || defaultActiveClasses[color]) : ""
      )}
    >
      {children}
    </div>
  );
}
