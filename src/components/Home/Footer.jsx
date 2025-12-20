import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { Link } from "react-router-dom";

const Footer = () => {
  const containerRef = useRef(null);

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

        // Purple/Pink underwater colors
        vec3 deepWater = vec3(0.15, 0.0, 0.15);
        vec3 midWater = vec3(0.3, 0.0, 0.3);
        vec3 causticHighlight = vec3(0.7, 0.2, 0.7);
        vec3 shimmerHighlight = vec3(0.9, 0.4, 0.9);

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

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-black overflow-hidden">
      {/* Purple/Pink Underwater shader background */}
      <div ref={containerRef} className="absolute inset-0 z-0" />

      {/* ✅ Sonar rings (unchanged) */}
      <div className="absolute inset-0 pointer-events-none z-[1]">
        <style>{`
          @keyframes sonar {
            0%   { transform: translate(-50%, -50%) scale(0.15); opacity: 0.0; }
            10%  { opacity: 0.25; }
            55%  { opacity: 0.12; }
            100% { transform: translate(-50%, -50%) scale(1.45); opacity: 0.0; }
          }
        `}</style>

        {[
          { left: "18%", top: "55%", delay: "0s", dur: "5.8s" },
          { left: "72%", top: "40%", delay: "1.6s", dur: "6.6s" },
          { left: "50%", top: "78%", delay: "3.0s", dur: "6.2s" },
        ].map((r, i) => (
          <div key={i} className="absolute" style={{ left: r.left, top: r.top }}>
            {/* ✅ responsiveness-only: ring sizes now scale on small screens */}
            <div
              className="absolute rounded-full border border-fuchsia-300/25"
              style={{
                width: "clamp(260px, 60vw, 520px)",
                height: "clamp(260px, 60vw, 520px)",
                animation: `sonar ${r.dur} ease-out infinite`,
                animationDelay: r.delay,
                boxShadow: "0 0 30px rgba(200, 0, 255, 0.12)",
                background:
                  "radial-gradient(circle, rgba(255,255,255,0.05), transparent 55%)",
              }}
            />
            <div
              className="absolute rounded-full border border-purple-400/20"
              style={{
                width: "clamp(180px, 42vw, 360px)",
                height: "clamp(180px, 42vw, 360px)",
                animation: `sonar ${r.dur} ease-out infinite`,
                animationDelay: `calc(${r.delay} + 0.35s)`,
                boxShadow: "0 0 26px rgba(200, 0, 255, 0.10)",
              }}
            />
          </div>
        ))}
      </div>

      {/* Gradient fade at top */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black to-transparent z-10" />

      {/* Content */}
      {/* ✅ responsiveness-only: px/py scale down on small screens */}
      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 py-12 sm:py-16">
        {/* ✅ responsiveness-only: alignments become left on mobile, centered on md */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 mb-2 items-start">
          {/* 1) Brand Section */}
          <div className="text-left">
            {/* ✅ responsiveness-only: heading scales down on small screens */}
            <h3
              className="text-3xl sm:text-4xl font-bold mb-5 text-transparent bg-clip-text font-heading bg-gradient-to-r from-purple-400 via-pink-300 to-fuchsia-400"
              style={{
                textShadow: "0 0 30px rgba(200, 0, 255, 0.6)",
                filter: "drop-shadow(0 0 15px rgba(200, 0, 255, 0.8))",
              }}
            >
              COREY G. MARSH
            </h3>

            {/* ✅ responsiveness-only: body size scales down on small screens */}
            <p
              className="text-purple-100/70 text-base sm:text-xl max-w-sm font-body leading-relaxed"
              style={{ textShadow: "0 0 10px rgba(200, 0, 255, 0.3)" }}
            >
              Creating immersive worlds of color and motion through video editing,
              music production, and visual storytelling. Every project is a dive
              into creative excellence.
            </p>
          </div>

          {/* 2) Quick Links */}
          {/* ✅ responsiveness-only: left align on mobile, centered on md */}
          <div className="flex md:justify-center">
            <div className="text-left md:text-center">
              <h4
                className="text-xl sm:text-2xl font-bold font-heading uppercase text-purple-200 mb-2"
                style={{ textShadow: "0 0 10px rgba(200, 0, 255, 0.4)" }}
              >
                Quick Links
              </h4>

              {/* ✅ responsiveness-only: text size scales down on small screens */}
              <ul className="space-y-2 tracking-relaxed font-body text-base sm:text-lg">
                {[
                  { label: "Home", to: "/" },
                  { label: "Work", to: "/library" },
                  { label: "Beyond", to: "/beyond" },
                  { label: "About", to: "/about" },
                  { label: "Contact", to: "/contact" },
                ].map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-purple-100/60 hover:text-purple-300 transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 3) Services */}
          {/* ✅ responsiveness-only: left align on mobile, right on md */}
          <div className="flex md:justify-end">
            <div className="text-left md:text-center">
              <h4
                className="text-xl sm:text-2xl font-bold font-heading pointer-events-none uppercase text-purple-200 mb-2"
                style={{ textShadow: "0 0 10px rgba(200, 0, 255, 0.4)" }}
              >
                Services
              </h4>

              <ul className="space-y-2 text-base sm:text-lg font-body">
                {[
                  "Video Editing",
                  "Music Production",
                  "Color Grading",
                  "Photography",
                  "Motion Graphics",
                ].map((service) => (
                  <li key={service}>
                    <a className="text-purple-100/60 pointer-events-none transition-colors duration-300">
                      {service}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        {/* ✅ responsiveness-only: link row wraps nicely on mobile */}
        <div className="pt-8 border-t font-heading border-purple-500/20">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <p className="text-purple-100/60 text-sm">
              © {currentYear} CGM Creative. All rights reserved.
            </p>

            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <a
                href="/privacy"
                className="text-purple-100/60 hover:text-purple-300 transition-colors duration-300"
              >
                Privacy Policy
              </a>
              <a
                href="/terms"
                className="text-purple-100/60 hover:text-purple-300 transition-colors duration-300"
              >
                Terms of Service
              </a>
              <a
                href="/cookies"
                className="text-purple-100/60 hover:text-purple-300 transition-colors duration-300"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-purple-400/40 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
              boxShadow: "0 0 10px rgba(200, 0, 255, 0.6)",
            }}
          />
        ))}
      </div>
    </footer>
  );
};

export default Footer;
