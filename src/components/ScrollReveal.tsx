"use client";

import React, { useEffect, useRef, useState } from "react";

interface ScrollRevealProps {
  children: React.ReactNode;
  baseOpacity?: number;
  enableBlur?: boolean;
  baseRotation?: number;
  blurStrength?: number;
  className?: string;
}

export default function ScrollReveal({
  children,
  baseOpacity = 0,
  enableBlur = true,
  baseRotation = 5,
  blurStrength = 10,
  className = "",
}: ScrollRevealProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Anima apenas uma vez
        }
      },
      {
        threshold: 0.2, // Dispara quando 20% do elemento estiver visível
        rootMargin: "0px 0px -50px 0px",
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const style = {
    opacity: isVisible ? 1 : baseOpacity,
    transform: isVisible 
      ? "rotate(0deg) translateY(0)" 
      : `rotate(${baseRotation}deg) translateY(20px)`,
    filter: enableBlur 
      ? (isVisible ? "blur(0px)" : `blur(${blurStrength}px)`) 
      : "none",
    transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1)",
  };

  return (
    <div ref={elementRef} style={style} className={className}>
      {children}
    </div>
  );
}