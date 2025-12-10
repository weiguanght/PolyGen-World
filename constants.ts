import { BiomeType, BiomeConfig } from './types';

export const BIOME_DATA: Record<BiomeType, BiomeConfig> = {
  [BiomeType.FOREST]: {
    name: 'Temperate Forest',
    colors: {
      water: '#4fa4b8',
      sand: '#e8dcb5',
      grass: '#58a964',
      rock: '#8b8b8b',
      snow: '#ffffff',
      base: '#594433',
    },
    treeColor: '#2d6e32',
    woodColor: '#7a5334',
    waterLevel: 0.2,
    rockLevel: 0.7,
    snowLevel: 0.85,
    treeDensity: 0.15,
  },
  [BiomeType.DESERT]: {
    name: 'Arid Desert',
    colors: {
      water: '#3d8eb5', // Oasis
      sand: '#f2d272',
      grass: '#e0c05e',
      rock: '#bf6e45',
      snow: '#f5e6d3', // Light peaks
      base: '#b58a5e',
    },
    treeColor: '#8f9c38', // Cactus/Palm green
    woodColor: '#8c6b4a',
    waterLevel: 0.1,
    rockLevel: 0.6,
    snowLevel: 0.9,
    treeDensity: 0.05,
  },
  [BiomeType.ICE]: {
    name: 'Polar Ice Cap',
    colors: {
      water: '#6fcfe0', // Icy water
      sand: '#a9d6e0', // Slush
      grass: '#ffffff', // Snow
      rock: '#8caebf', // Icy rock
      snow: '#eeffff',
      base: '#6a8c9e',
    },
    treeColor: '#a1c2c4', // Frozen trees
    woodColor: '#4a5e66',
    waterLevel: 0.3,
    rockLevel: 0.6,
    snowLevel: 0.4, // Mostly snow
    treeDensity: 0.08,
  },
  [BiomeType.VOLCANO]: {
    name: 'Volcanic Lands',
    colors: {
      water: '#cf2525', // Lava
      sand: '#421C02', // Scorched earth
      grass: '#2A2A2A', // Ash
      rock: '#1a1a1a', // Obsidian
      snow: '#555555', // Grey ash peaks
      base: '#111111',
    },
    treeColor: '#632a0d', // Dead trees
    woodColor: '#2b1d16',
    waterLevel: 0.15,
    rockLevel: 0.4,
    snowLevel: 0.95,
    treeDensity: 0.02,
  },
};
