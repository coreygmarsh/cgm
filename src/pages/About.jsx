import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

const About = () => {
  const waterContainerRef = useRef(null);
  const gemContainerRef = useRef(null);
  const [activeTab, setActiveTab] = useState('story');
  const isGemHovered = useRef(false);

  const nameParts = ['COREY', 'GEORGE', 'MARSH'];
const [nameIndex, setNameIndex] = useState(0);

useEffect(() => {
  const interval = setInterval(() => {
    setNameIndex((prev) => (prev + 1) % nameParts.length);
  }, 2200); // timing between changes

  return () => clearInterval(interval);
}, []);


  // Underwater shader background (UNCHANGED)
  useEffect(() => {
    if (!waterContainerRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(waterContainerRef.current.clientWidth, waterContainerRef.current.clientHeight);
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
        
        vec3 deepWater = vec3(0.0, 0.15, 0.15);
        vec3 midWater = vec3(0.0, 0.3, 0.28);
        vec3 causticHighlight = vec3(0.2, 0.7, 0.65);
        vec3 shimmerHighlight = vec3(0.3, 0.9, 0.85);
        
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
        resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
      },
      transparent: true,
      blending: THREE.AdditiveBlending
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

  // 3D Spinning Teal Gem (UNCHANGED)
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
      color: 0x00ddcc,
      metalness: 0.3,
      roughness: 0,
      transparent: false,
      opacity: 1,
      reflectivity: 1,
      clearcoat: 1,
      clearcoatRoughness: 0,
      envMapIntensity: 5,
      ior: 2.4
    });

    material.emissive = new THREE.Color(0x00ddcc);
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

    const pointLight1 = new THREE.PointLight(0x00ddcc, 2);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x00ffee, 1.5);
    pointLight2.position.set(-5, -5, 5);
    scene.add(pointLight2);

    camera.position.z = 5;

    const baseRotation = { x: 0.008, y: 0.015, z: 0.01 };
    const hoverSpeedMultiplier = 3.0;
    const normalColor = new THREE.Color(0x00ddcc);
    const hoverColor = new THREE.Color(0x99fff5);

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

  // You can delete the old stories array now — story tab is a biography layout.
  const skills = [
    { name: 'Video Editing', level: 95 },
    { name: 'Music Production', level: 92 },
        { name: 'Graphic Design + Social Media Management', level: 90 },
    { name: 'Storytelling + Film Production', level: 90 },
    { name: 'Web Development', level: 82 },
    { name: '3D Modelling', level: 82 },
    { name: 'Photography', level: 80 },
       { name: 'Project Management', level: 80 },
  ];

  const timeline = [
    { year: '2025', event: 'Author, Blogger and Corporate Content Creation' },
    { year: '2024', event: 'Launched CGM Creative Services' },
    { year: '2022', event: 'Teaching and Mentoring' },
    { year: '2021', event: 'Started freelance Video Editing and Graphic Design career' },
    { year: '2019', event: 'Completed New Media Communications degree' }
  ];

  return (
    <div className="relative min-h-screen bg-black">
      {/* Underwater shader background */}
      <div ref={waterContainerRef} className="fixed inset-0 z-0" />

      {/* Content */}
      <div className="relative z-10 pt-24 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section with 3D Gem */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 mb-20">
            <div className="flex-1">
              <h1
                className="text-6xl md:text-7xl font-bold mb-6 text-transparent font-heading   bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-300 to-emerald-400"
                style={{
                  textShadow: '0 0 30px rgba(0, 220, 200, 0.6)',
                  filter: 'drop-shadow(0 0 15px rgba(0, 220, 200, 0.8))'
                }}
              >
                ABOUT ME
              </h1>
              <p
                className="text-xl font-body text-teal-100/80 mb-8 leading-relaxed"
                style={{ textShadow: '0 0 10px rgba(0, 220, 200, 0.3)' }}
              >
                Exploring the depths of creativity through articles, tutorials, and behind-the-scenes insights.
                Discover the stories, philosophy, and experiences that shape my work as a creative artist and technologist.
              </p>

              {/* Tab Navigation */}
              <div className="flex flex-wrap gap-3 font-body">
                {['story', 'skills', 'timeline'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-2 rounded-full cursor-pointer font-medium transition-all duration-300 ${
                      activeTab === tab
                        ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-black shadow-lg'
                        : 'bg-teal-900/30 text-teal-300 border border-teal-500/30 hover:border-teal-400/60'
                    }`}
                    style={activeTab === tab ? { boxShadow: '0 0 20px rgba(0, 220, 200, 0.5)' } : {}}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* 3D Spinning Gem */}
            <div className="flex-shrink-0">
              <div
                className="relative"
                style={{
                  filter: 'drop-shadow(0 0 40px rgba(0, 220, 200, 0.8))'
                }}
                onMouseEnter={() => {
                  isGemHovered.current = true;
                }}
                onMouseLeave={() => {
                  isGemHovered.current = false;
                }}
              >
                <div ref={gemContainerRef} className="w-[400px] h-[400px]" />
                <div className="absolute inset-0 pointer-events-none">
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-teal-500/30 to-cyan-500/30 blur-3xl animate-pulse"
                    style={{ animationDuration: '3s' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Dynamic Content Based on Active Tab */}
          {activeTab === 'story' && (
            <div className="max-w-6xl mx-auto font-body">
              <div className="relative p-8 md:p-10 bg-gradient-to-br from-teal-900/25 to-cyan-950/25 rounded-2xl border border-teal-500/25 backdrop-blur-sm overflow-hidden">
                <div className="absolute -inset-32 bg-gradient-to-r from-teal-500/10 via-cyan-500/10 to-emerald-500/10 blur-3xl pointer-events-none" />

                <div className="relative grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-10 items-start">
                  {/* LEFT */}
                  <div className="relative">
                    <div
                      className="rounded-2xl border-2 border-teal-400/90 bg-black/20 overflow-hidden"
                      style={{ boxShadow: '0 0 35px rgba(0, 220, 200, 0.25)' }}
                    >
                      <div className="aspect-[4/5] w-full">
                        <img
  src="/images/coreyportrait.JPG"
  alt="Portrait of Corey Marsh"
  className="w-full h-full object-cover object-[75%_50%]"
  loading="lazy"
/>

                      </div>

                      <div className="p-5 border-t border-teal-400/20 bg-gradient-to-r from-teal-950/40 to-cyan-950/30">
                        <p className="text-sm text-center text-teal-300/70">
                          Creative Technologist • Video Editor • Musician
                        </p>
                        <h2
                          className="text-2xl text-center font-body font-bold text-teal-100 mt-1"
                          style={{ textShadow: '0 0 14px rgba(0, 220, 200, 0.35)' }}
                        >
                          COREY G. MARSH
                        </h2>
                      </div>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                      {[
                        { label: 'Focus', value: 'Video + Web' },
                        { label: 'Style', value: 'Underwater / Glow' },
                        { label: 'Tools', value: 'Adobe + Three.js' },
                        { label: 'Based', value: 'Boston / Quincy' }
                      ].map((item) => (
                        <div
                          key={item.label}
                          className="p-4 rounded-xl border border-teal-500/20 bg-teal-950/20"
                        >
                          <p className="text-xs text-teal-300/60">{item.label}</p>
                          <p className="text-sm text-teal-100 mt-1">{item.value}</p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-5 flex flex-wrap gap-3">
                      <a
                        href="https://www.linkedin.com/in/corey-marsh-02765732a/" // <-- UPDATE
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 rounded-full text-sm font-semibold bg-teal-900/30 text-teal-200 border border-teal-400/30 hover:border-teal-300/70 transition"
                        style={{ boxShadow: '0 0 14px rgba(0, 220, 200, 0.18)' }}
                      >
                        LinkedIn
                      </a>
                      <a
                        href="https://www.instagram.com/reykoning/" // <-- UPDATE
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 rounded-full text-sm font-semibold bg-teal-900/30 text-teal-200 border border-teal-400/30 hover:border-teal-300/70 transition"
                      >
                        Instagram
                      </a>
                      <a
                        href="/contact"
                        className="px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-teal-400 to-cyan-400 text-black hover:brightness-110 transition"
                        style={{ boxShadow: '0 0 18px rgba(0, 220, 200, 0.35)' }}
                      >
                        Let’s work →
                      </a>
                    </div>
                  </div>

                  {/* RIGHT */}
                  <div>
                    <h3
                      className="text-4xl md:text-5xl text-center text-shadow-blue-950/100 font-body tracking-tightest font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-cyan-200 to-emerald-300"
                      style={{ textShadow: '0 0 22px rgba(0, 220, 200, 1.00)' }}
                    >
                      ABOUT{' '}
                      <span className="inline-block min-w-[6ch] transition-opacity duration-700 ease-in-out animate-fadeName">
                          {nameParts[nameIndex]}
                      </span>
                    </h3>

                    <p className="mt-5 text-lg text-teal-100/75 leading-relaxed">
                      I’m Corey — a creative technologist who blends cinematic storytelling with cutting-edge technology.
                      I love creating new visual experiences that
                      make brands feel premium and unforgettable.
                    </p>

                    <p className="mt-4 text-lg text-teal-100/70 leading-relaxed">
                      I work across editing, color, motion, and interactive front-end experiences — turning rough ideas
                      into clean stories and polished deliverables that are ready to ship.
                    </p>

                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { title: 'Video Editing', desc: 'Pacing, storytelling, sound, and clean exports for every platform.' },
                        { title: 'Design + Branding', desc: 'Posters, social assets, and visual systems with premium feel.' },
                        { title: 'Motion + VFX', desc: 'Titles, transitions, glow treatments, compositing, and experienced polish.' },
                        { title: 'Web + 3D', desc: 'React + Three.js experiences that feel like a world, not a page.' }
                      ].map((card) => (
                        <div
                          key={card.title}
                          className="p-6 rounded-2xl border border-teal-500/25 bg-gradient-to-br from-teal-950/30 to-cyan-950/20 hover:border-teal-400/60 transition"
                        >
                          <h4
                            className="text-xl font-bold text-teal-100"
                            style={{ textShadow: '0 0 12px rgba(0, 220, 200, 0.25)' }}
                          >
                            {card.title}
                          </h4>
                          <p className="mt-2 text-sm text-teal-100/60 leading-relaxed">{card.desc}</p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-8">
                      <p className="text-sm text-teal-300/70 mb-3">Tool stack</p>
                      <div className="flex flex-wrap gap-2">
                        {['Premiere Pro', 'After Effects', 'DaVinci Resolve', 'Photoshop', 'React', 'Three.js', 'Tailwind'].map(
                          (tool) => (
                            <span
                              key={tool}
                              className="px-3 py-1 rounded-full text-xs font-semibold text-teal-200 bg-teal-900/20 border border-teal-400/20"
                            >
                              {tool}
                            </span>
                          )
                        )}
                      </div>
                    </div>

                    <div className="mt-10 p-6 rounded-2xl border border-teal-400/25 bg-gradient-to-r from-teal-500/10 to-cyan-500/10">
                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div>
                          <p className="text-teal-100 font-semibold">Want something that embodies your vision?</p>
                          <p className="text-teal-100/60 text-sm mt-1">
                           I’ll help you shape it and ship it, with your story in mind.
                          </p>
                        </div>
                        <a
                          href="/contact"
                          className="px-5 py-3 rounded-full font-bold bg-gradient-to-r from-teal-400 to-cyan-400 text-black hover:brightness-110 transition"
                          style={{ boxShadow: '0 0 22px rgba(0, 220, 200, 0.35)' }}
                        >
                          Contact me
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="max-w-4xl mx-auto">
              <div className="p-12 bg-gradient-to-br from-teal-900/30 to-cyan-950/30 rounded-2xl border border-teal-500/30 backdrop-blur-sm">
                <h2
                  className="text-4xl font-bold mb-8 font-heading uppercase text-center text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400"
                  style={{ textShadow: '0 0 20px rgba(0, 220, 200, 0.5)' }}
                >
                  Technical Expertise
                </h2>
                <div className="space-y-6 font-body">
                  {skills.map((skill, index) => (
                    <div
                      key={skill.name}
                      style={{
                        animation: 'fadeInLeft 0.6s ease-out',
                        animationDelay: `${index * 0.1}s`,
                        animationFillMode: 'backwards'
                      }}
                    >
                      <div className="flex justify-between mb-2">
                        <span className="text-teal-200 font-semibold">{skill.name}</span>
                        <span className="text-teal-400">{skill.level}%</span>
                      </div>
                      <div className="h-3 bg-teal-950/50 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-teal-500 to-cyan-400 rounded-full transition-all duration-1000"
                          style={{
                            width: `${skill.level}%`,
                            boxShadow: '0 0 10px rgba(0, 220, 200, 0.5)'
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="max-w-4xl mx-auto">
              <div className="relative">
                <div
                  className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-teal-500 via-cyan-500 to-teal-500"
                  style={{ boxShadow: '0 0 10px rgba(0, 220, 200, 0.5)' }}
                />

                <div className="space-y-8 font-body">
                  {timeline.map((item, index) => (
                    <div
                      key={item.year}
                      className="relative pl-20"
                      style={{
                        animation: 'fadeInRight 0.6s ease-out',
                        animationDelay: `${index * 0.15}s`,
                        animationFillMode: 'backwards'
                      }}
                    >
                      <div
                        className="absolute left-0 w-16 h-16 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center font-bold text-black text-sm"
                        style={{ boxShadow: '0 0 20px rgba(0, 220, 200, 0.6)' }}
                      >
                        {item.year}
                      </div>

                      <div className="p-6 bg-gradient-to-br from-teal-900/30 to-cyan-950/30 rounded-xl border border-teal-500/30 backdrop-blur-sm hover:border-teal-400/60 transition-all duration-300">
                        <p className="text-teal-100 text-lg">{item.event}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeInRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

export default About;
