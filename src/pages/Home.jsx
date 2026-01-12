import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
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
 * - underwater-style glow on active segment
 * - clickable arcs scroll to section
 */
function ColorWheelNav({ sections, active }) {
  const size = 78;
  const strokeBase = 12;
  const strokeActive = 16;

  const r = 36;
  const cx = 50;
  const cy = 50;

  const C = 2 * Math.PI * r;
  const gap = 7;
  const seg = C / sections.length;
  const dash = Math.max(8, seg - gap);

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
      <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: "visible" }}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="24" />

        {sections.map((s, i) => {
          const isActive = active === s.id;
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
                style={{ transition: "opacity 250ms ease, stroke-width 250ms ease" }}
              />
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

function hexToRgba(hex, alpha = 1) {
  const clean = hex.replace("#", "");
  const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;

  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** Simple helper hook */
function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia(query);
    const onChange = (e) => setMatches(e.matches);
    setMatches(mql.matches);

    if (mql.addEventListener) mql.addEventListener("change", onChange);
    else mql.addListener(onChange);

    return () => {
      if (mql.removeEventListener) mql.removeEventListener("change", onChange);
      else mql.removeListener(onChange);
    };
  }, [query]);

  return matches;
}

/**
 * Preloader
 * - cheap (CSS + a couple small motion-ish effects)
 * - locks scroll while showing
 */
function Preloader({ show, label = "Loading experience…" }) {
  useEffect(() => {
    if (!show) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-black grid place-items-center">
      <div className="relative text-center px-6">
        <div
          className="absolute inset-0 -z-10 blur-3xl opacity-60"
          style={{
            background:
              "radial-gradient(700px 450px at 50% 50%, rgba(34,211,238,0.22), transparent 60%)",
          }}
        />
        <div className="mx-auto mb-6 h-14 w-14 rounded-full border border-white/15 grid place-items-center">
          <div className="h-9 w-9 rounded-full border-2 border-cyan-400/70 border-t-transparent animate-spin" />
        </div>
        <div className="text-white font-semibold tracking-wide">{label}</div>
        <div className="mt-2 text-white/55 text-sm">
          One moment — loading visuals & sections.
        </div>
      </div>
    </div>
  );
}

/**
 * Desktop Notice Modal
 * - shows on mobile/tablet (or coarse pointer)
 * - dismissable + remembers in localStorage
 */
function DesktopNoticeModal({ open, onClose }) {
  useEffect(() => {
    if (!open) return;

    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[55]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="absolute inset-0 grid place-items-center p-6">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-950/80 backdrop-blur-xl p-6 shadow-[0_0_80px_rgba(34,211,238,0.12)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-white font-semibold text-lg">
                Best viewed on desktop
              </div>
              <div className="mt-2 text-white/70 leading-relaxed">
                For the full experience (animations, layout, and navigation),
                this site is best viewed on a desktop screen.
              </div>
            </div>

            <button
              onClick={onClose}
              className="shrink-0 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-white/80 hover:text-white hover:bg-white/10 transition"
              aria-label="Close"
              type="button"
            >
              ✕
            </button>
          </div>

          <div className="mt-5 flex flex-col sm:flex-row gap-3">
            <button
              onClick={onClose}
              type="button"
              className="w-full rounded-xl bg-cyan-500/90 hover:bg-cyan-400 text-black font-semibold py-3 transition"
            >
              Continue anyway
            </button>
            <button
              onClick={onClose}
              type="button"
              className="w-full rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-semibold py-3 transition"
            >
              Got it
            </button>
          </div>

          <div className="mt-3 text-xs text-white/45">
            Tip: rotate to landscape or use a larger display for best results.
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  // sections in color wheel order
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

  // Tint spotlight by active section color
  const spotlightColor = useMemo(() => {
    const s = sections[activeIndex];
    return s?.color ?? "#22d3ee";
  }, [sections, activeIndex]);

  // ✅ PRELOADER (short, but waits for next paint + assets settle)
  const [showLoader, setShowLoader] = useState(true);
  useEffect(() => {
    let t1 = 0;
    let t2 = 0;

    const finish = () => setShowLoader(false);

    // wait for first paint
    t1 = requestAnimationFrame(() => {
      // give the browser a tiny moment to finish layout + decode
      t2 = window.setTimeout(finish, 900);
    });

    return () => {
      cancelAnimationFrame(t1);
      clearTimeout(t2);
    };
  }, []);

  // ✅ DESKTOP NOTICE MODAL (only show once)
  const isMobileLike = useMediaQuery("(max-width: 1024px), (pointer: coarse)");
  const [showDesktopModal, setShowDesktopModal] = useState(false);

  useEffect(() => {
    if (!isMobileLike) return;

    const key = "cgm_desktop_notice_dismissed";
    const dismissed = typeof window !== "undefined" && localStorage.getItem(key) === "1";
    if (!dismissed) setShowDesktopModal(true);
  }, [isMobileLike]);

  const closeDesktopModal = useCallback(() => {
    try {
      localStorage.setItem("cgm_desktop_notice_dismissed", "1");
    } catch {}
    setShowDesktopModal(false);
  }, []);

  return (
    <main className="bg-black text-white relative">
      {/* Preloader */}
      <Preloader show={showLoader} label="Loading experience…" />

      {/* Desktop Notice Modal */}
      <DesktopNoticeModal open={showDesktopModal} onClose={closeDesktopModal} />

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
