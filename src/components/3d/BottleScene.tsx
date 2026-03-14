// @ts-nocheck
import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, ContactShadows, OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { PerfumeBottle3D } from './PerfumeBottle3D';
import { ParticleField } from './ParticleField';

function SceneContent({ perfume, scale = 1, interactive = false, showParticles = true }) {
  return (
    <>
      <directionalLight position={[4, 6, 3]} intensity={2.5} color="#FFF5E0" castShadow />
      <directionalLight position={[-3, 2, -2]} intensity={0.8} color="#C8D8FF" />
      <pointLight position={[0, 3, -4]} intensity={3.0} color={perfume.bottle.lightingTint} />
      <ambientLight intensity={0.2} color="#1A1A2E" />

      <PerfumeBottle3D perfume={perfume} scale={scale} autoRotate={!interactive} />

      {showParticles && (
        <ParticleField color={perfume.bottle.particleColor} count={80} radius={2.5} />
      )}

      <ContactShadows opacity={0.4} scale={3} blur={2} far={4} color="#000000" position={[0, -0.5, 0]} />
      <Environment preset="studio" />

      {interactive && (
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={1}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.5}
        />
      )}

      <EffectComposer>
        <Bloom luminanceThreshold={0.6} intensity={0.8} radius={0.4} />
        <Vignette eskil={false} offset={0.15} darkness={0.6} />
      </EffectComposer>
    </>
  );
}

export function BottleScene({ perfume, scale = 1, interactive = false, showParticles = true, className = '' }) {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [0, 1, 4], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <SceneContent
            perfume={perfume}
            scale={scale}
            interactive={interactive}
            showParticles={showParticles}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
