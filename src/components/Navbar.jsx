import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

const AGENCY_URL = 'https://www.coreygmarsh.com'; // ← change this to your real URL

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

const navLinkBase =
  "relative group text-md md:text-lg font-medium tracking-wide transition-all duration-300 px-3 py-2 rounded-full";

  
  // Different active colors for each page
  const navLinkStyles = {
    home: {
      inactive: "text-cyan-100 hover:text-blue-300",
      active: "text-slate-900 bg-gradient-to-r from-blue-400 to-blue-600 shadow-lg shadow-blue-400/50",
      hover: "from-blue-400 to-blue-600",
      glow: "rgba(59, 130, 246, 0.8)", // blue
      shadow: "0 0 10px rgba(59, 130, 246, 0.3)"
    },
    work: {
      inactive: "text-cyan-100 hover:text-green-300",
      active: "text-slate-900 bg-gradient-to-r from-green-400 to-emerald-600 shadow-lg shadow-green-400/50",
      hover: "from-green-400 to-emerald-600",
      glow: "rgba(34, 197, 94, 0.8)", // green
      shadow: "0 0 10px rgba(34, 197, 94, 0.3)"
    },
    beyond: {
      inactive: "text-cyan-100 hover:text-yellow-300",
      active: "text-slate-900 bg-gradient-to-r from-yellow-400 to-amber-500 shadow-lg shadow-yellow-400/50",
      hover: "from-yellow-400 to-amber-500",
      glow: "rgba(234, 179, 8, 0.8)", // yellow
      shadow: "0 0 10px rgba(234, 179, 8, 0.3)"
    },
    about: {
      inactive: "text-cyan-100 hover:text-teal-300",
      active: "text-slate-900 bg-gradient-to-r from-teal-400 to-cyan-600 shadow-lg shadow-teal-400/50",
      hover: "from-teal-400 to-cyan-600",
      glow: "rgba(20, 184, 166, 0.8)", // teal
      shadow: "0 0 10px rgba(20, 184, 166, 0.3)"
    },
    contact: {
      inactive: "text-cyan-100 hover:text-red-300",
      active: "text-slate-900 bg-gradient-to-r from-red-400 to-rose-600 shadow-lg shadow-red-400/50",
      hover: "from-red-400 to-rose-600",
      glow: "rgba(239, 68, 68, 0.8)", // red
      shadow: "0 0 10px rgba(239, 68, 68, 0.3)"
    }
  };

  const handleLogoClick = () => {
    window.open(AGENCY_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <style>
        {`
          @keyframes wave-slide {
            0% {
              transform: translateX(-50%);
            }
            100% {
              transform: translateX(0%);
            }
          }
          
          @keyframes water-float {
            0%, 100% {
              transform: translateY(0px);
            }
            25% {
              transform: translateY(-3px);
            }
            50% {
              transform: translateY(0px);
            }
            75% {
              transform: translateY(-2px);
            }
          }
          
          @keyframes water-wiggle {
            0%, 100% {
              transform: translateX(0px) translateY(0px);
            }
            10% {
              transform: translateX(1px) translateY(-1px);
            }
            20% {
              transform: translateX(-1px) translateY(-2px);
            }
            30% {
              transform: translateX(1px) translateY(-1px);
            }
            40% {
              transform: translateX(0px) translateY(-2px);
            }
            50% {
              transform: translateX(-1px) translateY(-1px);
            }
            60% {
              transform: translateX(1px) translateY(-2px);
            }
            70% {
              transform: translateX(-1px) translateY(-1px);
            }
            80% {
              transform: translateX(1px) translateY(0px);
            }
            90% {
              transform: translateX(-1px) translateY(-1px);
            }
          }
        `}
      </style>
      
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-black/40 backdrop-blur-md' : 'bg-transparent'}`}
        style={{
          animation: 'water-float 4s ease-in-out infinite'
        }}
      >
        <div className="relative overflow-hidden">
          {/* Animated wave border */}
          <div className="absolute bottom-0 left-0 right-0 h-[2px] overflow-hidden">
            <div 
              className="absolute inset-0 opacity-60"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.8), rgba(0, 200, 200, 0.6), transparent)',
                animation: 'wave-slide 3s ease-in-out infinite',
                width: '200%'
              }}
            />
            <div 
              className="absolute inset-0 opacity-40"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(0, 200, 200, 0.6), rgba(0, 255, 255, 0.8), transparent)',
                animation: 'wave-slide 4s ease-in-out infinite reverse',
                width: '200%'
              }}
            />
          </div>

          <div 
            className="container mx-auto px-6 py-4"
            style={{
              animation: 'water-wiggle 6s ease-in-out infinite'
            }}
          >
            <div className="flex items-center justify-between">
              {/* Logo + Brand */}
              <div className="flex items-center cursor-event-none gap-3">
                <button
                  type="button"
                  onClick={handleLogoClick}
                  aria-label="Visit CGM Creative agency website"
                  className="h-24 w-24 overflow-hidden transition-transform hover:scale-105"
                >
                  <img src="/images/cgmlogotwo.png" alt="CGM Creative logo" className="h-24 w-24 cursor-pointer object-contain"/>
                </button>

                <span 
                  className="text-sm sm:text-base font-bold tracking-[0.3em] uppercase font-heading text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400"
                  style={{ 
                    textShadow: '0 0 20px rgba(0, 255, 255, 0.5)',
                    filter: 'drop-shadow(0 0 8px rgba(0, 255, 255, 0.6))'
                  }}
                >
                  CGM Creative
                </span>
              </div>

              {/* Nav Items */}
              <div className="flex items-center text-3xl font-heading gap-2">
                {/* HOME - Blue */}
                <NavLink
                  to="/"
                  end
                  className={({ isActive }) =>
                    `${navLinkBase} ${isActive ? navLinkStyles.home.active : navLinkStyles.home.inactive}`
                  }
                  style={({ isActive }) => ({
                    textShadow: isActive ? navLinkStyles.home.shadow : '0 0 10px rgba(0, 255, 255, 0.3)'
                  })}
                >
                  {({ isActive }) => (
                    <>
                      Home
                      {!isActive && (
                        <>
                          <span className={`absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r ${navLinkStyles.home.hover} group-hover:w-full transition-all duration-300`}
                                style={{ boxShadow: `0 0 10px ${navLinkStyles.home.glow}` }} />
                          <span 
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-blue-400 opacity-0 group-hover:opacity-100 group-hover:animate-ping" 
                            style={{ animationDuration: '2s' }}
                          />
                        </>
                      )}
                    </>
                  )}
                </NavLink>

                <NavLink
  to="/library"
  onClick={() => {
    // Force top of page
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }}
  className={({ isActive }) =>
    `${navLinkBase} ${
      isActive ? navLinkStyles.work.active : navLinkStyles.work.inactive
    }`
  }
  style={({ isActive }) => ({
    textShadow: isActive
      ? navLinkStyles.work.shadow
      : "0 0 10px rgba(0, 255, 255, 0.3)",
  })}
>
  {({ isActive }) => (
    <>
      Work
      {!isActive && (
        <>
          <span
            className={`absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r ${navLinkStyles.work.hover} group-hover:w-full transition-all duration-300`}
            style={{ boxShadow: `0 0 10px ${navLinkStyles.work.glow}` }}
          />
          <span
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-green-400 opacity-0 group-hover:opacity-100 group-hover:animate-ping"
            style={{ animationDuration: "2s" }}
          />
        </>
      )}
    </>
  )}
</NavLink>



                {/* ABOUT - Teal */}
                <NavLink
                  to="/about"
                  className={({ isActive }) =>
                    `${navLinkBase} ${isActive ? navLinkStyles.about.active : navLinkStyles.about.inactive}`
                  }
                  style={({ isActive }) => ({
                    textShadow: isActive ? navLinkStyles.about.shadow : '0 0 10px rgba(0, 255, 255, 0.3)'
                  })}
                >
                  {({ isActive }) => (
                    <>
                      About
                      {!isActive && (
                        <>
                          <span className={`absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r ${navLinkStyles.about.hover} group-hover:w-full transition-all duration-300`}
                                style={{ boxShadow: `0 0 10px ${navLinkStyles.about.glow}` }} />
                          <span 
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-teal-400 opacity-0 group-hover:opacity-100 group-hover:animate-ping" 
                            style={{ animationDuration: '2s' }}
                          />
                        </>
                      )}
                    </>
                  )}
                </NavLink>


                {/* BEYOND - Yellow */}
                <NavLink
                  to="/beyond"
                  className={({ isActive }) =>
                    `${navLinkBase} ${isActive ? navLinkStyles.beyond.active : navLinkStyles.beyond.inactive}`
                  }
                  style={({ isActive }) => ({
                    textShadow: isActive ? navLinkStyles.beyond.shadow : '0 0 10px rgba(0, 255, 255, 0.3)'
                  })}
                >
                  {({ isActive }) => (
                    <>
                      Beyond
                      {!isActive && (
                        <>
                          <span className={`absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r ${navLinkStyles.beyond.hover} group-hover:w-full transition-all duration-300`}
                                style={{ boxShadow: `0 0 10px ${navLinkStyles.beyond.glow}` }} />
                          <span 
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-yellow-400 opacity-0 group-hover:opacity-100 group-hover:animate-ping" 
                            style={{ animationDuration: '2s' }}
                          />
                        </>
                      )}
                    </>
                  )}
                </NavLink>

                {/* CONTACT - Red */}
                <NavLink
                  to="/contact"
                  className={({ isActive }) =>
                    `${navLinkBase} ${isActive ? navLinkStyles.contact.active : navLinkStyles.contact.inactive}`
                  }
                  style={({ isActive }) => ({
                    textShadow: isActive ? navLinkStyles.contact.shadow : '0 0 10px rgba(0, 255, 255, 0.3)'
                  })}
                >
                  {({ isActive }) => (
                    <>
                      Contact
                      {!isActive && (
                        <>
                          <span className={`absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r ${navLinkStyles.contact.hover} group-hover:w-full transition-all duration-300`}
                                style={{ boxShadow: `0 0 10px ${navLinkStyles.contact.glow}` }} />
                          <span 
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-red-400 opacity-0 group-hover:opacity-100 group-hover:animate-ping" 
                            style={{ animationDuration: '2s' }}
                          />
                        </>
                      )}
                    </>
                  )}
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;