import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

const Contact = () => {
  const waterContainerRef = useRef(null);
  const gemContainerRef = useRef(null);
  const isGemHovered = useRef(false); // 👈 controls hover speed/shine

  // ✅ Replace with your Formspree endpoint (it will email you)
  // Example: https://formspree.io/f/abcdwxyz
  const FORMSPREE_ENDPOINT = "https://formspree.io/f/mwveeakp";

  // ✅ Form state
  const [form, setForm] = useState({
    name: "",
    email: "",
    projectType: "",
    budgetRange: "",
    details: ""
  });

  const [status, setStatus] = useState({
    state: "idle", // idle | sending | success | error
    message: ""
  });

  // Underwater shader effect - RED theme
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
        
        // RED palette
        vec3 deepWater = vec3(0.08, 0.0, 0.02);       // deep crimson
        vec3 midWater = vec3(0.22, 0.02, 0.08);       // dark ruby
        vec3 causticHighlight = vec3(0.85, 0.25, 0.35); // bright red highlight
        vec3 shimmerHighlight = vec3(1.0, 0.45, 0.55);  // pinkish shimmer
        
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
      if (!waterContainerRef.current) return;
      const width = waterContainerRef.current.clientWidth;
      const height = waterContainerRef.current.clientHeight;
      renderer.setSize(width, height);
      material.uniforms.resolution.value.set(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      if (waterContainerRef.current && renderer.domElement) {
        waterContainerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  // 3D Spinning RED Gem (same behavior as other pages)
  useEffect(() => {
    if (!gemContainerRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 400 / 400, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(400, 400);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    gemContainerRef.current.appendChild(renderer.domElement);

    const crownGeometry = new THREE.CylinderGeometry(0.8, 1.5, 0.6, 8, 1);
    const pavilionGeometry = new THREE.ConeGeometry(1.5, 2, 8, 1);

    const material = new THREE.MeshPhysicalMaterial({
      color: 0xff3366,
      metalness: 0.3,
      roughness: 0,
      transparent: false,
      opacity: 1,
      reflectivity: 1,
      clearcoat: 1,
      clearcoatRoughness: 0,
      envMapIntensity: 5,
      ior: 2.4,
    });

    material.emissive = new THREE.Color(0xff3366);
    material.emissiveIntensity = 0.2;

    const crown = new THREE.Mesh(crownGeometry, material);
    crown.position.y = 0.3;

    const pavilion = new THREE.Mesh(pavilionGeometry, material);
    pavilion.rotation.z = Math.PI;
    pavilion.position.y = -1;

    const gemGroup = new THREE.Group();
    gemGroup.add(crown);
    gemGroup.add(pavilion);
    scene.add(gemGroup);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xff5577, 2);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xff99aa, 1.5);
    pointLight2.position.set(-5, -5, 5);
    scene.add(pointLight2);

    camera.position.z = 5;

    const baseRotation = { x: 0.008, y: 0.015, z: 0.01 };
    const hoverSpeedMultiplier = 3.0;
    const normalColor = new THREE.Color(0xff3366);
    const hoverColor = new THREE.Color(0xff88aa);

    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      const speedMultiplier = isGemHovered.current ? hoverSpeedMultiplier : 1.0;

      gemGroup.rotation.x += baseRotation.x * speedMultiplier;
      gemGroup.rotation.y += baseRotation.y * speedMultiplier;
      gemGroup.rotation.z += baseRotation.z * speedMultiplier;

      const targetColor = isGemHovered.current ? hoverColor : normalColor;
      material.color.lerp(targetColor, 0.08);

      const targetEmissive = isGemHovered.current ? 0.9 : 0.2;
      material.emissiveIntensity += (targetEmissive - material.emissiveIntensity) * 0.08;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      renderer.dispose();
      crownGeometry.dispose();
      pavilionGeometry.dispose();
      material.dispose();
      if (gemContainerRef.current && renderer.domElement) {
        gemContainerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  const onChange = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
    if (status.state !== "idle") setStatus({ state: "idle", message: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!FORMSPREE_ENDPOINT.includes("formspree.io")) {
      setStatus({
        state: "error",
        message: "Form endpoint not set. Replace FORMSPREE_ENDPOINT with your Formspree URL."
      });
      return;
    }

    setStatus({ state: "sending", message: "Sending..." });

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          projectType: form.projectType,
          budgetRange: form.budgetRange,
          details: form.details
        })
      });

      if (!res.ok) throw new Error("Request failed");

      setStatus({
        state: "success",
        message: "Message sent. I’ll get back to you soon."
      });

      setForm({
        name: "",
        email: "",
        projectType: "",
        budgetRange: "",
        details: ""
      });
    } catch (err) {
      setStatus({
        state: "error",
        message: "Something went wrong. Please try again, or email me directly."
      });
    }
  };

  return (
    <div className="relative min-h-screen bg-black">
      {/* Underwater shader background (red) */}
      <div ref={waterContainerRef} className="fixed inset-0 z-0" />

      {/* Content */}
      <div className="relative z-10 pt-24 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section with 3D Gem */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 mb-16">
            <div className="flex-1">
              <h1
                className="text-6xl md:text-7xl  text-shadow-red-500 text-shadow-xl  rounded-full font-bold mb-6 text-transparent bg-clip-text font-heading bg-gradient-to-r from-rose-400 via-red-300 to-orange-400"
                style={{
                  textShadow: '0 0 30px rgba(248, 113, 113, 0.7)',
                  filter: 'drop-shadow(0 0 15px rgba(248, 113, 113, 0.9))',
                }}
              >
                CONTACT
              </h1>
              <p
                className="text-xl font-body text-rose-100/85 mb-6 leading-relaxed"
                style={{ textShadow: '0 0 10px rgba(248, 113, 113, 0.4)' }}
              >
                Ready to bring your project to life? Whether you&apos;re looking
                for powerful vision-focused graphic design, motion graphics, sharp video edits, or full
                creative direction, let&apos;s start the conversation.
              </p>
              <p
                className="text-sm font-body text-rose-100/70 mb-4 leading-relaxed"
                style={{ textShadow: '0 0 6px rgba(248, 113, 113, 0.3)' }}
              >
                Share as much detail as you&apos;d like about your project —
                style references, timeline, budget range, and where the final
                piece will live. I&apos;ll respond with next steps, availability,
                and how we can make something powerful together.
              </p>
            </div>

            {/* 3D Spinning Red Gem */}
            <div className="flex-shrink-0">
              <div
                className="relative"
                style={{
                  filter: 'drop-shadow(0 0 30px rgba(248, 113, 113, 0.8))',
                }}
                onMouseEnter={() => { isGemHovered.current = true; }}
                onMouseLeave={() => { isGemHovered.current = false; }}
              >
                <div ref={gemContainerRef} className="w-[320px] h-[320px] md:w-[400px] md:h-[400px]" />
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-r from-rose-500/20 to-red-500/20 blur-3xl animate-pulse" />
                </div>
              </div>
            </div>
          </div>

          {/* Main Contact Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Left: Info / Details */}
            <div className="p-8 bg-gradient-to-br from-rose-900/30 to-red-950/30 rounded-2xl border border-rose-500/30 backdrop-blur-sm">
              <h2
                className="text-3xl font-heading font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-red-400"
                style={{ textShadow: '0 0 18px rgba(248, 113, 113, 0.6)' }}
              >
                Let&apos;s Collaborate
              </h2>
              <p className="font-body text-rose-100/80 mb-6 leading-relaxed">
                I work with companies, artists, brands, studios, and storytellers who care
                deeply about visuals, sound, and emotional impact. If you have a
                clear brief or just a feeling you want to capture, I&apos;ll help
                shape it into a cinematic experience.
              </p>

              <div className="space-y-4 mb-8">
                <div>
                  <h3 className="font-body text-sm uppercase tracking-wide text-rose-300/80 mb-1">
                    Email
                  </h3>
                  <p className="font-body text-rose-100">
                    coreymarshpm@gmail.com
                  </p>
                </div>
                <div>
                  <h3 className="font-body text-sm uppercase tracking-wide text-rose-300/80 mb-1">
                    Based In
                  </h3>
                  <p className="font-body text-rose-100">
                    Boston / Quincy, MA — open to remote & hybrid collaborations.
                  </p>
                </div>
                <div>
                  <h3 className="font-body text-sm uppercase tracking-wide text-rose-300/80 mb-1">
                    Ideal Projects
                  </h3>
                  <ul className="font-body text-rose-100/80 text-sm list-disc list-inside space-y-1">
                    <li>Music videos, performance visuals, or studio sessions</li>
                    <li>Short-form social content with cinematic polish</li>
                    <li>Themed visual storytelling</li>
                    <li>Documentary or branded mini-doc style projects</li>
                  </ul>
                </div>
              </div>

              <div className="font-body text-xs text-rose-200/70 italic">
                *If you have a tight deadline, please include your ideal launch date
                so I can respond with realistic options.
              </div>
            </div>

            {/* Right: Contact Form */}
            <div className="p-8 bg-gradient-to-br from-black/60 to-rose-950/40 rounded-2xl border border-rose-500/30 backdrop-blur-sm">
              <h2
                className="text-2xl font-heading font-bold mb-4 text-rose-100"
                style={{ textShadow: '0 0 14px rgba(248, 113, 113, 0.6)' }}
              >
                Share Your Project
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-body text-rose-200 mb-1">
                      Name
                    </label>
                    <input
                      name="name"
                      type="text"
                      required
                      value={form.name}
                      onChange={onChange("name")}
                      className="w-full px-3 py-2 rounded-md bg-black/60 border border-rose-500/40 text-rose-100 text-sm font-body focus:outline-none focus:ring-2 focus:ring-rose-400/70 focus:border-rose-300 transition"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-body text-rose-200 mb-1">
                      Email
                    </label>
                    <input
                      name="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={onChange("email")}
                      className="w-full px-3 py-2 rounded-md bg-black/60 border border-rose-500/40 text-rose-100 text-sm font-body focus:outline-none focus:ring-2 focus:ring-rose-400/70 focus:border-rose-300 transition"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-body text-rose-200 mb-1">
                    Project Type
                  </label>
                  <select
                    name="projectType"
                    required
                    value={form.projectType}
                    onChange={onChange("projectType")}
                    className="w-full px-3 py-2 rounded-md bg-black/60 border border-rose-500/40 text-rose-100 text-sm font-body focus:outline-none focus:ring-2 focus:ring-rose-400/70 focus:border-rose-300 transition"
                  >
                    <option value="" disabled>
                      Select one
                    </option>
                    <option>Music Video</option>
                    <option>Social Media Content</option>
                    <option>Documentary / Story</option>
                    <option>Studio Session / Live Capture</option>
                    <option>Other Creative Project</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-body text-rose-200 mb-1">
                    Budget Range (optional)
                  </label>
                  <select
                    name="budgetRange"
                    value={form.budgetRange}
                    onChange={onChange("budgetRange")}
                    className="w-full px-3 py-2 rounded-md bg-black/60 border border-rose-500/40 text-rose-100 text-sm font-body focus:outline-none focus:ring-2 focus:ring-rose-400/70 focus:border-rose-300 transition"
                  >
                    <option value="">
                      Select a rough range
                    </option>
                    <option>Under $500</option>
                    <option>$500 – $1,500</option>
                    <option>$1,500 – $3,500</option>
                    <option>$3,500+</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-body text-rose-200 mb-1">
                    Project Details
                  </label>
                  <textarea
                    name="details"
                    rows={5}
                    required
                    value={form.details}
                    onChange={onChange("details")}
                    className="w-full px-3 py-2 rounded-md bg-black/60 border border-rose-500/40 text-rose-100 text-sm font-body focus:outline-none focus:ring-2 focus:ring-rose-400/70 focus:border-rose-300 transition resize-none"
                    placeholder="Tell me about your vision, goals, references, and timeline..."
                  />
                </div>

                {/* ✅ Status message */}
                {status.state !== "idle" && (
                  <div
                    className="text-sm font-body rounded-xl px-4 py-3 border"
                    style={{
                      borderColor:
                        status.state === "success"
                          ? "rgba(134,239,172,0.35)"
                          : status.state === "error"
                          ? "rgba(251,113,133,0.35)"
                          : "rgba(248,113,113,0.25)",
                      background:
                        status.state === "success"
                          ? "rgba(16,185,129,0.10)"
                          : status.state === "error"
                          ? "rgba(244,63,94,0.10)"
                          : "rgba(248,113,113,0.08)",
                      color:
                        status.state === "success"
                          ? "rgba(167,243,208,0.95)"
                          : status.state === "error"
                          ? "rgba(254,205,211,0.95)"
                          : "rgba(254,226,226,0.9)",
                      textShadow: "0 0 10px rgba(248, 113, 113, 0.25)"
                    }}
                  >
                    {status.message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status.state === "sending"}
                  className={`w-full mt-2 py-3 rounded-full cursor-pointer bg-gradient-to-r from-rose-500 to-red-500 text-black font-heading text-sm tracking-wide font-semibold shadow-lg hover:from-rose-400 hover:to-red-400 transition-all duration-300 ${
                    status.state === "sending" ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                  style={{
                    boxShadow: '0 0 22px rgba(248, 113, 113, 0.8)',
                  }}
                >
                  {status.state === "sending" ? "Sending..." : "Send Message"}
                </button>

                <p className="text-[11px] font-body text-rose-200/60 mt-3 text-center">
                  I usually respond within 24–48 hours. If it&apos;s time-sensitive, mention
                  your deadline in the message.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Contact;
