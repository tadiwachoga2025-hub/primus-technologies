# Kinetic Navigation Integration Plan

## 1. Goal
Integrate the `sterling-gate-kinetic-navigation.tsx` component into the `src/components/ui` directory, hooking it up to the global layout and styling it to match the existing brand/design system. By leveraging `@ui-ux-pro-max` and `@frontend-design`, we'll achieve a fluid, GSAP-powered motion menu that feels both tactile and premium.

## 2. Component Structure & Shadcn Conventions
**Why `src/components/ui`?**
The codebase uses `src/components/layout` and `src/components/sections`. Shadcn/UI enforces the `components/ui` folder for standalone, agnostic, highly reusable atomic elements (like buttons, dialogs, or isolated navigation systems) separate from business logic or page wrappers. It ensures the design system can scale predictably without tangling global CSS with complex React logic.

## 3. Implementation Steps (Phase 2)
1. **Component Creation**:
   - Create `src/components/ui/sterling-gate-kinetic-navigation.tsx`.
   - Update SVGs to use `lucide-react` icons (e.g., `<Menu />` and `<X />`) to maintain consistency and fix the hardcoded SVG.
   - Refactor the code slightly to support strictly typed React constraints and ensure `CustomEase` registers properly within the Next.js App Router context.
2. **Global CSS Integration**:
   - Append the provided CSS root variables into `src/app/globals.css`. We will weave the `tw-animate-css` generic variables directly into the existing root blocks dynamically without disrupting the current light/dark variables.
3. **Usage via `DemoOne` Header**:
   - We will replace the current hardcoded `<nav>` desktop links in `src/components/layout/Header.tsx` to utilize this beautiful fullscreen GSAP kinetic menu as the primary navigation overlay, bringing the site to an enterprise-grade interactivity level.
   - Update anchor targets to use `<Link>` from `next/link`.

## 4. Pending Clarifications (Socratic Gate)
Before proceeding to Phase 2 (Implementation), please confirm:
1. **Header Replacement**: I plan to integrate this kinetic full-screen menu seamlessly into your current `Header.tsx` so that clicking "Menu" drops the animated layers over the site. Do you approve?
2. **GSAP Logic**: Since `gsap` is already installed, I'll deploy the provided component code essentially verbatim but upgraded for TypeScript and Lucide. Sound good?
