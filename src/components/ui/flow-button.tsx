'use client';

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { ButtonHTMLAttributes } from 'react';

interface FlowButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    text?: string;
    href?: string;
}

export function FlowButton({
    text = "Modern Button",
    href,
    className = "",
    ...props
}: FlowButtonProps) {
    // Using site-specific vars while maintaining the requested fluid, rounded animation style.
    const containerClasses = `group relative flex items-center justify-center gap-1 overflow-hidden rounded-[100px] border-[1.5px] border-[var(--border)] bg-transparent px-[32px] py-[16px] cursor-pointer transition-all duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)] hover:border-transparent hover:rounded-[12px] active:scale-[0.95] ${className}`;

    const innerContent = (
        <>
            {/* Left arrow (arr-2) */}
            <ArrowRight
                className="absolute w-4 h-4 left-[-25%] stroke-[var(--foreground)] fill-none z-[9] group-hover:left-6 group-hover:stroke-white transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]"
            />

            {/* Text */}
            <span className="relative z-[1] -translate-x-3 group-hover:translate-x-3 transition-all duration-[800ms] ease-out font-mono text-[13px] font-medium tracking-[2px] text-[var(--foreground)] group-hover:text-white uppercase">
                {text}
            </span>

            {/* Circle Layer */}
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-[var(--accent-blue)] rounded-[50%] opacity-0 group-hover:w-[350px] group-hover:h-[350px] group-hover:opacity-100 transition-all duration-[800ms] ease-[cubic-bezier(0.19,1,0.22,1)]"></span>

            {/* Right arrow (arr-1) */}
            <ArrowRight
                className="absolute w-4 h-4 right-6 stroke-[var(--foreground)] fill-none z-[9] group-hover:right-[-25%] group-hover:stroke-white transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]"
            />
        </>
    );

    if (href) {
        return (
            <Link href={href} className={containerClasses}>
                {innerContent}
            </Link>
        );
    }

    return (
        <button className={containerClasses} {...props}>
            {innerContent}
        </button>
    );
}
