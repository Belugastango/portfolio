'use client';

import React from "react";
import { ArrowUpRight, RotateCcw, ChevronDown } from "lucide-react";

/**
 * HeroOverlay Component
 * Strict High-Contrast Swiss/International Architectural Design
 * Features:
 * - Top minimal navigation with brand and pill CTA
 * - Bold minimal headline ("STRUCTURE & FORM")
 * - Architectural technical metadata (coordinates, scale, phase counter)
 * - Assembly replay trigger
 * - Subtle bottom scroll indicator
 */
export default function HeroOverlay({ onReplay, isAssembling = false }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-6 sm:p-10 md:p-12 text-[#FFFFFF] select-none">
      
      {/* ============================================================
          TOP NAVIGATION BAR (Strict Minimal Swiss Architecture)
          ============================================================ */}
      <header className="flex items-center justify-between w-full pointer-events-auto">
        {/* Brand Mark */}
        <a href="#home" className="flex items-center gap-3 group text-decoration-none">
          <div className="w-5 h-5 border border-white flex items-center justify-center transition-transform duration-300 group-hover:rotate-45">
            <div className="w-1.5 h-1.5 bg-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-xs tracking-[0.25em] uppercase font-bold text-white">
              ARCHITECT
            </span>
            <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-[#666666]">
              STUDIO EDITION
            </span>
          </div>
        </a>

        {/* Center Technical Datum (Hidden on mobile) */}
        <div className="hidden lg:flex items-center gap-6 font-mono text-[10px] tracking-[0.2em] text-[#888888] uppercase">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>RENDER ENGINE: WEBGL / CAD 60FPS</span>
          </div>
          <span className="text-[#333333]">|</span>
          <span>LAT 35°40'N  LON 139°45'E</span>
          <span className="text-[#333333]">|</span>
          <span>ELEVATION: +18.4M</span>
        </div>

        {/* Right Navigation & CTA */}
        <div className="flex items-center gap-4 sm:gap-8">
          <nav className="hidden md:flex items-center gap-6 font-mono text-xs tracking-[0.18em] uppercase text-[#888888]">
            <a href="#index" className="hover:text-white transition-colors duration-200">
              INDEX
            </a>
            <a href="#projects" className="hover:text-white transition-colors duration-200">
              PROJECTS
            </a>
            <a href="#studio" className="hover:text-white transition-colors duration-200">
              STUDIO
            </a>
          </nav>

          {/* Minimal High-Contrast Pill CTA */}
          <a
            href="#contact"
            className="flex items-center gap-2.5 px-4 sm:px-5 py-2 sm:py-2.5 bg-white text-black font-mono text-xs font-semibold tracking-[0.14em] uppercase rounded-full hover:bg-[#e5e5e5] transition-all duration-200 hover:scale-[1.02] shadow-[0_0_20px_rgba(255,255,255,0.2)]"
          >
            <span>GET IN TOUCH</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </header>

      {/* ============================================================
          MAIN HERO TYPOGRAPHY & TECHNICAL ANNOTATIONS
          ============================================================ */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-end my-auto pt-16 pb-8">
        
        {/* Left Column: Bold Monumental Headline */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="flex items-center gap-3 font-mono text-xs tracking-[0.3em] uppercase text-[#888888]">
            <span className="text-white font-bold">01 //</span>
            <span>PROCEDURAL WIREFRAME PROJECTION</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl xl:text-8xl font-black tracking-[-0.05em] uppercase leading-[0.92] text-white">
            STRUCTURE<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#e0e0e0] to-[#666666]">
              &amp; FORM.
            </span>
          </h1>

          <p className="font-mono text-xs sm:text-sm tracking-wide text-[#999999] max-w-lg leading-relaxed pt-2">
            Minimalist architectural residence realized in inverted CAD wireframe.
            Engineered through progressive procedural assembly from foundation to cantilevered roof planes.
          </p>
        </div>

        {/* Right Column: Editorial Notes (Matching Reference) */}
        <div className="lg:col-span-4 flex flex-col gap-4 lg:items-end">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-sm text-left font-sans">
            <div className="flex flex-col gap-2">
              <p className="text-[12px] leading-relaxed text-[#f7f2eb]/90">
                If you already have high-quality photos of the houses, let them become the centerpiece of the design.
              </p>
              <p className="text-[11px] leading-relaxed text-[#a8967e]/80">
                Where there is space for only what truly matters.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-[12px] leading-relaxed text-[#f7f2eb]/90">
                The structure below is designed so the landing page can later evolve into a full multi-page website.
              </p>
              <p className="text-[11px] leading-relaxed text-[#a8967e]/80">
                The first screen should create an emotional connection, while the content builds trust.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* ============================================================
          BOTTOM HUD: PHASE METRICS & SCROLL EXPLORE INDICATOR
          ============================================================ */}
      <footer className="flex items-end justify-between w-full border-t border-[#1c1c1c] pt-4 font-mono text-[10px] sm:text-xs tracking-[0.2em] text-[#666666] uppercase">
        
        {/* Left Phase Indicators */}
        <div className="flex items-center gap-4 sm:gap-8">
          <div className="flex items-center gap-1.5 text-white">
            <span className="w-1 h-3 bg-white" />
            <span>01 FOUNDATION</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5">
            <span className="w-1 h-3 bg-[#333333]" />
            <span>02 COLUMNS</span>
          </div>
          <div className="hidden md:flex items-center gap-1.5">
            <span className="w-1 h-3 bg-[#333333]" />
            <span>03 SLABS</span>
          </div>
          <div className="hidden lg:flex items-center gap-1.5">
            <span className="w-1 h-3 bg-[#333333]" />
            <span>04 DETAILS</span>
          </div>
        </div>

        {/* Center / Right Scroll Indicator */}
        <div className="pointer-events-auto flex items-center gap-2 text-white hover:text-[#aaaaaa] transition-colors cursor-pointer">
          <span className="tracking-[0.25em]">SCROLL TO EXPLORE</span>
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </div>

      </footer>

    </div>
  );
}
