import { ShieldCheck, Cloud, Server, Globe } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WavyBackground from "@/components/ui/blue-meshy-background";

const services = [
  {
    icon: ShieldCheck,
    title: "Enterprise Cybersecurity",
    category: "SECURITY",
    description: "Comprehensive security solutions to protect your critical infrastructure and data assets.",
    features: [
      "Security risk assessments",
      "Firewall and endpoint security deployment",
      "Threat monitoring and mitigation",
      "Compliance-driven infrastructure"
    ]
  },
  {
    icon: Cloud,
    title: "Cloud & Infrastructure Architecture",
    category: "CLOUD",
    description: "Scalable cloud solutions designed for performance, reliability, and cost efficiency.",
    features: [
      "Cloud migration and optimization",
      "Hybrid cloud deployment",
      "Virtualization solutions",
      "Disaster recovery and business continuity"
    ]
  },
  {
    icon: Server,
    title: "Managed IT Services",
    category: "MANAGED SERVICES",
    description: "Proactive IT management ensuring your systems run smoothly around the clock.",
    features: [
      "SLA-based support for enterprises",
      "Remote monitoring systems",
      "Infrastructure lifecycle management",
      "IT governance implementation"
    ]
  },
  {
    icon: Globe,
    title: "International Remote Technology Services",
    category: "GLOBAL SERVICES",
    description: "Remote technology expertise serving global markets from our African headquarters.",
    features: [
      "DevOps and system monitoring",
      "Infrastructure automation",
      "Global cloud management",
      "Remote enterprise support"
    ]
  }
];

export default function ServicesPage() {
  return (
    <main className="flex flex-col min-h-screen bg-[var(--background)]">
      <Header />

      {/* Hero Section with Blue Meshy Background */}
      <section className="relative min-h-[600px] flex flex-col border-b border-[#333333]">
        <WavyBackground className="flex flex-col justify-end h-[600px]">
          <div className="relative z-10 flex flex-col gap-5 p-[80px_60px]">
            <span className="font-mono text-[13px] font-medium tracking-[2px] text-[var(--accent-gold)] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              OUR SERVICES
            </span>
            <h1 className="font-display text-[80px] leading-[1.05] text-white max-w-[1000px] drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
              Enterprise-Grade Solutions
            </h1>
            <p className="font-body text-[17px] leading-[1.5] text-white/85 max-w-[660px] drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]">
              From cybersecurity to global cloud management, we provide the backbone for critical operations across Africa and beyond.
            </p>
          </div>
        </WavyBackground>
      </section>

      {/* Services Grid */}
      <section className="flex flex-col gap-0 bg-[var(--background)]">
        {services.map((service, i) => (
          <div
            key={i}
            className={`flex items-start gap-[60px] p-[80px_60px] border-b border-[var(--border)] ${
              i % 2 === 1 ? "flex-row-reverse bg-[var(--background)]" : "bg-[#FAFAFA]"
            }`}
          >
            <div className="flex flex-col gap-6 w-[500px]">
              <service.icon className="w-12 h-12 text-[var(--accent-navy)]" />
              <span className="font-mono text-[13px] font-medium tracking-[2px] text-[var(--accent-blue)]">
                {service.category}
              </span>
              <h2 className="font-display text-[48px] leading-[1.1] text-[var(--foreground)]">
                {service.title}
              </h2>
              <p className="font-body text-[15px] leading-[1.6] text-[var(--foreground-muted)]">
                {service.description}
              </p>
            </div>
            <div className="flex-1 flex flex-col gap-4 p-[40px] bg-white border border-[var(--border)]">
              <span className="font-mono text-[13px] font-medium tracking-[2px] text-[var(--foreground-muted)]">
                KEY CAPABILITIES
              </span>
              <ul className="flex flex-col gap-3">
                {service.features.map((feature, j) => (
                  <li key={j} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-[var(--accent-gold)] rounded-full" />
                    <span className="font-body text-[15px] text-[var(--foreground)]">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </section>

      <Footer />
    </main>
  );
}
