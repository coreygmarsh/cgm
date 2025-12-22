import React, { useRef, useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import { useNavigate } from "react-router-dom";

// ✅ adjust this path to your real file location
import { projects } from "../../pages/projectsData";

const BlogStoriesSection = () => {
  const containerRef = useRef(null);
  const navigate = useNavigate();

  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(null);

  // =========================
  // RED shader background (responsive sizing, desktop unchanged)
  // =========================
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

        vec3 deepWater = vec3(0.08, 0.0, 0.02);
        vec3 midWater = vec3(0.22, 0.02, 0.08);
        vec3 causticHighlight = vec3(0.85, 0.25, 0.35);
        vec3 shimmerHighlight = vec3(1.0, 0.45, 0.55);

        vec3 color = mix(deepWater, midWater, waterPattern);
        color = mix(color, causticHighlight, caustics * 0.5);

        float shimmer = pow(
          sin(uv.x * 25.0 + uv.y * 20.0 + time * 4.0) * 0.5 + 0.5,
          3.0
        );
        float shimmer2 = pow(
          sin(uv.x * 18.0 - uv.y * 22.0 - time * 3.5) * 0.5 + 0.5,
          4.0
        );
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
        // ✅ match container size (not window)
        resolution: {
          value: new THREE.Vector2(
            containerRef.current.clientWidth,
            containerRef.current.clientHeight
          ),
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

    // ✅ better on mobile: picks up height changes + font/layout shifts
    const ro = new ResizeObserver(handleResize);
    ro.observe(containerRef.current);
    window.addEventListener("resize", handleResize);

    return () => {
      ro.disconnect();
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

  // =========================
  // Helpers
  // =========================
  const slugify = (str = "") =>
    String(str)
      .toLowerCase()
      .trim()
      .replace(/['"]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  // =========================
  // Pull ONLY Articles + Books from projects
  // =========================
  const posts = useMemo(() => {
    const arr = Array.isArray(projects) ? projects : [];

    const isArticleOrBook = (p) => {
      const type = String(p?.type ?? p?.tag ?? p?.category ?? "").toLowerCase();
      const tags = Array.isArray(p?.tags)
        ? p.tags.map((t) => String(t).toLowerCase())
        : [];
      return (
        type.includes("articles") ||
        type.includes("books") ||
        type.includes("essay") ||
        tags.includes("articles") ||
        tags.includes("books") ||
        tags.includes("essay")
      );
    };

    const normalize = (p) => {
      const title = p?.title ?? p?.name ?? "Untitled";
      const tag =
        p?.tag ??
        p?.type ??
        p?.category ??
        (Array.isArray(p?.tags) ? p.tags[0] : "Story");

      const date = p?.date ?? p?.published ?? p?.year ?? "";
      const mins = p?.mins ?? p?.readTime ?? p?.readingTime ?? "";
      const blurb = p?.blurb ?? p?.excerpt ?? p?.description ?? p?.summary ?? "";

      const slug = p?.slug ?? slugify(title);
      const route = p?.route ?? p?.path ?? p?.urlPath ?? null;
      const external = p?.externalUrl ?? p?.href ?? p?.link ?? p?.url ?? null;

      return {
        ...p,
        __title: title,
        __tag: String(tag),
        __date: String(date),
        __mins: String(mins),
        __blurb: String(blurb),
        __slug: String(slug),
        __route: route,
        __external: external,
      };
    };

    return arr.filter(isArticleOrBook).map(normalize);
  }, []);

  useEffect(() => {
    if (!posts.length) return;
    setActive((prev) => (prev < 0 || prev > posts.length - 1 ? 0 : prev));
  }, [posts.length]);

  const nodes = useMemo(() => {
    const count = Math.max(1, Math.min(posts.length || 1, 5));
    const fixed = [
      { x: 68, y: 22 },
      { x: 22, y: 28 },
      { x: 52, y: 52 },
      { x: 30, y: 72 },
      { x: 72, y: 76 },
    ];
    return fixed.slice(0, count).map((p, i) => ({ ...p, i }));
  }, [posts.length]);

  const links = useMemo(() => {
    const base = [
      [0, 2],
      [1, 2],
      [2, 3],
      [2, 4],
      [0, 4],
    ];
    const maxIndex = nodes.length - 1;
    return base.filter(([a, b]) => a <= maxIndex && b <= maxIndex);
  }, [nodes.length]);

  const current = posts[active];

  const openPost = (p) => {
    if (!p) return;
    if (p.__external) {
      window.open(p.__external, "_blank", "noopener,noreferrer");
      return;
    }
    if (p.__route) {
      navigate(p.__route);
      return;
    }
    navigate(`/library`);
  };

  if (!posts.length) {
    return (
      <section className="relative overflow-hidden bg-black py-16 sm:py-20 md:py-24">
        <div ref={containerRef} className="absolute inset-0" />
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-5xl font-bold text-rose-100 font-heading">
            STORIES &amp; INSIGHTS
          </h2>
          <p className="mt-4 text-rose-200/70 font-body">
            No Articles or Books found in your projectsData.jsx “projects” array.
            Add items with type/tag/category/tags including “Article” or “Book”.
          </p>
        </div>
      </section>
    );
  }

  return (
    <>
      <style>{`
        @keyframes float-particle {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(-20px) translateX(10px); }
          50% { transform: translateY(-10px) translateX(-10px); }
          75% { transform: translateY(-25px) translateX(5px); }
        }

        @keyframes orbit {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes scan {
          0% { transform: translateY(-120%); opacity: 0; }
          15% { opacity: .35; }
          55% { opacity: .22; }
          100% { transform: translateY(140%); opacity: 0; }
        }

        @keyframes glowPulseRed {
          0%, 100% {
            box-shadow: 0 0 20px rgba(255, 70, 90, 0.35), 0 0 60px rgba(255, 70, 90, 0.16);
          }
          50% {
            box-shadow: 0 0 30px rgba(255, 70, 90, 0.6), 0 0 90px rgba(255, 70, 90, 0.28);
          }
        }
      `}</style>

      {/* ✅ Phone-friendly section height; desktop feel unchanged */}
      <section className="relative bg-black overflow-hidden py-16 sm:py-20 md:py-24">
        {/* fades */}
        <div className="absolute top-0 left-0 right-0 h-24 sm:h-32 bg-gradient-to-b from-black to-transparent z-10 pointer-events-none" />
        <div ref={containerRef} className="absolute inset-0" />
        <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-32 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none" />

        {/* overlay grid/vignette */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute inset-0 opacity-25"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,70,90,0.09) 1px, transparent 1px), linear-gradient(90deg, rgba(255,70,90,0.09) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
              maskImage:
                "radial-gradient(circle at 50% 40%, black 40%, transparent 72%)",
              WebkitMaskImage:
                "radial-gradient(circle at 50% 40%, black 40%, transparent 72%)",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/70" />
        </div>

        {/* particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(18)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: "rgba(255, 70, 90, 0.35)",
                animation: `float-particle ${6 + Math.random() * 6}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 4}s`,
                boxShadow: "0 0 10px rgba(255, 70, 90, 0.45)",
              }}
            />
          ))}
        </div>

        {/* ✅ Constrain width + responsive title sizing */}
        <div className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2
            className="font-bold text-center mb-5 sm:mb-6 text-transparent font-heading bg-clip-text bg-gradient-to-r from-red-400 via-rose-400 to-red-300"
            style={{
              fontSize: "clamp(2.2rem, 6vw, 6rem)", // ✅ fixes huge phone text
              lineHeight: 1.05,
              textShadow: "0 0 30px rgba(255, 70, 90, 0.55)",
              filter: "drop-shadow(0 0 18px rgba(255, 70, 90, 0.6))",
            }}
          >
            BOOKS &amp; ARTICLES
          </h2>

          <p
            className="text-rose-100/80 text-center font-body mb-10 sm:mb-12 mx-auto"
            style={{
              fontSize: "clamp(1rem, 2.2vw, 1.25rem)",
              maxWidth: 720,
              textShadow: "0 0 10px rgba(255, 70, 90, 0.18)",
            }}
          >
            A living map of ideas—tap a
            <span className="text-rose-300 sm:text-xl max-w-sm font-body leading-relaxed"
              style={{ textShadow: "0 0 10px rgba(255, 0, 50, 1.0)" }}> signal,</span>  follow the thread, and read what
            surfaced.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10 items-stretch">
            {/* LEFT: Constellation Map */}
            <div className="relative rounded-3xl border border-rose-400/20 bg-black/20 backdrop-blur-sm overflow-hidden">
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -inset-24 bg-rose-500/10 blur-3xl" />
              </div>

              {/* ✅ rings become responsive */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div
                  className="rounded-full border border-rose-400/15"
                  style={{
                    width: "min(520px, 86vw)",
                    height: "min(520px, 86vw)",
                    boxShadow: "0 0 70px rgba(255,70,90,0.10)",
                  }}
                />
                <div
                  className="absolute rounded-full border border-rose-400/10"
                  style={{
                    width: "min(360px, 62vw)",
                    height: "min(360px, 62vw)",
                  }}
                />
              </div>

              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div
                  className="relative"
                  style={{
                    width: "min(520px, 86vw)",
                    height: "min(520px, 86vw)",
                    animation: "orbit 18s linear infinite",
                  }}
                >
                  {[...Array(10)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-1 h-1 rounded-full"
                      style={{
                        left: `${8 + i * 9}%`,
                        top: `${15 + ((i * 13) % 70)}%`,
                        background: "rgba(255, 140, 155, 0.45)",
                        boxShadow: "0 0 14px rgba(255,70,90,0.35)",
                        opacity: 0.6,
                      }}
                    />
                  ))}
                </div>
              </div>

              <svg className="absolute inset-0 w-full h-full">
                {links.map(([a, b], idx) => {
                  const A = nodes[a];
                  const B = nodes[b];
                  return (
                    <line
                      key={idx}
                      x1={`${A.x}%`}
                      y1={`${A.y}%`}
                      x2={`${B.x}%`}
                      y2={`${B.y}%`}
                      stroke="rgba(255, 90, 110, 0.25)"
                      strokeWidth="2"
                    />
                  );
                })}
              </svg>

              {/* ✅ map area adapts to screen */}
              <div
                className="relative w-full"
                style={{ height: "clamp(360px, 60vh, 560px)" }}
              >
                {nodes.map((n) => {
                  const isActive = active === n.i;
                  const isHover = hovered === n.i;
                  const labelTitle = posts[n.i]?.__title ?? "";

                  return (
                    <button
                      key={n.i}
                      type="button"
                      onClick={() => setActive(n.i)}
                      onMouseEnter={() => setHovered(n.i)}
                      onMouseLeave={() => setHovered(null)}
                      className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full focus:outline-none"
                      style={{ left: `${n.x}%`, top: `${n.y}%` }}
                      aria-label={`Select post: ${labelTitle}`}
                    >
                      <div
                        className="absolute inset-0 rounded-full"
                        style={{
                          width: isActive ? 54 : 44,
                          height: isActive ? 54 : 44,
                          transform: "translate(-50%, -50%)",
                          left: "50%",
                          top: "50%",
                          background: "rgba(255, 70, 90, 0.10)",
                          filter: "blur(10px)",
                          opacity: isActive || isHover ? 1 : 0.55,
                        }}
                      />

                      <div
                        className="relative rounded-full flex items-center justify-center"
                        style={{
                          width: isActive ? 34 : 26,
                          height: isActive ? 34 : 26,
                          background: isActive
                            ? "linear-gradient(135deg, rgba(255,70,90,1), rgba(255,170,180,0.95))"
                            : "rgba(255, 120, 135, 0.35)",
                          border: isActive
                            ? "1px solid rgba(255, 230, 235, 0.55)"
                            : "1px solid rgba(255, 120, 135, 0.35)",
                          boxShadow: isActive
                            ? "0 0 24px rgba(255,70,90,0.55)"
                            : "0 0 16px rgba(255,70,90,0.22)",
                          transition: "all 220ms ease",
                        }}
                      >
                        <span className="text-[10px] font-bold text-black font-heading">
                          {n.i + 1}
                        </span>
                      </div>

                      {/* ✅ label width scales down for phones */}
                      <div
                        className="absolute left-1/2 top-[110%] -translate-x-1/2 text-center"
                        style={{
                          width: "min(220px, 62vw)",
                          pointerEvents: "none",
                        }}
                      >
                        <div
                          className="font-body"
                          style={{
                            fontSize: "clamp(0.75rem, 2.4vw, 0.95rem)",
                            color: isActive
                              ? "rgba(255,240,245,0.95)"
                              : "rgba(255,210,220,0.72)",
                            textShadow: isActive
                              ? "0 0 18px rgba(255,70,90,0.25)"
                              : "none",
                            opacity: isActive || isHover ? 1 : 0,
                            transform:
                              isActive || isHover
                                ? "translateY(0)"
                                : "translateY(-6px)",
                            transition: "all 220ms ease",
                          }}
                        >
                          {labelTitle}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="absolute bottom-4 sm:bottom-5 left-4 sm:left-6 right-4 sm:right-6 flex items-center justify-between">
                <div className="text-[10px] sm:text-xs uppercase tracking-widest text-rose-200/70 font-body">
                  Tap nodes • Explore threads
                </div>
                <div className="text-[10px] sm:text-xs text-rose-200/60 font-body">
                  {active + 1} / {posts.length}
                </div>
              </div>
            </div>

            {/* RIGHT: Hologram Preview Panel */}
            <div className="relative rounded-3xl border border-rose-400/20 bg-black/25 backdrop-blur-sm overflow-hidden">
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to bottom, transparent, rgba(255,70,90,0.22), transparent)",
                  height: "18%",
                  width: "100%",
                  animation: "scan 4.8s ease-in-out infinite",
                }}
              />

              <div
                className="absolute inset-0 pointer-events-none rounded-3xl"
                style={{ boxShadow: "inset 0 0 60px rgba(255,70,90,0.12)" }}
              />

              <div className="p-5 sm:p-7 md:p-9">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-5 sm:mb-6">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-bold text-black bg-gradient-to-r from-red-400 to-rose-300 font-heading"
                    style={{ boxShadow: "0 0 16px rgba(255,70,90,0.35)" }}
                  >
                    {current?.__tag}
                  </span>

                  <div
                    className="text-rose-200/70 font-body"
                    style={{ fontSize: "clamp(0.85rem, 2vw, 0.95rem)" }}
                  >
                    {current?.__date}
                    {current?.__date && current?.__mins ? " • " : ""}
                    {current?.__mins}
                  </div>
                </div>

                <h3
                  className="font-bold text-rose-50 font-heading mb-4"
                  style={{
                    fontSize: "clamp(1.5rem, 3.6vw, 3rem)",
                    textShadow: "0 0 18px rgba(255,70,90,0.22)",
                  }}
                >
                  {current?.__title}
                </h3>

                <p
                  className="text-rose-100/75 font-body leading-relaxed"
                  style={{ fontSize: "clamp(1rem, 2.2vw, 1.125rem)" }}
                >
                  {current?.__blurb}
                </p>

                <div
                  className="mt-7 sm:mt-8 rounded-2xl border border-rose-400/15 bg-black/30 p-4 sm:p-5"
                  style={{ animation: "glowPulseRed 4.2s ease-in-out infinite" }}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-xs uppercase tracking-[0.25em] text-rose-200/70 font-body">
                      Signal Strength
                    </div>
                    <div className="text-xs text-rose-200/60 font-body">
                      ID-{String(active + 1).padStart(2, "0")}
                    </div>
                  </div>

                  <div className="mt-3 h-2 rounded-full bg-black/50 overflow-hidden border border-rose-400/10">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${58 + (active % 5) * 8}%`,
                        background:
                          "linear-gradient(90deg, rgba(255,70,90,0.95), rgba(255,170,180,0.75))",
                        boxShadow: "0 0 18px rgba(255,70,90,0.25)",
                        transition: "width 350ms ease",
                      }}
                    />
                  </div>

                  <div className="mt-3 text-sm text-rose-100/65 font-body">
                    “Follow the thread. Keep what’s real. Drop what’s noise.”
                  </div>
                </div>

                <div className="mt-7 sm:mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                  <button
                    type="button"
                    onClick={() => openPost(current)}
                    className="px-6 py-3 rounded-full font-body font-bold cursor-pointer text-black bg-gradient-to-r from-red-400 to-rose-300 hover:from-red-300 hover:to-rose-200 transition-all duration-300"
                    style={{ boxShadow: "0 0 22px rgba(255,70,90,0.35)" }}
                  >
                    Read Story →
                  </button>

                  <button
                    type="button"
                    onClick={() => setActive((prev) => (prev + 1) % posts.length)}
                    className="px-6 py-3 rounded-full font-body font-bold text-rose-100 cursor-pointer border border-rose-400/30 bg-black/20 hover:bg-rose-500/10 transition-all duration-300"
                  >
                    Next Signal
                  </button>
                </div>
              </div>

              <div className="absolute top-4 right-4 w-12 h-12 sm:w-14 sm:h-14 border-t-2 border-r-2 border-rose-300/40 rounded-tr-2xl" />
              <div className="absolute bottom-4 left-4 w-12 h-12 sm:w-14 sm:h-14 border-b-2 border-l-2 border-rose-300/40 rounded-bl-2xl" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BlogStoriesSection;
