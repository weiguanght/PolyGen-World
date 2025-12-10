import React, { useMemo, useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Perlin } from '../utils/noise';
import { MapConfig, BiomeConfig } from '../types';
import { BIOME_DATA } from '../constants';

interface MapProps {
  config: MapConfig;
}

const TREE_SCALE = 0.3;

export const Map: React.FC<MapProps> = ({ config }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const biomeData: BiomeConfig = BIOME_DATA[config.biome];
  
  // Calculate Map Data
  const { geometry, colors, trees, waterGeometry } = useMemo(() => {
    const perlin = new Perlin(config.seed);
    const size = config.size;
    const scale = config.scale; // Controls "zoom" of noise
    const heightMultiplier = 6;
    
    // We construct a custom buffer geometry for that "blocky" look
    // but smoothed out slightly for the low-poly aesthetic
    const geometry = new THREE.PlaneGeometry(size, size, size * 2, size * 2);
    const waterGeo = new THREE.PlaneGeometry(size, size, 1, 1);
    
    const count = geometry.attributes.position.count;
    const colorsArr = new Float32Array(count * 3);
    const treePositions: { position: [number, number, number], scale: number }[] = [];

    // Helper to convert hex to rgb
    const c = new THREE.Color();
    const getColor = (hex: string) => {
      c.set(hex);
      return [c.r, c.g, c.b];
    };

    const waterColor = getColor(biomeData.colors.water);
    const sandColor = getColor(biomeData.colors.sand);
    const grassColor = getColor(biomeData.colors.grass);
    const rockColor = getColor(biomeData.colors.rock);
    const snowColor = getColor(biomeData.colors.snow);

    // Modify vertices
    for (let i = 0; i < count; i++) {
      const x = geometry.attributes.position.getX(i);
      const y = geometry.attributes.position.getY(i); // This is actually Z in world space initially before rotation

      // Generate noise value (-1 to 1 typically)
      let noiseVal = perlin.noise2D(x * scale, y * scale);
      
      // Add octave for detail
      noiseVal += 0.5 * perlin.noise2D(x * scale * 2, y * scale * 2);
      
      // Normalize somewhat to 0-1 range for height logic
      // The Perlin impl returns approx -1 to 1.
      let h = (noiseVal + 1) / 2; 
      
      // Apply power curve to flatten valleys and sharpen peaks
      h = Math.pow(h, 2.5);

      const finalHeight = h * heightMultiplier;
      
      // Update Z (which will be Y in world space)
      geometry.attributes.position.setZ(i, finalHeight);

      // Determine Color
      let r, g, b;
      if (h < biomeData.waterLevel) {
        [r, g, b] = sandColor; // Underwater/Shore is sand
      } else if (h < biomeData.waterLevel + 0.05) {
        [r, g, b] = sandColor;
      } else if (h < biomeData.rockLevel) {
        [r, g, b] = grassColor;
        // Chance for tree
        if (Math.random() < biomeData.treeDensity && h > biomeData.waterLevel + 0.1) {
             treePositions.push({
                position: [x, finalHeight, -y], // Note: -y because plane is rotated -90deg usually
                scale: 0.8 + Math.random() * 0.5
             });
        }
      } else if (h < biomeData.snowLevel) {
        [r, g, b] = rockColor;
      } else {
        [r, g, b] = snowColor;
      }

      colorsArr[i * 3] = r;
      colorsArr[i * 3 + 1] = g;
      colorsArr[i * 3 + 2] = b;
    }

    geometry.setAttribute('color', new THREE.BufferAttribute(colorsArr, 3));
    geometry.computeVertexNormals();

    return { 
        geometry, 
        colors: colorsArr, 
        trees: treePositions,
        waterGeometry: waterGeo
    };
  }, [config, biomeData]);

  return (
    <group>
      {/* Main Terrain */}
      <mesh ref={meshRef} geometry={geometry} receiveShadow castShadow rotation={[-Math.PI / 2, 0, 0]}>
        <meshStandardMaterial 
            vertexColors 
            flatShading 
            roughness={0.8} 
            metalness={0.1}
        />
      </mesh>

      {/* Water Plane */}
      <mesh 
        geometry={waterGeometry} 
        position={[0, biomeData.waterLevel * 6 - 0.2, 0]} 
        rotation={[-Math.PI / 2, 0, 0]} 
        receiveShadow
      >
        <meshStandardMaterial 
            color={biomeData.colors.water} 
            transparent 
            opacity={0.8} 
            roughness={0.3} 
            metalness={0.1} 
        />
      </mesh>

      {/* Base/Sides (The Skirt) */}
      <mesh position={[0, -2.5, 0]} receiveShadow>
         <boxGeometry args={[config.size, 5, config.size]} />
         <meshStandardMaterial color={biomeData.colors.base} />
      </mesh>

      {/* Trees */}
      <group>
        {trees.map((tree, i) => (
            <Tree 
                key={i} 
                position={tree.position} 
                scale={tree.scale * TREE_SCALE} 
                biomeData={biomeData}
            />
        ))}
      </group>
    </group>
  );
};

const Tree: React.FC<{ 
    position: [number, number, number]; 
    scale: number; 
    biomeData: BiomeConfig 
}> = React.memo(({ position, scale, biomeData }) => {
    // Determine tree style based on biome? 
    // For now, simple Low Poly Pine or Palm
    const isDesert = biomeData.name.includes('Desert');
    
    return (
        <group position={position} scale={[scale, scale, scale]}>
            {/* Trunk */}
            <mesh position={[0, 1, 0]} castShadow receiveShadow>
                <cylinderGeometry args={[0.2, 0.3, 2, 5]} />
                <meshStandardMaterial color={biomeData.woodColor} flatShading />
            </mesh>
            
            {/* Leaves */}
            {isDesert ? (
                // Palm-ish leaves
                 <group position={[0, 2, 0]}>
                    <mesh position={[0.5, 0.5, 0]} rotation={[0, 0, -0.5]} castShadow>
                        <boxGeometry args={[1.5, 0.2, 0.5]} />
                        <meshStandardMaterial color={biomeData.treeColor} flatShading />
                    </mesh>
                    <mesh position={[-0.5, 0.5, 0]} rotation={[0, 0, 0.5]} castShadow>
                        <boxGeometry args={[1.5, 0.2, 0.5]} />
                        <meshStandardMaterial color={biomeData.treeColor} flatShading />
                    </mesh>
                    <mesh position={[0, 0.5, 0.5]} rotation={[0.5, 0, 0]} castShadow>
                        <boxGeometry args={[0.5, 0.2, 1.5]} />
                        <meshStandardMaterial color={biomeData.treeColor} flatShading />
                    </mesh>
                    <mesh position={[0, 0.5, -0.5]} rotation={[-0.5, 0, 0]} castShadow>
                        <boxGeometry args={[0.5, 0.2, 1.5]} />
                        <meshStandardMaterial color={biomeData.treeColor} flatShading />
                    </mesh>
                 </group>
            ) : (
                // Pine/Fir Tree
                <group position={[0, 1, 0]}>
                    <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
                        <coneGeometry args={[1.2, 2.5, 6]} />
                        <meshStandardMaterial color={biomeData.treeColor} flatShading />
                    </mesh>
                    <mesh position={[0, 3, 0]} castShadow receiveShadow>
                        <coneGeometry args={[0.9, 2, 6]} />
                        <meshStandardMaterial color={biomeData.treeColor} flatShading />
                    </mesh>
                </group>
            )}
        </group>
    );
});
