import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const AGENCY_URL = "https://www.cgmcreativesolutions.com"; // ← change this to your real URL

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu if user resizes back to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setIsMenuOpen(false); // lg breakpoint
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const navLinkBase =
    "relative group text-md md:text-lg font-medium tracking-wide transition-all duration-300 px-3 py-2 rounded-full";

  const navLinkStyles = {
    home: {
      inactive: "text-cyan-100 hover:text-blue-300",
      active:
        "text-slate-900 bg-gradient-to-r from-blue-400 to-blue-600 shadow-lg shadow-blue-400/50",
      hover: "from-blue-400 to-blue-600",
      glow: "rgba(59, 130, 246, 0.8)",
      shadow: "0 0 10px rgba(59, 130, 246, 0.3)",
    },
    work: {
      inactive: "text-cyan-100 hover:text-green-300",
      active:
        "text-slate-900 bg-gradient-to-r from-green-400 to-emerald-600 shadow-lg shadow-green-400/50",
      hover: "from-green-400 to-emerald-600",
      glow: "rgba(34, 197, 94, 0.8)",
      shadow: "0 0 10px rgba(34, 197, 94, 0.3)",
    },
    beyond: {
      inactive: "text-cyan-100 hover:text-yellow-300",
      active:
        "text-slate-900 bg-gradient-to-r from-yellow-400 to-amber-500 shadow-lg shadow-yellow-400/50",
      hover: "from-yellow-400 to-amber-500",
      glow: "rgba(234, 179, 8, 0.8)",
      shadow: "0 0 10px rgba(234, 179, 8, 0.3)",
    },
    about: {
      inactive: "text-cyan-100 hover:text-teal-300",
      active:
        "text-slate-900 bg-gradient-to-r from-teal-400 to-cyan-600 shadow-lg shadow-teal-400/50",
      hover: "from-teal-400 to-cyan-600",
      glow: "rgba(20, 184, 166, 0.8)",
      shadow: "0 0 10px rgba(20, 184, 166, 0.3)",
    },
    contact: {
      inactive: "text-cyan-100 hover:text-red-300",
      active:
        "text-slate-900 bg-gradient-to-r from-red-400 to-rose-600 shadow-lg shadow-red-400/50",
      hover: "from-red-400 to-rose-600",
      glow: "rgba(239, 68, 68, 0.8)",
      shadow: "0 0 10px rgba(239, 68, 68, 0.3)",
    },
  };

  const handleLogoClick = () => {
    window.open(AGENCY_URL, "_blank", "noopener,noreferrer");
  };

  // Helper to render a link with your existing effects
  const RenderLink = ({ to, label, styleKey, end = false }) => (
    <NavLink
      to={to}
      end={end}
      onClick={() => {
        // close mobile menu and scroll to top
        setIsMenuOpen(false);
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      }}
      className={({ isActive }) =>
        `${navLinkBase} ${
          isActive ? navLinkStyles[styleKey].active : navLinkStyles[styleKey].inactive
        }`
      }
      style={({ isActive }) => ({
        textShadow: isActive
          ? navLinkStyles[styleKey].shadow
          : "0 0 10px rgba(0, 255, 255, 0.3)",
      })}
    >
      {({ isActive }) => (
        <>
          {label}
          {!isActive && (
            <>
              <span
                className={`absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r ${navLinkStyles[styleKey].hover} group-hover:w-full transition-all duration-300`}
                style={{ boxShadow: `0 0 10px ${navLinkStyles[styleKey].glow}` }}
              />
              <span
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping"
                style={{ animationDuration: "2s" }}
              />
            </>
          )}
        </>
      )}
    </NavLink>
  );

  return (
    <>
      <style>
        {`
          @keyframes wave-slide {
            0% { transform: translateX(-50%); }
            100% { transform: translateX(0%); }
          }
          @keyframes water-float {
            0%, 100% { transform: translateY(0px); }
            25% { transform: translateY(-3px); }
            50% { transform: translateY(0px); }
            75% { transform: translateY(-2px); }
          }
          @keyframes water-wiggle {
            0%, 100% { transform: translateX(0px) translateY(0px); }
            10% { transform: translateX(1px) translateY(-1px); }
            20% { transform: translateX(-1px) translateY(-2px); }
            30% { transform: translateX(1px) translateY(-1px); }
            40% { transform: translateX(0px) translateY(-2px); }
            50% { transform: translateX(-1px) translateY(-1px); }
            60% { transform: translateX(1px) translateY(-2px); }
            70% { transform: translateX(-1px) translateY(-1px); }
            80% { transform: translateX(1px) translateY(0px); }
            90% { transform: translateX(-1px) translateY(-1px); }
          }
        `}
      </style>

      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled ? "bg-black/40 backdrop-blur-md" : "bg-transparent"
        }`}
        style={{ animation: "water-float 4s ease-in-out infinite" }}
      >
        <div className="relative overflow-hidden">
          {/* Animated wave border */}
          <div className="absolute bottom-0 left-0 right-0 h-[2px] overflow-hidden">
            <div
              className="absolute inset-0 opacity-60"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.8), rgba(0, 200, 200, 0.6), transparent)",
                animation: "wave-slide 3s ease-in-out infinite",
                width: "200%",
              }}
            />
            <div
              className="absolute inset-0 opacity-40"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(0, 200, 200, 0.6), rgba(0, 255, 255, 0.8), transparent)",
                animation: "wave-slide 4s ease-in-out infinite reverse",
                width: "200%",
              }}
            />
          </div>

          <div
            className="container mx-auto px-4 sm:px-6 py-3 sm:py-4"
            style={{ animation: "water-wiggle 6s ease-in-out infinite" }}
          >
            <div className="flex items-center justify-between">
              {/* Logo + Brand */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleLogoClick}
                  aria-label="Visit CGM Creative agency website"
                  className="overflow-hidden transition-transform hover:scale-105
                             h-14 w-14 sm:h-16 sm:w-16 lg:h-24 lg:w-24"
                >
                  <img
                    src="/images/cgmlogotwo.png"
                    alt="CGM Creative logo"
                    className="h-full w-full cursor-pointer object-contain"
                  />
                </button>

                <span
                  className="text-xs sm:text-sm lg:text-base font-bold tracking-[0.3em] uppercase font-heading
                             text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400"
                  style={{
                    textShadow: "0 0 20px rgba(0, 255, 255, 0.5)",
                    filter: "drop-shadow(0 0 8px rgba(0, 255, 255, 0.6))",
                  }}
                >
                  CGM Creative
                </span>
              </div>

              {/* Desktop Nav (UNCHANGED behavior, just hidden on small) */}
              <div className="hidden lg:flex items-center font-heading gap-2">
                <RenderLink to="/" label="Home" styleKey="home" end />
                <RenderLink to="/library" label="Work" styleKey="work" />
                <RenderLink to="/about" label="About" styleKey="about" />
                <RenderLink to="/beyond" label="Beyond" styleKey="beyond" />
                <RenderLink to="/contact" label="Contact" styleKey="contact" />
              </div>

              {/* Mobile/Tablet Toggle */}
              <button
                type="button"
                onClick={() => setIsMenuOpen((v) => !v)}
                aria-label="Toggle navigation menu"
                aria-expanded={isMenuOpen}
                className="lg:hidden px-3 py-2 rounded-xl border border-cyan-200/20
                           text-cyan-100 font-heading tracking-wider bg-black/30 backdrop-blur
                           hover:bg-black/50 transition"
                style={{ textShadow: "0 0 10px rgba(0, 255, 255, 0.35)" }}
              >
                {isMenuOpen ? "Close" : "Menu"}
              </button>
            </div>

            {/* Mobile/Tablet Dropdown */}
            <div className={`lg:hidden ${isMenuOpen ? "block" : "hidden"} pt-3`}>
              <div className="rounded-2xl border border-cyan-200/15 bg-black/45 backdrop-blur-md p-3">
                <div className="flex flex-col gap-2">
                  <RenderLink to="/" label="Home" styleKey="home" end />
                  <RenderLink to="/library" label="Work" styleKey="work" />
                  <RenderLink to="/about" label="About" styleKey="about" />
                  <RenderLink to="/beyond" label="Beyond" styleKey="beyond" />
                  <RenderLink to="/contact" label="Contact" styleKey="contact" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </nav>

      {/* Optional: click-outside dim layer (mobile only) */}
      {isMenuOpen && (
        <button
          className="fixed inset-0 z-40 lg:hidden bg-black/40"
          onClick={() => setIsMenuOpen(false)}
          aria-label="Close menu overlay"
        />
      )}
    </>
  );
};

export default Navbar;
