"use client";

import { HeroCanvas } from "@/components/HeroCanvas";
import { ServicesSection } from "@/components/ServicesSection";
import { AboutUs } from "@/components/AboutUs";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Home() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Deep Violet for light mode visibility, Electric Purple for dark mode
  const particleColor = resolvedTheme === "dark" ? "#A855F7" : "#4C1D95";
  const particleOpacity = resolvedTheme === "dark" ? 0.65 : 0.8;
  const headlineColor = resolvedTheme === "dark" ? "#A855F7" : "#4C1D95";

  return (
    <>
      <main className="relative z-0 w-full min-h-screen bg-[var(--background)] transition-colors duration-500 overflow-hidden">
        
        {/* Continuous grid background — matches ServicesSection for seamless transition */}
        <div className="absolute inset-0 z-0 [background-image:linear-gradient(to_right,rgba(107,33,168,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(107,33,168,0.04)_1px,transparent_1px)] [background-size:64px_64px]" />

        {/* Interactive Particle Canvas */}
        <div className="absolute inset-0 z-[1]">
          {mounted && <HeroCanvas color={particleColor} opacity={particleOpacity} />}
        </div>

        {/* UI Overlay */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">
          
          {/* System Online Badge */}
          <motion.div
            className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-200 dark:border-purple-500/30 bg-purple-50 dark:bg-purple-500/10 backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500" />
            </span>
            <span className="text-sm text-purple-700 dark:text-purple-300 font-mono">System Online</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
            style={{
              fontFamily: "var(--font-geist-mono), monospace",
              color: mounted ? headlineColor : "#4C1D95",
            }}
          >
            Engineering Digital Infrastructure.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mb-10"
          >
            Cypher Solutions builds scalable, high-performance web platforms for
            startups, enterprises, and modern brands.
          </motion.p>

          {/* CTA Button Group */}
          <motion.div
            className="flex flex-col sm:flex-row items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.55, ease: "easeOut" }}
          >
            {/* Primary CTA */}
            <a
              href="/services"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-white bg-purple-600 dark:bg-purple-500 hover:bg-purple-700 dark:hover:bg-purple-400 shadow-lg shadow-purple-500/30 dark:shadow-purple-500/20 transition-all duration-300 hover:scale-105 hover:shadow-purple-500/50"
            >
              Explore Services
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </a>

            {/* Secondary CTA */}
            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-purple-700 dark:text-purple-300 bg-transparent border border-purple-300 dark:border-purple-500/50 hover:bg-purple-50 dark:hover:bg-purple-500/10 transition-all duration-300 hover:scale-105"
            >
              Request a Demo
            </a>
          </motion.div>
        </div>
      </main>

      {/* Services Section — below the fold */}
      <ServicesSection />

      {/* Leadership & Personnel Section (Consolidated) */}
      <AboutUs />
    </>
  );
}

