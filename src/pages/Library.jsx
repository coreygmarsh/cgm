import React, { useRef, useEffect, useState, useMemo } from "react";
import * as THREE from "three";
import ArticleModal from "./ArticleModal";
import BookModal from "./BookModal";
import PhotoModal from "./PhotoModal";
import { projects } from "./projectsData.jsx";
import { useSearchParams } from "react-router-dom";

const Library = () => {
  const waterContainerRef = useRef(null);
  const gemContainerRef = useRef(null);

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [openArticle, setOpenArticle] = useState(null);
  const [openBook, setOpenBook] = useState(null);
  const [openPhoto, setOpenPhoto] = useState(null);

  const isGemHovered = useRef(false);

  // Underwater shader effect
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

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) setSelectedCategory(cat);
  }, [searchParams]);

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
      ior: 2.4,
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
      material.emissiveIntensity +=
        (targetEmissive - material.emissiveIntensity) * 0.08;

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

  const categories = useMemo(
    () => ["all", "video", "music", "photography", "articles", "graphics", "books"],
    []
  );

  const filteredProjects =
    selectedCategory === "all"
      ? projects
      : projects.filter((p) => p.category === selectedCategory);

  return (
    <div className="relative min-h-screen bg-black">
      <div ref={waterContainerRef} className="fixed inset-0 z-0" />

      <div className="relative z-10 pt-24 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 mb-20">
            <div className="flex-1">
              <h1
                className="text-6xl md:text-7xl font-bold mb-6 font-heading text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-green-400"
                style={{
                  textShadow: "0 0 30px rgba(0, 255, 150, 0.6)",
                  filter: "drop-shadow(0 0 15px rgba(0, 255, 150, 0.8))",
                }}
              >
                LIBRARY
              </h1>

              <p
                className="text-xl text-emerald-100/80 mb-8 font-body leading-relaxed"
                style={{ textShadow: "0 0 10px rgba(0, 255, 150, 0.3)" }}
              >
                A curated collection of creative projects spanning video production,
                music composition, photography, and written content.
              </p>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-6 py-2 rounded-full font-bold font-heading cursor-pointer transition-all duration-300 ${
                      selectedCategory === cat
                        ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-black shadow-lg"
                        : "bg-emerald-900/30 text-emerald-300 border border-emerald-500/30 hover:border-emerald-400/90"
                    }`}
                    style={
                      selectedCategory === cat
                        ? { boxShadow: "0 0 20px rgba(0, 255, 150, 0.5)" }
                        : {}
                    }
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* 3D Gem */}
            <div className="flex-shrink-0">
              <div
                className="relative"
                style={{ filter: "drop-shadow(0 0 30px rgba(0, 255, 150, 0.6))" }}
                onMouseEnter={() => {
                  isGemHovered.current = true;
                }}
                onMouseLeave={() => {
                  isGemHovered.current = false;
                }}
              >
                <div ref={gemContainerRef} className="w-[400px] h-[400px]" />
              </div>
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 font-body md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="group relative bg-gradient-to-br from-emerald-900/20 to-teal-950/20 rounded-xl border border-emerald-500/20 backdrop-blur-sm hover:border-emerald-400/60 transition-all duration-500 overflow-hidden cursor-pointer"
                onClick={() => {
  if (project.category === "articles") setOpenArticle(project);
  else if (project.category === "books") setOpenBook(project);
  else if (
    (project.category === "photography" || project.category === "graphics") &&
    project.image
  ) {
    setOpenPhoto(project);
  }
}}

              >
                <div className="aspect-video bg-gradient-to-br from-emerald-800/40 to-teal-900/40 relative overflow-hidden">
                  {(project.category === "video" || project.category === "music") &&
                  project.youtubeId ? (
                    <>
                      <iframe
                        className="absolute inset-0 w-full h-full"
                        src={`https://www.youtube-nocookie.com/embed/${project.youtubeId}`}
                        title={project.title}
                        loading="lazy"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                      <div className="absolute inset-0 pointer-events-none bg-emerald-500/0 group-hover:bg-emerald-500/10 transition-all duration-500" />
                    </>
                  ) : project.image ? (
                    <>
                      <img
                        src={project.image}
                        alt={project.title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/20 transition-all duration-500" />
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
                  <span className="px-2 py-1 text-xs font-semibold text-emerald-900 bg-emerald-400 rounded">
                    {project.category}
                  </span>
                  <h3 className="text-2xl font-bold text-emerald-200 mt-2 mb-2">
                    {project.title}
                  </h3>
                  <p className="text-sm text-emerald-100/60 mb-4">
                    {project.description}
                  </p>
                  <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                    View Project <span>→</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ArticleModal article={openArticle} onClose={() => setOpenArticle(null)} />
      <BookModal book={openBook} onClose={() => setOpenBook(null)} />
      <PhotoModal photo={openPhoto} onClose={() => setOpenPhoto(null)} />
    </div>
  );
};

export default Library;
