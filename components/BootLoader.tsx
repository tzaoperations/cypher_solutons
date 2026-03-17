"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";

const SESSION_KEY = "cy_boot_done";
type Phase = "counting" | "flash" | "reveal" | "done";

export function BootLoader() {
  // 1. ALL HOOKS MUST BE DECLARED AT THE TOP LEVEL
  const [show, setShow] = useState(false);
  const [phase, setPhase] = useState<Phase>("counting");
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  
  // EXTRACTED: This was previously inside the conditional JSX
  const progressWidth = useTransform(count, [0, 100], ["0%", "100%"]);
  
  const [displayCount, setDisplayCount] = useState(0);
  const mountedRef = useRef(false);

  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;

    if (typeof sessionStorage === "undefined") return;
    if (sessionStorage.getItem(SESSION_KEY)) return;

    setShow(true);

    const unsubscribe = rounded.on("change", setDisplayCount);

    const controls = animate(count, 100, {
      duration: 1.8,
      ease: [0.12, 0, 0.88, 1],
      onComplete: () => {
        setPhase("flash");
        setTimeout(() => {
          setPhase("reveal");
          setTimeout(() => {
            setPhase("done");
            sessionStorage.setItem(SESSION_KEY, "1");
          }, 950);
        }, 650);
      },
    });

    return () => {
      controls.stop();
      unsubscribe();
    };
  }, [count, rounded]);

  // 2. EARLY RETURN MUST BE AFTER ALL HOOKS
  if (!show || phase === "done") return null;

  // 3. MAIN RENDER
  return (
    <div className="fixed inset-0 z-[1000] pointer-events-none overflow-hidden">

      {/* ── Top panel ── */}
      <motion.div
        className="absolute inset-x-0 top-0 h-1/2 bg-[#0B0F14]"
        animate={phase === "reveal" ? { y: "-100%" } : { y: 0 }}
        transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
      />

      {/* ── Bottom panel ── */}
      <motion.div
        className="absolute inset-x-0 bottom-0 h-1/2 bg-[#0B0F14]"
        animate={phase === "reveal" ? { y: "100%" } : { y: 0 }}
        transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
      />

      {/* ── Centred content (visible only during counting + flash) ── */}
      {(phase === "counting" || phase === "flash") && (
        <div className="absolute inset-0 flex flex-col items-center justify-center select-none">
          <AnimatePresence mode="wait">

            {/* Counter view */}
            {phase === "counting" && (
              <motion.div
                key="counter"
                className="flex flex-col items-center gap-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
              >
                {/* Big numeric counter */}
                <div
                  className="font-mono font-bold leading-none tracking-tighter"
                  style={{
                    fontSize: "clamp(5rem,13vw,10rem)",
                    color: "transparent",
                    WebkitTextStroke: "1px rgba(168,85,247,0.65)",
                    textShadow: "0 0 60px rgba(168,85,247,0.12)",
                  }}
                >
                  {String(displayCount).padStart(3, "0")}
                  <span
                    style={{
                      fontSize: "0.35em",
                      verticalAlign: "super",
                      marginLeft: "0.15em",
                      opacity: 0.45,
                    }}
                  >
                    %
                  </span>
                </div>

                {/* Thin progress bar */}
                <div className="w-44 h-px bg-white/10 relative overflow-hidden rounded-full">
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-purple-500 rounded-full"
                    style={{ width: progressWidth }}
                  />
                </div>

                {/* Label */}
                <p className="font-mono text-[10px] tracking-[0.4em] uppercase text-purple-400/45">
                  System Initializing…
                </p>
              </motion.div>
            )}

            {/* CYPHER flash */}
            {phase === "flash" && (
              <motion.div
                key="flash"
                className="font-mono font-black tracking-[0.22em] uppercase"
                style={{
                  fontSize: "clamp(3.5rem,11vw,9rem)",
                  color: "transparent",
                  WebkitTextStroke: "1px rgba(168,85,247,0.95)",
                  textShadow:
                    "0 0 24px rgba(168,85,247,0.55), 0 0 80px rgba(168,85,247,0.2)",
                  letterSpacing: "0.22em",
                }}
                initial={{ opacity: 0, scale: 0.9, filter: "blur(12px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{
                  opacity: 0,
                  scale: 1.08,
                  filter: "blur(6px)",
                  transition: { duration: 0.25 },
                }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                CYPHER
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      )}
    </div>
  );
}