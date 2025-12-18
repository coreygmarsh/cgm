import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { useNavigate } from "react-router-dom";

const FeaturedWorkSection = () => {
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);

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

        vec3 deepWater = vec3(0.0, 0.15, 0.1);
        vec3 midWater = vec3(0.0, 0.3, 0.2);
        vec3 causticHighlight = vec3(0.2, 0.7, 0.4);
        vec3 shimmerHighlight = vec3(0.4, 0.9, 0.6);

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
        resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
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

  const items = [
    {
      title: "Video Projects",
      category: "video",
      tag: "EDITING",
      icon: "🎥",
      blurb: "Cuts, pacing, and story-first edits — trailers, reels, and cinematic sequences.",
      stats: ["Rhythm", "Story", "Impact"],
    },
    {
      title: "Music & Sound",
      category: "music",
      tag: "AUDIO",
      icon: "🎛️",
      blurb: "Production, mixing, and sound design — emotion you can feel in the room.",
      stats: ["Tone", "Space", "Energy"],
    },
    {
      title: "Photography & Graphics",
      category: "photography",
      tag: "VISUALS",
      icon: "📸",
      blurb: "Stills + design — clean compositions, bold identity, and underwater-inspired aesthetics.",
      stats: ["Texture", "Color", "Detail"],
    },
  ];

  const active = items[activeIndex];

  const goToLibrary = (category) => {
    navigate(`/library?category=${category}`);
  };

  return (
    <>
      <style>
        {`
          @keyframes float-particle {
            0%, 100% { transform: translateY(0px) translateX(0px); }
            25% { transform: translateY(-20px) translateX(10px); }
            50% { transform: translateY(-10px) translateX(-10px); }
            75% { transform: translateY(-25px) translateX(5px); }
          }

          @keyframes pulse-ring {
            0% { transform: translate(-50%, -50%) scale(0.75); opacity: 0.0; }
            25% { opacity: 0.35; }
            100% { transform: translate(-50%, -50%) scale(1.55); opacity: 0; }
          }

          @keyframes scanline {
            0% { transform: translateY(-120%); opacity: 0; }
            10% { opacity: 0.35; }
            50% { opacity: 0.15; }
            100% { transform: translateY(120%); opacity: 0; }
          }

          @keyframes shimmer {
            0% { background-position: -120% 0; }
            100% { background-position: 220% 0; }
          }

          .k-scrollbar::-webkit-scrollbar { width: 0px; height: 0px; }
          .k-focus:focus-visible { outline: 2px solid rgba(110,255,210,0.8); outline-offset: 4px; border-radius: 16px; }
        `}
      </style>

      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black to-transparent z-10" />
        <div ref={containerRef} className="absolute inset-0" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-10" />

        {/* Floating particles (kept) */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-cyan-400/40"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float-particle ${5 + Math.random() * 5}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 3}s`,
                boxShadow: "0 0 10px rgba(0, 255, 255, 0.6)",
              }}
            />
          ))}
        </div>

        <div className="relative z-10 w-screen mx-auto py-20 px-6">
          <h2
            className="text-7xl md:text-8xl font-bold text-center font-heading mb-6 text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-green-300 to-emerald-400"
            style={{
              textShadow: "0 0 30px rgba(100, 255, 0, 0.9)",
              filter: "drop-shadow(0 0 15px rgba(0, 255, 255, 0.8))",
            }}
          >
            FEATURED WORK
          </h2>

          <p
            className="text-xl text-cyan-100/80 text-center font-body mb-14"
            style={{ textShadow: "0 0 10px rgba(0, 255, 255, 0.3)" }}
          >
            Dive into a collection of creative projects spanning{" "}
            <span className="font-bold italic text-green-400">video editing</span>,{" "}
            <span className="font-bold text-green-400 italic">music production</span>, and{" "}
            <span className="font-bold text-green-400 italic">visual storytelling</span>.
          </p>

          {/* ✅ Command Center Layout */}
          <div className="max-w-6xl mx-auto grid grid-cols-1 font-body lg:grid-cols-12 gap-8 items-stretch">
            {/* Left: Selector */}
            <div className="lg:col-span-4">
              <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-900/15 to-teal-950/15 backdrop-blur-sm p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-emerald-200 font-body font-semibold tracking-wide">
                    MODULES
                  </div>
                  <div
                    className="text-xs font-body text-emerald-200/60"
                    style={{ textShadow: "0 0 10px rgba(0,255,150,0.25)" }}
                  >
                    click to preview
                  </div>
                </div>

                <div className="space-y-3 font-heading ">
                  {items.map((it, idx) => {
                    const isActive = idx === activeIndex;
                    return (
                      <button
                        key={it.title}
                        type="button"
                        className={`k-focus w-full text-left group cursor-pointer rounded-xl px-4 py-4 border transition-all duration-300 ${
                          isActive
                            ? "border-emerald-400/60 bg-emerald-500/10"
                            : "border-emerald-500/15 bg-black/15 hover:bg-emerald-500/5 hover:border-emerald-400/40"
                        }`}
                        onClick={() => setActiveIndex(idx)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className="text-2xl"
                              style={{
                                filter: "drop-shadow(0 0 12px rgba(0,255,150,0.45))",
                                transform: isActive ? "scale(1.06)" : "scale(1)",
                                transition: "transform 250ms ease",
                              }}
                            >
                              {it.icon}
                            </div>
                            <div>
                              <div className="text-emerald-100 font-heading text-xl font-bold">
                                {it.title}
                              </div>
                              <div className="text-emerald-100/55 font-body text-sm">
                                {it.tag} • {it.category}
                              </div>
                            </div>
                          </div>

                          <div
                            className={`text-emerald-300 font-body font-semibold transition-all duration-300 ${
                              isActive ? "opacity-100" : "opacity-40 group-hover:opacity-80"
                            }`}
                          >
                            →
                          </div>
                        </div>

                        {/* micro bar */}
                        <div className="mt-3 h-[2px] w-full bg-emerald-500/10 overflow-hidden rounded-full">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-300/0 via-emerald-300/70 to-emerald-300/0"
                            style={{
                              width: isActive ? "100%" : "35%",
                              transition: "width 450ms ease",
                              animation: isActive ? "shimmer 4.1s linear infinite" : "none",
                              backgroundSize: "200% 100%",
                            }}
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right: Big Preview Panel */}
            <div className="lg:col-span-8">
              <div
                className="relative rounded-3xl overflow-hidden border border-emerald-500/20 backdrop-blur-sm"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(0, 255, 150, 0.10) 0%, rgba(0, 0, 0, 0.55) 45%, rgba(0, 255, 150, 0.08) 100%)",
                  boxShadow:
                    "0 0 60px rgba(0,255,150,0.12), 0 0 120px rgba(0,255,150,0.06)",
                }}
              >
                {/* sonar rings */}
                <div className="absolute inset-0 pointer-events-none">
                  <div
                    className="absolute left-1/2 top-1/2 w-[520px] h-[520px] rounded-full"
                    style={{
                      border: "1px solid rgba(110,255,210,0.20)",
                      filter: "blur(0px)",
                      animation: "pulse-ring 2.8s ease-out infinite",
                    }}
                  />
                  <div
                    className="absolute left-1/2 top-1/2 w-[520px] h-[520px] rounded-full"
                    style={{
                      border: "1px solid rgba(110,255,210,0.16)",
                      animation: "pulse-ring 2.8s ease-out infinite",
                      animationDelay: "0.9s",
                    }}
                  />
                  <div
                    className="absolute left-1/2 top-1/2 w-[520px] h-[520px] rounded-full"
                    style={{
                      border: "1px solid rgba(110,255,210,0.12)",
                      animation: "pulse-ring 2.8s ease-out infinite",
                      animationDelay: "1.8s",
                    }}
                  />
                </div>

                {/* scanline */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(to bottom, transparent, rgba(110,255,210,0.18), transparent)",
                    height: "18%",
                    width: "100%",
                    animation: "scanline 3.6s ease-in-out infinite",
                    mixBlendMode: "screen",
                  }}
                />

                {/* gradients */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/30 via-transparent to-teal-900/20" />

                <div className="relative p-8 md:p-10">
                  <div className="flex items-start justify-between gap-6">
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <span className="px-3 py-1 rounded-full text-xs font-bold text-black bg-gradient-to-r from-emerald-400 to-teal-300 shadow-lg shadow-emerald-500/25">
                          {active.tag}
                        </span>
                        <span className="text-emerald-100/60 font-heading text-sm">
                          Library Module • {active.category}
                        </span>
                      </div>

                      <h3
                        className="text-4xl md:text-5xl font-bold font-heading text-emerald-100"
                        style={{
                          textShadow: "0 0 25px rgba(0,255,150,0.30)",
                        }}
                      >
                        {active.title}
                      </h3>

                      <p className="mt-4 text-emerald-100/70 font-body text-lg max-w-2xl">
                        {active.blurb}
                      </p>
                    </div>

                    <div
                      className="text-5xl md:text-6xl"
                      style={{
                        filter: "drop-shadow(0 0 14px rgba(0,255,150,0.45))",
                      }}
                    >
                      {active.icon}
                    </div>
                  </div>

                  {/* mini “signals” */}
                  <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {active.stats.map((label) => (
                      <div
                        key={label}
                        className="rounded-2xl border border-emerald-500/15 bg-black/25 backdrop-blur-sm p-4"
                      >
                        <div className="text-emerald-200 font-body font-semibold">
                          {label}
                        </div>
                        <div className="mt-2 h-[2px] w-full bg-emerald-500/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-300/0 via-emerald-300/75 to-emerald-300/0"
                            style={{
                              width: "100%",
                              animation: "shimmer 10.2s linear infinite",
                              backgroundSize: "200% 100%",
                            }}
                          />
                        </div>
                        <div className="mt-3 text-emerald-100/55 font-body text-sm">
                          Signal locked — open to explore.
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* CTA row */}
                  <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                    <div className="text-emerald-100/55 font-body text-sm">
                      Tip: Use the selector on the left to switch modules instantly.
                    </div>

                    <button
                      type="button"
                      onClick={() => goToLibrary(active.category)}
                      className="px-6 py-3 rounded-full font-body font-bold text-black cursor-pointer bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200 transition-all duration-300 shadow-lg shadow-emerald-500/25"
                      style={{
                        boxShadow: "0 0 22px rgba(0,255,150,0.35)",
                      }}
                    >
                      Open Library →
                    </button>
                  </div>
                </div>

                {/* corner brackets */}
                <div className="absolute top-4 right-4 w-16 h-16 border-t-2 border-r-2 border-emerald-400/40 rounded-tr-2xl" />
                <div className="absolute bottom-4 left-4 w-16 h-16 border-b-2 border-l-2 border-emerald-400/40 rounded-bl-2xl" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default FeaturedWorkSection;
