import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { FlowButton } from "@/components/ui/flow-button";
import { ShieldCheck, Lightbulb, Users, Lock, MapPin, Calendar, Mail, Phone } from "lucide-react";
import { GeometricVortexAnimation } from "@/components/ui/geometric-vortex-animation";
import WavyBackground from "@/components/ui/blue-meshy-background";

const values = [
  {
    icon: ShieldCheck,
    title: "Integrity",
    description: "Unwavering commitment to honesty and ethical standards in every digital infrastructure project we undertake."
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "Redefining urban landscapes with innovative, eco-friendly tech solutions built for the future."
  },
  {
    icon: Users,
    title: "Client-Centric Approach",
    description: "Delivering excellence in design and functionality while prioritizing the unique needs of our partners."
  },
  {
    icon: Lock,
    title: "Security Excellence",
    description: "Protecting critical infrastructure with enterprise-grade security and robust threat mitigation."
  }
];

export default function AboutPage() {
  return (
    <main className="flex flex-col min-h-screen bg-[var(--background)]">
      <Header />

      {/* Hero Section with Blue Meshy Background */}
      <section className="relative min-h-[600px] flex flex-col border-b border-[#333333]">
        <WavyBackground className="flex flex-col justify-end h-[600px]">
          <div className="relative z-10 flex flex-col gap-5 p-[80px_60px]">
            <span className="font-mono text-[13px] font-medium tracking-[2px] text-[var(--accent-gold)] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              ABOUT PRIMUS TECHNOLOGIES
            </span>
            <h1 className="font-display text-[80px] leading-[1.05] text-white max-w-[1000px] drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
              Building Africa&apos;s Digital Future
            </h1>
            <p className="font-body text-[17px] leading-[1.5] text-white/85 max-w-[660px] drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]">
              Founded in 2024, we are committed to excellence, innovation, and measurable impact for our clients across Africa and global markets.
            </p>
          </div>
        </WavyBackground>
      </section>

      {/* Mission & Vision */}
      <section className="flex border-b border-[var(--border)]">
        <div className="flex flex-col justify-center gap-5 w-1/2 p-[80px_60px] bg-[var(--background-dark)]">
          <span className="font-mono text-[13px] font-medium tracking-[2px] text-[var(--accent-gold)]">
            OUR MISSION
          </span>
          <h2 className="font-display text-[36px] leading-[1.1] text-white">
            Redefining Urban Landscapes
          </h2>
          <p className="font-body text-[17px] leading-[1.6] text-[var(--foreground-light)]">
            To redefine urban landscapes with innovative, eco-friendly solutions. Delivering excellence in design and functionality.
          </p>
        </div>
        <div className="flex flex-col justify-center gap-5 w-1/2 p-[80px_60px] bg-[var(--background)]">
          <span className="font-mono text-[13px] font-medium tracking-[2px] text-[var(--accent-blue)]">
            OUR VISION
          </span>
          <h2 className="font-display text-[36px] leading-[1.1] text-[var(--foreground)]">
            Leading Enterprise Infrastructure
          </h2>
          <p className="font-body text-[17px] leading-[1.6] text-[var(--foreground-muted)]">
            To become Africa&apos;s leading enterprise digital infrastructure provider serving global markets.
          </p>
        </div>
      </section>

      {/* Core Values */}
      <section className="flex flex-col items-center gap-[60px] p-[80px_60px] bg-[var(--background)] border-b border-[var(--border)]">
        <div className="flex flex-col items-center gap-4">
          <span className="font-mono text-[13px] font-medium tracking-[2px] text-[var(--accent-blue)]">
            OUR CORE VALUES
          </span>
          <h2 className="font-display text-[48px] text-[var(--foreground)] text-center">
            The Pillars of Primus
          </h2>
        </div>
        <div className="flex justify-center gap-6 w-full">
          {values.map((value, i) => (
            <div key={i} className="flex flex-col items-center gap-5 w-[280px] p-[40px] bg-white border border-[var(--border)]">
              <value.icon className="w-10 h-10 text-[var(--accent-navy)]" />
              <h3 className="font-display text-[20px] text-[var(--foreground)] text-center">{value.title}</h3>
              <p className="font-body text-[14px] leading-[1.5] text-[var(--foreground-muted)] text-center">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Team & Leadership */}
      <section className="flex items-stretch border-b border-[var(--border)]">
        <div className="relative w-1/2 min-h-[500px]">
          <Image
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1080"
            alt="Team collaboration"
            fill
            className="object-cover"
          />
        </div>
        <div className="flex flex-col justify-center gap-6 w-1/2 p-[80px_60px] bg-[var(--background)]">
          <span className="font-mono text-[13px] font-medium tracking-[2px] text-[var(--accent-blue)]">
            LEADERSHIP
          </span>
          <h2 className="font-display text-[48px] leading-[1.1] text-[var(--foreground)]">
            Expert Team, Direct Leadership
          </h2>
          <p className="font-body text-[15px] leading-[1.6] text-[var(--foreground-muted)]">
            Our team of 10+ expert software developers and designers brings deep expertise in enterprise infrastructure, cybersecurity, and cloud technologies. Every project is led directly by our CEO and Founder, ensuring quality and commitment at every stage.
          </p>
          <div className="flex items-center gap-4 mt-4 p-4 bg-[#FAFAFA] border border-[var(--border)]">
            <div className="w-16 h-16 rounded-full bg-[var(--accent-navy)]" />
            <div className="flex flex-col gap-1">
              <span className="font-display text-[18px] text-[var(--foreground)]">Douglas Gweera</span>
              <span className="font-body text-[14px] text-[var(--foreground-light)]">CEO & Founder</span>
            </div>
          </div>
        </div>
      </section>

      {/* Company Credentials with Blue Meshy Background */}
      <section className="relative border-b border-[#333333]">
        <WavyBackground className="flex flex-col items-center gap-[60px] p-[80px_60px]">
          <div className="relative z-10 flex flex-col items-center gap-4">
            <span className="font-mono text-[13px] font-medium tracking-[2px] text-[var(--accent-gold)] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              COMPANY DETAILS
            </span>
            <h2 className="font-display text-[48px] text-white text-center drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
              Established Credentials
            </h2>
          </div>
          <div className="relative z-10 flex justify-center gap-8 w-full">
            <div className="flex items-center gap-4 p-[30px_40px] bg-black/40 backdrop-blur-sm border border-white/10 rounded">
              <MapPin className="w-6 h-6 text-[var(--accent-gold)]" />
              <div className="flex flex-col">
                <span className="font-mono text-[11px] tracking-[2px] text-white/70">HEADQUARTERS</span>
                <span className="font-body text-[16px] text-white">Harare, Zimbabwe</span>
              </div>
            </div>
            <div className="flex items-center gap-4 p-[30px_40px] bg-black/40 backdrop-blur-sm border border-white/10 rounded">
              <Calendar className="w-6 h-6 text-[var(--accent-gold)]" />
              <div className="flex flex-col">
                <span className="font-mono text-[11px] tracking-[2px] text-white/70">FOUNDED</span>
                <span className="font-body text-[16px] text-white">2024</span>
              </div>
            </div>
            <div className="flex items-center gap-4 p-[30px_40px] bg-black/40 backdrop-blur-sm border border-white/10 rounded hover:bg-white/10 transition-colors cursor-pointer group">
              <Link href="/contact" className="absolute inset-0 z-20" aria-label="Go to contact page"></Link>
              <div className="flex flex-col">
                <span className="font-mono text-[11px] tracking-[2px] text-white/70 group-hover:text-white transition-colors">INQUIRIES</span>
                <span className="font-body text-[16px] text-[var(--accent-gold)] group-hover:text-white transition-colors">Contact Our Team &rarr;</span>
              </div>
            </div>
          </div>
        </WavyBackground>
      </section>

      {/* CTA Section */}
      <section className="flex flex-col items-center gap-6 p-[80px_60px] bg-[var(--background)] border-b border-[var(--border)]">
        <h2 className="font-display text-[48px] text-[var(--foreground)] text-center">
          Ready to Transform Your Infrastructure?
        </h2>
        <p className="font-body text-[17px] text-[var(--foreground-muted)] text-center max-w-[600px]">
          Partner with Africa&apos;s leading enterprise digital infrastructure provider. Hybrid operational model combining physical office presence with remote service capabilities.
        </p>
        <FlowButton text="Start Your Project" href="/contact" />
      </section>

      <Footer />
    </main>
  );
}
