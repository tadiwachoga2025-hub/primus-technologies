import Link from "next/link";
import { Hexagon, Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-[#111111] text-[#A3A3A3] pt-[80px] pb-[32px] px-6 md:px-[60px]">

      {/* Massive CTA Section -> Reduced */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 pb-[48px] border-b border-[#333333]">
        <div className="flex flex-col gap-4 max-w-[800px]">
          <span className="font-mono text-[11px] uppercase tracking-[3px] text-[var(--accent-gold)] font-medium">READY TO BUILD</span>
          <h2 className="font-display text-[40px] md:text-[64px] leading-[1] text-white">Let&apos;s build infrastructure.</h2>
        </div>

        <Link href="/contact" className="group flex items-center gap-4 bg-white hover:bg-transparent border border-white text-black hover:text-white rounded-full px-6 py-3 transition-all duration-300">
          <span className="font-mono text-[13px] font-bold tracking-[1px] uppercase">Get in Touch</span>
          <div className="w-2 h-2 rounded-full bg-[var(--accent-blue)] group-hover:bg-white transition-colors" />
        </Link>
      </div>

      {/* Grid Links & Information -> Reduced Padding & Text sizes */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pt-[56px] pb-[80px]">

        {/* Company Identity */}
        <div className="md:col-span-1 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Hexagon className="w-6 h-6 text-[var(--accent-blue)]" />
            <span className="font-display text-[20px] font-bold tracking-[2px] text-white">PRIMUS</span>
          </div>
          <p className="font-body text-[14px] leading-[1.6] max-w-[280px]">
            Enterprise digital infrastructure provider serving global markets through innovation.
          </p>
        </div>

        {/* Support & Inquiries */}
        <div className="flex flex-col gap-5">
          <span className="font-mono text-[11px] uppercase tracking-[3px] text-white">Support</span>
          <div className="flex flex-col gap-3">
            <Link href="/contact" className="font-body text-[14px] hover:text-white transition-colors">Contact Support</Link>
            <Link href="/contact" className="font-body text-[14px] hover:text-white transition-colors">Sales & Inquiries</Link>
            <Link href="/contact" className="font-body text-[14px] hover:text-white transition-colors">Global Offices</Link>
          </div>
        </div>

        {/* Global Services */}
        <div className="flex flex-col gap-5">
          <span className="font-mono text-[11px] uppercase tracking-[3px] text-white">Services</span>
          <div className="flex flex-col gap-3">
            <Link href="/sectors" className="font-body text-[14px] hover:text-white transition-colors">Cybersecurity</Link>
            <Link href="/sectors" className="font-body text-[14px] hover:text-white transition-colors">Cloud Infrastructure</Link>
            <Link href="/sectors" className="font-body text-[14px] hover:text-white transition-colors">Managed IT</Link>
          </div>
        </div>

        {/* Company */}
        <div className="flex flex-col gap-5">
          <span className="font-mono text-[11px] uppercase tracking-[3px] text-white">Company</span>
          <div className="flex flex-col gap-3">
            <Link href="/process" className="font-body text-[14px] hover:text-white transition-colors">Process & About</Link>
            <Link href="/projects" className="font-body text-[14px] hover:text-white transition-colors">Portfolio Overview</Link>
          </div>
        </div>
      </div>

      {/* Sub Footer Legal */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-6 border-t border-[#333333]">
        <p className="font-mono text-[11px] tracking-[1px] uppercase">
          © 2024 Primus Technologies. All Rights Reserved.
        </p>
        <div className="flex gap-6">
          <span className="font-mono text-[11px] tracking-[1px] uppercase hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
          <span className="font-mono text-[11px] tracking-[1px] uppercase hover:text-white cursor-pointer transition-colors">Terms of Service</span>
        </div>
      </div>

    </footer>
  );
}
