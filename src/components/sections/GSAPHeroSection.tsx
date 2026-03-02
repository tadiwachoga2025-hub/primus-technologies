"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { FlowButton } from "@/components/ui/flow-button";

export default function GSAPHeroSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // We use standard GSAP ease or CustomEase if registered globally
        const ctx = gsap.context(() => {
            const tl = gsap.timeline();

            const elements = contentRef.current?.children;
            if (!elements) return;

            // 1. Image parallax reveal
            gsap.set(imageRef.current, { clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)", scale: 1.1 });
            tl.to(imageRef.current, {
                clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
                scale: 1,
                duration: 1.4,
                ease: "power4.inOut"
            });

            // 2. Stagger text content reveal
            tl.fromTo(
                elements,
                { autoAlpha: 0, y: 30 },
                {
                    autoAlpha: 1,
                    y: 0,
                    duration: 1,
                    stagger: 0.15,
                    ease: "back.out(1.2)" // SOP mandated premium physical easing
                },
                "-=0.6" // overlaps with the image reveal
            );

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="flex w-full h-[700px] border-b border-[var(--border)] overflow-hidden">
            {/* 1. Image Parallax Container */}
            <div ref={imageRef} className="relative w-[560px] h-full transform-gpu">
                <Image
                    src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1080"
                    alt="Modern corporate building"
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-black/10 mix-blend-multiply" />
            </div>

            {/* 2. Text Content Container */}
            <div
                ref={contentRef}
                className="flex-1 flex flex-col justify-center gap-6 p-[80px] bg-[var(--background)] relative z-10"
            >
                <div className="flex items-center gap-3">
                    <div className="w-1 h-5 bg-[var(--accent-lime)] rounded-sm" />
                    <span className="font-mono text-[13px] font-medium tracking-[2px] text-[var(--accent-blue)]">
                        TURN-KEY OFFICE SOLUTIONS
                    </span>
                </div>

                <h1 className="font-display text-[72px] leading-[1.05] text-[var(--foreground)] max-w-[720px] tracking-tight">
                    Enterprise Digital Infrastructure for Global Markets.
                </h1>

                <p className="font-body text-[17px] leading-[1.5] text-[var(--foreground-muted)] max-w-[700px]">
                    To become Africa&apos;s leading enterprise digital infrastructure provider serving global markets through innovation and excellence.
                </p>

                <div className="flex gap-4 mt-4">
                    <FlowButton text="Explore Services" href="/sectors" className="hover:shadow-lg hover:-translate-y-[2px]" />
                    <FlowButton text="Our Portfolio" href="/projects" className="hover:shadow-lg hover:-translate-y-[2px]" />
                </div>
            </div>
        </section>
    );
}
