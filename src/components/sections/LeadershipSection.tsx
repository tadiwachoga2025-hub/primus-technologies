'use client';

import { useRef, useEffect } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import { ShieldCheck, Network, Cpu, Code2 } from 'lucide-react';
import Image from 'next/image';

const stats = [
  { icon: Code2, label: 'Tech Stack', value: 'Enterprise JS/TS' },
  { icon: ShieldCheck, label: 'Security', value: 'ISO/Compliance' },
  { icon: Network, label: 'Delivery', value: 'Agile & CI/CD' },
  { icon: Cpu, label: 'Bandwidth', value: '99.9% Uptime' },
];

export default function LeadershipSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: true, margin: '-100px' });
  const controls = useAnimation();

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [inView, controls]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const childVariants: any = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <section className="w-full py-24 md:py-32 px-6 md:px-16 bg-[var(--background)] border-b border-[var(--border)] overflow-hidden">
      <div className="max-w-[1440px] mx-auto w-full">
        <motion.div
          ref={containerRef}
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24"
        >
          {/* Left Column: Mission & Metrics (Sticky) */}
          <div className="lg:col-span-5 flex flex-col items-start relative">
            <div className="lg:sticky lg:top-32 w-full">
              <motion.div variants={childVariants} className="flex flex-col gap-6 mb-12">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[var(--accent-blue)] animate-pulse" />
                  <span className="font-mono text-[12px] md:text-[13px] uppercase tracking-[3px] text-[var(--accent-blue)] font-bold">
                    [ Executive Leadership ]
                  </span>
                </div>

                <h2 className="font-display text-[40px] md:text-[56px] leading-[1.05] text-[var(--foreground)] font-bold tracking-tight">
                  Architectural Board <br className="hidden md:block" />
                  &amp; Leadership.
                </h2>

                <p className="font-body text-[16px] md:text-[17px] leading-[1.7] text-[var(--foreground-muted)] max-w-[500px]">
                  Our collective of highly specialized software architects and engineers operates through an enterprise-grade hybrid delivery model. Every infrastructure deployment is commanded by engineering leadership to guarantee rigorous compliance and scalable performance.
                </p>
              </motion.div>

              {/* Technical Metrics Grid */}
              <motion.div variants={childVariants} className="grid grid-cols-2 gap-4 w-full">
                {stats.map((stat, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col gap-3 p-5 bg-white shadow-sm border border-[var(--border)] group hover:border-[var(--accent-blue)] transition-all duration-300"
                  >
                    <stat.icon className="w-5 h-5 text-[var(--accent-blue)] group-hover:scale-110 transition-transform duration-300" />
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[2px] text-[var(--foreground-light)] mb-1">
                        {stat.label}
                      </p>
                      <p className="font-mono text-[13px] text-[var(--foreground)] font-bold">
                        {stat.value}
                      </p>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>

          {/* Right Column: High-Spec Profile Cards */}
          <div className="lg:col-span-7 flex flex-col gap-8 md:gap-12 mt-8 lg:mt-0">
            {/* CEO Profile */}
            <motion.article
              variants={childVariants}
              className="group relative flex flex-col md:flex-row gap-8 p-8 md:p-10 bg-white shadow-sm hover:shadow-md transition-shadow duration-300 border border-[var(--border)] overflow-hidden cursor-pointer"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent-blue)]/5 rounded-full blur-3xl group-hover:bg-[var(--accent-blue)]/10 transition-colors duration-500" />

              {/* Profile Image / Initials */}
              <div className="relative w-28 h-28 md:w-36 md:h-36 shrink-0 bg-[var(--background)] border border-[var(--border)] flex items-center justify-center p-2 z-10 group-hover:border-[var(--accent-blue)] transition-colors duration-300">
                <span className="font-display text-4xl text-[var(--foreground)] opacity-50 font-medium tracking-tighter">
                  DG
                </span>
                <div className="absolute -bottom-3 -right-3 bg-[var(--background)] px-2 py-1 border border-[var(--border)] shadow-sm">
                  <span className="font-mono text-[9px] uppercase tracking-[1px] text-[var(--accent-blue)] font-bold">L:1</span>
                </div>
              </div>

              {/* Profile Detail */}
              <div className="flex flex-col justify-center w-full z-10">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-display text-[28px] md:text-[32px] text-[var(--foreground)] font-bold leading-none">
                    Douglas Gweera
                  </h3>
                  <a href="#" className="w-8 h-8 rounded-full border border-[var(--border)] flex items-center justify-center text-[var(--foreground-light)] hover:text-[var(--accent-blue)] hover:border-[var(--accent-blue)] transition-all bg-[var(--background)]">
                    <span className="sr-only">LinkedIn</span>
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                  </a>
                </div>

                <p className="font-mono text-[12px] text-[var(--accent-blue)] tracking-[2px] uppercase font-bold mb-6">
                  Chief Executive Officer
                </p>

                <p className="font-body text-[15px] text-[var(--foreground-light)] leading-relaxed mb-8">
                  Architecting sovereign digital infrastructure and laying the operational groundwork for high-availability enterprise environments across emerging African markets.
                </p>

                <div className="flex flex-wrap items-center gap-4 mt-auto">
                  <div className="flex items-center gap-2 bg-[var(--background)] px-3 py-1.5 border border-[var(--border)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-mono text-[10px] uppercase text-[var(--foreground-light)] tracking-wide">Harare, ZW</span>
                  </div>
                  <div className="flex items-center gap-2 bg-[var(--background)] px-3 py-1.5 border border-[var(--border)]">
                    <span className="font-mono text-[10px] uppercase text-[var(--foreground-light)] tracking-wide">ID: CEO-001</span>
                  </div>
                  <div className="flex items-center gap-2 bg-[var(--background)] px-3 py-1.5 border border-[var(--border)]">
                    <span className="font-mono text-[10px] uppercase text-[var(--foreground-light)] tracking-wide">Est. 2024</span>
                  </div>
                </div>
              </div>
            </motion.article>

            {/* CTO / Lead Architect Profile */}
            <motion.article
              variants={childVariants}
              className="group relative flex flex-col md:flex-row gap-8 p-8 md:p-10 bg-white shadow-sm hover:shadow-md transition-shadow duration-300 border border-[var(--border)] overflow-hidden cursor-pointer"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent-blue)]/5 rounded-full blur-3xl group-hover:bg-[var(--accent-blue)]/10 transition-colors duration-500" />

              <div className="relative w-28 h-28 md:w-36 md:h-36 shrink-0 bg-[var(--background)] border border-[var(--border)] flex items-center justify-center p-2 z-10 group-hover:border-[var(--accent-blue)] transition-colors duration-300">
                <span className="font-display text-4xl text-[var(--foreground)] opacity-50 font-medium tracking-tighter">
                  TD
                </span>
                <div className="absolute -bottom-3 -right-3 bg-[var(--background)] px-2 py-1 border border-[var(--border)] shadow-sm">
                  <span className="font-mono text-[9px] uppercase tracking-[1px] text-[var(--accent-blue)] font-bold">L:2</span>
                </div>
              </div>

              <div className="flex flex-col justify-center w-full z-10">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-display text-[28px] md:text-[32px] text-[var(--foreground)] font-bold leading-none">
                    Tadiwa Choga
                  </h3>
                  <a href="#" className="w-8 h-8 rounded-full border border-[var(--border)] flex items-center justify-center text-[var(--foreground-light)] hover:text-[var(--accent-blue)] hover:border-[var(--accent-blue)] transition-all bg-[var(--background)]">
                    <span className="sr-only">LinkedIn</span>
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                  </a>
                </div>

                <p className="font-mono text-[12px] text-[var(--accent-blue)] tracking-[2px] uppercase font-bold mb-6">
                  Chief Technology Officer
                </p>

                <p className="font-body text-[15px] text-[var(--foreground-light)] leading-relaxed mb-8">
                  Directing system architecture, security implementation strategies, and multi-cloud deployment paradigms to ensure enterprise-grade resilience for all partners.
                </p>

                <div className="flex flex-wrap items-center gap-4 mt-auto">
                  <div className="flex items-center gap-2 bg-[var(--background)] px-3 py-1.5 border border-[var(--border)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-blue)] animate-pulse" />
                    <span className="font-mono text-[10px] uppercase text-[var(--foreground-light)] tracking-wide">Intl. Remote</span>
                  </div>
                  <div className="flex items-center gap-2 bg-[var(--background)] px-3 py-1.5 border border-[var(--border)]">
                    <span className="font-mono text-[10px] uppercase text-[var(--foreground-light)] tracking-wide">ID: CTO-001</span>
                  </div>
                  <div className="flex items-center gap-2 bg-[var(--background)] px-3 py-1.5 border border-[var(--border)]">
                    <span className="font-mono text-[10px] uppercase text-[var(--foreground-light)] tracking-wide">Security Lead</span>
                  </div>
                </div>
              </div>
            </motion.article>

          </div>
        </motion.div>
      </div>
    </section>
  );
}
