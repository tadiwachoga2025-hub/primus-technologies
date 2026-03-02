'use client';

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { X, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Register GSAP Plugins safely
if (typeof window !== "undefined") {
    gsap.registerPlugin(CustomEase);
}

export function SterlingGateKineticNavigation() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();

    // Close menu on route change
    useEffect(() => {
        setIsMenuOpen(false);
    }, [pathname]);

    // Initial Setup & Hover Effects
    useEffect(() => {
        if (!containerRef.current) return;

        // Create custom easing
        try {
            if (!gsap.parseEase("main")) {
                CustomEase.create("main", "0.65, 0.01, 0.05, 0.99");
                gsap.defaults({ ease: "main", duration: 0.7 });
            }
        } catch (e) {
            console.warn("CustomEase failed to load, falling back to default.", e);
            gsap.defaults({ ease: "power2.out", duration: 0.7 });
        }

        const ctx = gsap.context(() => {
            // Shape Hover Effects
            const menuItems = containerRef.current!.querySelectorAll(".menu-list-item[data-shape]");
            const shapesContainer = containerRef.current!.querySelector(".ambient-background-shapes");

            menuItems.forEach((item) => {
                const shapeIndex = item.getAttribute("data-shape");
                const shape = shapesContainer ? shapesContainer.querySelector(`.bg-shape-${shapeIndex}`) : null;

                if (!shape) return;

                const shapeEls = shape.querySelectorAll(".shape-element");

                const onEnter = () => {
                    if (shapesContainer) {
                        shapesContainer.querySelectorAll(".bg-shape").forEach((s) => s.classList.remove("active"));
                    }
                    shape.classList.add("active");

                    gsap.fromTo(shapeEls,
                        { scale: 0.5, opacity: 0, rotation: -10 },
                        { scale: 1, opacity: 1, rotation: 0, duration: 0.6, stagger: 0.08, ease: "back.out(1.7)", overwrite: "auto" }
                    );
                };

                const onLeave = () => {
                    gsap.to(shapeEls, {
                        scale: 0.8, opacity: 0, duration: 0.3, ease: "power2.in",
                        onComplete: () => shape.classList.remove("active"),
                        overwrite: "auto"
                    });
                };

                item.addEventListener("mouseenter", onEnter);
                item.addEventListener("mouseleave", onLeave);

                // @ts-ignore - attaching cleanup manually
                item._cleanup = () => {
                    item.removeEventListener("mouseenter", onEnter);
                    item.removeEventListener("mouseleave", onLeave);
                };
            });

        }, containerRef);

        return () => {
            ctx.revert();
            if (containerRef.current) {
                const items = containerRef.current.querySelectorAll(".menu-list-item[data-shape]");
                // @ts-ignore
                items.forEach((item) => item._cleanup && item._cleanup());
            }
        };
    }, []);

    // Menu Open/Close Animation Effect
    useEffect(() => {
        if (!containerRef.current) return;

        const ctx = gsap.context(() => {
            const navWrap = containerRef.current!.querySelector(".nav-overlay-wrapper");
            const menu = containerRef.current!.querySelector(".menu-content");
            const overlay = containerRef.current!.querySelector(".overlay");
            const bgPanels = containerRef.current!.querySelectorAll(".backdrop-layer");
            const menuLinks = containerRef.current!.querySelectorAll(".nav-link");
            const fadeTargets = containerRef.current!.querySelectorAll("[data-menu-fade]");

            const menuButton = containerRef.current!.querySelector(".nav-close-btn");
            const menuButtonTexts = menuButton?.querySelectorAll("p") as NodeListOf<HTMLParagraphElement>;
            const menuButtonIcon = menuButton?.querySelector(".menu-button-icon-wrapper") as Element;

            const tl = gsap.timeline();

            if (isMenuOpen) {
                // OPEN
                if (navWrap) navWrap.setAttribute("data-nav", "open");
                document.body.style.overflow = "hidden"; // Prevent background scrolling

                tl.set(navWrap, { display: "block" })
                    .fromTo(menu, { xPercent: 0 }, { xPercent: 0, clearProps: "transform" }, "<")
                    .fromTo(menuButtonTexts, { yPercent: 0 }, { yPercent: -100, stagger: 0.2 })
                    .fromTo(menuButtonIcon, { rotate: 0 }, { rotate: 180 }, "<")

                    .fromTo(overlay, { autoAlpha: 0 }, { autoAlpha: 1 }, "<")
                    .fromTo(bgPanels, { xPercent: 101 }, { xPercent: 0, stagger: 0.12, duration: 0.575 }, "<")
                    .fromTo(menuLinks, { yPercent: 140, rotate: 10 }, { yPercent: 0, rotate: 0, stagger: 0.05 }, "<+=0.35");

                if (fadeTargets.length) {
                    tl.fromTo(fadeTargets, { autoAlpha: 0, yPercent: 50 }, { autoAlpha: 1, yPercent: 0, stagger: 0.04 }, "<+=0.2");
                }

            } else {
                // CLOSE
                if (navWrap) navWrap.setAttribute("data-nav", "closed");

                tl.set(navWrap, { display: "block" })
                    .fromTo(fadeTargets, { autoAlpha: 1, yPercent: 0 }, { autoAlpha: 0, yPercent: 20, stagger: -0.04, duration: 0.3 })
                    .fromTo(menuLinks, { yPercent: 0, rotate: 0 }, { yPercent: 140, rotate: 10, stagger: -0.05, duration: 0.4, ease: "power2.inOut" }, "<")
                    .fromTo(bgPanels, { xPercent: 0 }, { xPercent: 101, stagger: -0.1, duration: 0.5, ease: "power3.inOut" }, "<")
                    .fromTo(menu, { xPercent: 0 }, { xPercent: 120, duration: 0.6, ease: "power3.inOut" }, "<+=0.2")
                    .fromTo(overlay, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.4 }, "<")
                    .fromTo(menuButtonTexts, { yPercent: -100 }, { yPercent: 0, duration: 0.4 }, "<")
                    .fromTo(menuButtonIcon, { rotate: 180 }, { rotate: 0, duration: 0.4 }, "<")
                    .set(navWrap, { display: "none" })
                    .add(() => { document.body.style.overflow = ""; }); // Re-enable scroll when completely closed
            }

        }, containerRef);

        return () => {
            // WARNING: Reverting context here on dependency change (isMenuOpen) instantly resets DOM to CSS defaults
            // This is why we MUST use .fromTo() on the CLOSE timeline to rebuild the state instantly
            ctx.revert();
            document.body.style.overflow = "";
        };
    }, [isMenuOpen]);

    // keydown Escape handling
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isMenuOpen) {
                setIsMenuOpen(false);
            }
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [isMenuOpen]);

    const toggleMenu = () => setIsMenuOpen(prev => !prev);
    const closeMenu = () => setIsMenuOpen(false);

    return (
        <div ref={containerRef} className="sterling-kinetic-nav">
            {/* Trigger Button */}
            <div className="flex items-center gap-4 relative z-[100]">
                {/* Abstract Menu Text Button */}
                <button
                    onClick={toggleMenu}
                    className="group flex flex-col items-center justify-center p-3 rounded-full bg-[var(--background-dark)] border border-[var(--border)] text-white hover:border-[var(--accent-blue)] transition-all duration-300 shadow-md nav-close-btn"
                    aria-label="Toggle Menu"
                >
                    <div className="relative overflow-hidden h-5 w-12 text-center text-[10px] font-mono uppercase tracking-[2px] font-bold">
                        <div className="flex flex-col transform transition-transform duration-500 ease-[cubic-bezier(0.65,0.01,0.05,0.99)]">
                            <p className="h-5 flex items-center justify-center m-0">Menu</p>
                            <p className="h-5 flex items-center justify-center m-0 text-[var(--accent-blue)]">Close</p>
                        </div>
                    </div>
                    <div className="menu-button-icon-wrapper mt-1">
                        {isMenuOpen ? (
                            <X className="w-5 h-5 text-white menu-button-icon transition-colors" />
                        ) : (
                            <Menu className="w-5 h-5 text-white menu-button-icon transition-colors group-hover:text-[var(--accent-blue)]" />
                        )}
                    </div>
                </button>
            </div>

            <section className="fullscreen-menu-container z-[90]">
                <div data-nav="closed" className="nav-overlay-wrapper fixed inset-0 z-[90] hidden">
                    {/* Overlay to catch stray clicks */}
                    <div className="overlay absolute inset-0 bg-black/40 backdrop-blur-sm cursor-alias" onClick={closeMenu}></div>

                    <nav className="menu-content absolute top-0 right-0 h-full w-full max-w-[640px] shadow-2xl overflow-hidden">
                        <div className="menu-bg absolute inset-0 z-0">
                            <div className="backdrop-layer first absolute inset-0 bg-[var(--background)]"></div>
                            <div className="backdrop-layer second absolute inset-0 bg-[var(--accent-blue)] opacity-90"></div>
                            <div className="backdrop-layer absolute inset-0 bg-[var(--background-dark)]"></div>

                            {/* Abstract shapes container */}
                            <div className="ambient-background-shapes absolute inset-0 pointer-events-none overflow-hidden opacity-30 mix-blend-screen">
                                {/* Shape 1 */}
                                <svg className="bg-shape bg-shape-1 absolute inset-0 w-full h-full opacity-0" viewBox="0 0 400 400" fill="none" preserveAspectRatio="xMidYMid slice">
                                    <circle className="shape-element" cx="80" cy="120" r="40" fill="rgba(99,102,241,0.4)" />
                                    <circle className="shape-element" cx="300" cy="80" r="60" fill="rgba(139,92,246,0.3)" />
                                </svg>

                                {/* Shape 2 */}
                                <svg className="bg-shape bg-shape-2 absolute inset-0 w-full h-full opacity-0" viewBox="0 0 400 400" fill="none" preserveAspectRatio="xMidYMid slice">
                                    <path className="shape-element" d="M0 200 Q100 100, 200 200 T 400 200" stroke="rgba(99,102,241,0.5)" strokeWidth="60" fill="none" />
                                </svg>

                                {/* Shape 3: Grid dots */}
                                <svg className="bg-shape bg-shape-3 absolute inset-0 w-full h-full opacity-0" viewBox="0 0 400 400" fill="none" preserveAspectRatio="xMidYMid slice">
                                    <circle className="shape-element" cx="150" cy="50" r="8" fill="rgba(139,92,246,0.6)" />
                                    <circle className="shape-element" cx="200" cy="150" r="12" fill="rgba(236,72,153,0.5)" />
                                </svg>

                                {/* Shape 4 */}
                                <svg className="bg-shape bg-shape-4 absolute inset-0 w-full h-full opacity-0" viewBox="0 0 400 400" fill="none" preserveAspectRatio="xMidYMid slice">
                                    <path className="shape-element" d="M100 100 Q150 50, 200 100 Q250 150, 200 200 Q150 250, 100 200 Q50 150, 100 100" fill="rgba(99,102,241,0.3)" />
                                </svg>

                                {/* Shape 5 */}
                                <svg className="bg-shape bg-shape-5 absolute inset-0 w-full h-full opacity-0" viewBox="0 0 400 400" fill="none" preserveAspectRatio="xMidYMid slice">
                                    <line className="shape-element" x1="0" y1="100" x2="300" y2="400" stroke="rgba(99,102,241,0.4)" strokeWidth="30" />
                                </svg>
                            </div>
                        </div>

                        <div className="menu-content-wrapper relative z-10 h-full flex flex-col justify-center px-12 md:px-24">
                            <span className="font-mono text-[12px] uppercase tracking-[4px] text-[var(--accent-blue)] font-bold mb-12">Navigation</span>
                            <ul className="menu-list flex flex-col gap-6">
                                <li className="menu-list-item relative w-fit overflow-hidden py-2" data-shape="1">
                                    <Link href="/process" className="nav-link inline-block origin-top-left">
                                        <p className="nav-link-text font-display text-5xl md:text-7xl font-bold text-white hover:text-[var(--accent-blue)] transition-colors duration-300">About Us</p>
                                    </Link>
                                </li>
                                <li className="menu-list-item relative w-fit overflow-hidden py-2" data-shape="2">
                                    <Link href="/projects" className="nav-link inline-block origin-top-left">
                                        <p className="nav-link-text font-display text-5xl md:text-7xl font-bold text-white hover:text-[var(--accent-blue)] transition-colors duration-300">Our Work</p>
                                    </Link>
                                </li>
                                <li className="menu-list-item relative w-fit overflow-hidden py-2" data-shape="3">
                                    <Link href="/sectors" className="nav-link inline-block origin-top-left">
                                        <p className="nav-link-text font-display text-5xl md:text-7xl font-bold text-white hover:text-[var(--accent-blue)] transition-colors duration-300">Services</p>
                                    </Link>
                                </li>
                                <li className="menu-list-item relative w-fit overflow-hidden py-2" data-shape="5">
                                    <Link href="/contact" onClick={closeMenu} className="nav-link inline-block origin-top-left">
                                        <p className="nav-link-text font-display text-5xl md:text-7xl font-bold text-white hover:text-[var(--accent-blue)] transition-colors duration-300" data-menu-fade="true">Contact</p>
                                    </Link>
                                </li>
                            </ul>

                            {/* Corporate Infrastructure Statement */}
                            <div className="mt-8 mb-2 max-w-[400px]" data-menu-fade="true">
                                <p className="font-body text-[15px] md:text-[16px] text-[#8B8B8B] leading-[1.6]">
                                    Partner with our architectural board to design resilient, secure, and future-forward digital ecosystems.
                                </p>
                            </div>

                            {/* Footer text inside overlay */}
                            <div className="mt-12 pt-8 border-t border-[var(--border)]" data-menu-fade="true">
                                <p className="font-mono text-[12px] text-[var(--foreground-light)] tracking-[1px] uppercase">
                                    Enterprise Infrastructure. <br />
                                    Est. 2024
                                </p>
                            </div>
                        </div>
                    </nav>
                </div>
            </section>
        </div>
    );
}
