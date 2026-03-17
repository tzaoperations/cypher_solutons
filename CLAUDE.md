# PROJECT: CYPHER SOLUTIONS
**Identity**: Engineering backbone for Zero Agency. We engineer digital infrastructure.
**Vibe**: Stripe × Linear × Apple. Minimalist, premium. Dark mode: #0B0F14. Light mode: #FAFAFA.
**Strictly Avoid**: Generic templates, AI-corporate tone, and unoptimized glitch effects.

## 1. TECH STACK & ARCHITECTURE
* **Frontend**: Next.js (App Router), TypeScript, Tailwind CSS.
* **Themes**: next-themes (Light/Dark support).
* **Animations & 3D**: React Three Fiber, GSAP, Framer Motion, Lenis.
* **Backend**: Appwrite (Database, Auth, Storage, custom CMS).

## 2. STRICT ARCHITECTURAL RULES (CRITICAL)
* **Rules of Hooks**: ALL hooks (useState, useEffect, useTransform, etc.) MUST be declared at the absolute top of the component. No early returns (e.g., `if (loading) return null`) are allowed above hook declarations.
* **3D Optimization**: ALL Three.js/WebGL components MUST be dynamically imported with `ssr: false` to prevent hydration errors.
* **UI Specifics**: 
    - Theme Toggle must use `text-black dark:text-white` for visibility.
    - Particles in `HeroCanvas`: use primary purple in dark mode; use deeper purple (`#6B21A8`) in light mode.
* **Physics UI**: Use spring physics for the Custom Cursor and all hover/scroll interactions. No stiff transitions.

## 3. COMPONENT REGISTRY
* **BootLoader**: System initializing sequence (Session-stored). Flash "CYPHER" on 100%.
* **CustomCursor**: Geometric spring-physics follower. Morphs on hover over links/buttons.
* **ThemeToggle**: Floating toggle visible in all modes.
* **HeroCanvas**: Interactive particle field with cursor repulsion/attraction logic.

## 4. PAGE ARCHITECTURE
* **Public**: `/` (Home), `/services`, `/projects`, `/process`, `/about`, `/blog`, `/contact`.
* **Dynamic**: `/services/[slug]`, `/projects/[slug]`, `/blog/[slug]`.
* **Admin**: `/admin` (Secure Appwrite Auth).

## 5. APPWRITE DATABASE SCHEMA
* **projects**: title, slug, category, featured(bool), techStack(array), images, results, seoMeta.
* **blogs**: title, slug, content(rich), category, tags, seoMeta, focusKeyword.
* **team**: name, role, bio, socialLinks, displayOrder, isVisible.
* **services**: title, description, icon, seoMeta, structuredData.
* **inquiries**: name, company, email, projectType, budget, message.
* **siteSettings**: globalSEO, defaultOG, analyticsScripts, robotsRules.