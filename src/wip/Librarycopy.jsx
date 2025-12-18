import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

// Article Modal Component
const ArticleModal = ({ article, onClose }) => {
  if (!article) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] bg-gradient-to-br from-emerald-900/95 to-teal-950/95 rounded-2xl border border-emerald-500/30 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-10 w-10 h-10 flex items-center justify-center bg-emerald-500/20 hover:bg-emerald-500/40 rounded-full transition-all duration-300 text-emerald-300 hover:text-emerald-100"
          style={{ textShadow: '0 0 10px rgba(0, 255, 150, 0.5)' }}
        >
          <span className="text-2xl">×</span>
        </button>

        {/* Scrollable content */}
        <div className="overflow-y-auto max-h-[90vh] p-8 md:p-12">
          <div className="mb-6">
            <span className="px-3 py-1 text-xs font-semibold text-emerald-900 bg-emerald-400 rounded-full">
              {article.year}
            </span>
          </div>

          <h2 
            className="text-4xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300"
            style={{ textShadow: '0 0 30px rgba(0, 255, 150, 0.6)' }}
          >
            {article.title}
          </h2>

          <p className="text-emerald-200/80 text-lg mb-8 italic">
            {article.description}
          </p>

          <div className="prose prose-invert prose-emerald max-w-none">
            <div className="text-emerald-100/90 leading-relaxed space-y-4">
              {article.content}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Book Modal Component
const BookModal = ({ book, onClose }) => {
  if (!book) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="relative w-full max-w-5xl max-h-[90vh] bg-gradient-to-br from-emerald-900/95 to-teal-950/95 rounded-2xl border border-emerald-500/30 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-10 w-10 h-10 flex items-center justify-center bg-emerald-500/20 hover:bg-emerald-500/40 rounded-full transition-all duration-300 text-emerald-300 hover:text-emerald-100"
          style={{ textShadow: '0 0 10px rgba(0, 255, 150, 0.5)' }}
        >
          <span className="text-2xl">×</span>
        </button>

        {/* Scrollable content */}
        <div className="overflow-y-auto max-h-[90vh] p-8 md:p-12">
          <div className="mb-6">
            <span className="px-3 py-1 text-xs font-semibold text-emerald-900 bg-emerald-400 rounded-full">
              Published {book.year}
            </span>
          </div>

          <h2 
            className="text-4xl md:text-6xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300"
            style={{ textShadow: '0 0 30px rgba(0, 255, 150, 0.6)' }}
          >
            {book.title}
          </h2>

          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div className="md:col-span-1">
              <div className="aspect-[2/3] bg-gradient-to-br from-emerald-800/60 to-teal-900/60 rounded-lg border border-emerald-500/30 flex items-center justify-center">
                <span className="text-6xl">📚</span>
              </div>
            </div>
            
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold text-emerald-200 mb-4">About This Book</h3>
              <p className="text-emerald-200/80 text-lg mb-6 leading-relaxed">
                {book.description}
              </p>
              
              {book.synopsis && (
                <>
                  <h3 className="text-2xl font-bold text-emerald-200 mb-4">Synopsis</h3>
                  <p className="text-emerald-100/90 leading-relaxed">
                    {book.synopsis}
                  </p>
                </>
              )}
            </div>
          </div>

          {book.chapters && (
            <div className="mt-8">
              <h3 className="text-2xl font-bold text-emerald-200 mb-4">Table of Contents</h3>
              <div className="space-y-2">
                {book.chapters.map((chapter, idx) => (
                  <div key={idx} className="p-3 bg-emerald-900/20 rounded border border-emerald-500/20 hover:border-emerald-400/40 transition-all">
                    <span className="text-emerald-400 font-semibold">Chapter {idx + 1}:</span>
                    <span className="text-emerald-100/90 ml-2">{chapter}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Library = () => {
  const waterContainerRef = useRef(null);
  const gemContainerRef = useRef(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [openArticle, setOpenArticle] = useState(null);
  const [openBook, setOpenBook] = useState(null);
  const isGemHovered = useRef(false);

  // Underwater shader effect
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

  // 3D Spinning Gem
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
      color: 0x00ff88,
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

    material.emissive = new THREE.Color(0x00ff88);
    material.emissiveIntensity = 0.15;

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

    const pointLight1 = new THREE.PointLight(0x00ffaa, 2);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x00ff88, 1.5);
    pointLight2.position.set(-5, -5, 5);
    scene.add(pointLight2);

    camera.position.z = 5;

    const baseRotation = { x: 0.008, y: 0.015, z: 0.01 };
    const hoverSpeedMultiplier = 3.0;
    const normalColor = new THREE.Color(0x00ff88);
    const hoverColor = new THREE.Color(0x66ffd9);

    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      const speedMultiplier = isGemHovered.current ? hoverSpeedMultiplier : 1.0;

      gemGroup.rotation.x += baseRotation.x * speedMultiplier;
      gemGroup.rotation.y += baseRotation.y * speedMultiplier;
      gemGroup.rotation.z += baseRotation.z * speedMultiplier;

      const targetColor = isGemHovered.current ? hoverColor : normalColor;
      material.color.lerp(targetColor, 0.08);

      const targetEmissive = isGemHovered.current ? 0.8 : 0.15;
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

  const categories = ['all', 'video', 'music', 'photography', 'articles', 'graphics', 'books'];
  
  const projects = [
    { id: 1, title: 'Ocean Documentary', category: 'video', year: '2024', description: 'Deep sea exploration footage', youtubeId: 'g_SkCJnU0jE' },
    { id: 2, title: 'Marine Life Edit', category: 'video', year: '2023', description: 'Wildlife documentary cutting', youtubeId: 'jpxjJgwPSTo' },
    { id: 3, title: 'Blue Planet Tribute', category: 'video', year: '2024', description: 'Nature documentary style edit', youtubeId: 'vlFqThlpCBs' },
    { id: 4, title: 'Reef Restoration', category: 'video', year: '2023', description: 'Conservation documentary', youtubeId: 'yyQ1sZDIiVk' },
    { id: 5, title: 'Coastal Wonders', category: 'video', year: '2023', description: 'Shoreline exploration', youtubeId: 'FUIAYnWfCH8' },
    { id: 6, title: 'Kelp Forest Journey', category: 'video', year: '2023', description: 'Underwater forest ecosystem', youtubeId: '9mf7EJ7t2f4' },
    { id: 7, title: 'Tide Pool Life', category: 'video', year: '2023', description: 'Macro marine creatures', youtubeId: 'yITOKo-HQOY' },
    { id: 8, title: 'Deep Blue', category: 'video', year: '2023', description: 'Open ocean adventure', youtubeId: '8jD2PkiFNfY' },

    { id: 9, title: 'Coral Reef Series', category: 'photography', year: '2024', description: 'Macro photography collection', image: '/photos/photoone.jpg' },
    { id: 46, title: 'Jellyfish Dreams', category: 'photography', year: '2024', description: 'Bioluminescent captures', image: '/photos/phototwo.jpg' },
    { id: 12, title: 'Depth & Light', category: 'photography', year: '2023', description: 'Abstract underwater shots', image: '/photos/photothree.jpg'  },
    { id: 30, title: 'Ocean Textures', category: 'photography', year: '2023', description: 'Close-up marine details', image: '/photos/photofour.jpg' },
    { id: 45, title: 'Ocean Textures', category: 'photography', year: '2023', description: 'Close-up marine details', image: '/photos/photofive.jpg' },
    { id: 35, title: 'Ocean Textures', category: 'photography', year: '2023', description: 'Close-up marine details', image: '/photos/photosix.jpg' },
    { id: 36, title: 'Ocean Textures', category: 'photography', year: '2023', description: 'Close-up marine details', image: '/photos/photoseven.jpg' },
    { id: 37, title: 'Ocean Textures', category: 'photography', year: '2023', description: 'Close-up marine details', image: '/photos/photoeight.jpg' },
    { id: 38, title: 'Ocean Textures', category: 'photography', year: '2023', description: 'Close-up marine details', image: '/photos/photonine.jpg' },
    { id: 39, title: 'Ocean Textures', category: 'photography', year: '2023', description: 'Close-up marine details', image: '/photos/phototen.jpg' },
    { id: 40, title: 'Ocean Textures', category: 'photography', year: '2023', description: 'Close-up marine details', image: '/photos/photoeleven.jpg' },
    { id: 41, title: 'Ocean Textures', category: 'photography', year: '2023', description: 'Close-up marine details', image: '/photos/phototwelve.jpg' },
    { id: 42, title: 'Ocean Textures', category: 'photography', year: '2023', description: 'Close-up marine details', image: '/photos/photothirteen.jpg' },

    { id: 10, title: 'Twenty-Five', category: 'music', year: '2021', description: 'Vocalist / Songwriter / Graphic Designer', youtubeId: '5GIae2G2wzo' },
    { id: 11, title: 'Echo', category: 'music', year: '2021', description: 'Vocalist / Songwriter / Graphic Designer', youtubeId: 'R8XX7tS5gR4' },
    { id: 14, title: 'Let Me Loose', category: 'music', year: '2023', description: 'Vocalist / Songwriter / Graphic Designer', youtubeId: 'yZyaT02-iLc' },
    { id: 17, title: 'Tension', category: 'music', year: '2022', description: 'Vocalist / Songwriter / Graphic Designer', youtubeId: '3EMVGEtc-_0' },
    { id: 18, title: 'Explode', category: 'music', year: '2021', description: 'Vocalist / Songwriter / Graphic Designer', youtubeId: '1MlYQ38n2V4' },
    { id: 19, title: 'Footloose', category: 'music', year: '2021', description: 'Vocalist / Songwriter / Graphic Designer', youtubeId: '1a-15ZPoV6c' },
    { id: 20, title: 'Big Sauce', category: 'music', year: '2020', description: 'Vocalist / Songwriter / Producer / Graphic Designer', youtubeId: 'g61WPCA7Jnw' },
    { id: 21, title: 'Cyan', category: 'music', year: '2020', description: 'Vocalist / Songwriter / Producer / Graphic Designer', youtubeId: 'RClw2M_9dJg' },
    { id: 22, title: 'Suga Lips', category: 'music', year: '2020', description: 'Vocalist / Songwriter / Producer / Graphic Designer', youtubeId: 'mgjpfsAt27M' },
    { id: 23, title: 'Typhoon', category: 'music', year: '2020', description: 'Vocalist / Songwriter / Producer / Graphic Designer', youtubeId: '6odNrES7--s' },
    { id: 24, title: 'Take A Flick', category: 'music', year: '2020', description: 'Vocalist / Songwriter / Producer / Graphic Designer', youtubeId: '1zKpmB4IB1M' },
    { id: 25, title: 'Strawberry Cough', category: 'music', year: '2022', description: 'Vocalist / Songwriter / Producer / Graphic Designer', youtubeId: 'aL9DA0U7U5c' },

    { 
      id: 13, 
      title: 'The Art of Diving', 
      category: 'articles', 
      year: '2024', 
      description: 'Tutorial on underwater videography',
      content: (
        <>
          <p>Underwater videography is a unique blend of technical skill and artistic vision. The ocean presents challenges that land-based filmmakers never encounter – constant movement, limited visibility, and the physics of light underwater.</p>
          
          <h3 className="text-2xl font-bold text-emerald-300 mt-6 mb-3">Understanding Light Underwater</h3>
          <p>Water absorbs light differently than air. Red wavelengths disappear first, usually within 15 feet. This is why everything looks blue-green at depth. To capture true colors, you need artificial lighting or color correction in post-production.</p>
          
          <h3 className="text-2xl font-bold text-emerald-300 mt-6 mb-3">Equipment Essentials</h3>
          <p>A proper underwater housing is non-negotiable. Your camera needs protection from water pressure and corrosion. Invest in quality seals and test your setup in shallow water before diving deep.</p>
          
          <h3 className="text-2xl font-bold text-emerald-300 mt-6 mb-3">Composition Tips</h3>
          <p>Think in three dimensions. Unlike land photography, you can move up and down as easily as left and right. Use this to your advantage – shoot from below to capture subjects against the surface, or from above to show the relationship between creatures and the reef.</p>
          
          <p className="mt-6">The ocean rewards patience. The best shots often come from staying still and letting marine life approach you. Remember: you're a guest in their world.</p>
        </>
      )
    },
    { 
      id: 16, 
      title: 'Color Grading Guide', 
      category: 'articles', 
      year: '2023', 
      description: 'Ocean scene color theory',
      content: (
        <>
          <p>Color grading underwater footage requires a different approach than traditional video editing. The ocean's natural color shifts demand specific techniques to restore and enhance the visual narrative.</p>
          
          <h3 className="text-2xl font-bold text-emerald-300 mt-6 mb-3">The Color Challenge</h3>
          <p>Underwater environments naturally filter out warm tones. By 30 feet, reds are almost completely absent. Your raw footage will likely appear heavily cyan and blue. This isn't a camera problem – it's physics.</p>
          
          <h3 className="text-2xl font-bold text-emerald-300 mt-6 mb-3">Restoration vs. Enhancement</h3>
          <p>First, restore. Use color correction to bring back the reds and oranges that water absorbed. Then enhance – push the aesthetic to match your creative vision. Don't be afraid to lean into the blue-green palette; it's the ocean's signature.</p>
          
          <h3 className="text-2xl font-bold text-emerald-300 mt-6 mb-3">Technical Workflow</h3>
          <p>Start with white balance adjustment. Use the eyedropper on something that should be neutral gray. Then add warmth selectively using masks and tracking. Focus warmth on your subject while keeping the background naturally cool.</p>
          
          <p className="mt-6">Remember: authenticity matters. Audiences can sense when colors feel wrong. Study reference footage and real diving experiences to guide your grading decisions.</p>
        </>
      )
    },

    { id: 31, title: 'Wave Patterns', category: 'graphics', year: '2023', description: 'Abstract ocean design' },
    { id: 32, title: 'Marine Infographic', category: 'graphics', year: '2023', description: 'Data visualization' },

    { 
      id: 33, 
      title: 'The Tides of the Twin Kings', 
      category: 'books', 
      year: '2025', 
      description: 'An epic fantasy tale of two kingdoms divided by the sea',
      synopsis: 'In a world where two kingdoms rule opposite shores of a mystical ocean, twin princes must navigate political intrigue, ancient magic, and their own conflicting destinies. When the tides begin to turn against the natural order, they discover their connection runs deeper than blood – their fates are tied to the very sea that separates them.',
      chapters: [
        'The Divided Shore',
        'Whispers Beneath the Waves',
        'The First Tide',
        'Crown of Coral',
        'The Midnight Crossing',
        'Secrets of the Deep',
        'The Storm Brothers',
        'Rising Waters',
        'The Convergence',
        'Kingdom of Tides'
      ]
    },
    { 
      id: 34, 
      title: 'The Phoenix Empire', 
      category: 'books', 
      year: '2025', 
      description: 'A science fiction journey through rebirth and revolution',
      synopsis: 'Three centuries after Earth\'s collapse, humanity has rebuilt civilization on the ashes of the old world. But the Phoenix Empire, humanity\'s greatest achievement, harbors a dark secret: every generation, the empire must burn and be reborn to survive. When a young engineer discovers the truth behind the cycles, she must decide whether to save the empire or let it die for good.',
      chapters: [
        'The Ash Archives',
        'Embers of Memory',
        'The Burning Season',
        'Flight of the Phoenix',
        'Smoke and Mirrors',
        'The Last Flame',
        'Ashes to Ashes',
        'The Rebirth Protocol',
        'Wings of Fire',
        'New Dawn'
      ]
    },
    { 
      id: 28, 
      title: 'Diving into Storytelling', 
      category: 'books', 
      year: '2020', 
      description: 'Crafting narratives beneath the waves',
      synopsis: 'A comprehensive guide to underwater documentary filmmaking that combines practical diving techniques with narrative theory. Learn how to structure compelling ocean stories, from initial research and dive planning to final edit. Includes case studies from award-winning documentaries and interviews with renowned underwater filmmakers.',
      chapters: [
        'The Story Beneath',
        'Pre-Production Planning',
        'Diving with Purpose',
        'Capturing the Moment',
        'Working with Marine Life',
        'The Language of Water',
        'Editing Underwater Narratives',
        'Sound Design for Ocean Films',
        'Ethics and Conservation',
        'Distribution and Impact'
      ]
    },
    { 
      id: 29, 
      title: 'Soundscapes of the Sea', 
      category: 'books', 
      year: '2019', 
      description: 'Creating immersive audio for ocean films',
      synopsis: 'Explore the acoustic world beneath the waves and learn how to craft authentic underwater soundscapes for film and media. From hydrophone recording techniques to foley artistry, this book reveals the secrets of creating audio that truly transports audiences to the ocean depths. Features practical exercises and professional insights from Hollywood sound designers.',
      chapters: [
        'The Ocean\'s Voice',
        'Hydrophone Basics',
        'Recording Techniques',
        'The Physics of Underwater Sound',
        'Marine Life Audio',
        'Foley for Ocean Scenes',
        'Mixing Underwater Ambience',
        'Music and the Sea',
        'Post-Production Workflows',
        'Case Studies in Ocean Audio'
      ]
    },
  ];

  const filteredProjects = selectedCategory === 'all' 
    ? projects 
    : projects.filter(p => p.category === selectedCategory);

  return (
    <div className="relative min-h-screen bg-black">
      <div ref={waterContainerRef} className="fixed inset-0 z-0" />

      <div className="relative z-10 pt-24 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 mb-20">
            <div className="flex-1">
              <h1 
                className="text-6xl md:text-7xl font-bold mb-6 font-heading text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-green-400"
                style={{ 
                  textShadow: '0 0 30px rgba(0, 255, 150, 0.6)',
                  filter: 'drop-shadow(0 0 15px rgba(0, 255, 150, 0.8))'
                }}
              >
                LIBRARY
              </h1>
              <p className="text-xl text-emerald-100/80 mb-8 font-body leading-relaxed"
                 style={{ textShadow: '0 0 10px rgba(0, 255, 150, 0.3)' }}>
                A curated collection of creative projects spanning video production, music composition, 
                photography, and written content. Each piece represents a journey into the depths of artistic expression.
              </p>
              
              <div className="flex flex-wrap gap-3">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-6 py-2 rounded-full font-body font-medium transition-all duration-300 ${
                      selectedCategory === cat
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-black shadow-lg'
                        : 'bg-emerald-900/30 text-emerald-300 border border-emerald-500/30 hover:border-emerald-400/60'
                    }`}
                    style={selectedCategory === cat ? { boxShadow: '0 0 20px rgba(0, 255, 150, 0.5)' } : {}}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-shrink-0">
              <div 
                className="relative"
                style={{ 
                  filter: 'drop-shadow(0 0 30px rgba(0, 255, 150, 0.6))'
                }}
                onMouseEnter={() => { isGemHovered.current = true; }}
                onMouseLeave={() => { isGemHovered.current = false; }}
              >
                <div ref={gemContainerRef} className="w-[400px] h-[400px]" />
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 blur-3xl animate-pulse" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 font-body gap-6">
            {filteredProjects.map((project, index) => (
              <div
                key={project.id}
                className="group relative bg-gradient-to-br from-emerald-900/20 to-teal-950/20 rounded-xl border border-emerald-500/20 backdrop-blur-sm hover:border-emerald-400/60 transition-all duration-500 overflow-hidden cursor-pointer"
                style={{
                  animation: 'fadeIn 0.5s ease-in-out',
                  animationDelay: `${index * 0.1}s`,
                  animationFillMode: 'backwards'
                }}
                onClick={() => {
                  if (project.category === 'articles') {
                    setOpenArticle(project);
                  } else if (project.category === 'books') {
                    setOpenBook(project);
                  }
                }}
              >
                <div className="aspect-video bg-gradient-to-br from-emerald-800/40 to-teal-900/40 relative overflow-hidden">
                {/* VIDEO + MUSIC (YouTube embed) */}
{(project.category === 'video' || project.category === 'music') && project.youtubeId ? (
  <>
    <iframe
      className="absolute inset-0 w-full h-full"
      src={`https://www.youtube-nocookie.com/embed/${project.youtubeId}`}
      title={project.title}
      loading="lazy"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
    />
    <div className="absolute inset-0 pointer-events-none bg-emerald-500/0 group-hover:bg-emerald-500/10 transition-all duration-500" />
  </>
) : project.category === 'photography' && project.image ? (
  <>
    <img
      src={project.image}
      alt={project.title}
      className="absolute inset-0 w-full h-full object-cover"
      loading="lazy"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
  </>
) : (
  <>
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
    <div className="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/20 transition-all duration-500" />
  </>
)}

                
                  {(project.category === 'video' || project.category === 'music') && project.youtubeId ? (
                    <>
                      <iframe
                        className="absolute inset-0 w-full h-full"
                        src={`https://www.youtube-nocookie.com/embed/${project.youtubeId}`}
                        title={project.title}
                        loading="lazy"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                      <div className="absolute inset-0 pointer-events-none bg-emerald-500/0 group-hover:bg-emerald-500/10 transition-all duration-500" />
                    </>
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/20 transition-all duration-500" />
                    </>
                  )}

                  <div className="absolute top-4 right-4 px-3 py-1 bg-emerald-500/90 text-black text-xs font-bold rounded-full">
                    {project.year}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 text-xs font-semibold text-emerald-900 bg-emerald-400 rounded">
                      {project.category}
                    </span>
                  </div>
                  
                  <h3 
                    className="text-2xl font-bold text-emerald-200 mb-2 group-hover:text-emerald-100 transition-colors"
                    style={{ textShadow: '0 0 15px rgba(0, 255, 150, 0.4)' }}
                  >
                    {project.title}
                  </h3>
                  
                  <p className="text-sm text-emerald-100/60 mb-4">
                    {project.description}
                  </p>
                  
                  <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm group-hover:gap-4 transition-all duration-300">
                    View Project
                    <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
                  </div>
                </div>

                <div 
                  className="absolute -inset-1 bg-gradient-to-r from-emerald-500/0 via-emerald-500/20 to-emerald-500/0 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <ArticleModal article={openArticle} onClose={() => setOpenArticle(null)} />
      <BookModal book={openBook} onClose={() => setOpenBook(null)} />

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
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

export default Library