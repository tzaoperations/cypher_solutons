"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

interface HologramCardProps {
  imageSrc: string;
  name: string;
  role: string;
  className?: string; // Allow passing GSAP animation classes like opacity-0
}

export function HologramCard({ imageSrc, name, role, className = "" }: HologramCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const card = cardRef.current;
    if (!card) return;

    // Standard 3D mouse parallax math
    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -10; // Max 10 deg
      const rotateY = ((x - centerX) / centerX) * 10;  // Max 10 deg

      gsap.to(imageWrapRef.current, {
        rotationX: rotateX,
        rotationY: rotateY,
        x: ((x - centerX) / centerX) * -5, // slight lateral shift
        y: ((y - centerY) / centerY) * -5,
        scale: 1.0, // Scale back up to exactly 100% on hover
        duration: 0.5,
        ease: "power2.out",
      });
      // Boost z-index of card on hover to prevent overlapping issues
      gsap.to(card, { zIndex: 30, duration: 0 });
    };

    const handleMouseLeave = () => {
      gsap.to(imageWrapRef.current, {
        rotationX: 0,
        rotationY: 0,
        x: 0,
        y: 0,
        scale: 0.75, // Return to 75% shrunk state
        duration: 0.7,
        ease: "power3.out",
      });
      // Drop z-index back to baseline
      gsap.to(card, { zIndex: 1, duration: 0, delay: 0.7 });
    };

    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, { scope: cardRef });

  return (
    <div 
      ref={cardRef} 
      className={`relative w-full aspect-[3/4] md:aspect-square lg:aspect-[3/4] overflow-hidden bg-transparent group hologram-card perspective-1000 z-[1] ${className}`}
      style={{ perspective: "1000px" }}
    >
      <div 
        ref={imageWrapRef} 
        className="relative w-full h-full transform-style-3d will-change-transform origin-center scale-[0.75]"
      >
        <Image 
          src={imageSrc} 
          alt={name} 
          fill 
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain object-bottom grayscale-[0.5] group-hover:grayscale-0 transition-all duration-700"
        />
        
        {/* Holographic Overlay */}
        <div className="absolute inset-0 pointer-events-none z-10">
          {/* Subtle noise/grid */}
          <div className="absolute inset-0 [background-image:linear-gradient(rgba(168,85,247,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.08)_1px,transparent_1px)] [background-size:4px_4px] opacity-50 mix-blend-screen" />
          
          {/* Scanline element */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
             <div className="w-full h-[2px] bg-[#A855F7] shadow-[0_0_10px_2px_#A855F7] absolute -top-[10%] animate-[scanline_4s_linear_infinite]" />
             {/* Glow trailing the line slightly */}
             <div className="w-full h-16 bg-gradient-to-b from-[#A855F7]/0 via-[#A855F7]/10 to-[#A855F7]/0 absolute -top-[10%] animate-[scanline_4s_linear_infinite]" />
          </div>
        </div>
      </div>

      {/* Info Block (lives outside the 3D wrapper so it stays locked to frame, or inside if you want it to tilt) */}
      <div className="absolute bottom-0 left-0 w-full p-6 pointer-events-none z-20 flex flex-col items-center justify-end">
        <h3 
          className="text-xl md:text-2xl font-bold text-white mb-1 tracking-tight" 
          style={{ fontFamily: "var(--font-geist-mono), monospace" }}
        >
          {name}
        </h3>
        <p 
          className="text-sm font-semibold uppercase tracking-widest text-purple-400" 
          style={{ fontFamily: "var(--font-geist-mono), monospace" }}
        >
          {role}
        </p>
      </div>
    </div>
  );
}
