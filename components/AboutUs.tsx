"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HologramCard } from "./HologramCard";

gsap.registerPlugin(ScrollTrigger);

export function AboutUs() {
  const sectionRef = useRef<HTMLElement>(null);
  
  // TIER 1: CO-FOUNDERS
  const terminalRef = useRef<HTMLDivElement>(null);
  const cardsWrapRef = useRef<HTMLDivElement>(null);
  const textContentRef = useRef<HTMLDivElement>(null);
  const [logText, setLogText] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  // TIER 2: COO
  const cooWrapRef = useRef<HTMLDivElement>(null);
  const cooImageRef = useRef<HTMLImageElement>(null);
  const cooLaserRef = useRef<HTMLDivElement>(null);

  // TIER 3: CTO
  const ctoWrapRef = useRef<HTMLDivElement>(null);
  const ctoImageTrueRef = useRef<HTMLDivElement>(null);
  const ctoLaserH1Ref = useRef<HTMLDivElement>(null);
  const ctoLaserH2Ref = useRef<HTMLDivElement>(null);
  const [ctoBioLog, setCtoBioLog] = useState(["", "", ""]);

  useGSAP(() => {
    if (!sectionRef.current) return;

    // ==========================================
    // TIER 1: CO-FOUNDERS ANIMATION
    // ==========================================
    const tl1 = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 60%",
        once: true,
      },
    });

    const text1 = "> DECRYPTING LEADERSHIP...";
    const text2 = "> ABOUT US";

    tl1.to({}, {
      duration: 1.5,
      onUpdate: function() {
        const progress = Math.floor(this.progress() * text1.length);
        setLogText(text1.substring(0, progress));
      },
      ease: "none",
    });
    tl1.to({}, { duration: 1.0 });
    tl1.to({}, {
      duration: 0.8,
      onUpdate: function() {
        const progress = Math.floor((1 - this.progress()) * text1.length);
        setLogText(text1.substring(0, progress));
      },
      ease: "power2.in",
    });
    tl1.to({}, { duration: 0.3 });
    tl1.to({}, {
      duration: 0.8,
      onUpdate: function() {
        const progress = Math.floor(this.progress() * text2.length);
        setLogText(text2.substring(0, progress));
      },
      ease: "none",
    });

    const cards = cardsWrapRef.current?.querySelectorAll(".hologram-card-wrap");
    if (cards && cards.length === 2) {
      const [card1, card2] = Array.from(cards);
      
      gsap.set(card1, { x: 100, scale: 1.0, opacity: 0 });
      gsap.set(card2, { x: -100, scale: 1.0, opacity: 0 });

      tl1.to([card1, card2], { opacity: 1, duration: 0.5, stagger: 0.1 }, "-=3.0");
      
      tl1.to([card1, card2], {
        x: 0,
        scale: 0.75,
        duration: 1.2,
        ease: "power3.inOut"
      }, "+=0.2");

      if (textContentRef.current) {
        tl1.fromTo(textContentRef.current, 
          { opacity: 0, y: 30, filter: "blur(5px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.0, ease: "power2.out" },
          "-=0.6"
        );
      }
    }


    // ==========================================
    // TIER 2: COO ANIMATION (Laser Print)
    // ==========================================
    const tl2 = gsap.timeline({
      scrollTrigger: {
        trigger: cooWrapRef.current,
        start: "top 70%",
        once: true,
      },
    });

    // The image starts clipped entirely to the bottom (invisible)
    gsap.set(cooImageRef.current, { clipPath: "inset(100% 0 0 0)" });
    // The laser line starts at the bottom
    gsap.set(cooLaserRef.current, { top: "100%", opacity: 0 });

    tl2.to(cooLaserRef.current, { opacity: 1, duration: 0.1 });
    
    // Laser moves from bottom to top (100% -> 0%) while the image unclips
    tl2.to([cooLaserRef.current], {
      top: "0%",
      duration: 2.0,
      ease: "power1.inOut",
    }, "coo_print");

    tl2.to(cooImageRef.current, {
      clipPath: "inset(0% 0 0 0)",
      duration: 2.0,
      ease: "power1.inOut",
    }, "coo_print");

    tl2.to(cooLaserRef.current, { opacity: 0, duration: 0.2 });

    // Note: Layout is strictly CSS Grid now, no sliding required.
    // We just fade in the text next to it.
    const cooText = cooWrapRef.current?.querySelector(".coo-text");
    if (cooText) {
      tl2.fromTo(cooText, 
        { opacity: 0, x: 30, filter: "blur(4px)" },
        { opacity: 1, x: 0, filter: "blur(0px)", duration: 1.0, ease: "power2.out" },
        "-=0.5"
      );
    }


    // ==========================================
    // TIER 3: CTO ANIMATION (Direct Laser Assembly)
    // ==========================================
    const tl3 = gsap.timeline({
      scrollTrigger: {
        trigger: ctoWrapRef.current,
        start: "top 65%",
        once: true,
      },
    });

    // Laser Assembly: Ghost outline is underlying. True image starts clipped.
    // Two Horizontal lasers scan Top -> Bottom
    gsap.set(ctoLaserH1Ref.current, { top: "0%", opacity: 0 });
    gsap.set(ctoLaserH2Ref.current, { top: "-10%", opacity: 0 }); // Second laser follows closely
    
    // We'll reveal the true image top-to-bottom synced with the primary horizontal laser
    gsap.set(ctoImageTrueRef.current, { clipPath: "inset(0 0 100% 0)" });

    tl3.to([ctoLaserH1Ref.current, ctoLaserH2Ref.current], { opacity: 1, duration: 0.2 }, "cto_laser");

    tl3.to(ctoLaserH1Ref.current, { top: "100%", duration: 2.0, ease: "power1.inOut" }, "cto_laser");
    tl3.to(ctoLaserH2Ref.current, { top: "100%", duration: 2.0, ease: "power1.inOut" }, "cto_laser+=0.2");
    
    tl3.to(ctoImageTrueRef.current, {
      clipPath: "inset(0 0 0% 0)",
      duration: 2.0,
      ease: "power1.inOut",
    }, "cto_laser");

    tl3.to([ctoLaserH1Ref.current, ctoLaserH2Ref.current], { opacity: 0, duration: 0.3 }, "cto_laser+=2.0");

    // Bio Typing
    const bioLines = [
      "Mohammed Rifaqath",
      "Chief Technology Officer",
      "Architecting distributed systems and building the intelligence pipeline. Rifaqath ensures the technology stack is resilient, future-proof, and lightning fast."
    ];

    // Bio Typing - Syncs tightly with the 2.0s laser pass
    tl3.to({}, {
      duration: 0.4,
      onUpdate: function() {
        const progress = Math.floor(this.progress() * bioLines[0].length);
        setCtoBioLog(prev => [bioLines[0].substring(0, progress), prev[1], prev[2]]);
      },
      ease: "none",
    }, "cto_laser");

    tl3.to({}, {
      duration: 0.4,
      onUpdate: function() {
        const progress = Math.floor(this.progress() * bioLines[1].length);
        setCtoBioLog(prev => [prev[0], bioLines[1].substring(0, progress), prev[2]]);
      },
      ease: "none",
    }, "cto_laser+=0.4");

    tl3.to({}, {
      duration: 1.2,
      onUpdate: function() {
        const progress = Math.floor(this.progress() * bioLines[2].length);
        setCtoBioLog(prev => [prev[0], prev[1], bioLines[2].substring(0, progress)]);
      },
      ease: "none",
    }, "cto_laser+=0.8");

  }, { scope: sectionRef });

  return (
    <section 
      ref={sectionRef} 
      id="about" 
      className="relative w-full pt-12 pb-32 bg-[var(--background)] overflow-hidden font-mono"
      style={{ fontFamily: "var(--font-geist-mono), monospace" }}
    >
      {/* Zero Gap background continuation across the entire long section */}
      <div className="absolute inset-0 [background-image:linear-gradient(to_right,rgba(107,33,168,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(107,33,168,0.05)_1px,transparent_1px)] [background-size:64px_64px]" />

      <div className="relative w-full max-w-7xl mx-auto flex flex-col items-center px-6">
        
        {/* ======================================================================
            TIER 1: CO-FOUNDERS (Elastic Center Morph)
            ====================================================================== */}
        <div 
          ref={terminalRef} 
          className="text-center mb-16 min-h-[4rem] flex items-end justify-center z-20"
        >
          <p className="text-2xl md:text-3xl font-bold tracking-widest text-slate-900 dark:text-[#A855F7]">
            {logText}
            {showCursor && (
              <span className="animate-pulse inline-block w-[14px] h-[1.5rem] bg-slate-900 dark:bg-[#A855F7] ml-2 align-middle translate-y-[-2px]" />
            )}
          </p>
        </div>

        <div className="relative w-full flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-0 mt-4 h-[auto] lg:h-[600px] mb-32">
          
          {/* CF1 (Left Edge) */}
          <div ref={cardsWrapRef} className="absolute inset-0 flex items-center justify-center lg:justify-between pointer-events-none z-10 hidden lg:flex">
             <div className="hologram-card-wrap pointer-events-auto w-[35%] max-w-[380px]">
                <HologramCard 
                  imageSrc="/teamimages/CF1.png"
                  name="Mohammed Shaz"
                  role="Co-Founder"
                />
             </div>
             <div className="hologram-card-wrap pointer-events-auto w-[35%] max-w-[380px]">
                <HologramCard 
                  imageSrc="/teamimages/CF2.png"
                  name="Muhammed Sawad"
                  role="Co-Founder"
                />
             </div>
          </div>

          <div className="flex flex-col gap-10 lg:hidden w-full max-w-sm mx-auto z-10 hologram-card-wrap">
             <HologramCard 
                imageSrc="/teamimages/CF1.png"
                name="Mohammed Shaz"
                role="Co-Founder"
              />
              <HologramCard 
                imageSrc="/teamimages/CF2.png"
                name="Muhammed Sawad"
                role="Co-Founder"
              />
          </div>

          <div 
            ref={textContentRef}
            className="opacity-0 relative z-20 text-center flex flex-col items-center max-w-xl mx-auto px-4 mt-8 lg:mt-0"
          >
             <h3 className="text-xl md:text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-6 uppercase tracking-widest break-words">
               Engineering the Future
             </h3>
             <p className="text-base md:text-lg font-medium text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
               Cypher Solutions is led by a duo of specialized engineers bridging the gap between hyperscale cloud infrastructure and pixel-perfect digital experiences. 
             </p>
             <p className="text-base md:text-lg font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
               We don't just write code; we architect systems designed to scale from day one, ensuring zero-downtime and uncompromised performance for every deploy.
             </p>
          </div>
        </div>


        {/* ======================================================================
            TIER 2: COO (Strict 2-Column Grid + Bottom-Up Laser Print)
            ====================================================================== */}
        <div ref={cooWrapRef} className="relative w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center min-h-[500px] mb-32 z-20">
            
            {/* Left Column: Image wrapper */}
            <div className="relative w-full aspect-[3/4] max-w-[400px] mx-auto overflow-hidden rounded-xl border border-purple-900/20 bg-slate-950/20">
                {/* Print Laser Line (Horizontal, moves Bottom -> Top) */}
                <div ref={cooLaserRef} className="absolute left-0 right-0 h-[4px] z-30 pointer-events-none">
                    <div className="w-full h-[2px] bg-white shadow-[0_0_15px_4px_#A855F7]" />
                    <div className="w-full h-8 bg-gradient-to-t from-[#A855F7]/0 via-[#A855F7]/40 to-white/80 absolute bottom-0" />
                </div>

                {/* The clipping container revealing the image */}
                <div ref={cooImageRef} className="absolute inset-0 z-20">
                    <Image 
                        src="/teamimages/COO.png"
                        alt="Sahil Sameer"
                        fill
                        sizes="(max-width: 768px) 100vw, 400px"
                        className="object-contain object-bottom grayscale-[0.2]"
                    />
                    <div className="absolute top-0 left-0 w-full h-[120%] overflow-hidden pointer-events-none z-10 mix-blend-screen opacity-40">
                        <div className="w-full h-[2px] bg-[#A855F7] absolute -top-[10%] animate-[scanline_4s_linear_infinite]" />
                    </div>
                </div>
            </div>

            {/* Right Column: Bio Text */}
            <div className="coo-text flex flex-col items-start text-left opacity-0 translate-x-8">
               <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
                 Sahil Sameer
               </h3>
               <p className="text-sm md:text-base font-semibold uppercase tracking-[0.2em] text-purple-600 dark:text-purple-400 mb-6">
                 Chief Operating Officer
               </p>
               <h4 className="text-xl md:text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4 uppercase tracking-widest leading-snug">
                 Orchestrating Scale
               </h4>
               <p className="text-base md:text-lg font-medium text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                 As COO, Sahil is the operational architect ensuring Cypher Solutions executes with military precision.
               </p>
               <p className="text-base md:text-lg font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
                 His focus is on unblocking engineering layers, optimizing delivery pipelines, and maintaining uncompromising quality across every sprint.
               </p>
            </div>
        </div>


        {/* ======================================================================
            TIER 3: CTO (Streamlined Direct Laser Assembly)
            ====================================================================== */}
        <div className="relative w-full max-w-5xl mx-auto flex flex-col justify-center min-h-[600px] z-20">
            <div 
              ref={ctoWrapRef}
              className="relative w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
            >

              {/* Left Column: Bio Text (Auto-typing) */}
              <div className="flex flex-col items-start text-left min-h-[250px] z-20">
                 <h3 className="text-3xl md:text-4xl font-bold tracking-tight h-10 truncate text-slate-900 dark:text-white mb-2 w-full">
                   {ctoBioLog[0]}
                   {ctoBioLog[0].length > 0 && ctoBioLog[0].length < 17 && <span className="animate-pulse bg-purple-500 w-3 h-8 inline-block ml-1 align-middle translate-y-[-4px]" />}
                 </h3>
                 
                 <p className="text-sm md:text-base font-semibold uppercase tracking-[0.2em] text-purple-600 dark:text-purple-400 h-6 flex items-center mb-6">
                   <span className="mr-2 opacity-50">{ctoBioLog[1].length > 0 ? ">" : ""}</span>
                   {ctoBioLog[1]}
                   {ctoBioLog[1].length > 0 && ctoBioLog[1].length < 24 && <span className="animate-pulse bg-purple-400 w-2 h-4 inline-block ml-1 align-middle" />}
                 </p>
                 
                 <p className="text-base md:text-lg font-medium text-slate-600 dark:text-slate-400 leading-relaxed min-h-[150px]">
                   {ctoBioLog[2]}
                   {ctoBioLog[2].length > 0 && ctoBioLog[2].length < 155 && <span className="animate-pulse bg-slate-500 w-2 h-4 inline-block ml-1 align-middle translate-y-[-2px]" />}
                 </p>
              </div>

              {/* Right Column: Laser Assembly Box */}
              <div className="relative w-full aspect-[4/5] max-w-[400px] mx-auto overflow-hidden rounded-xl border border-purple-900/20 bg-slate-950/20">
                  {/* Base Layer: Ghost outline image */}
                  <div className="absolute inset-0 z-10 opacity-10">
                     <Image 
                       src="/teamimages/CTO.png"
                       alt="CTO Outline"
                       fill
                       sizes="(max-width: 768px) 100vw, 400px"
                       className="object-contain object-bottom brightness-0"
                       style={{ filter: "sepia(100%) hue-rotate(250deg) saturate(1000%) drop-shadow(0 0 4px #A855F7)" }}
                     />
                  </div>

                  {/* Top Layer: Assembled True Image */}
                  <div ref={ctoImageTrueRef} className="absolute inset-0 z-20">
                     <Image 
                       src="/teamimages/CTO.png"
                       alt="Mohammed Rifaqath"
                       fill
                       sizes="(max-width: 768px) 100vw, 400px"
                       className="object-contain object-bottom grayscale-[0.1]"
                     />
                     <div className="absolute top-0 left-0 w-full h-[120%] overflow-hidden pointer-events-none z-10 mix-blend-screen opacity-40">
                        <div className="w-full h-[2px] bg-[#A855F7] absolute -top-[10%] animate-[scanline_4s_linear_infinite]" />
                     </div>
                  </div>

                  {/* Horizontal Laser 1 */}
                  <div ref={ctoLaserH1Ref} className="absolute left-0 right-0 h-[4px] z-30 pointer-events-none">
                     <div className="w-full h-[2px] bg-white shadow-[0_0_15px_4px_#A855F7]" />
                     <div className="w-full h-8 bg-gradient-to-t from-[#A855F7]/0 via-[#A855F7]/40 to-white/80 absolute bottom-0" />
                  </div>

                  {/* Horizontal Laser 2 (Follower) */}
                  <div ref={ctoLaserH2Ref} className="absolute left-0 right-0 h-[4px] z-30 pointer-events-none">
                     <div className="w-full h-[1px] bg-[#A855F7] shadow-[0_0_10px_2px_#A855F7]" />
                  </div>
              </div>

            </div>
        </div>

      </div>
    </section>
  );
}
