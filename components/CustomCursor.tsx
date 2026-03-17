"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const rafRef = useRef<number>(0);

  const rawX = useMotionValue(-100);
  const rawY = useMotionValue(-100);

  // Dot follows tightly
  const dotX = useSpring(rawX, { stiffness: 800, damping: 60, mass: 0.4 });
  const dotY = useSpring(rawY, { stiffness: 800, damping: 60, mass: 0.4 });

  // Ring lags behind for trailing effect
  const ringX = useSpring(rawX, { stiffness: 200, damping: 30, mass: 0.8 });
  const ringY = useSpring(rawY, { stiffness: 200, damping: 30, mass: 0.8 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        rawX.set(e.clientX);
        rawY.set(e.clientY);
        if (!isVisible) setIsVisible(true);
      });
    };

    const onLeave = () => setIsVisible(false);
    const onEnter = () => setIsVisible(true);

    // Detect hoverable elements
    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const clickable = target.closest(
        "a, button, [role='button'], input, textarea, select, label, [data-cursor-hover]"
      );
      setIsHovering(!!clickable);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
      cancelAnimationFrame(rafRef.current);
    };
  }, [rawX, rawY, isVisible]);

  return (
    <>
      {/* Trailing ring */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[9999] rounded-full"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
          border: "1.5px solid rgba(168, 85, 247, 0.35)",
          boxShadow: isHovering
            ? "0 0 12px rgba(168, 85, 247, 0.4)"
            : "0 0 4px rgba(168, 85, 247, 0.15)",
        }}
        animate={{
          width: isHovering ? 44 : 32,
          height: isHovering ? 44 : 32,
          opacity: isVisible ? 1 : 0,
          borderColor: isHovering
            ? "rgba(168, 85, 247, 0.7)"
            : "rgba(168, 85, 247, 0.35)",
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      />

      {/* Core dot */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[9999] rounded-full bg-purple-400"
        style={{
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: isHovering ? 6 : 5,
          height: isHovering ? 6 : 5,
          opacity: isVisible ? 1 : 0,
          backgroundColor: isHovering
            ? "rgba(216, 180, 254, 1)"
            : "rgba(192, 132, 252, 1)",
          boxShadow: isHovering
            ? "0 0 10px 3px rgba(192, 132, 252, 0.7)"
            : "0 0 6px 2px rgba(192, 132, 252, 0.4)",
        }}
        transition={{ duration: 0.15, ease: "easeOut" }}
      />
    </>
  );
}
