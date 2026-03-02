import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ParticlesComponent from "@/components/ui/particles-bg";
import { Database, Zap, Satellite } from "lucide-react";

const projects = [
  {
    client: "LADS AFRICA",
    title: "Switch Middleware System & SOW",
    category: "FINANCIAL SERVICES",
    description: "Database and server infrastructure with comprehensive security implementation. Statement of Work documentation and middleware integration for financial switching systems.",
    icon: Database,
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1080"
  },
  {
    client: "POWERTEL",
    title: "Transformer Anti Intrusion System (TAIS)",
    category: "UTILITIES & ENERGY",
    description: "Electrical transformer security with warning systems, billing calculator interface, and WiFi/connectivity indicators for remote monitoring capabilities.",
    icon: Zap,
    image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1080"
  },
  {
    client: "ZODSAT",
    title: "Transformer Anti Intrusion System (TAIS)",
    category: "TELECOMMUNICATIONS",
    description: "Electrical transformer security system with warning indicators and remote monitoring capabilities for satellite communications infrastructure.",
    icon: Satellite,
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1080"
  }
];

export default function PortfolioPage() {
  return (
    <main className="flex flex-col min-h-screen bg-[var(--background)]">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-[600px] flex flex-col border-b border-[#333333] overflow-hidden">
        <div className="absolute inset-0 [&_#particles-js]:!h-full [&_#particles-js]:!relative">
          <ParticlesComponent />
        </div>
        {/* Gradient overlay - transparent top to dark bottom for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60 z-[1] pointer-events-none" />
        <div className="relative z-10 pointer-events-none flex flex-col justify-end gap-5 h-[600px] p-[80px_60px]">
          <span className="font-mono text-[13px] font-medium tracking-[2px] text-[var(--accent-gold)] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
            PORTFOLIO HIGHLIGHTS
          </span>
          <h1 className="font-display text-[80px] leading-[1.05] text-white max-w-[1000px] drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
            Proven Enterprise Solutions
          </h1>
          <p className="font-body text-[17px] leading-[1.5] text-white/85 max-w-[660px] drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]">
            Delivering measurable impact for leading organizations across financial services, utilities, and telecommunications sectors.
          </p>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="flex flex-col gap-0 bg-[var(--background)]">
        {projects.map((project, i) => (
          <div
            key={i}
            className={`flex items-stretch gap-0 border-b border-[var(--border)] ${
              i % 2 === 1 ? "flex-row-reverse" : ""
            }`}
          >
            <div className="relative w-[50%] min-h-[500px]">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover"
              />
              <div className="absolute top-6 left-6 px-4 py-2 bg-[var(--accent-navy)]">
                <span className="font-mono text-[13px] font-bold tracking-[2px] text-white">
                  {project.client}
                </span>
              </div>
            </div>
            <div className="flex flex-col justify-center gap-6 w-[50%] p-[60px] bg-[var(--background)]">
              <project.icon className="w-10 h-10 text-[var(--accent-gold)]" />
              <span className="font-mono text-[11px] font-medium tracking-[2px] text-[var(--accent-blue)]">
                {project.category}
              </span>
              <h2 className="font-display text-[32px] leading-[1.1] text-[var(--foreground)]">
                {project.title}
              </h2>
              <p className="font-body text-[15px] leading-[1.6] text-[var(--foreground-muted)]">
                {project.description}
              </p>
              <div className="flex gap-3 mt-2">
                <div className="px-3 py-1 bg-[var(--background-dark)]">
                  <span className="font-mono text-[11px] text-white">ENTERPRISE</span>
                </div>
                <div className="px-3 py-1 border border-[var(--border)]">
                  <span className="font-mono text-[11px] text-[var(--foreground-muted)]">INFRASTRUCTURE</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      <Footer />
    </main>
  );
}
