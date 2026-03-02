import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ServicesCarousel from "@/components/sections/ServicesCarousel";
import FeaturedProjectsParallax from "@/components/sections/FeaturedProjectsParallax";
import LeadershipSection from "@/components/sections/LeadershipSection";
import { CoreValuesSection } from "@/components/sections/CoreValuesSection";
import GSAPHeroSection from "@/components/sections/GSAPHeroSection";
import { FlowButton } from "@/components/ui/flow-button";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen bg-[var(--background)]">
      <Header />

      {/* GSAP Cinematic Hero Section */}
      <GSAPHeroSection />

      {/* Values Section */}
      <section className="flex items-center gap-[80px] h-[700px] p-[60px] border-b border-[var(--border)]">
        <div className="flex flex-col gap-5 justify-center flex-1">
          <span className="font-mono text-[13px] font-medium tracking-[2px] text-[var(--accent-navy)]">
            OUR VALUES
          </span>
          <h2 className="font-display text-[48px] leading-[1.1] text-[var(--foreground)] max-w-[500px]">
            Guided by Excellence
          </h2>
          <p className="font-body text-[15px] leading-[1.6] text-[var(--foreground-muted)] max-w-[500px]">
            Integrity, Innovation, Client-Centricity, and Security Excellence are the pillars of every Primus project.
          </p>
        </div>
        <div className="relative flex-1 h-full">
          <Image
            src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1080"
            alt="Technology workspace"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </section>

      {/* Core Values Grid - APOSSIBLE Design Pattern */}
      <CoreValuesSection />

      {/* Mission Section */}
      <section className="flex w-full border-b border-[var(--border)]">
        <div className="flex items-center p-[80px] bg-[var(--background)]">
          <div className="flex flex-col gap-5 p-[60px] bg-[var(--background)] border border-[var(--border)] w-[600px]">
            <span className="font-mono text-[13px] font-medium tracking-[2px] text-[var(--accent-blue)]">
              OUR MISSION
            </span>
            <h2 className="font-display text-[36px] leading-[1.1] text-[var(--foreground)]">
              Redefining Urban Landscapes with Innovation
            </h2>
            <p className="font-body text-[15px] leading-[1.6] text-[var(--foreground-muted)]">
              To redefine urban landscapes with innovative, eco-friendly solutions. Delivering excellence in design and functionality through cutting-edge technology and sustainable practices.
            </p>
            <div className="w-fit mt-2">
              <FlowButton text="Learn About Us" href="/process" />
            </div>
          </div>
        </div>
        <div className="relative flex-1 h-auto min-h-[500px]">
          <Image
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1080"
            alt="Modern cityscape"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </section>

      {/* Services/Expertise Section - APOSSIBLE Design Pattern */}
      <ServicesCarousel />

      {/* Featured Projects - Parallax Glassmorphism Pattern */}
      <FeaturedProjectsParallax />

      {/* Leadership Section - Enterprise Design Pattern */}
      <LeadershipSection />

      <Footer />
    </main>
  );
}
