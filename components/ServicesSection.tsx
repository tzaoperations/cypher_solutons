"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ─────────────────────────────────────────────
// Services data
// ─────────────────────────────────────────────
const SERVICES = [
  {
    icon: "☁️",
    title: "Cloud Infrastructure",
    desc: "Architecting scalable, fault-tolerant cloud systems on AWS, GCP, and Azure — built for zero-downtime at any load.",
    tags: ["AWS", "Terraform", "Kubernetes"],
  },
  {
    icon: "⚡",
    title: "Full-Stack Development",
    desc: "End-to-end engineering with Next.js, React, and Node — from pixel-perfect UIs to high-throughput APIs.",
    tags: ["Next.js", "TypeScript", "PostgreSQL"],
  },
  {
    icon: "🔷",
    title: "Data Engineering",
    desc: "Building robust data pipelines, real-time analytics platforms, and ML-ready infrastructure for data-driven teams.",
    tags: ["Spark", "dbt", "Snowflake"],
  },
];

// Terminal lines that type out in Phase 1
const CODE_LINES = [
  "$ cypher --init production",
  "  [✓] Environment validated",
  "  [✓] Dependencies resolved (847 packages)",
  "  [✓] Schema migrations applied",
  "  [✓] CDN assets pre-warmed",
  "  [✓] Security scan complete — 0 issues",
  "  [>] Compiling service modules...",
];

// Shared outline style for the SERVICES word
const SERVICES_TEXT_STYLE: React.CSSProperties = {
  fontFamily: "var(--font-geist-mono), monospace",
  color: "transparent",
  WebkitTextStroke: "2px",
  WebkitTextStrokeColor: "var(--accent, #7C3AED)",
};

export function ServicesSection() {
  // ── Refs ────────────────────────────────
  const sectionRef      = useRef<HTMLElement>(null);
  const terminalRef     = useRef<HTMLDivElement>(null);
  const progressBarRef  = useRef<HTMLDivElement>(null);
  const progressLblRef  = useRef<HTMLParagraphElement>(null);
  const terminalWrapRef = useRef<HTMLDivElement>(null);   // terminal + progress bar block
  const stageRef        = useRef<HTMLDivElement>(null);   // min-h stage that the terminal occupies
  const servicesRef     = useRef<HTMLHeadingElement>(null); // THE single SERVICES element
  const subtitleRef     = useRef<HTMLDivElement>(null);
  const gridRef         = useRef<HTMLDivElement>(null);

  const [codeLines, setCodeLines] = useState<string[]>([]);

  useGSAP(
    () => {
      const stage      = stageRef.current;
      const terminal   = terminalWrapRef.current;
      const services   = servicesRef.current;
      const subtitle   = subtitleRef.current;
      const grid       = gridRef.current;

      // All refs must be present — no early return (hooks rule satisfied above)
      if (!stage || !terminal || !services || !subtitle || !grid) return;

      // ── Calculate the vertical offset so SERVICES appears
      //    centered inside the stage when the timeline starts.
      //
      //    The element's natural position is at top of section (y=0).
      //    The stage center is at: stage.offsetTop + stage.offsetHeight / 2
      //    The services element center is: services.offsetTop + services.offsetHeight / 2
      //    Delta = stage center − services center  → push DOWN by this much to start
      const getStartY = () => {
        const stageCenterY  = stage.offsetTop + stage.offsetHeight / 2;
        const servicesCenterY = services.offsetTop + services.offsetHeight / 2;
        return stageCenterY - servicesCenterY; // positive = push down
      };

      // Start the element invisible and translated to the center of the stage
      gsap.set(services, { opacity: 0, scale: 0.8, y: getStartY() });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          once: true,
        },
      });

      // ── Phase 0: Fade terminal in
      tl.fromTo(
        terminal,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
      );

      // ── Phase 1: Type out code lines one by one
      CODE_LINES.forEach((_, idx) => {
        tl.call(() => {
          setCodeLines((prev) => [...prev, CODE_LINES[idx]]);
        }, [], "+=0.18");
      });

      // ── Phase 1b: Progress bar appears & fills
      const progressBlock = terminal.querySelector<HTMLElement>(".progress-block");
      const progressBar   = progressBarRef.current;
      const progressLbl   = progressLblRef.current;

      if (progressBlock) {
        tl.fromTo(progressBlock, { opacity: 0 }, { opacity: 1, duration: 0.3 }, "+=0.1");
      }
      if (progressBar) {
        tl.fromTo(
          progressBar,
          { scaleX: 0 },
          { scaleX: 1, duration: 1.2, ease: "power1.inOut", transformOrigin: "left center" }
        );
      }

      // Counter label 0% → 100%
      const counter = { val: 0 };
      tl.to(
        counter,
        {
          val: 100,
          duration: 1.2,
          ease: "power1.inOut",
          onUpdate() {
            if (progressLbl) {
              progressLbl.textContent = `Rendering services... ${Math.round(counter.val)}%`;
            }
          },
        },
        "<"
      );

      // ── Phase 2: Fade terminal out
      tl.to(terminal, { opacity: 0, duration: 0.4 }, "+=0.15");

      // ── Phase 3: Scale SERVICES up (0.8 → 1.0) simultaneously, still at stage center
      tl.to(
        services,
        { opacity: 1, scale: 1.0, duration: 0.55, ease: "back.out(1.7)" },
        "<0.1"
      );

      // ── Phase 3b: Morph SERVICES from stage-center to its header position (y → 0)
      //    onComplete: collapse the stage so no dead air is left below SERVICES
      tl.to(
        services,
        {
          y: 0,
          scale: 1,
          duration: 0.7,
          ease: "power3.inOut",
          onComplete() {
            // Collapse the stage height so the layout closes up cleanly
            if (stage) {
              gsap.to(stage, { height: 0, minHeight: 0, duration: 0.35, ease: "power2.inOut", marginTop: 0 });
            }
            // Make services headline pointer-events active once settled
            if (services) services.style.pointerEvents = "auto";
          },
        },
        "+=0.25"
      );

      // ── Phase 4: Stagger subtitle children (h2 + p)
      const subtitleItems = subtitle.querySelectorAll<HTMLElement>(".animate-in");
      if (subtitleItems.length) {
        tl.fromTo(
          subtitleItems,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.15, ease: "power2.out" },
          "+=0.05"
        );
      }

      // ── Phase 5: Service cards stagger in
      const cards = grid.querySelectorAll<HTMLElement>(".service-card");
      if (cards.length) {
        tl.fromTo(
          cards,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: "power2.out" },
          "+=0.1"
        );
      }
    },
    { scope: sectionRef }
  );

  return (
    /* z-10 so Services sits above the Hero (z-0) — no particle bleed-over */
    <section
      ref={sectionRef}
      id="services"
      className="relative z-10 w-full pt-0 pb-24 px-6 bg-[var(--background)] overflow-hidden"
    >
      {/* Subtle grid background */}
      <div className="absolute inset-0 [background-image:linear-gradient(to_right,rgba(107,33,168,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(107,33,168,0.05)_1px,transparent_1px)] [background-size:64px_64px]" />

      <div className="relative max-w-6xl mx-auto">

        {/* ══ SINGLE SERVICES HEADER ══════════════════════════════
            Lives here at the natural top of the section (final position).
            GSAP sets its initial y to push it down to the stage center,
            then animates it up to y=0 — this IS the header, no clone needed.
        ═══════════════════════════════════════════════════════════ */}
        <h2
          ref={servicesRef}
          className="text-center text-7xl md:text-9xl font-bold tracking-tighter select-none leading-none pb-2 opacity-0 pointer-events-none"
          style={SERVICES_TEXT_STYLE}
          aria-label="Services"
        >
          SERVICES
        </h2>

        {/* ══ TERMINAL STAGE ══════════════════════════════════════
            min-h keeps layout stable while the terminal plays.
            Once collapsed by GSAP (opacity 0), the stage shrinks
            naturally because the SERVICES header is now in-flow above.
        ═══════════════════════════════════════════════════════════ */}
        <div ref={stageRef} className="relative min-h-[340px] flex items-center justify-center -mt-2">
          {/* Terminal block + progress bar */}
          <div ref={terminalWrapRef} className="w-full opacity-0">
            {/* Terminal window */}
            <div className="mx-auto max-w-2xl rounded-xl overflow-hidden border border-slate-200 dark:border-purple-900/60 shadow-2xl shadow-purple-500/10 bg-slate-50 dark:bg-slate-900/50">
              {/* Chrome bar */}
              <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700/50">
                <span className="w-3 h-3 rounded-full bg-red-400" />
                <span className="w-3 h-3 rounded-full bg-yellow-400" />
                <span className="w-3 h-3 rounded-full bg-green-400" />
                <span className="ml-3 text-xs font-mono text-slate-400">cypher-cli — bash</span>
              </div>
              {/* Terminal body */}
              <div
                ref={terminalRef}
                className="bg-slate-950 p-5 min-h-[200px] font-mono text-sm leading-7"
              >
                {codeLines.map((line, i) => (
                  <div
                    key={i}
                    className={
                      line.startsWith("$")
                        ? "text-purple-400"
                        : line.includes("[✓]")
                        ? "text-emerald-400"
                        : "text-amber-400"
                    }
                  >
                    {line}
                    {i === codeLines.length - 1 && (
                      <span className="inline-block w-2 h-4 ml-1 bg-current animate-pulse" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Progress bar — uses class selector inside useGSAP */}
            <div className="progress-block mt-4 mx-auto max-w-2xl">
              <p
                ref={progressLblRef}
                className="text-xs font-mono text-purple-600 dark:text-purple-400 mb-2"
              >
                Rendering services... 0%
              </p>
              <div className="h-1.5 w-full rounded-full bg-purple-100 dark:bg-purple-950/60 overflow-hidden">
                <div
                  ref={progressBarRef}
                  className="h-full rounded-full bg-gradient-to-r from-purple-600 to-purple-400"
                  style={{ transform: "scaleX(0)", transformOrigin: "left center" }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ══ SUBTITLE — stagger-in after SERVICES settles ════════ */}
        <div ref={subtitleRef} className="text-center mt-6 mb-8">
          {/* Technical label */}
          <span
            className="animate-in block text-[0.75rem] uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400 font-mono mb-1 opacity-0"
          >
            What We
          </span>
          {/* Display word */}
          <h3
            className="animate-in text-4xl md:text-5xl font-bold tracking-tighter text-[#4C1D95] dark:text-[#A855F7] leading-none mb-3 opacity-0"
            style={{ fontFamily: "var(--font-geist-mono), monospace" }}
          >
            Build
          </h3>
          <p className="animate-in text-slate-600 dark:text-slate-400 max-w-xl mx-auto text-base md:text-lg opacity-0">
            Precision-engineered solutions for teams that move fast and break nothing.
          </p>
        </div>

        {/* ══ SERVICE CARDS GRID ══════════════════════════════════ */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
          {SERVICES.map((service) => (
            <div
              key={service.title}
              className="service-card group relative rounded-2xl p-7 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 hover:border-purple-400 dark:hover:border-purple-500/60 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 opacity-0"
            >
              {/* Glow on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/0 to-purple-500/0 group-hover:from-purple-500/5 group-hover:to-purple-500/0 transition-all duration-500" />

              <div className="relative">
                <span className="text-3xl mb-5 block">{service.icon}</span>
                <h4
                  className="text-lg font-bold mb-3 text-slate-900 dark:text-white"
                  style={{ fontFamily: "var(--font-geist-mono), monospace" }}
                >
                  {service.title}
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-5">
                  {service.desc}
                </p>
                <div className="flex flex-wrap gap-2">
                  {service.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 text-xs font-mono rounded-full text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
