import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";

const BeyondWorkSection = () => {
  const containerRef = useRef(null);
  const carouselRef = useRef(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Underwater shader background (GOLD)
  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    );
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      uniform float time;
      uniform vec2 resolution;
      varying vec2 vUv;

      float noise(vec2 p) {
        return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
      }

      float smoothNoise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);

        float a = noise(i);
        float b = noise(i + vec2(1.0, 0.0));
        float c = noise(i + vec2(0.0, 1.0));
        float d = noise(i + vec2(1.0, 1.0));

        return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
      }

      float fbm(vec2 p) {
        float value = 0.0;
        float amplitude = 0.5;
        float frequency = 2.0;

        for(int i = 0; i < 5; i++) {
          value += amplitude * smoothNoise(p * frequency);
          amplitude *= 0.5;
          frequency *= 2.0;
        }
        return value;
      }

      void main() {
        vec2 uv = vUv;
        vec2 p = uv * 3.0;

        float caustic1 = fbm(p + time * 0.2 + vec2(0.0, time * 0.15));
        float caustic2 = fbm(p * 1.5 - time * 0.15 + vec2(time * 0.1, 0.0));
        float caustic3 = fbm(p * 2.2 + vec2(time * 0.12, -time * 0.08));

        float caustics = caustic1 * 0.5 + caustic2 * 0.3 + caustic3 * 0.2;
        caustics = pow(caustics, 1.5);

        float wave1 = sin(p.x * 3.5 + time * 0.7) * cos(p.y * 2.8 - time * 0.5);
        float wave2 = sin(p.x * 5.2 - time * 0.9) * sin(p.y * 4.1 + time * 0.6);
        float wave3 = cos(p.x * 2.1 + time * 0.4) * sin(p.y * 3.3 - time * 0.8);
        float waves = (wave1 + wave2 * 0.7 + wave3 * 0.5) * 0.3 + 0.5;

        vec2 distortion = vec2(
          sin(p.y * 4.0 + time * 0.5) * 0.02,
          cos(p.x * 3.5 + time * 0.6) * 0.02
        );
        float distortedCaustics = fbm(p + distortion + time * 0.1);

        float waterPattern = mix(caustics, waves, 0.3);
        waterPattern = mix(waterPattern, distortedCaustics, 0.4);

        vec3 deepWater = vec3(0.15, 0.12, 0.0);
        vec3 midWater = vec3(0.3, 0.25, 0.0);
        vec3 causticHighlight = vec3(0.7, 0.6, 0.1);
        vec3 shimmerHighlight = vec3(0.9, 0.8, 0.2);

        vec3 color = mix(deepWater, midWater, waterPattern);
        color = mix(color, causticHighlight, caustics * 0.5);

        float shimmer = pow(sin(uv.x * 25.0 + uv.y * 20.0 + time * 4.0) * 0.5 + 0.5, 3.0);
        float shimmer2 = pow(sin(uv.x * 18.0 - uv.y * 22.0 - time * 3.5) * 0.5 + 0.5, 4.0);
        color = mix(color, shimmerHighlight, (shimmer + shimmer2) * 0.15);

        float depthGradient = 1.0 - length(uv - 0.5) * 0.3;
        color *= depthGradient;

        float alpha = 0.85 + waterPattern * 0.15;
        gl_FragColor = vec4(color, alpha);
      }
    `;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        time: { value: 0 },
        resolution: {
          value: new THREE.Vector2(window.innerWidth, window.innerHeight),
        },
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      material.uniforms.time.value += 0.01;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      renderer.setSize(width, height);
      material.uniforms.resolution.value.set(width, height);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  const interests = [
    {
      tag: "SPORT",
      title: "Football (Soccer)",
      desc: "Soccer has been the heartbeat of my life for over 22 years—playing, watching, and coaching since it first became my earliest and deepest passion. Real Madrid is my north star in the sport: a constant source of inspiration, standards, and joy.",
      image: "/interests/soccer.jpg",
      icon: "⚽",
    },
    {
      tag: "SPORT",
      title: "Basketball",
      desc: "Growing up in New York, the Knicks became part of my identity from the moment I started school. Soccer and the Knicks gave me a sense of belonging to a team from my earliest memories.",
      image: "/interests/basketball.jpg",
      icon: "🏀",
    },
    {
      tag: "MUSIC",
      title: "Music",
      desc: "Vocalist, songwriter, producer, and guitarist—using sound as a form of storytelling and emotional expression.",
      image: "/interests/music.jpg",
      icon: "🎵",
    },
    {
      tag: "STORY",
      title: "Film & TV",
      desc: "Personally as a film fanatic, I enjoy stories that intend to act as a powerful medium to challenge perspectives, sharpen taste, and inspire deeper creative thinking.",
      image: "/interests/film.jpg",
      icon: "🎬",
    },
  ];

  const scrollCarousel = (dir = 1) => {
    const el = carouselRef.current;
    if (!el) return;
    const amount = Math.max(400, Math.floor(el.clientWidth * 0.85));
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  return (
    <>
      <style>
        {`
          @keyframes float-card {
            0%, 100% { transform: translateY(0px) rotateY(0deg); }
            50% { transform: translateY(-25px) rotateY(3deg); }
          }

          @keyframes glow-pulse-gold {
            0%, 100% { 
              box-shadow: 0 10px 40px rgba(255, 215, 0, 0.5), 
                          0 0 80px rgba(255, 215, 0, 0.3),
                          inset 0 0 30px rgba(255, 215, 0, 0.15); 
            }
            50% { 
              box-shadow: 0 15px 60px rgba(255, 215, 0, 0.8), 
                          0 0 120px rgba(255, 215, 0, 0.5),
                          inset 0 0 50px rgba(255, 215, 0, 0.25); 
            }
          }

          @keyframes shimmer {
            0% { background-position: -1000px 0; }
            100% { background-position: 1000px 0; }
          }

          @keyframes scan {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(100%); }
          }

          .hide-scrollbar::-webkit-scrollbar { display: none; }
          .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

          .card-3d {
            perspective: 1500px;
            transform-style: preserve-3d;
          }

          .card-inner {
            transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1);
            transform-style: preserve-3d;
          }

          .card-3d:hover .card-inner {
            transform: rotateY(5deg) rotateX(-3deg) translateZ(20px);
          }

          .shimmer-effect {
            background: linear-gradient(
              90deg,
              transparent 0%,
              rgba(255, 215, 0, 0.4) 50%,
              transparent 100%
            );
            background-size: 200% 100%;
            animation: shimmer 3s infinite;
          }

          .scan-line {
            animation: scan 4s ease-in-out infinite;
          }

          .hologram-border {
            position: relative;
          }

          .hologram-border::before,
          .hologram-border::after {
            content: '';
            position: absolute;
            inset: -2px;
            background: linear-gradient(45deg, 
              transparent 30%, 
              rgba(255, 215, 0, 0.4) 50%, 
              transparent 70%
            );
            border-radius: 24px;
            opacity: 0;
            transition: opacity 0.3s;
          }

          .hologram-border:hover::before {
            opacity: 1;
            animation: shimmer 2s infinite;
          }
        `}
      </style>

      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black to-transparent z-20 pointer-events-none" />
        <div ref={containerRef} className="absolute inset-0" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-20 pointer-events-none" />

        {/* ✅ responsiveness-only change: py scales down on small screens */}
        <div className="relative z-10 w-screen py-16 sm:py-24 md:py-32">
          <div className="items-center overflow-visible">
            <div className="font-body">
              {/* Header */}
              <div className="mb-12 text-center relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse" />
                </div>

                {/* ✅ responsiveness-only: title scales down on phones, unchanged on desktop */}
                <h2
                  className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-4 text-transparent relative z-10 font-heading bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400"
                  style={{
                    textShadow: "0 0 40px rgba(255, 215, 0, 0.8)",
                    filter: "drop-shadow(0 0 20px rgba(255, 215, 0, 1))",
                    animation: "shimmer 3s infinite",
                    backgroundSize: "200% auto",
                  }}
                >
                  BEYOND THE WORK
                </h2>

                <div className="flex items-center justify-center gap-3 mb-6">
                  <div className="h-px w-24 bg-gradient-to-r from-transparent to-yellow-500/50" />
                  <p
                    className="text-sm uppercase tracking-[0.3em] text-yellow-300/90 font-body font-bold"
                    style={{ textShadow: "0 0 10px rgba(255, 215, 0, 0.5)" }}
                  >
                    ⚡ INTERESTS ⚡
                  </p>
                  <div className="h-px w-24 bg-gradient-to-l from-transparent to-yellow-500/50" />
                </div>

                {/* ✅ responsiveness-only: paragraph size scales down on phones */}
                <p className="text-amber-100/60 text-base sm:text-lg max-w-2xl mx-auto">
                  Where passion meets purpose and pursuit fuels creative{" "}
                  <span className="text-amber-300 font-bold italic font-heading">
                    gold.
                  </span>
                </p>
              </div>

              {/* Carousel */}
              <div
                className="relative"
                style={{ background: "transparent", boxShadow: "none", border: "none" }}
              >
                {/* ✅ responsiveness-only: gap + padding scale down on phones */}
                <div
                  ref={carouselRef}
                  className="hide-scrollbar flex gap-6 sm:gap-8 overflow-x-auto overflow-y-visible scroll-smooth snap-x snap-mandatory py-10 sm:py-16 pb-16 sm:pb-20"
                >
                  {interests.map((card, idx) => (
                    <div
                      key={card.title}
                      className="snap-center flex-shrink-0 w-[88%] sm:w-[45%] md:w-[42%] lg:w-[30%] card-3d"
                      style={{
                        animation: `float-card ${6 + idx * 0.5}s ease-in-out infinite`,
                        animationDelay: `${idx * -1.5}s`,
                      }}
                      onMouseEnter={() => setHoveredIndex(idx)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    >
                      {/* ✅ responsiveness-only: card height scales down on phones */}
                      <div
                        className="card-inner relative h-[440px] sm:h-[520px] lg:h-[580px] rounded-3xl overflow-hidden backdrop-blur-md hologram-border"
                        style={{
                          animation: "glow-pulse-gold 4s ease-in-out infinite",
                          background:
                            "linear-gradient(135deg, rgba(255, 215, 0, 0.15) 0%, rgba(255, 140, 0, 0.1) 100%)",
                          border:
                            hoveredIndex === idx
                              ? "2px solid rgba(255, 215, 0, 0.8)"
                              : "2px solid rgba(255, 215, 0, 0.4)",
                        }}
                      >
                        {/* Image */}
                        <img
                          src={card.image}
                          alt={card.title}
                          className="absolute inset-0 w-full h-full object-cover transition-all duration-700"
                          style={{
                            opacity: hoveredIndex === idx ? 0.45 : 0.25,
                            filter:
                              hoveredIndex === idx
                                ? "saturate(1.3) contrast(1.1)"
                                : "saturate(0.9)",
                          }}
                          loading="lazy"
                        />

                        {/* Scan line effect */}
                        {hoveredIndex === idx && (
                          <div className="scan-line absolute inset-0 w-full h-1 bg-gradient-to-b from-transparent via-yellow-400/30 to-transparent" />
                        )}

                        {/* Gradients */}
                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-900/50 via-black/70 to-amber-900/60" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

                        {/* Shimmer overlay */}
                        {hoveredIndex === idx && (
                          <div className="shimmer-effect absolute inset-0 pointer-events-none" />
                        )}

                        {/* Content */}
                        {/* ✅ responsiveness-only: padding scales down on phones */}
                        <div className="absolute inset-0 p-5 sm:p-7 md:p-8 flex flex-col justify-between">
                          {/* Top section with tag and icon */}
                          <div className="flex items-center justify-between">
                            <span className="px-4 py-1.5 rounded-full text-xs font-bold text-black bg-gradient-to-r from-yellow-400 to-amber-400 shadow-lg shadow-yellow-500/50">
                              {card.tag}
                            </span>

                            {/* ✅ responsiveness-only: icon size scales down on phones */}
                            <div
                              className="text-4xl sm:text-5xl transform transition-all duration-500"
                              style={{
                                filter:
                                  "drop-shadow(0 0 10px rgba(255, 215, 0, 0.8))",
                                transform:
                                  hoveredIndex === idx
                                    ? "scale(1.2) rotate(10deg)"
                                    : "scale(1)",
                              }}
                            >
                              {card.icon}
                            </div>
                          </div>

                          {/* Bottom section */}
                          <div className="space-y-3 sm:space-y-4">
                            {/* ✅ responsiveness-only: title scales down on phones */}
                            <h4
                              className="text-2xl sm:text-3xl md:text-4xl font-heading uppercase font-bold italic text-white transition-all duration-500"
                              style={{
                                textShadow:
                                  hoveredIndex === idx
                                    ? "0 0 30px rgba(255, 215, 0, 0.9), 0 4px 20px rgba(0,0,0,0.9)"
                                    : "0 4px 15px rgba(0,0,0,0.95)",
                                transform:
                                  hoveredIndex === idx ? "translateY(-5px)" : "translateY(0)",
                              }}
                            >
                              {card.title}
                            </h4>

                            {/* ✅ responsiveness-only: body text scales down on phones */}
                            <p
                              className="text-sm sm:text-base md:text-lg text-amber-100/90 leading-relaxed transition-all duration-500"
                              style={{
                                textShadow: "0 2px 12px rgba(0,0,0,1)",
                                opacity: hoveredIndex === idx ? 1 : 0.85,
                              }}
                            >
                              {card.desc}
                            </p>
                          </div>

                          {/* Tech corner brackets */}
                          <div
                            className="absolute top-4 right-4 w-16 h-16 border-t-2 border-r-2 border-yellow-400/60 rounded-tr-2xl transition-all duration-500"
                            style={{ opacity: hoveredIndex === idx ? 1 : 0.4 }}
                          />
                          <div
                            className="absolute bottom-4 left-4 w-16 h-16 border-b-2 border-l-2 border-yellow-400/60 rounded-bl-2xl transition-all duration-500"
                            style={{ opacity: hoveredIndex === idx ? 1 : 0.4 }}
                          />

                          {/* Additional corner accents */}
                          <div className="absolute top-4 left-4 w-3 h-3 border-t-2 border-l-2 border-yellow-400/80" />
                          <div className="absolute bottom-4 right-4 w-3 h-3 border-b-2 border-r-2 border-yellow-400/80" />
                        </div>

                        {/* Edge glow on hover */}
                        {hoveredIndex === idx && (
                          <div className="absolute inset-0 border-2 border-yellow-400/50 rounded-3xl pointer-events-none" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Navigation */}
                {/* ✅ responsiveness-only: buttons scale down on phones */}
                <div className="absolute -bottom-3 sm:-bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 sm:gap-5 z-20">
                  <button
                    type="button"
                    onClick={() => scrollCarousel(-1)}
                    className="w-10 h-10 sm:w-12 sm:h-12 pt-2 rounded-full cursor-pointer bg-gradient-to-br from-yellow-500/30 to-amber-600/30 backdrop-blur-xl border-2 border-yellow-400/60 text-yellow-100 hover:text-white hover:border-yellow-300 hover:scale-110 transition-all duration-300 flex items-center justify-center text-xl font-bold shadow-lg shadow-yellow-500/30"
                    aria-label="Previous"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollCarousel(1)}
                    className="w-10 h-10 sm:w-12 sm:h-12 pt-2 rounded-full cursor-pointer bg-gradient-to-br from-yellow-500/30 to-amber-600/30 backdrop-blur-xl border-2 border-yellow-400/60 text-yellow-100 hover:text-white hover:border-yellow-300 hover:scale-110 transition-all duration-300 flex items-center justify-center text-xl font-bold shadow-lg shadow-yellow-500/30"
                    aria-label="Next"
                  >
                    →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BeyondWorkSection;
