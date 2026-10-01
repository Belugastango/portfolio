# Modern Luxury Architectural Studio Landing Page (Next.js + Three.js)

A high-contrast, black & white modern luxury architectural landing page built with **Next.js (App Router)**, **React Three Fiber (@react-three/fiber)**, **Three.js**, **GSAP**, and **Tailwind CSS**.

---

## 1. Required Packages

Run the following command in your Next.js project root:

```bash
npm install three @react-three/fiber @react-three/drei @react-three/postprocessing gsap lucide-react
```

---

## 2. Directory Structure

Place the components in your Next.js project as follows:

```text
├── app/
│   ├── layout.jsx
│   └── page.jsx                  # Main page rendering <ArchitecturalHero />
├── components/
│   ├── ArchitecturalHero.jsx     # Fullscreen wrapper with dynamic SSR: false
│   ├── ArchitecturalCanvas.jsx   # 3D Procedural Villa wireframe & assembly
│   └── HeroOverlay.jsx           # Swiss typography, HUD & minimal navigation
├── tailwind.config.js
└── package.json
```

---

## 3. Usage in Next.js Page (`app/page.jsx`)

```jsx
import ArchitecturalHero from "@/components/ArchitecturalHero";

export default function Home() {
  return (
    <main className="w-full min-h-screen bg-[#000000]">
      <ArchitecturalHero />
    </main>
  );
}
```

---

## 4. Architectural Assembly Animation Breakdown

The 3D procedural wireframe villa constructs dynamically across 4 distinct phases via a synchronized GSAP timeline:

| Phase | Timing | Architectural Element | Behavior |
| :--- | :--- | :--- | :--- |
| **Phase 1** | `0.0s – 1.2s` | Foundation & Ground Drafting Grid | Base podium, terrace plinth, and coordinate grid expand outward. |
| **Phase 2** | `1.0s – 2.5s` | Structural Columns | 12 vertical grid columns shoot upward with `expo.out` easing. |
| **Phase 3** | `2.2s – 3.8s` | Slabs, Roof & Cantilevers | Ground floor pavilion, cantilevered master volume, and flat roof slab sweep in. |
| **Phase 4** | `3.5s – 5.0s` | Window Mullions & Louvers | Wooden brise-soleil slats, frameless glass mullions, and stair treads resolve. |
