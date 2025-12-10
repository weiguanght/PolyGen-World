import React, { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';

// Key handling hook
function useKeys() {
  const [keys, setKeys] = React.useState<Record<string, boolean>>({});

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => setKeys((k) => ({ ...k, [e.code]: true }));
    const handleKeyUp = (e: KeyboardEvent) => setKeys((k) => ({ ...k, [e.code]: false }));
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return keys;
}

export const Controls: React.FC = () => {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const keys = useKeys();
  const { camera } = useThree();
  const panSpeed = 0.5;

  useFrame(() => {
    if (!controlsRef.current) return;

    // Pan Logic based on Arrow Keys
    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
    forward.y = 0; // Keep movement on the horizontal plane
    forward.normalize();
    
    const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion);
    right.y = 0;
    right.normalize();

    let moved = false;

    if (keys['ArrowUp'] || keys['KeyW']) {
      camera.position.addScaledVector(forward, panSpeed);
      controlsRef.current.target.addScaledVector(forward, panSpeed);
      moved = true;
    }
    if (keys['ArrowDown'] || keys['KeyS']) {
      camera.position.addScaledVector(forward, -panSpeed);
      controlsRef.current.target.addScaledVector(forward, -panSpeed);
      moved = true;
    }
    if (keys['ArrowLeft'] || keys['KeyA']) {
      camera.position.addScaledVector(right, -panSpeed);
      controlsRef.current.target.addScaledVector(right, -panSpeed);
      moved = true;
    }
    if (keys['ArrowRight'] || keys['KeyD']) {
      camera.position.addScaledVector(right, panSpeed);
      controlsRef.current.target.addScaledVector(right, panSpeed);
      moved = true;
    }
    
    if (moved) {
        controlsRef.current.update();
    }
  });

  return (
    <OrbitControls 
      ref={controlsRef}
      enablePan={true} 
      enableZoom={true} 
      enableRotate={true}
      // Restrict vertical angle (30 degrees to 90 degrees)
      // 90 degrees in radians is PI/2 (top down)
      // 30 degrees is PI/6
      // In OrbitControls, maxPolarAngle is how far down you can look. 0 is top. PI is bottom.
      // We want to restrict looking 'up' too much.
      minPolarAngle={0} 
      maxPolarAngle={Math.PI / 2 - (30 * Math.PI / 180)} // Approx 60 deg from top, preventing looking from side
      dampingFactor={0.1}
    />
  );
};
