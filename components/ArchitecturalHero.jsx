'use client';

import React from "react";
import dynamic from "next/dynamic";
import HeroOverlay from "./HeroOverlay";

const ArchitecturalCanvas = dynamic(() => import("./ArchitecturalCanvas"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 w-full h-full bg-[#000000] flex items-center justify-center font-mono text-xs text-[#555555] tracking-[0.25em] uppercase">
      INITIALIZING 3D WIREFRAME ENVIRONMENT...
    </div>
  ),
});

/**
 * ArchitecturalHero Fullscreen Section
 * Integrates:
 * 1. Live 3D Procedural Wireframe House Assembly (Three.js / R3F)
 * 2. High-Contrast Swiss Minimalist Typography & Navigation Overlay
 */
export default function ArchitecturalHero() {
  return (
    <section className="relative w-full h-screen overflow-hidden bg-[#000000]">
      {/* Live 3D Wireframe Scene */}
      <ArchitecturalCanvas />

      {/* UI Typography & Nav Overlay */}
      <HeroOverlay />
    </section>
  );
}
