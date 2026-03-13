// @ts-nocheck
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface PerfumeBottle3DProps {
  perfume: any;
  scale?: number;
  autoRotate?: boolean;
}

export function PerfumeBottle3D({ perfume, scale = 1, autoRotate = true }: PerfumeBottle3DProps) {
  const groupRef = useRef(null);
  const bottle = perfume.bottle;

  const bottleGeometry = useMemo(() => {
    const points = bottle.profilePoints.map(
      ([x, y]: number[]) => new THREE.Vector2(x * scale * 0.3, y * scale * 0.3)
    );
    return new THREE.LatheGeometry(points, 64);
  }, [bottle.profilePoints, scale]);

  const liquidGeometry = useMemo(() => {
    const pts = bottle.profilePoints.slice(0, -3).map(
      ([x, y]: number[]) => new THREE.Vector2(x * 0.88 * scale * 0.3, y * 0.85 * scale * 0.3)
    );
    if (pts.length < 2) return null;
    return new THREE.LatheGeometry(pts, 64);
  }, [bottle.profilePoints, scale]);

  const capGeometry = useMemo(() => {
    const r = 0.12 * scale;
    const h = 0.15 * scale;
    switch (bottle.capStyle) {
      case 'faceted-hexagon': return new THREE.CylinderGeometry(r, r, h, 6);
      case 'pyramid': return new THREE.ConeGeometry(r, h, 4, 1);
      case 'flat-disc': return new THREE.CylinderGeometry(r * 1.2, r * 1.2, h * 0.3, 32);
      case 'soft-dome': return new THREE.SphereGeometry(r, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5);
      case 'crown': return new THREE.CylinderGeometry(r * 0.8, r * 1.1, h * 1.2, 8);
      default: return new THREE.CylinderGeometry(r, r, h, 32);
    }
  }, [bottle.capStyle, scale]);

  const capY = useMemo(() => {
    const lastPt = bottle.profilePoints[bottle.profilePoints.length - 1];
    return lastPt[1] * scale * 0.3 + 0.1 * scale;
  }, [bottle.profilePoints, scale]);

  useFrame((state) => {
    if (groupRef.current && autoRotate) {
      groupRef.current.rotation.y += 0.003;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh geometry={bottleGeometry}>
        <meshPhysicalMaterial
          color={bottle.glassColor}
          transparent
          opacity={bottle.glassOpacity}
          roughness={0.05}
          metalness={0.0}
          transmission={0.92}
          thickness={0.8}
          ior={1.52}
          envMapIntensity={bottle.envIntensity}
        />
      </mesh>
      {liquidGeometry && (
        <mesh geometry={liquidGeometry}>
          <meshPhysicalMaterial
            color={bottle.liquidColor}
            transparent
            opacity={bottle.liquidOpacity}
            roughness={0.1}
            metalness={0.2}
          />
        </mesh>
      )}
      <mesh geometry={capGeometry} position={[0, capY, 0]}>
        <meshStandardMaterial
          color={bottle.capColor}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
    </group>
  );
}
