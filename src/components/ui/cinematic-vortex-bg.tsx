"use client";
import React, { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";

/**
 * CinematicVortexBackground
 * A pure DOM/GSAP recreation of the "Vortex Glitch Shatter" video prompt.
 * 
 * Timeline:
 * 1. Shatter: Background breaks into pieces.
 * 2. Mosaic Tiling: Background breaks into a 4x4 grid.
 * 3. Liquid Vortex: Middle spins and distorts.
 * 4. Bloom: White glow overtakes.
 * 5. Starburst: Shape collapses to a sliver and vanishes into black.
 */
export function CinematicVortexBackground({
  children,
  fallbackSrc = "/vortex-bg.png",
}: {
  children?: React.ReactNode;
  fallbackSrc?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const baseBgRef = useRef<HTMLImageElement>(null);
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const vortexRef = useRef<HTMLDivElement>(null);
  const bloomRef = useRef<HTMLDivElement>(null);
  const starRef = useRef<HTMLDivElement>(null);
  const shardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });
      const shards = shardsRef.current.filter(Boolean);

      // INIT
      gsap.set(baseBgRef.current, { autoAlpha: 0.6, scale: 1.05 });
      gsap.set(shards, { autoAlpha: 0 }); // Hidden initially
      gsap.set(gridContainerRef.current, { autoAlpha: 0 });
      gsap.set(vortexRef.current, { autoAlpha: 0, rotation: 0, scale: 1, filter: "brightness(1)" });
      gsap.set(bloomRef.current, { autoAlpha: 0, scale: 0.5, filter: "blur(20px)" });
      gsap.set(starRef.current, { autoAlpha: 0, scale: 0, rotation: 0 });

      tl.addLabel("start", 1) // Start after 1 second of stillness

        // Stage 1: Shatter (00:00-00:01)
        // Hide base image, show shards, and explode them out slightly
        .set(baseBgRef.current, { autoAlpha: 0 }, "start")
        .set(shards, { autoAlpha: 0.6 }, "start")
        .to(shards, {
          x: () => gsap.utils.random(-100, 100),
          y: () => gsap.utils.random(-100, 100),
          rotation: () => gsap.utils.random(-30, 30),
          duration: 1,
          ease: "expo.out",
          stagger: { amount: 0.1, from: "center" }
        }, "start")

        // Stage 2: Mosaic Tiling (00:02-00:04)
        .addLabel("mosaic", "start+=1.5")
        .to(shards, { autoAlpha: 0, duration: 0.5 }, "mosaic")
        .set(gridContainerRef.current, { autoAlpha: 0.6 }, "mosaic")
        // Animate the background size from cover to 4x4 (25%)
        .fromTo(gridContainerRef.current,
          { backgroundSize: "100% 100%", backgroundRepeat: "repeat" },
          { backgroundSize: "25% 25%", duration: 2, ease: "power2.inOut" },
          "mosaic")

        // Stage 3: Liquid Vortex / Twirl (00:05-00:08)
        .addLabel("vortex", "mosaic+=2.5")
        // Hide mosaic, switch to a swirly scaled version
        .to(gridContainerRef.current, { autoAlpha: 0, duration: 0.3 }, "vortex")
        .set(vortexRef.current, { autoAlpha: 0.6 }, "vortex")
        .to(vortexRef.current, {
          rotation: 1440, // Multiple fast spins
          scale: 0.2, // suck into middle
          duration: 3,
          ease: "power4.in"
        }, "vortex")

        // Stage 4: Chromatic Bloom & Explosion (00:09-00:10)
        .addLabel("bloom", "vortex+=2.2")
        .to(vortexRef.current, { filter: "brightness(4) contrast(3) hue-rotate(90deg)", duration: 0.8 }, "bloom")
        .set(bloomRef.current, { autoAlpha: 1 }, "bloom+=0.4")
        .to(bloomRef.current, {
          scale: 4, // expand massive white light
          duration: 0.6,
          ease: "expo.in"
        }, "bloom+=0.4")

        // Stage 5: Starburst Collapse (00:11-00:13)
        .addLabel("collapse", "bloom+=1")
        .set(starRef.current, { autoAlpha: 1, scale: 2 }, "collapse")
        .set(bloomRef.current, { autoAlpha: 0 }, "collapse") // cut to star shape
        .to(starRef.current, {
          scale: 0,
          rotation: 90,
          duration: 0.8,
          ease: "expo.out"
        }, "collapse");

    }, containerRef);
    return () => ctx.revert();
  }, []);

  // 4 basic abstract shard polygons for the shatter effect
  const shardPolygons = [
    "polygon(0 0, 50% 10%, 40% 60%, 0 50%)",
    "polygon(50% 10%, 100% 0, 100% 40%, 40% 60%)",
    "polygon(0 50%, 40% 60%, 30% 100%, 0 100%)",
    "polygon(40% 60%, 100% 40%, 100% 100%, 30% 100%)"
  ];

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full overflow-hidden bg-black flex flex-col justify-center">

      {/* Background Graphic Engine */}
      <div className="absolute inset-0 z-0">

        {/* State 0: Normal Image */}
        <Image
          ref={baseBgRef as any}
          src={fallbackSrc}
          alt="Cinematic Background"
          fill
          priority
          sizes="100vw"
          className="object-cover mix-blend-screen"
        />

        {/* State 1: Shards */}
        {shardPolygons.map((polygon, i) => (
          <div
            key={`shard-${i}`}
            ref={el => { shardsRef.current[i] = el; }}
            className="absolute inset-0 w-full h-full bg-cover bg-center mix-blend-screen"
            style={{
              backgroundImage: `url(${fallbackSrc})`,
              clipPath: polygon
            }}
          />
        ))}

        {/* State 2: Mosaic Tiling */}
        <div
          ref={gridContainerRef}
          className="absolute inset-[0%] w-[100%] h-[100%] bg-center mix-blend-screen"
          style={{ backgroundImage: `url(${fallbackSrc})` }}
        />

        {/* State 3: Vortex Twirl */}
        <div
          ref={vortexRef}
          className="absolute inset-0 w-full h-full rounded-full bg-cover bg-center mix-blend-screen"
          style={{ backgroundImage: `url(${fallbackSrc})` }}
        />

        {/* State 4: Chromatic Bloom */}
        <div
          ref={bloomRef}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full mix-blend-screen"
          style={{
            background: "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(200,200,255,0.8) 20%, rgba(255,100,255,0.5) 40%, rgba(0,255,255,0) 80%)"
          }}
        />

        {/* State 5: Starburst Collapse */}
        <div
          ref={starRef}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-white mix-blend-screen shadow-[0_0_50px_20px_white]"
          style={{
            clipPath: "polygon(50% 0%, 55% 45%, 100% 50%, 55% 55%, 50% 100%, 45% 55%, 0% 50%, 45% 45%)"
          }}
        />

        {/* Static Enterprise Legibility Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#111111]/70 via-[#111111]/80 to-[#111111] pointer-events-none" />
      </div>

      {/* Hero Content (Foreground) */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
}
