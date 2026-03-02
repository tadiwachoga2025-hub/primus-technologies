"use client";

import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useInView, animate } from "framer-motion";
import { Globe2, Layers, Network, Anchor } from "lucide-react";
import Image from "next/image";

const Counter = ({ value }: { value: number }) => {
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true });

    useEffect(() => {
        if (inView) {
            animate(0, value, {
                duration: 2,
                ease: [0.22, 1, 0.36, 1],
                onUpdate: (latest: number) => {
                    if (ref.current) {
                        ref.current.textContent = Math.floor(latest).toString();
                    }
                },
            });
        }
    }, [inView, value]);

    return <span ref={ref}>0</span>;
};

const cards = [
    {
        icon: Globe2,
        title: "Global Reach",
        subtitle: "Enterprise deployment across 15+ countries.",
    },
    {
        icon: Layers,
        title: "Data Architecture",
        subtitle: "High-compliance, low-latency secure systems.",
    },
    {
        icon: Network,
        title: "Eco-Tech Grids",
        subtitle: "Sustainable, carbon-neutral digital networks.",
    },
    {
        icon: Anchor,
        title: "Turnkey Design",
        subtitle: "End-to-end office and infrastructural delivery.",
    },
];

export default function FeaturedProjectsParallax() {
    const containerRef = useRef<HTMLElement>(null);

    // Parallax background setup
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });

    // Shift Y from -20% to 20%
    const yBg = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);

    return (
        <section
            ref={containerRef}
            className="relative w-full overflow-hidden bg-[#0047AB] py-[100px] lg:py-[120px]"
            style={{
                clipPath: "polygon(0 24px, 100% 0, 100% calc(100% - 24px), 0 100%)",
            }}
        >
            {/* Parallax Background */}
            <motion.div
                className="absolute inset-0 w-full h-full transform-gpu origin-center"
                style={{ y: yBg, scale: 1.1 }}
            >
                <Image
                    src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80"
                    alt="Parallax Tech Background"
                    fill
                    className="object-cover"
                />
            </motion.div>

            {/* Blended Gradient Overlay */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    background: "linear-gradient(135deg, rgba(0,71,171,0.82) 0%, rgba(0,100,200,0.72) 40%, rgba(0,174,239,0.65) 100%)",
                }}
            />

            <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 flex flex-col items-center">
                {/* Zone 1: Small Top Label */}
                <AnimatedLabel />

                {/* Zone 2: Hero Text & Counter */}
                <AnimatedHero />

                {/* Zone 3: Cards Grid */}
                <div className="mt-12 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {cards.map((card, idx) => (
                        <GlassCard key={idx} card={card} index={idx} />
                    ))}
                </div>

                {/* CTA Button */}
                <AnimatedCTA />
            </div>
        </section>
    );
}

const AnimatedLabel = () => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-50px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="mb-6 flex items-center gap-4"
        >
            <div className="w-8 h-[2px] bg-[rgba(255,255,255,0.8)]" />
            <span className="font-mono text-[13px] font-black tracking-[5px] text-white uppercase">
                Featured Projects
            </span>
        </motion.div>
    );
};

const AnimatedHero = () => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-50px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 36 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 36 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-center"
        >
            <h2
                className="font-display text-[40px] md:text-[64px] font-black text-white leading-[1.1] md:leading-[1.05]"
                style={{ textShadow: "0 2px 20px rgba(0,20,60,0.25)" }}
            >
                Delivering <Counter value={500} />+ <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-[#AADDFF] drop-shadow-sm">
                    Key Deployments
                </span>
            </h2>
        </motion.div>
    );
};

const GlassCard = ({ card, index }: { card: any; index: number }) => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-50px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 28 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
            transition={{ duration: 1, delay: 0.3 + index * 0.1, ease: [0.22, 1, 0.36, 1] }}
            whileHover="hover"
            className="group relative flex flex-col items-center text-center p-6 rounded-[20px] overflow-hidden cursor-pointer"
            style={{
                background: "rgba(255,255,255,0.13)",
                border: "1px solid rgba(255,255,255,0.22)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
            }}
            variants={{
                hover: { y: -6, background: "rgba(255,255,255,0.18)", borderColor: "rgba(255,255,255,0.35)", transition: { duration: 0.3 } }
            }}
        >
            {/* Icon Ring */}
            <motion.div
                className="mb-6 p-4 rounded-full border border-[rgba(255,255,255,0.3)] bg-[rgba(255,255,255,0.05)] flex items-center justify-center transform-gpu"
                variants={{
                    hover: { scale: 1.15, rotate: 8, transition: { type: "spring", stiffness: 300, damping: 15 } }
                }}
            >
                <card.icon className="w-6 h-6 text-white drop-shadow-md" strokeWidth={1.5} />
            </motion.div>

            <h3 className="font-display text-[20px] font-bold text-white mb-2 tracking-tight">
                {card.title}
            </h3>
            <p className="font-body text-[15px] text-[rgba(255,255,255,0.85)] leading-relaxed">
                {card.subtitle}
            </p>

            {/* Absolute strict bottom accent line revealed on hover */}
            <motion.div
                className="absolute bottom-0 left-0 w-full h-[3px] bg-white origin-left"
                initial={{ scaleX: 0, opacity: 0 }}
                variants={{ hover: { scaleX: 1, opacity: 1, transition: { duration: 0.3, ease: "easeOut" } } }}
            />
        </motion.div>
    );
};

const AnimatedCTA = () => {
    return (
        <motion.button
            whileHover={{ scale: 1.04, boxShadow: "0 8px 24px rgba(0,20,60,0.3)" }}
            whileTap={{ scale: 0.97 }}
            className="mt-12 px-[32px] py-[16px] rounded-full bg-white font-mono text-[13px] font-black tracking-[3px] uppercase text-[#0047AB] transition-shadow shadow-xl flex items-center justify-center"
            style={{ boxShadow: "0 4px 16px rgba(0,20,60,0.22)" }}
        >
            View Full Portfolio
        </motion.button>
    );
};
