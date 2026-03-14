// @ts-nocheck
import { Suspense, useRef, useState, useCallback, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, ContactShadows, Float, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { ParticleField } from './ParticleField';

/* ─── Spray Burst Particles (3D space) ─── */
function SprayBurst3D({ active, color }: { active: boolean; color: string }) {
  const groupRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const [startTime, setStartTime] = useState(0);

  const { positions, velocities } = useMemo(() => {
    const count = 60;
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = 0;
      pos[i * 3 + 1] = 0;
      pos[i * 3 + 2] = 0;
      const angle = Math.random() * Math.PI * 2;
      const spread = 0.3 + Math.random() * 0.7;
      vel[i * 3] = Math.cos(angle) * spread * 2;
      vel[i * 3 + 1] = 3 + Math.random() * 4;
      vel[i * 3 + 2] = Math.sin(angle) * spread * 2;
    }
    return { positions: pos, velocities: vel };
  }, []);

  useEffect(() => {
    if (active) {
      setStartTime(Date.now());
      if (particlesRef.current) {
        const posArray = particlesRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < posArray.length; i++) posArray[i] = 0;
        particlesRef.current.geometry.attributes.position.needsUpdate = true;
      }
    }
  }, [active]);

  useFrame((state, delta) => {
    if (!active || !particlesRef.current) return;
    const elapsed = (Date.now() - startTime) / 1000;
    if (elapsed > 2.5) return;

    const posArray = particlesRef.current.geometry.attributes.position.array as Float32Array;
    const count = posArray.length / 3;
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      posArray[i3] += velocities[i3] * delta;
      posArray[i3 + 1] += velocities[i3 + 1] * delta - 4.0 * delta * elapsed;
      posArray[i3 + 2] += velocities[i3 + 2] * delta;
    }
    particlesRef.current.geometry.attributes.position.needsUpdate = true;
    particlesRef.current.material.opacity = Math.max(0, 1 - elapsed / 2);
  });

  if (!active) return null;

  return (
    <group ref={groupRef} position={[0, 1.8, 0]}>
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={60}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color={color}
          size={0.06}
          transparent
          opacity={0.9}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
      {/* Mist sphere */}
      <mesh>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

/* ─── Glowing Pedestal ─── */
function GlowingPedestal({ color }: { color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const mat = meshRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.12 + Math.sin(state.clock.elapsedTime * 1.5) * 0.06;
    }
  });

  return (
    <group position={[0, -0.52, 0]}>
      {/* Main pedestal disc */}
      <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.2, 64]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      {/* Rim ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.15, 1.25, 64]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      {/* Volumetric glow cone */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.3, 1.2, 0.6, 32, 1, true]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.04}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

/* ─── Premium Bottle Model with Materials ─── */
function PremiumBottleModel({ modelUrl, perfume, onClick }: { modelUrl: string; perfume: any; onClick: () => void }) {
  const { scene } = useGLTF(modelUrl);
  const modelRef = useRef<THREE.Group>(null);
  const bottle = perfume.bottle;

  // Apply premium materials to the GLB model
  useEffect(() => {
    if (!scene) return;

    scene.traverse((child: any) => {
      if (child.isMesh) {
        const mesh = child as THREE.Mesh;
        const name = (mesh.name || '').toLowerCase();
        const yPos = mesh.position.y;
        const bounds = new THREE.Box3().setFromObject(mesh);
        const height = bounds.max.y - bounds.min.y;
        const center = bounds.getCenter(new THREE.Vector3());

        // Try to identify parts by name, position, or geometry
        if (name.includes('cap') || name.includes('top') || name.includes('lid') || name.includes('cover')) {
          // Cap / top piece  — metallic gold
          mesh.material = new THREE.MeshPhysicalMaterial({
            color: new THREE.Color(bottle.capColor),
            metalness: 0.95,
            roughness: 0.1,
            envMapIntensity: 2.5,
            clearcoat: 1.0,
            clearcoatRoughness: 0.05,
          });
        } else if (name.includes('liquid') || name.includes('fluid') || name.includes('fill')) {
          // Liquid inside
          mesh.material = new THREE.MeshPhysicalMaterial({
            color: new THREE.Color(bottle.liquidColor),
            transparent: true,
            opacity: bottle.liquidOpacity,
            roughness: 0.05,
            metalness: 0.1,
            transmission: 0.3,
            thickness: 1.5,
          });
        } else if (name.includes('label') || name.includes('text') || name.includes('decal')) {
          // Label accent
          mesh.material = new THREE.MeshPhysicalMaterial({
            color: new THREE.Color(bottle.labelAccentColor),
            metalness: 0.7,
            roughness: 0.25,
            envMapIntensity: 1.5,
          });
        } else {
          // Default: glass bottle body — premium transparent glass
          mesh.material = new THREE.MeshPhysicalMaterial({
            color: new THREE.Color(bottle.glassColor),
            transparent: true,
            opacity: 0.25,
            roughness: 0.02,
            metalness: 0.0,
            transmission: 0.94,
            thickness: 1.2,
            ior: 1.52,
            envMapIntensity: bottle.envIntensity * 1.5,
            clearcoat: 0.5,
            clearcoatRoughness: 0.03,
            specularIntensity: 1.0,
            specularColor: new THREE.Color('#ffffff'),
            sheenColor: new THREE.Color(bottle.liquidColor),
            sheen: 0.3,
            attenuationColor: new THREE.Color(bottle.liquidColor),
            attenuationDistance: 0.5,
          });

          // Add inner liquid effect on glass meshes
          if (height > 0.3) {
            const liquidMesh = mesh.clone();
            liquidMesh.scale.multiplyScalar(0.88);
            liquidMesh.position.y = mesh.position.y;
            liquidMesh.material = new THREE.MeshPhysicalMaterial({
              color: new THREE.Color(bottle.liquidColor),
              transparent: true,
              opacity: bottle.liquidOpacity * 0.7,
              roughness: 0.08,
              metalness: 0.15,
              transmission: 0.4,
              thickness: 2.0,
              ior: 1.33,
            });
            mesh.parent?.add(liquidMesh);
          }
        }

        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
  }, [scene, bottle]);

  // Center and scale the model
  useEffect(() => {
    if (!scene) return;
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const targetSize = 2.8;
    const scale = targetSize / maxDim;
    scene.scale.setScalar(scale);
    scene.position.set(-center.x * scale, -center.y * scale + 0.4, -center.z * scale);
  }, [scene]);

  return (
    <group ref={modelRef} onClick={onClick}>
      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3} floatingRange={[-0.08, 0.08]}>
        <primitive object={scene} />
      </Float>
    </group>
  );
}

/* ─── Scene Content ─── */
function SceneContent({ perfume, modelUrl, onSpray }: { perfume: any; modelUrl: string; onSpray: () => void }) {
  const [spraying, setSpraying] = useState(false);
  const bottle = perfume.bottle;

  const handleClick = useCallback(() => {
    setSpraying(true);
    onSpray();
    setTimeout(() => setSpraying(false), 2500);
  }, [onSpray]);

  return (
    <>
      {/* 3-point lighting setup */}
      <directionalLight
        position={[4, 6, 3]}
        intensity={3.0}
        color="#FFF5E0"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.001}
      />
      <directionalLight position={[-3, 4, -2]} intensity={1.2} color="#C8D8FF" />
      <pointLight position={[0, 3, -4]} intensity={4.0} color={bottle.lightingTint} distance={10} />
      <pointLight position={[2, -1, 3]} intensity={1.5} color={bottle.labelAccentColor} distance={8} />
      <ambientLight intensity={0.15} color="#1A1A2E" />

      {/* Spot light from above for dramatic effect */}
      <spotLight
        position={[0, 8, 0]}
        angle={0.4}
        penumbra={0.8}
        intensity={2.0}
        color="#FFF8F0"
        castShadow
      />

      {/* The 3D Bottle */}
      <PremiumBottleModel modelUrl={modelUrl} perfume={perfume} onClick={handleClick} />

      {/* Spray burst */}
      <SprayBurst3D active={spraying} color={bottle.particleColor} />

      {/* Ambient particle mist */}
      <ParticleField color={bottle.particleColor} count={250} radius={3} />

      {/* Glowing pedestal */}
      <GlowingPedestal color={bottle.lightingTint} />

      {/* Contact Shadows */}
      <ContactShadows
        opacity={0.5}
        scale={4}
        blur={2.5}
        far={4}
        color="#000000"
        position={[0, -0.5, 0]}
      />

      {/* HDR Environment */}
      <Environment preset="studio" />

      {/* Orbit Controls */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={1.2}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 1.6}
        dampingFactor={0.08}
        enableDamping
      />

    </>
  );
}

/* ─── Loading Skeleton ─── */
function LoadingSkeleton() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-16 h-16 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
        <span className="font-mono text-[10px] tracking-[0.3em] text-primary/60 uppercase animate-pulse">
          Loading 3D
        </span>
      </div>
    </div>
  );
}

/* ─── Exported GLB Bottle Scene ─── */
interface GLBBottleSceneProps {
  perfume: any;
  modelUrl?: string;
  className?: string;
  onSpray?: () => void;
}

export function GLBBottleScene({
  perfume,
  modelUrl = '/models/twilight-bottle.glb',
  className = '',
  onSpray = () => {},
}: GLBBottleSceneProps) {
  return (
    <div className={`relative w-full h-full ${className}`}>
      <LoadingSkeleton />
      <Canvas
        camera={{ position: [0, 1.2, 4.5], fov: 40 }}
        gl={{
          antialias: true,
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
        shadows
        style={{ background: 'transparent' }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <SceneContent perfume={perfume} modelUrl={modelUrl} onSpray={onSpray} />
        </Suspense>
      </Canvas>

      {/* Overlay hint */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 bg-background/40 backdrop-blur-sm rounded-full border border-primary/20 pointer-events-none opacity-60">
        <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5 text-primary/70" stroke="currentColor" strokeWidth="2">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
          <path d="M8 12l2-2m0 0l2 2m-2-2v6M16 12l-2 2m0 0l-2-2m2 2V8" />
        </svg>
        <span className="font-mono text-[8px] tracking-[0.2em] text-primary/70 uppercase">Drag to rotate · Tap to spray</span>
      </div>
    </div>
  );
}

// Preload the model

