import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { Link } from "react-router-dom";

const UnderwaterHero = () => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const mousePos = useRef({ x: 0.5, y: 0.5 });
  const heroRef = useRef(null);

  const [isHovering, setIsHovering] = useState(false);

  // cursor spotlight + parallax
  const [spot, setSpot] = useState({ x: 50, y: 50 });
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [ripples, setRipples] = useState([]);

  // Touch devices: enable "hover strength" feel by default
  useEffect(() => {
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouch) setIsHovering(true);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    );
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // Vertex shader
    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    // Fragment shader for water caustics
    const fragmentShader = `
      uniform float time;
      uniform vec2 mouse;
      uniform float hoverStrength;
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

        vec2 mouseUv = mouse;
        vec2 toMouse = uv - mouseUv;

        float fogNoise1 = fbm(uv * 4.0 + time * 0.1);
        float fogNoise2 = fbm(uv * 6.0 - time * 0.08 + vec2(time * 0.05, 0.0));
        float fogPattern = (fogNoise1 + fogNoise2) * 0.5;

        float flowX = sin(uv.y * 5.0 + time * 0.5) * 0.1;
        float flowY = cos(uv.x * 4.0 + time * 0.4) * 0.1;
        vec2 flowOffset = vec2(flowX, flowY);

        float distWithFlow = length(toMouse + flowOffset);

        float fogRadius = 0.25 + fogPattern * 0.1;
        float fogFalloff = 0.3;

        float fogReveal = smoothstep(fogRadius - fogFalloff, fogRadius + fogFalloff, distWithFlow);
        fogReveal = mix(fogReveal, fogReveal * (0.8 + fogPattern * 0.4), 0.6);

        float edgeMask = smoothstep(0.0, 0.15, uv.x) * smoothstep(1.0, 0.85, uv.x);
        edgeMask *= smoothstep(0.0, 0.1, uv.y) * smoothstep(1.0, 0.9, uv.y);

        float finalFog = mix(1.0, fogReveal, hoverStrength);
        finalFog = mix(1.0, finalFog, edgeMask);

        vec3 deepWater = vec3(0.0, 0.15, 0.2);
        vec3 midWater = vec3(0.0, 0.25, 0.3);
        vec3 causticHighlight = vec3(0.2, 0.6, 0.7);
        vec3 shimmerHighlight = vec3(0.3, 0.8, 0.9);

        vec3 color = mix(deepWater, midWater, waterPattern);
        color = mix(color, causticHighlight, caustics * 0.5);

        float shimmer = pow(sin(uv.x * 25.0 + uv.y * 20.0 + time * 4.0) * 0.5 + 0.5, 3.0);
        float shimmer2 = pow(sin(uv.x * 18.0 - uv.y * 22.0 - time * 3.5) * 0.5 + 0.5, 4.0);
        color = mix(color, shimmerHighlight, (shimmer + shimmer2) * 0.15);

        float depthGradient = 1.0 - length(uv - 0.5) * 0.3;
        color *= depthGradient;

        float alpha = (0.95 + waterPattern * 0.15) * finalFog;
        gl_FragColor = vec4(color, alpha);
      }
    `;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        time: { value: 0 },
        mouse: { value: new THREE.Vector2(0.5, 0.5) },
        hoverStrength: { value: 0 },
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

    sceneRef.current = { scene, camera, renderer, material, mesh };

    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      material.uniforms.time.value += 0.01;

      const targetHover = isHovering ? 1 : 0;
      material.uniforms.hoverStrength.value +=
        (targetHover - material.uniforms.hoverStrength.value) * 0.05;

      material.uniforms.mouse.value.x +=
        (mousePos.current.x - material.uniforms.mouse.value.x) * 0.1;
      material.uniforms.mouse.value.y +=
        (mousePos.current.y - material.uniforms.mouse.value.y) * 0.1;

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
  }, [isHovering]);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = 1 - (e.clientY - rect.top) / rect.height;

    mousePos.current = { x, y };

    setSpot({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });

    const dx = x - 0.5;
    const dy = y - 0.5;
    setTilt({
      rx: Math.max(-8, Math.min(8, -dy * 10)),
      ry: Math.max(-10, Math.min(10, dx * 12)),
    });
  };

  // Touch move support for spotlight/tilt
  const handleTouchMove = (e) => {
    if (!containerRef.current || !e.touches?.[0]) return;
    const t = e.touches[0];
    const rect = containerRef.current.getBoundingClientRect();
    const x = (t.clientX - rect.left) / rect.width;
    const y = 1 - (t.clientY - rect.top) / rect.height;

    mousePos.current = { x, y };
    setSpot({
      x: ((t.clientX - rect.left) / rect.width) * 100,
      y: ((t.clientY - rect.top) / rect.height) * 100,
    });

    const dx = x - 0.5;
    const dy = y - 0.5;
    setTilt({
      rx: Math.max(-6, Math.min(6, -dy * 9)),
      ry: Math.max(-8, Math.min(8, dx * 10)),
    });
  };

  const handleClick = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const id = `${Date.now()}-${Math.random()}`;
    setRipples((r) => [...r, { id, x, y }]);
    setTimeout(() => {
      setRipples((r) => r.filter((rp) => rp.id !== id));
    }, 900);
  };

  const handleTouchStart = (e) => {
    if (!containerRef.current || !e.touches?.[0]) return;
    const t = e.touches[0];
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((t.clientX - rect.left) / rect.width) * 100;
    const y = ((t.clientY - rect.top) / rect.height) * 100;
    const id = `${Date.now()}-${Math.random()}`;
    setRipples((r) => [...r, { id, x, y }]);
    setTimeout(() => {
      setRipples((r) => r.filter((rp) => rp.id !== id));
    }, 900);
  };

  const phrases = [
    "Content Creator",
    "Creative Partner",
    "Technologist",
    "Visual Storyteller",
    "Video Editor",
    "Author",
    "Videographer",
    "Musician",
  ];
  const [activePhrase, setActivePhrase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActivePhrase((prev) => (prev + 1) % phrases.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      ref={heroRef}
      className="relative w-full bg-black overflow-hidden min-h-[100svh] md:h-screen"
      id="hero"
    >
      <style>{`
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes hudFloat {
          0%,100% { transform: translateY(0); opacity: .65; }
          50% { transform: translateY(-10px); opacity: .9; }
        }

        @keyframes scanLine {
          0% { transform: translateY(-120%); opacity: 0; }
          20% { opacity: .35; }
          60% { opacity: .25; }
          100% { transform: translateY(140%); opacity: 0; }
        }

        @keyframes ripple {
          0% { transform: translate(-50%, -50%) scale(0.4); opacity: .45; }
          100% { transform: translate(-50%, -50%) scale(2.4); opacity: 0; }
        }

        @keyframes shimmer {
          0% { background-position: -120% 0; opacity: 0.15; }
          30% { opacity: 0.35; }
          100% { background-position: 220% 0; opacity: 0.15; }
        }

        .hero-hud-grid {
          background-image:
            linear-gradient(to right, rgba(0,255,255,.10) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,255,255,.08) 1px, transparent 1px);
          background-size: 72px 72px;
          mask-image: radial-gradient(circle at 50% 50%, rgba(0,0,0,0.95), transparent 70%);
          opacity: .45;
        }

        .hero-glass {
          background: linear-gradient(135deg, rgba(0,255,255,0.10), rgba(0,0,0,0.35));
          border: 1px solid rgba(0,255,255,0.22);
          box-shadow: 0 0 40px rgba(0,255,255,0.14), inset 0 0 30px rgba(0,255,255,0.08);
          backdrop-filter: blur(10px);
        }

        .hero-corners:before,
        .hero-corners:after {
          content: "";
          position: absolute;
          width: 18px; height: 18px;
          border: 2px solid rgba(0,255,255,0.40);
          filter: drop-shadow(0 0 10px rgba(0,255,255,0.25));
        }
        .hero-corners:before { top: 10px; left: 10px; border-right: none; border-bottom: none; border-top-left-radius: 12px; }
        .hero-corners:after { bottom: 10px; right: 10px; border-left: none; border-top: none; border-bottom-right-radius: 12px; }

        .hero-shimmer {
          background: linear-gradient(90deg, transparent, rgba(0,255,255,0.25), transparent);
          background-size: 220% 100%;
          animation: shimmer 4.2s linear infinite;
        }
      `}</style>

      {/* Video Background */}
      <div className="absolute inset-0 flex items-center justify-center">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          style={{ filter: "brightness(0.9) contrast(1.1)" }}
        >
          <source src="/videos/cgmbackground.mp4" type="video/mp4" />
        </video>
      </div>

      {/* HUD grid overlay */}
      <div className="absolute inset-0 hero-hud-grid pointer-events-none" />

      {/* Shader Water Overlay */}
      <div
        ref={containerRef}
        className="absolute inset-0 cursor-pointer"
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        onClick={handleClick}
        onTouchStart={handleTouchStart}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      />

      {/* spotlight & scanline layer */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(420px circle at ${spot.x}% ${spot.y}%, rgba(0,255,255,0.18), transparent 60%)`,
            transition: "background 60ms linear",
            mixBlendMode: "screen",
            opacity: isHovering ? 1 : 0.65,
          }}
        />

        <div
          className="absolute inset-x-0 h-[180px]"
          style={{
            top: "10%",
            background:
              "linear-gradient(to bottom, transparent, rgba(0,255,255,0.12), transparent)",
            filter: "blur(0.6px)",
            animation: "scanLine 6.5s ease-in-out infinite",
            opacity: 0.75,
          }}
        />

        {ripples.map((r) => (
          <div
            key={r.id}
            className="absolute rounded-full border border-cyan-300/50"
            style={{
              left: `${r.x}%`,
              top: `${r.y}%`,
              width: 140,
              height: 140,
              transform: "translate(-50%, -50%)",
              boxShadow: "0 0 25px rgba(0,255,255,0.22)",
              animation: "ripple 900ms ease-out forwards",
            }}
          />
        ))}
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white pointer-events-none">
        <div
          className="relative hero-glass hero-corners rounded-[28px] px-5 py-6 sm:px-8 sm:py-8 md:px-14 md:py-12"
          style={{
            transform: `perspective(1100px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
            transition: "transform 120ms ease-out",
            maxWidth: "min(980px, 92vw)",
          }}
        >
          <div className="absolute inset-0 hero-shimmer opacity-40 pointer-events-none rounded-[28px]" />

          <div className="flex items-center justify-center mb-4 sm:mb-5">
            <span
              className="px-3 sm:px-4 py-1.5 rounded-full text-[8px] sm:text-xs font-bold tracking-[0.28em] font-heading uppercase text-black bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-300"
              style={{ boxShadow: "0 0 22px rgba(0,255,255,0.75)" }}
            >
              Portfolio • Motion • Color • Sound
            </span>
          </div>

          <h1
            className="font-bold mb-3 sm:mb-4 text-transparent font-heading bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 text-center"
            style={{
              fontSize: "clamp(2.2rem, 6vw, 6rem)",
              lineHeight: 1.05,
              textShadow:
                "0 0 20px rgba(0, 255, 255, 0.5), 0 0 40px rgba(0, 255, 255, 0.3)",
              filter: "drop-shadow(0 0 10px rgba(0, 255, 255, 0.7))",
            }}
          >
            COREY G. MARSH
          </h1>

          <p
            key={activePhrase}
            className="bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 tracking-widest font-heading uppercase mb-3 sm:mb-4 transition-all duration-700 text-center"
            style={{
              fontSize: "clamp(1.05rem, 3.2vw, 2.25rem)",
              textShadow: "0 0 10px rgba(0, 255, 255, 0.8)",
              animation: "fadeSlide 700ms ease",
            }}
          >
            {phrases[activePhrase]}
          </p>

          <div
            className="text-teal-200 text-center font-body"
            style={{ fontSize: "clamp(0.95rem, 2vw, 1.25rem)" }}
          >
            <p className="opacity-80">Hover to explore the depths</p>
          </div>

          <div className="mt-6 sm:mt-7 flex flex-wrap items-center justify-center gap-3 sm:gap-4 pointer-events-auto">
            <Link
              to="/library"
              className="px-5 py-2.5 sm:px-7 sm:py-3 rounded-full font-body font-bold text-black bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 transition-all duration-300"
              style={{ boxShadow: "0 0 28px rgba(0,255,255,0.25)" }}
            >
              View Library
            </Link>
            <Link
              to="/contact"
              className="px-5 py-2.5 sm:px-7 sm:py-3 rounded-full font-body font-bold text-cyan-100 border border-cyan-400/40 bg-black/30 hover:bg-black/45 transition-all duration-300"
              style={{ boxShadow: "0 0 22px rgba(0,255,255,0.12)" }}
            >
              Hire Me
            </Link>
          </div>
        </div>

        {/* scroll cue */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 pointer-events-none hidden sm:block">
          <div
            className="flex flex-col items-center gap-2"
            style={{ animation: "hudFloat 3.2s ease-in-out infinite" }}
          >
            <span className="text-xs tracking-[0.35em] font-body uppercase text-cyan-200/70">
              Scroll
            </span>
            <div className="w-[2px] h-12 bg-gradient-to-b from-cyan-400/70 via-cyan-400/25 to-transparent rounded-full" />
          </div>
        </div>
      </div>

      {/* Social Icons */}
      <div className="absolute bottom-5 right-4 sm:bottom-6 sm:right-6 z-20 pointer-events-auto">
        <div className="flex gap-2 sm:gap-3">
          <a
            href="https://music.apple.com/us/artist/the-downfall/1265793816"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-black/50 border border-cyan-400/40 flex items-center justify-center text-cyan-300 hover:text-slate-900 hover:bg-gradient-to-br hover:from-cyan-400 hover:to-teal-400 shadow-lg shadow-cyan-400/40 overflow-hidden transition-all duration-300"
            aria-label="Music"
          >
            <span className="absolute inset-0 rounded-full bg-cyan-400/30 scale-75 opacity-0 group-hover:scale-150 group-hover:opacity-40 transition-all duration-500 ease-out" />
            <svg className="relative h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3a9 9 0 1 0 9 9 9 9 0 0 0-9-9Zm3.6 6.2-4.7 1.3v5.3a1.9 1.9 0 1 1-1-1.7V7.9l5.7-1.6Z" />
            </svg>
          </a>

          <a
            href="https://www.facebook.com/profile.php?id=61584493543524"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-black/50 border border-cyan-400/40 flex items-center justify-center text-cyan-300 hover:text-slate-900 hover:bg-gradient-to-br hover:from-cyan-400 hover:to-teal-400 shadow-lg shadow-cyan-400/40 overflow-hidden transition-all duration-300"
            aria-label="Facebook"
          >
            <span className="absolute inset-0 rounded-full bg-cyan-400/30 scale-75 opacity-0 group-hover:scale-150 group-hover:opacity-40 transition-all duration-500 ease-out" />
            <svg className="relative h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13.5 9H15V6.5h-1.5c-2 0-3.5 1.2-3.5 3.6V12H8v2.5h2v6h2.5v-6H15l.4-2.5h-2.9v-1.6c0-.8.3-1.4 1-1.4Z" />
            </svg>
          </a>

          <a
            href="https://www.linkedin.com/in/corey-marsh-02765732a/"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-black/50 border border-cyan-400/40 flex items-center justify-center text-cyan-300 hover:text-slate-900 hover:bg-gradient-to-br hover:from-cyan-400 hover:to-teal-400 shadow-lg shadow-cyan-400/40 overflow-hidden transition-all duration-300"
            aria-label="LinkedIn"
          >
            <span className="absolute inset-0 rounded-full bg-cyan-400/30 scale-75 opacity-0 group-hover:scale-150 group-hover:opacity-40 transition-all duration-500 ease-out" />
            <svg className="relative h-5 w-5" viewBox="0 0 24 24" fill="none">
              <rect x="4" y="4" width="16" height="16" rx="2" ry="2" stroke="currentColor" strokeWidth="1.5" />
              <rect x="7" y="10" width="2" height="6" fill="currentColor" />
              <circle cx="8" cy="8" r="1.1" fill="currentColor" />
              <path
                d="M13 10h1.4a2 2 0 0 1 2 2v4h-2v-3.2c0-.65-.33-1-0.9-1-.57 0-.95.35-.95 1V16h-2v-6h2v1z"
                fill="currentColor"
              />
            </svg>
          </a>
        </div>
      </div>

      {/* Particles overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-cyan-400 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
              boxShadow:
                "0 0 10px rgba(0, 255, 255, 0.8), 0 0 20px rgba(0, 255, 255, 0.4)",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default UnderwaterHero;
