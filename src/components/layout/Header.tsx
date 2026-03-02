"use client";

import Link from "next/link";
import { Hexagon } from "lucide-react";
import { SterlingGateKineticNavigation } from "@/components/ui/sterling-gate-kinetic-navigation";

export default function Header() {
  return (
    <header className="flex items-center justify-between h-[70px] px-[60px] bg-[var(--background)] border-b border-[var(--border)] relative z-[100]">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-[10px] z-[110]">
        <Hexagon className="w-6 h-6 text-[var(--accent-navy)]" />
        <span className="font-display text-[22px] font-bold tracking-[2px] text-[var(--accent-navy)]">
          PRIMUS
        </span>
      </Link>

      {/* Kinetic Navigation System */}
      <SterlingGateKineticNavigation />
    </header>
  );
}
