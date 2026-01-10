import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { Link } from 'react-router-dom';

const Beyond = () => {
  const waterContainerRef = useRef(null);
  const gemContainerRef = useRef(null);
  const [selectedInterest, setSelectedInterest] = useState(null);
  const [showResume, setShowResume] = useState(false);
  const isGemHovered = useRef(false);

  // Underwater shader effect - Yellow theme
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

  // 3D Spinning Yellow Diamond
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
      color: 0xffdd00,
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

    material.emissive = new THREE.Color(0xffdd00);
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

    const pointLight1 = new THREE.PointLight(0xffdd55, 2);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xffaa33, 1.5);
    pointLight2.position.set(-5, -5, 5);
    scene.add(pointLight2);

    camera.position.z = 5;

    const baseRotation = { x: 0.008, y: 0.015, z: 0.01 };
    const hoverSpeedMultiplier = 3.0;
    const normalColor = new THREE.Color(0xffdd00);
    const hoverColor = new THREE.Color(0xfff199);

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

  const interests = [
    {
      id: 1,
      icon: '⚽',
      title: 'Football (Soccer)',
      subtitle: 'Real Madrid Fan',
      description: 'Passionate about the beautiful game, following Real Madrid through every season with unwavering dedication.',
      details: [
        'Lifelong Los Blancos supporter',
        'Follow La Liga and Champions League religiously',
        'Appreciate the artistry and strategy of the sport',
        'Connect soccer\'s rhythm to my creative process',
        'The global reach of football inspires my worldview and linguistic goals'
      ],
      quote: '"Football is more than a sport—it\'s poetry in motion."'
    },
    {
      id: 2,
      icon: '🏀',
      title: 'Basketball',
      subtitle: 'New York Knicks Devotee',
      description: 'Die-hard Knicks fan who bleeds orange and blue, living and breathing every game at the Garden.',
      details: [
        'Season ticket holder mentality',
        'Through thick and thin at Madison Square Garden',
        'Appreciation for the grit and hustle of NYC basketball',
        'The energy of the game fuels my creative drive',
        'Bronx and Mount Vernon native with deep NY roots'
      ],
      quote: '"Once a Knick, always a Knick. That\'s the New York way."'
    },
    {
      id: 3,
      icon: '🎸',
      title: 'Music',
      subtitle: 'Vocalist, Producer & Guitarist',
      description: 'Multi-instrumentalist and producer who lives and breathes music across every creative dimension.',
      details: [
        'Singer-songwriter crafting original compositions',
        'Music producer blending genres and sounds',
        'Guitarist exploring melody and rhythm',
        'Teacher sharing my passion with students',  
      ],
      quote: '"Music is the underwater current that connects all my work."'
    },
    {
      id: 4,
      icon: '🎬',
      title: 'Film & Television',
      subtitle: 'Creator & Cinephile',
      description: 'Obsessed with visual storytelling—from creating compelling content to analyzing cinematic masterpieces.',
      details: [
        'Avid consumer of film and television',
        'Study cinematography and narrative structure',
        'Create content that pushes creative boundaries',
        'Inspired by directors who take bold risks'
      ],
      quote: '"Every frame is a choice, every choice tells a story."'
    }
  ];

  const resumeData = {
    experience: [
      {
        title: 'Creative Technologist',
        company: 'Eternity Solutions',
        period: '2023 - Present',
        achievements: [
          'Crafted compelling narratives through strategic shot sequencing, dynamic pacing, and cohesive integration of visual and audio elements',
          'Enhanced production value by incorporating motion graphics, visual effects, and animation to create polished, professional final products',
          'Consulted with clients on video content strategy, offering data-driven recommendations on creation and distribution best practices aligned with current industry trends',
        ]
      },
      {
        title: 'Freelance Video Editor ',
        company: 'Various Productions',
        period: '2022 - Present',
        achievements: [
          'Edited 150+ saas, commercial and documentary projects',
          'Optimized video files for different platforms (e.g., YouTube, Instagram) by adjusting resolution, aspect ratio, file size/compression without compromising quality',
          'Edited and produced high-quality videos for various clients, including commercials, promotional videos, and social media content',
          'Collaborated with international production teams',
        ]
      },
       {
        title: 'Guitar & Vocal Instructor',
        company: 'School of Rock',
        period: '2022 - 2023',
        achievements: [
          'Provided guitar and vocal lessons to students of all ages and skill levels, tailoring instruction to meet individual needs and goals',
          'Utilized a variety of teaching methods including demonstrations, exercises, and interactive activities to engage students in the learning process',
          'Prepared students for performances by coaching them on stage presence, ensemble playing, and overcoming performance anxiety',
          'Led group rehearsals and incorporated technology into lessons by utilizing online resources for sheet music, backing tracks etc'
        ]
      },
      {
        title: 'Lead Photographer',
        company: 'Lifetouch',
        period: '2017 - 2020',
        achievements: [
          'Managed technical setup and breakdown of production equipment including tripods, backdrops, and professional lighting systems for diverse shoot requirements',
          'Optimized lighting conditions using reflectors, diffusers, and artificial flash attachments to achieve consistent, high-quality results across varied environments',
          'Maintained current expertise in industry best practices, emerging trends, and cutting-edge photography/videography technologies to deliver modern, competitive work',
          'Delivered exceptional client service resulting in high satisfaction rates, repeat business, and a strong referral network'
        ]
      },
     
      
    ],
    skills: {
      'Creative': ['Video Editing', 'Color Grading', 'Creative Direction', 'Storytelling', 'Web Development', '3D Modeling'],
      'Music': ['Vocals', 'Guitar', 'Music Production', 'Tenor Sax', 'Composition'],
      'Technical': ['Premiere Pro', 'DaVinci Resolve', 'Final Cut Pro', 'Blender', 'Afdobe Creative Suite'],
      'Soft Skills': ['Project Management', 'Collaboration', 'Problem Solving', 'Time Management', 'Communication']
    },
    education: [
      {
        degree: 'Bachelor of Arts in New Media Production',
        school: 'Concordia College',
        year: '2015-2019',
      },
      {
        degree: 'CAPM Certification',
        school: 'PMI Institute',
        year: '2022',
      }
    ]
  };
const DeckCard = ({
  children,
  index,
  isOpen,
  onToggle,
}) => {
  // Offsets for stacked state
  const stacked = [
    { x: 0,  y: 0,  r: -2, s: 1.00, z: 40 },
    { x: 10, y: 6,  r:  2, s: 0.99, z: 30 },
    { x: 20, y: 12, r: -1, s: 0.98, z: 20 },
    { x: 30, y: 18, r:  3, s: 0.97, z: 10 },
  ];

  // Offsets for fanned (open) state
  const fanned = [
    { x: -70, y: 0,  r: -10, s: 1.00, z: 40 },
    { x: -20, y: -8, r:  -4, s: 1.00, z: 30 },
    { x:  30, y: -8, r:   4, s: 1.00, z: 20 },
    { x:  80, y: 0,  r:  10, s: 1.00, z: 10 },
  ];

  const t = isOpen ? fanned[index] : stacked[index];

  return (
    <button
      type="button"
      onClick={onToggle}
      className="absolute inset-0 w-full h-full text-left rounded-2xl border border-yellow-500/25 bg-gradient-to-br from-yellow-900/15 to-amber-950/20 backdrop-blur-sm overflow-hidden
                 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300/70"
      style={{
        transform: `translate(${t.x}px, ${t.y}px) rotate(${t.r}deg) scale(${t.s})`,
        transition: 'transform 650ms cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 650ms',
        zIndex: t.z,
        boxShadow: isOpen
          ? '0 0 40px rgba(255, 220, 0, 0.18)'
          : '0 0 22px rgba(255, 220, 0, 0.10)',
      }}
    >
      {/* subtle sheen */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500"
           style={{ opacity: isOpen ? 1 : 0 }}>
        <div className="absolute -inset-20 bg-[radial-gradient(circle_at_30%_20%,rgba(255,220,0,0.18),transparent_55%)]" />
      </div>

      {children}
    </button>
  );
};

const InterestDeck = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="relative mx-auto"
      style={{
        width: 'min(720px, 92vw)',
        height: '520px', // controls the deck height
      }}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* base shadow plate */}
      <div className="absolute inset-0 rounded-3xl bg-black/10 border border-yellow-500/10" />

      {/* 4 cards */}
      {[0, 1, 2, 3].map((i) => (
        <DeckCard
          key={i}
          index={i}
          isOpen={isOpen}
          onToggle={() => setIsOpen((v) => !v)}
        >
          {children(i)}
        </DeckCard>
      ))}
    </div>
  );
};

  return (
    <div className="relative min-h-screen bg-black">
      <div ref={waterContainerRef} className="fixed inset-0 z-0" />

      <div className="relative z-10 pt-24 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 mb-20">
            <div className="flex-1">
              <h1 
                className="text-6xl md:text-7xl font-bold mb-6 mt-20 font-heading text-transparent  text-shadow-yellow-500 text-shadow-2xl bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500"
                style={{ 
                  textShadow: '0 0 30px rgba(255, 220, 0, 0.6)',
                  filter: 'drop-shadow(0 0 15px rgba(255, 220, 0, 0.8))'
                }}
              >
                BEYOND THE WORK
              </h1>
              <p className="text-xl text-amber-100/80 mb-4 font-body leading-relaxed"
                 style={{ textShadow: '0 0 10px rgba(255, 220, 0, 0.3)' }}>
                I'm Corey G. Marsh—a <span className='font-bold text-shadow-amber-300 italic'>creative</span> who finds inspiration in the rhythm of soccer, 
                the energy of basketball, the soul of music, and the magic of cinema.
              </p>
              <p className="text-lg text-amber-100/70 mb-8 font-body leading-relaxed"
                 style={{ textShadow: '0 0 10px rgba(255, 220, 0, 0.3)' }}>
                These passions aren't separate from my work—they fuel it. Every project I create 
                carries the intensity of a Knicks game, the precision of a Real Madrid counter-attack, 
                and the emotional depth of a perfectly produced track.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => setShowResume(!showResume)}
                  className="px-8 py-3 bg-gradient-to-r cursor-pointer from-yellow-500 to-amber-500 text-black font-body font-bold rounded-full hover:from-yellow-400 hover:to-amber-400 transition-all duration-300 shadow-lg"
                  style={{ boxShadow: '0 0 20px rgba(255, 220, 0, 0.5)' }}
                >
                  {showResume ? 'Hide Resume' : 'View Resume'}
                </button>
                <button className="px-8 py-3 border-2 cursor-pointer font-body border-yellow-500/50 text-yellow-300 font-bold rounded-full hover:border-yellow-400 hover:bg-yellow-500/10 transition-all duration-300">
                  Get in Touch
                </button>
              </div>
            </div>

            {/* 3D Spinning Diamond */}
            <div className="flex-shrink-0">
              <div 
                className="relative"
                style={{ 
                  filter: 'drop-shadow(0 0 30px rgba(255, 220, 0, 0.6))'
                }}
                onMouseEnter={() => { isGemHovered.current = true; }}
                onMouseLeave={() => { isGemHovered.current = false; }}
              >
                <div ref={gemContainerRef} className="w-[400px] h-[400px]" />
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 blur-3xl animate-pulse" />
                </div>
              </div>
            </div>
          </div>
          

          {/* Interests Grid — upgraded (BeyondTheWork expanded look) */}
<div className="mb-20">
  <style>{`
    @keyframes float-card {
      0%, 100% { transform: translateY(0px) rotateY(0deg); }
      50% { transform: translateY(-18px) rotateY(2.5deg); }
    }

    @keyframes shimmer-gold {
      0% { background-position: -1000px 0; }
      100% { background-position: 1000px 0; }
    }

    @keyframes scan {
      0% { transform: translateY(-120%); opacity: 0; }
      15% { opacity: .35; }
      55% { opacity: .22; }
      100% { transform: translateY(140%); opacity: 0; }
    }

    .hide-scrollbar::-webkit-scrollbar { display: none; }
    .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

    .card-3d {
      perspective: 1400px;
      transform-style: preserve-3d;
    }

    .card-inner {
      transform-style: preserve-3d;
      transition: transform 0.7s cubic-bezier(0.23, 1, 0.32, 1),
                  border-color 0.25s ease,
                  box-shadow 0.5s ease;
    }

    .card-3d:hover .card-inner {
      transform: rotateY(6deg) rotateX(-4deg) translateZ(18px);
    }

    .hologram-border { position: relative; }
    .hologram-border::before {
      content: '';
      position: absolute;
      inset: -2px;
      border-radius: 24px;
      background: linear-gradient(45deg,
        transparent 30%,
        rgba(255, 215, 0, 0.35) 50%,
        transparent 70%
      );
      opacity: 0;
      transition: opacity 0.3s;
      pointer-events: none;
      filter: blur(0.2px);
    }
    .card-3d:hover .hologram-border::before {
      opacity: 1;
      animation: shimmer-gold 2.2s linear infinite;
      background-size: 240% 100%;
    }

    .shimmer-overlay {
      background: linear-gradient(
        90deg,
        transparent 0%,
        rgba(255, 215, 0, 0.25) 50%,
        transparent 100%
      );
      background-size: 220% 100%;
      animation: shimmer-gold 3.2s infinite;
    }
  `}</style>

  {/* subtle rail glow behind the grid (keeps your background) */}
  <div className="relative">
    <div className="absolute inset-0 -z-10">
      <div className="mx-auto w-[92%] h-full rounded-3xl bg-yellow-500/5 blur-3xl" />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-body">
      {interests.map((interest, idx) => {
        const isOpen = selectedInterest === interest.id;

        return (
          <div
            key={interest.id}
            className="card-3d"
            style={{
              animation: `float-card ${6 + idx * 0.45}s ease-in-out infinite`,
              animationDelay: `${idx * -1.25}s`,
            }}
            onMouseEnter={() => {}}
            onMouseLeave={() => {}}
          >
            <button
              type="button"
              onClick={() =>
                setSelectedInterest(isOpen ? null : interest.id)
              }
              className="card-inner hologram-border relative w-full text-left rounded-3xl overflow-hidden border backdrop-blur-md cursor-pointer"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255, 215, 0, 0.14) 0%, rgba(255, 140, 0, 0.10) 100%)",
                borderColor: isOpen
                  ? "rgba(255, 215, 0, 0.75)"
                  : "rgba(255, 215, 0, 0.32)",
                boxShadow: isOpen
                  ? "0 15px 70px rgba(255, 215, 0, 0.25), 0 0 140px rgba(255, 215, 0, 0.18), inset 0 0 40px rgba(255, 215, 0, 0.10)"
                  : "0 10px 45px rgba(255, 215, 0, 0.14), 0 0 90px rgba(255, 215, 0, 0.10), inset 0 0 28px rgba(255, 215, 0, 0.07)",
                transition: "all 400ms ease",
              }}
            >
              {/* gradients to match BeyondTheWork vibe */}
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-900/45 via-black/70 to-amber-900/55" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

              {/* shimmer on hover / open */}
              {(isOpen) && (
                <div className="absolute inset-0 shimmer-overlay pointer-events-none opacity-70" />
              )}

              {/* scan line on open */}
              {isOpen && (
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    height: "100%",
                  }}
                >
                  <div
                    className="absolute inset-x-0 h-1 bg-gradient-to-b from-transparent via-yellow-400/30 to-transparent"
                    style={{ animation: "scan 4.2s ease-in-out infinite" }}
                  />
                </div>
              )}

              {/* content */}
              <div className="relative p-8">
                {/* top row */}
                <div className="flex items-center justify-between mb-5">
                  <span className="px-4 py-1.5 rounded-full text-xs font-bold text-black bg-gradient-to-r from-yellow-400 to-amber-400 shadow-lg shadow-yellow-500/40">
                    INTEREST
                  </span>

                  <div className="flex items-center gap-3">
                    <div
                      className="text-4xl"
                      style={{
                        filter:
                          "drop-shadow(0 0 12px rgba(255, 215, 0, 0.8))",
                        transform: isOpen ? "scale(1.15) rotate(8deg)" : "scale(1)",
                        transition: "transform 350ms ease",
                      }}
                    >
                      {/* {interest.icon} */}
                    </div>

                    {/* expand chevron */}
                    <div className="text-yellow-300/70">
                      <span
                        className="inline-block text-2xl"
                        style={{
                          transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                          transition: "transform 400ms ease",
                        }}
                      >
                        ↓
                      </span>
                    </div>
                  </div>
                </div>

                <h3
                  className="text-3xl md:text-4xl font-bold text-white mb-1 uppercase font-heading italic"
                  style={{
                    textShadow: isOpen
                      ? "0 0 30px rgba(255, 215, 0, 0.75), 0 4px 20px rgba(0,0,0,0.95)"
                      : "0 4px 16px rgba(0,0,0,0.95)",
                  }}
                >
                  {interest.title}
                </h3>

                <p className="text-yellow-300/85 text-sm font-semibold mb-4">
                  {interest.subtitle}
                </p>

                <p className="text-amber-100/85 leading-relaxed mb-5">
                  {interest.description}
                </p>

                {/* expandable details (your same content) */}
                <div
                  className="transition-all duration-500"
                  style={{
                    maxHeight: isOpen ? 420 : 0,
                    opacity: isOpen ? 1 : 0,
                    overflow: "hidden",
                  }}
                >
                  <div className="border-t border-yellow-500/25 pt-5">
                    <ul className="space-y-2 mb-5">
                      {interest.details.map((detail, i) => (
                        <li
                          key={i}
                          className="text-sm text-amber-100/75 flex items-start gap-2"
                        >
                          <span className="text-yellow-300 mt-1">✦</span>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="bg-yellow-500/10 border-l-4 border-yellow-400 p-4 rounded-lg">
                      <p className="text-yellow-200/90 italic text-sm">
                        {interest.quote}
                      </p>
                    </div>

                    <div className="mt-5 inline-flex items-center gap-2 text-yellow-300 font-semibold text-sm">
                      Close Details
                      <span className="opacity-80">→</span>
                    </div>
                  </div>
                </div>

                {/* tech corner brackets (BeyondTheWork style) */}
                <div
                  className="absolute top-4 right-4 w-16 h-16 border-t-2 border-r-2 border-yellow-400/55 rounded-tr-2xl"
                  style={{ opacity: isOpen ? 1 : 0.45, transition: "opacity 300ms" }}
                />
                <div
                  className="absolute bottom-4 left-4 w-16 h-16 border-b-2 border-l-2 border-yellow-400/55 rounded-bl-2xl"
                  style={{ opacity: isOpen ? 1 : 0.45, transition: "opacity 300ms" }}
                />
                <div className="absolute top-4 left-4 w-3 h-3 border-t-2 border-l-2 border-yellow-400/80" />
                <div className="absolute bottom-4 right-4 w-3 h-3 border-b-2 border-r-2 border-yellow-400/80" />
              </div>

              {/* edge glow on open */}
              {isOpen && (
                <div className="absolute inset-0 border-2 border-yellow-400/40 rounded-3xl pointer-events-none" />
              )}
            </button>
          </div>
        );
      })}
    </div>
  </div>
</div>

{/* Resume Section */}
<div
  className={`transition-all duration-700 ${
    showResume ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"
  }`}
>
  <div className="relative rounded-3xl border font-body border-white/10 bg-black/35 backdrop-blur-xl p-8 md:p-12 overflow-hidden">
    {/* ======= Underwater Jewel Backdrop ======= */}
    {/* intense prismatic blobs with layered glows */}
    <div className="absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full bg-cyan-400/40 blur-[80px] animate-pulse" style={{animationDuration: '4s'}} />
    <div className="absolute -top-16 -left-16 w-[320px] h-[320px] rounded-full bg-cyan-300/30 blur-[60px]" />
    <div className="absolute top-10 -right-32 w-[520px] h-[520px] rounded-full bg-red-500/35 blur-[100px] animate-pulse" style={{animationDuration: '5s'}} />
    <div className="absolute top-16 -right-24 w-[400px] h-[400px] rounded-full bg-red-400/25 blur-[80px]" />
    <div className="absolute -bottom-32 left-1/3 w-[520px] h-[520px] rounded-full bg-amber-400/35 blur-[100px] animate-pulse" style={{animationDuration: '6s'}} />
    <div className="absolute -bottom-24 left-1/4 w-[420px] h-[420px] rounded-full bg-yellow-300/25 blur-[85px]" />
    <div className="absolute bottom-10 -left-32 w-[520px] h-[520px] rounded-full bg-rose-500/30 blur-[110px] animate-pulse" style={{animationDuration: '5.5s'}} />
    <div className="absolute bottom-16 -left-20 w-[380px] h-[380px] rounded-full bg-pink-400/20 blur-[75px]" />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-teal-400/15 blur-[120px]" />
    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />

    {/* intense prismatic border glow with multiple layers */}
    <div
      className="absolute inset-0 rounded-3xl pointer-events-none animate-pulse"
      style={{
        boxShadow:
          "inset 0 0 100px rgba(255,255,0,0.15), inset 0 0 150px rgba(168,85,247,0.18), inset 0 0 80px rgba(250,204,21,0.15), 0 0 80px rgba(34,211,238,0.20), 0 0 100px rgba(244,63,94,0.12)",
        animationDuration: '3s'
      }}
    />
    <div
      className="absolute inset-0 rounded-3xl pointer-events-none"
      style={{
        boxShadow:
          "inset 0 0 60px rgba(20,184,166,0.18), 0 0 60px rgba(168,85,247,0.15), 0 0 40px rgba(250,204,21,0.12)",
      }}
    />

    {/* enhanced grid shimmer with color */}
    <div
      className="absolute inset-0 opacity-35 pointer-events-none"
      style={{
        backgroundImage:
          "linear-gradient(rgba(34,211,238,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.10) 1px, transparent 1px)",
        backgroundSize: "46px 46px",
        maskImage: "radial-gradient(circle at 50% 20%, black 40%, transparent 75%)",
        WebkitMaskImage:
          "radial-gradient(circle at 50% 20%, black 40%, transparent 75%)",
      }}
    />

    {/* enhanced "gem dust" particles with more variety and glow */}
    <div className="absolute inset-0 pointer-events-none opacity-85">
      {[...Array(35)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: i % 7 === 0 ? '6px' : i % 7 === 1 ? '4px' : '2px',
            height: i % 7 === 0 ? '6px' : i % 7 === 1 ? '4px' : '2px',
            background:
              i % 6 === 0
                ? "rgba(34,211,238,0.75)" // cyan
                : i % 6 === 1
                ? "rgba(20,184,166,0.65)" // teal
                : i % 6 === 2
                ? "rgba(250,204,21,0.70)" // yellow
                : i % 6 === 3
                ? "rgba(244,63,94,0.60)" // rose
                : i % 6 === 4
                ? "rgba(168,85,247,0.65)" // purple
                : "rgba(236,72,153,0.60)", // pink
            boxShadow:
              i % 6 === 0
                ? "0 0 20px rgba(34,211,238,0.70), 0 0 30px rgba(34,211,238,0.40)"
                : i % 6 === 1
                ? "0 0 20px rgba(20,184,166,0.60), 0 0 28px rgba(20,184,166,0.35)"
                : i % 6 === 2
                ? "0 0 22px rgba(250,204,21,0.65), 0 0 32px rgba(250,204,21,0.35)"
                : i % 6 === 3
                ? "0 0 18px rgba(244,63,94,0.55), 0 0 26px rgba(244,63,94,0.30)"
                : i % 6 === 4
                ? "0 0 20px rgba(168,85,247,0.60), 0 0 30px rgba(168,85,247,0.35)"
                : "0 0 18px rgba(236,72,153,0.55), 0 0 28px rgba(236,72,153,0.32)",
            animation: i % 3 === 0 ? 'pulse 3s infinite' : i % 3 === 1 ? 'pulse 4s infinite' : 'pulse 5s infinite',
          }}
        />
      ))}
    </div>

    {/* floating jewel shards */}
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: `${15 + i * 12}%`,
            top: `${10 + (i % 3) * 30}%`,
            width: '16px',
            height: '16px',
            background: i % 4 === 0 
              ? 'linear-gradient(135deg, rgba(34,211,238,0.35), rgba(168,85,247,0.25))'
              : i % 4 === 1
              ? 'linear-gradient(135deg, rgba(250,204,21,0.35), rgba(244,63,94,0.25))'
              : i % 4 === 2
              ? 'linear-gradient(135deg, rgba(20,184,166,0.35), rgba(34,211,238,0.25))'
              : 'linear-gradient(135deg, rgba(168,85,247,0.35), rgba(236,72,153,0.25))',
            transform: 'rotate(45deg)',
            boxShadow: i % 4 === 0
              ? '0 0 25px rgba(34,211,238,0.40), 0 0 40px rgba(168,85,247,0.25)'
              : i % 4 === 1
              ? '0 0 25px rgba(250,204,21,0.40), 0 0 40px rgba(244,63,94,0.25)'
              : i % 4 === 2
              ? '0 0 25px rgba(20,184,166,0.40), 0 0 40px rgba(34,211,238,0.25)'
              : '0 0 25px rgba(168,85,247,0.40), 0 0 40px rgba(236,72,153,0.25)',
            animation: `pulse ${3 + (i % 3)}s infinite`,
            opacity: 0.6,
          }}
        />
      ))}
    </div>

    {/* ======= Title ======= */}
    <div className="relative z-10 text-center mb-12">
      <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
  <span className="w-2.5 h-2.5 rotate-45 bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.55)]" />
  <span className="w-2.5 h-2.5 rotate-45 bg-green-300 shadow-[0_0_20px_rgba(20,184,166,0.5)]" />
  <span className="w-2.5 h-2.5 rotate-45 bg-rose-400 shadow-[0_0_18px_rgba(244,63,94,0.4)]" />
  <span className="w-2.5 h-2.5 rotate-45 bg-yellow-300 shadow-[0_0_18px_rgba(250,204,21,0.4)]" />
  <span className="w-2.5 h-2.5 rotate-45 bg-fuchsia-400 shadow-[0_0_20px_rgba(168,85,247,0.45)]" />
</div>


      <h2
        className="mt-6 text-5xl md:text-6xl font-bold font-heading text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-teal-200 via-yellow-200 via-rose-300 to-fuchsia-300"
        style={{
          textShadow:
            "0 0 26px rgba(34,211,238,0.18), 0 0 30px rgba(168,85,247,0.12)",
          filter: "drop-shadow(0 0 18px rgba(34,211,238,0.12))",
        }}
      >
        RESUME
      </h2>

      <p className="mt-4 text-white/70 font-body max-w-2xl mx-auto">
        A prismatic snapshot of my experience, skills, and education — engineered for clarity, story themed like deep-sea jewels.
      </p>
    </div>

    {/* ======= Sections Wrapper ======= */}
    <div className="relative z-10 space-y-12">
      {/* Experience */}
      <section className="rounded-2xl border border-white/10 bg-white/5 p-7 md:p-8 backdrop-blur-sm">
        <div className="flex items-center gap-4 mb-7">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400/25 to-fuchsia-400/20 border border-white/10 flex items-center justify-center">
            <span className="text-xl">💼</span>
          </div>
          <h3 className="text-2xl md:text-3xl text-amber-300 font-bold font-heading uppercase tracking-widest">
            Experience
          </h3>
          <div className="ml-auto h-[2px] flex-1 max-w-[200px] bg-gradient-to-r from-cyan-300/50 via-yellow-200/30 to-fuchsia-300/40 rounded-full" />
        </div>

        <div className="space-y-8">
          {resumeData.experience.map((job, index) => (
            <div
              key={index}
              className="relative pl-6 border-l-2 border-white/10"
            >
              {/* gem "pin" */}
              <div className="absolute left-0 top-1.5 -translate-x-1/2 w-3 h-3 rotate-45 bg-gradient-to-br from-cyan-300 to-fuchsia-300 shadow-[0_0_18px_rgba(34,211,238,0.25)]" />

              <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2">
                <h4 className="text-xl md:text-2xl font-bold text-white">
                  {job.title}
                </h4>
                <p className="text-white/60 text-sm">{job.period}</p>
              </div>

              <p className="text-cyan-200/70 mb-3">{job.company}</p>

              <ul className="space-y-2">
                {job.achievements.map((achievement, i) => (
                  <li key={i} className="text-white/75 flex items-start gap-3">
                    <span className="mt-1 text-cyan-300">✦</span>
                    <span>{achievement}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section className="rounded-2xl border border-white/10 bg-white/5 p-7 md:p-8 backdrop-blur-sm">
        <div className="flex items-center gap-4 mb-7">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-300/25 to-pink-400/20 border border-white/10 flex items-center justify-center">
            <span className="text-xl">⚡</span>
          </div>
          <h3 className="text-2xl md:text-3xl font-bold font-heading text-amber-300 uppercase tracking-wide">
            Skills
          </h3>
          <div className="ml-auto h-[2px] flex-1 max-w-[200px] bg-gradient-to-r from-yellow-200/40 via-rose-300/30 to-red-300/35 rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(resumeData.skills).map(([category, skills]) => (
            <div
              key={category}
              className="rounded-2xl border border-white/10 bg-black/25 p-6"
              style={{
                boxShadow:
                  "inset 0 0 40px rgba(34,211,238,0.06), inset 0 0 60px rgba(168,85,247,0.04)",
              }}
            >
              <h4 className="text-lg font-bold text-white mb-3">
                {category}
              </h4>

              <div className="flex flex-wrap gap-2">
                {skills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 text-sm rounded-full border border-white/10 bg-white/5 text-white/80"
                    style={{
                      boxShadow:
                        "0 0 16px rgba(34,211,238,0.06), 0 0 16px rgba(250,204,21,0.04), 0 0 16px rgba(168,85,247,0.05)",
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Education */}
      <section className="rounded-2xl border border-white/10 bg-white/5 p-7 md:p-8 backdrop-blur-sm">
        <div className="flex items-center gap-4 mb-7">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-300/25 to-cyan-300/20 border border-white/10 flex items-center justify-center">
            <span className="text-xl">🎓</span>
          </div>
          <h3 className="text-2xl md:text-3xl font-bold font-heading text-amber-300 uppercase tracking-wide">
            Education
          </h3>
          <div className="ml-auto h-[2px] flex-1 max-w-[200px] bg-gradient-to-r from-teal-200/40 via-cyan-200/30 to-yellow-200/25 rounded-full" />
        </div>

        <div className="space-y-6">
          {resumeData.education.map((edu, index) => (
            <div key={index} className="relative pl-6 border-l-2 border-white/10">
              <div className="absolute left-0 top-2 -translate-x-1/2 w-3 h-3 rotate-45 bg-gradient-to-br from-teal-200 to-yellow-200 shadow-[0_0_18px_rgba(20,184,166,0.22)]" />

              <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2">
                <h4 className="text-xl md:text-2xl font-bold text-white">
                  {edu.degree}
                </h4>
                <p className="text-white/60 text-sm">{edu.year}</p>
              </div>

              <p className="text-teal-200/70 mb-1">{edu.school}</p>
              <p className="text-white/60 text-sm">{edu.honors}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Download Button */}
<div className="pt-4 text-center">
  <button
    type="button"
    onClick={async () => {
      try {
        const response = await fetch("/Resume_2026.pdf");
        const blob = await response.blob();

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = "Resume_2026.pdf";
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (err) {
        console.error("Resume download failed", err);
      }
    }}
    className="px-10 py-4 rounded-full font-bold font-body text-black 
               bg-gradient-to-r from-cyan-300 via-green-200 to-teal-300 
               hover:opacity-95 transition-all duration-300"
    style={{
      boxShadow:
        "0 0 30px rgba(34,211,238,0.22), 0 0 30px rgba(250,204,21,0.14), 0 0 30px rgba(168,85,247,0.16)",
    }}
  >
    Download PDF Resume
  </button>

  <div className="mt-3 text-xs text-white/55 font-body">
    Tip: export from your PDF with the same hierarchy you see here (big title → section headers → bullets).
  </div>
</div>

      
    </div>
  </div>
</div>

          {/* Final CTA */}
          <div className="mt-20 text-center">
            <div className="inline-block p-12 bg-gradient-to-br from-amber-900/30 font-body to-yellow-950/30 rounded-2xl border border-yellow-500/30 backdrop-blur-sm">
              <h2 
                className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-400"
                style={{ textShadow: '0 0 20px rgba(255, 220, 0, 0.5)' }}
              >
                Let's Create Something Extraordinary
              </h2>
              <p className="text-amber-100/70 mb-6 max-w-2xl">
                Every passion feeds the work. Every project is intentional. 
                Let's collaborate and bring your vision to life with the same intensity I bring to everything I do.
              </p>
              <Link to="/contact">
  <button
    type="button"
    className="px-10 py-4 bg-gradient-to-r from-yellow-500 to-amber-500 
               cursor-pointer text-black text-lg font-bold rounded-full 
               hover:from-yellow-400 hover:to-amber-400 
               transition-all duration-300 shadow-lg"
    style={{ boxShadow: "0 0 30px rgba(255, 220, 0, 0.5)" }}
  >
    Start a Conversation
  </button>
</Link>
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

export default Beyond;