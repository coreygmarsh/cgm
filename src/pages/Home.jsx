import React, { useEffect, useMemo, useRef, useState } from "react";
import UnderwaterHero from "../components/UnderwaterHero";
import FeaturedWorkSection from "../components/Home/FeaturedWorkSection";
import BeyondWorkSection from "../components/Home/BeyondWorkSection";
import BlogStoriesSection from "../components/Home/BlogStoriesSection";
import Footer from "../components/Home/Footer";
import Approach from "../components/Home/Approach";

/**
 * RevealSection
 * - fades sections in on first intersection
 * - calls onActive(id) when section is near viewport center
 */
function RevealSection({ id, children, onActive }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  // reveal on intersect
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setVisible(true);
        }
      },
      { threshold: 0.18 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  // active when near center
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const center = window.innerHeight / 2;
      const elCenter = rect.top + rect.height / 2;
      const dist = Math.abs(elCenter - center);

      if (dist < window.innerHeight * 0.35) onActive?.(id);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [id, onActive]);

  return (
    <section
      id={id}
      ref={ref}
      className={[
        "relative z-10",
        "transition-all duration-700 ease-out",
        visible
          ? "opacity-100 translate-y-0 blur-0"
          : "opacity-0 translate-y-8 blur-[10px]",
      ].join(" ")}
      style={{ willChange: "transform, opacity, filter" }}
    >
      {children}
    </section>
  );
}

/**
 * ColorWheelNav
 * - true radial wheel
 * - underwater-style glow on active segment (teal/emerald bloom like your shader)
 * - clickable arcs scroll to section
 */
function ColorWheelNav({ sections, active }) {
  const size = 78; // px
  const strokeBase = 12;
  const strokeActive = 16;

  // SVG space
  const r = 36;
  const cx = 50;
  const cy = 50;

  const C = 2 * Math.PI * r;
  const gap = 7; // gap between segments
  const seg = C / sections.length;
  const dash = Math.max(8, seg - gap);

  // Underwater shader-esque bloom (teal/emerald)
  const UNDERWATER_GLOW = [
    "drop-shadow(0 0 6px rgba(0, 220, 200, 0.35))",
    "drop-shadow(0 0 14px rgba(0, 220, 200, 0.22))",
    "drop-shadow(0 0 26px rgba(0, 220, 200, 0.14))",
  ].join(" ");

  const scrollToId = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-20 hidden md:flex items-center">
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        style={{ overflow: "visible" }}
      >
        {/* faint base ring */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="24"
        />

        {sections.map((s, i) => {
          const isActive = active === s.id;

          // rotate so first segment starts near top
          const offset = -(seg * i) + C * 0.25;

          return (
            <g
              key={s.id}
              className="cursor-pointer"
              onClick={() => scrollToId(s.id)}
              style={{
                filter: isActive ? UNDERWATER_GLOW : "none",
                mixBlendMode: isActive ? "screen" : "normal",
                transition: "filter 250ms ease, opacity 250ms ease",
              }}
            >
              {/* glow stroke behind active arc */}
              <circle
                cx={cx}
                cy={cy}
                r={r}
                fill="none"
                stroke={isActive ? "rgba(0, 220, 200, 0.55)" : "transparent"}
                strokeWidth={isActive ? 14 : 0}
                strokeLinecap="round"
                strokeDasharray={`${dash} ${C - dash}`}
                strokeDashoffset={offset}
                opacity={isActive ? 1 : 0}
              />

              {/* main arc */}
              <circle
                cx={cx}
                cy={cy}
                r={r}
                fill="none"
                stroke={s.color}
                strokeWidth={isActive ? strokeActive : strokeBase}
                strokeLinecap="round"
                strokeDasharray={`${dash} ${C - dash}`}
                strokeDashoffset={offset}
                opacity={isActive ? 1 : 0.45}
                style={{
                  transition: "opacity 250ms ease, stroke-width 250ms ease",
                }}
              />

              {/* tiny marker dot at segment start */}
              <circle
                cx={cx}
                cy={cy}
                r={isActive ? 2.2 : 1.7}
                fill={s.color}
                opacity={isActive ? 1 : 0.55}
                style={{
                  transformOrigin: "50px 50px",
                  transform: `rotate(${(360 / sections.length) * i - 90}deg) translate(${r}px)`,
                  transition: "opacity 250ms ease, r 250ms ease",
                }}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/**
 * helper: hex -> rgba string
 * used for spotlight tinting
 */
function hexToRgba(hex, alpha = 1) {
  const clean = hex.replace("#", "");
  const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;

  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function Home() {
  // 6 sections in color wheel order:
  const sections = useMemo(
    () => [
      { id: "hero", label: "Hero", color: "#3b82f6" }, // blue
      { id: "featured", label: "Work", color: "#22c55e" }, // green
      { id: "beyond", label: "Beyond", color: "#eab308" }, // yellow
      { id: "approach", label: "Approach", color: "#f97316" }, // orange
      { id: "stories", label: "Books & Articles", color: "#ef4444" }, // red
      { id: "footer", label: "Footer", color: "#a855f7" }, // purple
    ],
    []
  );

  const [active, setActive] = useState("hero");

  const activeIndex = useMemo(
    () => Math.max(0, sections.findIndex((s) => s.id === active)),
    [active, sections]
  );

  // Spotlight follows active
  const spotlightY = useMemo(() => {
    const stops = ["-60%", "-35%", "-15%", "5%", "22%", "38%"];
    return stops[Math.min(stops.length - 1, activeIndex)];
  }, [activeIndex]);

  // Tint spotlight by active section color (keeps your vibe but makes it coherent)
  const spotlightColor = useMemo(() => {
    const s = sections[activeIndex];
    return s?.color ?? "#22d3ee";
  }, [sections, activeIndex]);

  return (
    <main className="bg-black text-white relative">
      {/* Spotlight layer */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div
          className="absolute left-1/2 top-1/2 h-[70vh] w-[70vw] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl opacity-50 transition-all duration-700"
          style={{
            transform: `translate(-50%, ${spotlightY})`,
            background: `radial-gradient(circle at center, ${hexToRgba(
              spotlightColor,
              0.18
            )}, rgba(0,0,0,0) 60%)`,
          }}
        />
      </div>

      {/* 🔵 Blue */}
      <RevealSection id="hero" onActive={setActive}>
        <UnderwaterHero />
      </RevealSection>

      {/* 🟢 Green */}
      <RevealSection id="featured" onActive={setActive}>
        <FeaturedWorkSection />
      </RevealSection>

      {/* 🟡 Yellow */}
      <RevealSection id="beyond" onActive={setActive}>
        <BeyondWorkSection />
      </RevealSection>

      {/* 🟠 Orange */}
      <RevealSection id="approach" onActive={setActive}>
        <Approach />
      </RevealSection>

      {/* 🔴 Red */}
      <RevealSection id="stories" onActive={setActive}>
        <BlogStoriesSection />
      </RevealSection>

      {/* 🟣 Purple */}
      <RevealSection id="footer" onActive={setActive}>
        <Footer />
      </RevealSection>

      {/* Wheel Nav */}
      <ColorWheelNav sections={sections} active={active} />
    </main>
  );
}
