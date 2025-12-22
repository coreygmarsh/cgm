import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";

const Approach = () => {
  const waterContainerRef = useRef(null);

  // =========
  // ORANGE "UNDERWATER" SHADER (unchanged)
  // =========
  useEffect(() => {
    if (!waterContainerRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(
      waterContainerRef.current.clientWidth,
      waterContainerRef.current.clientHeight
    );
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    waterContainerRef.current.appendChild(renderer.domElement);

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

        vec3 deepWater = vec3(0.10, 0.03, 0.00);
        vec3 midWater  = vec3(0.28, 0.10, 0.02);
        vec3 causticHighlight = vec3(1.00, 0.55, 0.18);
        vec3 shimmerHighlight = vec3(1.00, 0.85, 0.40);

        vec3 color = mix(deepWater, midWater, waterPattern);
        color = mix(color, causticHighlight, caustics * 0.55);

        float shimmer = pow(
          sin(uv.x * 25.0 + uv.y * 20.0 + time * 4.0) * 0.5 + 0.5,
          3.0
        );
        float shimmer2 = pow(
          sin(uv.x * 18.0 - uv.y * 22.0 - time * 3.5) * 0.5 + 0.5,
          4.0
        );
        color = mix(color, shimmerHighlight, (shimmer + shimmer2) * 0.18);

        float depthGradient = 1.0 - length(uv - 0.5) * 0.3;
        color *= depthGradient;

        float alpha = 0.86 + waterPattern * 0.14;

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
      if (!waterContainerRef.current) return;
      const width = waterContainerRef.current.clientWidth;
      const height = waterContainerRef.current.clientHeight;
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
      if (waterContainerRef.current && renderer.domElement) {
        waterContainerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  const steps = [
    {
      k: "01",
      title: "Align",
      text: 'We get clear on your goal, audience, and what "success" actually means—before anything gets built.',
      phoenixFeature: "Vision",
      gemType: "Ruby",
    },
    {
      k: "02",
      title: "Design the System",
      text: "We map the flow: story, structure, pacing, and visuals—so your work feels intentional and premium.",
      phoenixFeature: "Creation",
      gemType: "Amber",
    },
    {
      k: "03",
      title: "Build & Iterate",
      text: "Fast loops. Sharp feedback. We refine until it hits with clarity and glow.",
      phoenixFeature: "Refinement",
      gemType: "Citrine",
    },
    {
      k: "04",
      title: "Ship & Evolve",
      text: "Launch clean, measure what matters, and keep improving with a long-term creative rhythm.",
      phoenixFeature: "Rebirth",
      gemType: "Topaz",
    },
  ];

  return (
    <section className="relative min-h-screen bg-black overflow-hidden">
      {/* Shader background */}
      <div ref={waterContainerRef} className="fixed inset-0 z-0" />

      {/* Enhanced atmospheric layers */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-black via-orange-950/20 to-transparent z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black via-red-950/30 to-transparent z-10 pointer-events-none" />

      {/* Fiery glow orbs */}
      <div className="absolute inset-0 pointer-events-none z-5">
        <div
          className="absolute top-20 left-1/4 w-[260px] h-[260px] sm:w-[340px] sm:h-[340px] md:w-[400px] md:h-[400px] rounded-full bg-orange-500/20 blur-[100px] animate-pulse"
          style={{ animationDuration: "4s" }}
        />
        <div
          className="absolute top-40 right-1/4 w-[300px] h-[300px] sm:w-[420px] sm:h-[420px] md:w-[500px] md:h-[500px] rounded-full bg-red-500/15 blur-[120px] animate-pulse"
          style={{ animationDuration: "5s" }}
        />
        <div
          className="absolute bottom-32 left-1/3 w-[280px] h-[280px] sm:w-[380px] sm:h-[380px] md:w-[450px] md:h-[450px] rounded-full bg-amber-500/18 blur-[110px] animate-pulse"
          style={{ animationDuration: "6s" }}
        />
      </div>

      {/* Enhanced grid/vignette overlay */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,160,80,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(251,146,60,0.12) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage:
              "radial-gradient(circle at 50% 40%, black 45%, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(circle at 50% 40%, black 45%, transparent 75%)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70" />
      </div>

      {/* Floating ember particles with variety */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {[...Array(28)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: i % 5 === 0 ? "5px" : i % 5 === 1 ? "3px" : "2px",
              height: i % 5 === 0 ? "5px" : i % 5 === 1 ? "3px" : "2px",
              background:
                i % 4 === 0
                  ? "rgba(251,146,60,0.65)"
                  : i % 4 === 1
                  ? "rgba(252,211,77,0.60)"
                  : i % 4 === 2
                  ? "rgba(239,68,68,0.55)"
                  : "rgba(255,200,100,0.60)",
              boxShadow:
                i % 4 === 0
                  ? "0 0 16px rgba(251,146,60,0.70), 0 0 28px rgba(251,146,60,0.35)"
                  : i % 4 === 1
                  ? "0 0 16px rgba(252,211,77,0.65), 0 0 28px rgba(252,211,77,0.30)"
                  : i % 4 === 2
                  ? "0 0 16px rgba(239,68,68,0.60), 0 0 28px rgba(239,68,68,0.28)"
                  : "0 0 16px rgba(255,200,100,0.65), 0 0 28px rgba(255,200,100,0.32)",
              animation: `floatParticle ${6 + Math.random() * 6}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Floating gem shards */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${10 + i * 10}%`,
              top: `${15 + (i % 4) * 22}%`,
              width: "14px",
              height: "14px",
              background:
                i % 4 === 0
                  ? "linear-gradient(135deg, rgba(239,68,68,0.45), rgba(251,146,60,0.35))"
                  : i % 4 === 1
                  ? "linear-gradient(135deg, rgba(251,146,60,0.45), rgba(252,211,77,0.35))"
                  : i % 4 === 2
                  ? "linear-gradient(135deg, rgba(252,211,77,0.45), rgba(255,230,150,0.35))"
                  : "linear-gradient(135deg, rgba(255,200,100,0.45), rgba(251,146,60,0.35))",
              transform: "rotate(45deg)",
              boxShadow:
                "0 0 22px rgba(251,146,60,0.40), 0 0 35px rgba(239,68,68,0.25)",
              animation: `gemFloat ${4 + (i % 3)}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
              opacity: 0.7,
            }}
          />
        ))}
      </div>

      {/* Local keyframes */}
      <style>{`
        @keyframes floatParticle {
          0%, 100% { transform: translateY(0px) translateX(0px); opacity: .75; }
          25% { transform: translateY(-22px) translateX(10px); opacity: .95; }
          50% { transform: translateY(-12px) translateX(-12px); opacity: .70; }
          75% { transform: translateY(-28px) translateX(8px); opacity: .90; }
        }
        @keyframes gemFloat {
          0%, 100% { transform: rotate(45deg) translateY(0px) scale(1); opacity: 0.7; }
          50% { transform: rotate(45deg) translateY(-15px) scale(1.1); opacity: 0.95; }
        }
        @keyframes diamondFloat {
          0%, 100% { transform: rotate(45deg) translateY(0px) translateX(0px); opacity: 0.8; }
          33% { transform: rotate(45deg) translateY(-25px) translateX(15px); opacity: 1; }
          66% { transform: rotate(45deg) translateY(-15px) translateX(-20px); opacity: 0.85; }
        }
        @keyframes diamondSpin {
          0% { filter: hue-rotate(0deg) brightness(1); }
          50% { filter: hue-rotate(15deg) brightness(1.3); }
          100% { filter: hue-rotate(0deg) brightness(1); }
        }
        @keyframes phoenixPulse {
          0%, 100% {
            box-shadow: 0 0 40px rgba(251,146,60,0.45), 0 0 80px rgba(239,68,68,0.25), inset 0 0 50px rgba(251,146,60,0.12);
            transform: scale(1);
          }
          50% {
            box-shadow: 0 0 60px rgba(251,146,60,0.70), 0 0 120px rgba(239,68,68,0.40), inset 0 0 80px rgba(251,146,60,0.20);
            transform: scale(1.02);
          }
        }
        @keyframes scan {
          0% { transform: translateY(-120%) skewY(-5deg); opacity: 0; }
          15% { opacity: .45; }
          55% { opacity: .35; }
          100% { transform: translateY(140%) skewY(5deg); opacity: 0; }
        }
        @keyframes wingFlap {
          0%, 100% { transform: scaleX(1) translateX(0); opacity: 0.4; }
          50% { transform: scaleX(1.2) translateX(5px); opacity: 0.7; }
        }
        @keyframes embers {
          0% { transform: translateY(0) scale(1); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 0.6; }
          100% { transform: translateY(-100px) scale(1.5); opacity: 0; }
        }
      `}</style>

      {/* Content */}
      {/* ✅ RESPONSIVE: smaller padding on mobile */}
      <div className="relative z-20 pt-24 sm:pt-28 pb-16 sm:pb-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Title with phoenix wings */}
          <div className="text-center mb-12 sm:mb-16 relative">
            {/* ✅ RESPONSIVE: wing container scales down on mobile */}
            <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[360px] sm:w-[520px] md:w-[800px] h-28 sm:h-36 md:h-40 pointer-events-none">
              <div
                className="absolute left-0 top-0 w-40 sm:w-52 md:w-64 h-24 sm:h-28 md:h-32 opacity-50"
                style={{
                  background:
                    "radial-gradient(ellipse at 0% 50%, rgba(239,68,68,0.6), rgba(251,146,60,0.4), transparent 70%)",
                  animation: "wingFlap 2.5s ease-in-out infinite",
                  transformOrigin: "right center",
                  filter: "blur(20px)",
                }}
              />
              <div
                className="absolute right-0 top-0 w-40 sm:w-52 md:w-64 h-24 sm:h-28 md:h-32 opacity-50"
                style={{
                  background:
                    "radial-gradient(ellipse at 100% 50%, rgba(239,68,68,0.6), rgba(251,146,60,0.4), transparent 70%)",
                  animation: "wingFlap 2.5s ease-in-out infinite",
                  animationDelay: "0.15s",
                  transformOrigin: "left center",
                  filter: "blur(20px)",
                }}
              />
            </div>

            {/* Rising embers from title */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-full h-24 sm:h-32 pointer-events-none overflow-hidden">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute bottom-0"
                  style={{
                    left: `${30 + i * 10}%`,
                    width: "3px",
                    height: "3px",
                    borderRadius: "50%",
                    background:
                      i % 3 === 0
                        ? "rgba(239,68,68,0.9)"
                        : i % 3 === 1
                        ? "rgba(251,146,60,0.9)"
                        : "rgba(252,211,77,0.9)",
                    boxShadow: `0 0 10px ${
                      i % 3 === 0
                        ? "rgba(239,68,68,1)"
                        : i % 3 === 1
                        ? "rgba(251,146,60,1)"
                        : "rgba(252,211,77,1)"
                    }`,
                    animation: `embers ${3 + Math.random() * 2}s ease-out infinite`,
                    animationDelay: `${i * 0.3}s`,
                  }}
                />
              ))}
            </div>

            {/* ✅ RESPONSIVE: badge wraps + tighter padding */}
            <div className="inline-flex flex-wrap justify-center items-center gap-3 px-4 sm:px-6 py-3 rounded-full border-2 border-orange-400/30 bg-gradient-to-r from-black/60 via-red-950/40 to-black/60 backdrop-blur-md relative z-10 shadow-2xl">
              <span
                className="w-3 h-3 rotate-45 bg-gradient-to-br from-red-400 to-red-600"
                style={{
                  boxShadow:
                    "0 0 25px rgba(239,68,68,0.85), 0 0 40px rgba(239,68,68,0.45)",
                  animation: "pulse 2s infinite",
                }}
              />
              <span
                className="w-3 h-3 rotate-45 bg-gradient-to-br from-orange-400 to-orange-600"
                style={{
                  boxShadow:
                    "0 0 25px rgba(251,146,60,0.80), 0 0 40px rgba(251,146,60,0.42)",
                  animation: "pulse 2s infinite",
                  animationDelay: "0.2s",
                }}
              />
              <span
                className="w-3 h-3 rotate-45 bg-gradient-to-br from-amber-300 to-amber-500"
                style={{
                  boxShadow:
                    "0 0 25px rgba(252,211,77,0.75), 0 0 40px rgba(252,211,77,0.38)",
                  animation: "pulse 2s infinite",
                  animationDelay: "0.4s",
                }}
              />
              <span
                className="w-3 h-3 rotate-45 bg-gradient-to-br from-yellow-300 to-yellow-500"
                style={{
                  boxShadow:
                    "0 0 25px rgba(250,204,21,0.70), 0 0 40px rgba(250,204,21,0.35)",
                  animation: "pulse 2s infinite",
                  animationDelay: "0.6s",
                }}
              />
              <span className="text-xs sm:text-sm tracking-[0.35em] sm:tracking-[0.4em] uppercase text-orange-100/80 font-body font-bold">
                Phoenix Process
              </span>
            </div>

            {/* ✅ RESPONSIVE: title scales down cleanly */}
            <h1
              className="mt-8 sm:mt-10 text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold font-heading text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-400 via-amber-300 to-yellow-200 relative z-10"
              style={{
                textShadow:
                  "0 0 50px rgba(251,146,60,0.90), 0 0 80px rgba(239,68,68,0.50), 0 0 100px rgba(239,68,68,0.30)",
                filter: "drop-shadow(0 0 30px rgba(251,146,60,0.85))",
                letterSpacing: "0.02em",
              }}
            >
              MY APPROACH
            </h1>

            {/* ✅ RESPONSIVE: paragraph size scales */}
            <p
              className="mt-6 sm:mt-8 max-w-3xl mx-auto text-lg sm:text-xl md:text-2xl text-orange-50/90 font-body leading-relaxed relative z-10"
              style={{ textShadow: "0 0 20px rgba(251,146,60,0.35)" }}
            >
              Rising from the  <span className="text-orange-500 font-body leading-relaxed"
              style={{ textShadow: "0 0 10px rgba(255, 50, 0, 1.0)" }}>flames</span> of iteration, each project is forged with
              intention— a repeatable cycle of rebirth that polishes your vision
              into a <span className="text-orange-500 font-body leading-relaxed"
              style={{ textShadow: "0 0 10px rgba(255, 50, 0, 1.0)" }}>radiant gem</span>.
            </p>
          </div>

          {/* ✅ RESPONSIVE: smaller padding on cards on mobile + tighter gap */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8">
            {steps.map((s, idx) => (
              <div
                key={s.k}
                className="relative rounded-3xl border-2 border-orange-400/30 bg-gradient-to-br from-black/40 via-red-950/20 to-black/40 backdrop-blur-md overflow-hidden p-6 sm:p-10 group hover:border-orange-400/50 transition-all duration-500"
                style={{
                  animation: "phoenixPulse 5s ease-in-out infinite",
                  animationDelay: `${idx * 0.3}s`,
                  boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
                }}
              >
                {/* Enhanced scanline with color */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(to bottom, transparent 0%, rgba(251,146,60,0.40) 40%, rgba(239,68,68,0.35) 50%, rgba(251,146,60,0.40) 60%, transparent 100%)",
                    height: "25%",
                    width: "100%",
                    animation: "scan 7s ease-in-out infinite",
                    animationDelay: `${idx * 0.5}s`,
                    filter: "blur(10px)",
                  }}
                />

                {/* Animated border glow */}
                <div
                  className="absolute inset-0 rounded-3xl opacity-60"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(251,146,60,0.3), transparent)",
                    animation: "scan 8s linear infinite",
                    animationDelay: `${idx * 0.7}s`,
                  }}
                />

                {/* Phoenix flame accents - more intense */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-red-500/60 via-orange-400/70 to-transparent blur-sm" />
                <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-orange-400/60 via-amber-400/70 to-transparent blur-sm" />

                {/* ✅ RESPONSIVE: corner brackets scale down on mobile */}
                <div className="absolute top-4 sm:top-5 right-4 sm:right-5 w-14 sm:w-20 h-14 sm:h-20">
                  <div className="absolute inset-0 border-t-[3px] border-r-[3px] border-orange-400/50 rounded-tr-3xl" />
                  <div
                    className="absolute top-0 right-0 w-3 h-3 rotate-45 bg-gradient-to-br from-red-400 to-orange-600"
                    style={{
                      boxShadow:
                        "0 0 20px rgba(239,68,68,0.80), 0 0 35px rgba(239,68,68,0.40)",
                      animation: "pulse 2s infinite",
                    }}
                  />
                </div>
                <div className="absolute bottom-4 sm:bottom-5 left-4 sm:left-5 w-14 sm:w-20 h-14 sm:h-20">
                  <div className="absolute inset-0 border-b-[3px] border-l-[3px] border-orange-400/50 rounded-bl-3xl" />
                  <div
                    className="absolute bottom-0 left-0 w-3 h-3 rotate-45 bg-gradient-to-br from-amber-400 to-yellow-500"
                    style={{
                      boxShadow:
                        "0 0 20px rgba(252,211,77,0.75), 0 0 35px rgba(252,211,77,0.35)",
                      animation: "pulse 2s infinite",
                      animationDelay: "0.5s",
                    }}
                  />
                </div>

                {/* ✅ RESPONSIVE: stack layout on very small screens to prevent overflow */}
                <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <div className="text-[10px] sm:text-xs text-orange-400/70 font-body uppercase tracking-[0.3em] font-bold px-3 py-1 rounded-full bg-orange-500/10 border border-orange-400/20">
                        {s.phoenixFeature}
                      </div>
                      <div className="h-px flex-1 bg-gradient-to-r from-orange-400/30 to-transparent" />
                    </div>

                    <div className="flex items-baseline gap-3 mb-4">
                      <span className="text-5xl sm:text-6xl font-bold text-orange-500/20 font-heading">
                        {s.k}
                      </span>
                      <div className="min-w-0">
                        <h3
                          className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading text-orange-50 group-hover:text-orange-100 transition-colors break-words"
                          style={{
                            textShadow: "0 0 25px rgba(251,146,60,0.35)",
                          }}
                        >
                          {s.title}
                        </h3>
                      </div>
                    </div>

                    <p className="text-base sm:text-lg text-orange-100/80 font-body leading-relaxed">
                      {s.text}
                    </p>
                  </div>

                  {/* ✅ RESPONSIVE: keep gem chip only on sm+ (unchanged behavior) */}
                  <div
                    className="hidden sm:flex h-20 w-20 items-center pr-8 justify-center rounded-2xl border-2 border-orange-400/40 bg-black/50 relative overflow-hidden group-hover:scale-110 transition-transform duration-500"
                    style={{
                      boxShadow:
                        "0 0 40px rgba(251,146,60,0.35), 0 0 60px rgba(239,68,68,0.15), inset 0 0 40px rgba(251,146,60,0.20)",
                    }}
                  >
                    <div
                      className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-400/30 via-transparent to-red-500/20"
                      style={{
                        animation: "spin 8s linear infinite",
                      }}
                    />

                    <div className="relative z-10">
                      <div
                        className="h-8 w-8 rotate-45 absolute inset-0 m-auto"
                        style={{
                          background:
                            idx % 4 === 0
                              ? "linear-gradient(135deg, rgba(239,68,68,1), rgba(251,146,60,0.9))"
                              : idx % 4 === 1
                              ? "linear-gradient(135deg, rgba(251,146,60,1), rgba(252,211,77,0.9))"
                              : idx % 4 === 2
                              ? "linear-gradient(135deg, rgba(252,211,77,1), rgba(250,204,21,0.9))"
                              : "linear-gradient(135deg, rgba(250,204,21,1), rgba(255,230,150,0.9))",
                          boxShadow:
                            "0 0 30px rgba(251,146,60,0.70), 0 0 50px rgba(239,68,68,0.35), inset 0 0 20px rgba(255,255,255,0.3)",
                          border: "2px solid rgba(255,235,200,0.50)",
                          animation: "pulse 3s ease-in-out infinite",
                        }}
                      />

                      <div
                        className="h-3 w-3 rotate-45 absolute inset-0 m-auto"
                        style={{
                          background:
                            "radial-gradient(circle, rgba(255,255,255,0.9), transparent)",
                          animation: "pulse 2s ease-in-out infinite",
                          animationDelay: "0.5s",
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div
                  className="absolute bottom-8 left-8 w-10 sm:w-12 h-14 sm:h-16 opacity-15 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(251,146,60,0.8), rgba(239,68,68,0.5), transparent)",
                    transform: "rotate(-20deg) skewX(-5deg)",
                    filter: "blur(3px)",
                    animation: "pulse 4s ease-in-out infinite",
                  }}
                />
              </div>
            ))}
          </div>

          <div className="mt-12 sm:mt-16 flex flex-col sm:flex-row items-center justify-center gap-6" />
        </div>
      </div>
    </section>
  );
};

export default Approach;
