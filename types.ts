export enum BiomeType {
  FOREST = 'FOREST',
  DESERT = 'DESERT',
  ICE = 'ICE',
  VOLCANO = 'VOLCANO'
}

export interface BiomeConfig {
  name: string;
  colors: {
    water: string;
    sand: string;
    grass: string;
    rock: string;
    snow: string;
    base: string;
  };
  treeColor: string;
  woodColor: string;
  waterLevel: number;
  snowLevel: number;
  rockLevel: number;
  treeDensity: number;
}

export interface MapConfig {
  seed: number;
  size: number;
  scale: number;
  biome: BiomeType;
}
