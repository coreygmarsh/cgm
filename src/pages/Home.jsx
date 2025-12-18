import React, { useEffect, useMemo, useRef, useState } from "react";
import UnderwaterHero from "../components/UnderwaterHero";
import FeaturedWorkSection from "../components/Home/FeaturedWorkSection";
import BeyondWorkSection from "../components/Home/BeyondWorkSection";
import BlogStoriesSection from "../components/Home/BlogStoriesSection";
import Footer from "../components/Home/Footer";

function RevealSection({ id, children, onActive }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
          }
        }
      },
      { threshold: 0.18 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  // “Active section” = closest to center
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const center = window.innerHeight / 2;
      const elCenter = rect.top + rect.height / 2;
      const dist = Math.abs(elCenter - center);
      // within ~35% of viewport center counts as active
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
        visible ? "opacity-100 translate-y-0 blur-0" : "opacity-0 translate-y-8 blur-[10px]",
      ].join(" ")}
      style={{ willChange: "transform, opacity, filter" }}
    >
      {children}
    </section>
  );
}

export default function Home() {
  const sections = useMemo(() => ["hero", "featured", "stories", "services"], []);
  const [active, setActive] = useState("hero");

  return (
    <main className="bg-black text-white relative">
      {/* Spotlight layer */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div
          className="absolute left-1/2 top-1/2 h-[70vh] w-[70vw] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl opacity-50 transition-all duration-700"
          style={{
            // Shift the spotlight down as active section changes
            transform: `translate(-50%, ${
              active === "hero"
                ? "-58%"
                : active === "featured"
                ? "-25%"
                : active === "services"
                ? "5%"
                : "32%"
            })`,
            background:
              "radial-gradient(circle at center, rgba(0,220,200,0.18), rgba(0,0,0,0) 60%)",
          }}
        />
      </div>

      <RevealSection id="hero" onActive={setActive}>
        <UnderwaterHero />
      </RevealSection>

      <RevealSection id="featured" onActive={setActive}>
        <FeaturedWorkSection />
      </RevealSection>

      <RevealSection id="stories" onActive={setActive}>
        <BlogStoriesSection />
      </RevealSection>

      <RevealSection id="services" onActive={setActive}>
        <BeyondWorkSection />
      </RevealSection>

      

      <Footer />

      {/* Optional: tiny section progress dots */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-20 hidden md:flex flex-col gap-3">
        {sections.map((s) => (
          <a
            key={s}
            href={`#${s}`}
            className={[
              "h-2.5 w-2.5 rounded-full border transition-all",
              active === s
                ? "bg-white/80 border-white/80 scale-125"
                : "bg-white/10 border-white/30 hover:bg-white/30",
            ].join(" ")}
          />
        ))}
      </div>
    </main>
  );
}
