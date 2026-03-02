---
name: enterprise-architecture-sop
description: SOP for Enterprise-Scale Product Architecture, High-Fidelity UI, and Cinematic Animations
author: Antigravity System
version: 1.0.0
skills:
  - frontend-design
  - ui-ux-pro-max
  - react-best-practices
  - performance-profiling
---

# 🏛️ Enterprise-Scale Product Architecture & Design SOP

> **Core Directive:** To architect, design, and deploy elite, scalable web applications and B2B SaaS platforms capable of supporting massive user bases with Apple-tier aesthetics, billion-dollar trust design, and 60fps cinematic animations.

When an AI agent is instructed to implement this SOP, it MUST follow the exact technical implementation blueprints below.

---

## 🎨 Phase 1: Brand Authority & High-Fidelity UX

Billion-dollar products win on trust and aesthetics before a user even logs in.

### Step 1.1: Design Language System (DLS) Generation
1. Initialize the `ui-ux-pro-max` workflow to generate the foundational Design Tokens.
2. Define rigorous spacing (Base-4 or Base-8 grid).
3. Establish typography scales (e.g., *Inter* for interfaces, *Instrument Serif* for luxury display headings).
4. Define color palette arrays containing: Default, Hover, Active, Disabled, and Muted states. Must be fully equipped for AAA contrast Dark Mode.

### Step 1.2: Premium UI Prototyping
1. Design components natively for complex data visualization and heavy structural nesting.
2. Establish "Glassmorphism" protocols: use backdrop-blur, semi-transparent white overlays (`bg-white/10`), and 1px inner borders to create physical depth.
3. Every button, input, and card MUST contain micro-interaction hover definitions (e.g., `translate-y-[-2px] shadow-lg transition-all duration-300`).

---

## 🎬 Phase 2: The Cinematic Animation Layer (60fps)

Never use simple CSS transitions for primary storytelling. Utilize hardware-accelerated orchestration.

### Step 2.1: GSAP & WebGL Orchestration
1. **Component Initialization:** Wrap complex layout phases in `gsap.context()` for React memory safety and simple cleanup.
2. **Timeline Mastery:** Use `gsap.timeline()` for sequenced loading. Never animate elements randomly; stagger them (`stagger: 0.1`) to guide the user's eye across the viewport.
3. **Custom Easing:** Apply premium physical easing (e.g., `CustomEase.create("main", "0.65, 0.01, 0.05, 0.99")` or standard `expo.out`) to ensure UI components don't "snap" awkwardly.

### Step 2.2: Scroll & Kinetic Typography
1. Bind Hero sections to viewport scroll state via ScrollTrigger. Create parallax depth by passing different `yPercent` values to foreground, midground, and background layers.
2. Render kinetic text (e.g., Character-by-character reveals) utilizing `clip-path` and `transform` properties only to avoid DOM reflows.

---

## 🤖 Phase 3: Terminal-Native AI Scaffolding

### Step 3.1: Autonomous Scaffold Generation
1. Use CLI sub-agents (`frontend-specialist`, `backend-specialist`) to scaffold the Next.js/React folder structure (`npx create-next-app@latest`).
2. Integrate `shadcn/ui` components instantly to establish the accessible `.radix` primitive baseline before layering on custom enterprise styling.
3. Establish robust `eslint` and `prettier` config protocols to enforce absolute code conformity.

### Step 3.2: AI-Accelerated Logic Mapping
1. Agents define Data Models, fetch hooks, and WebSockets.
2. Ensure strict `TypeScript` typing on all generated interfaces. Do not permit `any` types.

---

## ⚙️ Phase 4: Expert Front-End Engineering & Optimization

### Step 4.1: Component Separation
1. Keep functional components completely decoupled. Form state must not trigger global layout re-renders. 
2. Employ `React.memo`, `useMemo`, and `useCallback` religiously for deep dashboards, grids, and analytic table views.

### Step 4.2: Zero-Waterfall Vitals & Perf
1. Move data fetching to Next.js React Server Components (RSC) to minimize client-side javascript payloads.
2. Optimize heavily: `<Image />` tags must have accurate `sizes` flags and formats set to WebP/AVIF. 

---

## ☁️ Phase 5: System Design & AWS Cloud Architecture

### Step 5.1: Infrastructure as Code (IaC)
1. Design backend utilizing AWS Solutions Architecture principles.
2. Define the exact infrastructure mapping (VPCs, ECS Clusters, RDS databases, Lambda triggers) utilizing Terraform or AWS CDK.

### Step 5.2: Expert Sub-Agent Orchestration
1. Segment applications into resilient microservices (authentication, raw data crunching, secure document parsing).
2. Utilize Model Context Protocol (MCP) servers locally to allow secure bridging between restricted APIs and the development environment.

---

## 🛡️ Phase 6: Enterprise Security & Edge Telemetry

1. **Zero-Trust & Compliance:** Route all user queries through OAuth 2.0 / SAML identity provision. Encrypt at rest utilizing AWS KMS.
2. **Global Edge Routing:** Serve all static assets and Next.js middleware via Vercel Edge Network or AWS CloudFront to assure maximum sub-50ms TTFB (Time to First Byte).
3. **Real-time Observability:** Implement Datadog/Sentry log aggregation, specifically tracking Core Web Vitals (LCP, CLS, INP) alongside standard error capture.
