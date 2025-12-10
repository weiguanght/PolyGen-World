import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Howl } from 'howler';
import { Map } from './components/Map';
import { Controls } from './components/Controls';
import { BiomeType, MapConfig } from './types';
import { BIOME_DATA } from './constants';

// Simple UI Sound
const clickSound = new Howl({
  src: ['https://assets.mixkit.co/sfx/preview/mixkit-modern-technology-select-3124.mp3'],
  volume: 0.5,
});

function App() {
  const [config, setConfig] = useState<MapConfig>({
    seed: Math.random(),
    size: 30, // Map Size
    scale: 0.1, // Noise Zoom
    biome: BiomeType.FOREST,
  });

  const regenerate = () => {
    clickSound.play();
    setConfig((prev) => ({ ...prev, seed: Math.random() }));
  };

  const changeBiome = (biome: BiomeType) => {
    clickSound.play();
    setConfig((prev) => ({ ...prev, biome }));
  };

  return (
    <div className="w-full h-screen bg-gray-900 relative overflow-hidden font-sans">
      
      {/* 3D Scene */}
      <div className="absolute inset-0 z-0">
        <Canvas shadows camera={{ position: [20, 20, 20], fov: 40 }}>
          {/* Lighting */}
          <ambientLight intensity={0.6} />
          <directionalLight 
            position={[50, 80, 30]} 
            intensity={1.5} 
            castShadow 
            shadow-mapSize-width={2048} 
            shadow-mapSize-height={2048}
            shadow-camera-left={-40}
            shadow-camera-right={40}
            shadow-camera-top={40}
            shadow-camera-bottom={-40}
          />
          
          <Map config={config} />
          <Controls />
          
          {/* Background Color changes with Biome slightly */}
          <color attach="background" args={[config.biome === BiomeType.VOLCANO ? '#2a1a1a' : '#cceeff']} />
          {/* Fog for depth */}
          <fog attach="fog" args={[config.biome === BiomeType.VOLCANO ? '#2a1a1a' : '#cceeff', 20, 90]} />
        </Canvas>
      </div>

      {/* UI Overlay */}
      <div className="absolute top-0 left-0 p-6 z-10 w-full pointer-events-none">
        <div className="flex justify-between items-start pointer-events-auto">
          <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/50 max-w-sm">
            <h1 className="text-3xl font-bold text-gray-800 mb-2 tracking-tight">PolyGen World</h1>
            <p className="text-sm text-gray-500 mb-6">Procedural Perlin Noise Terrain</p>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Biome Selection</label>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(BiomeType) as Array<keyof typeof BiomeType>).map((key) => (
                    <button
                      key={key}
                      onClick={() => changeBiome(BiomeType[key])}
                      className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 border-2 ${
                        config.biome === BiomeType[key]
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                          : 'border-transparent bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {BIOME_DATA[BiomeType[key]].name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Map Controls</label>
                <button
                  onClick={regenerate}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-500/30 transition-all flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Generate New World
                </button>
              </div>
            </div>
          </div>

          <div className="bg-black/80 backdrop-blur-md text-white p-4 rounded-xl text-xs space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-gray-700 p-1 rounded">WASD / Arrows</span> <span>Move Camera</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-gray-700 p-1 rounded">Left Click</span> <span>Rotate</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-gray-700 p-1 rounded">Scroll</span> <span>Zoom</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-gray-700 p-1 rounded">Right Click</span> <span>Pan</span>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}

export default App;
