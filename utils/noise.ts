// A self-contained, seeded Perlin Noise implementation to ensure code stability without external deps
export class Perlin {
  private p: number[] = [];
  private perm: number[] = [];

  constructor(seed: number = Math.random()) {
    this.seed(seed);
  }

  seed(seed: number) {
    this.p = new Array(512);
    this.perm = new Array(256);
    
    // Simple LCG for deterministic randomness based on seed
    let currentSeed = Math.floor(seed * 65536);
    const random = () => {
        currentSeed = (currentSeed * 9301 + 49297) % 233280;
        return currentSeed / 233280;
    };

    for (let i = 0; i < 256; i++) {
      this.perm[i] = i;
    }

    // Shuffle
    for (let i = 0; i < 256; i++) {
      const j = Math.floor(random() * 256);
      const swap = this.perm[i];
      this.perm[i] = this.perm[j];
      this.perm[j] = swap;
    }

    for (let i = 0; i < 512; i++) {
      this.p[i] = this.perm[i & 255];
    }
  }

  fade(t: number) {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  lerp(t: number, a: number, b: number) {
    return a + t * (b - a);
  }

  grad(hash: number, x: number, y: number, z: number) {
    const h = hash & 15;
    const u = h < 8 ? x : y;
    const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  }

  // 2D Perlin Noise
  noise2D(x: number, y: number) {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;

    x -= Math.floor(x);
    y -= Math.floor(y);

    const u = this.fade(x);
    const v = this.fade(y);

    const A = this.p[X] + Y;
    const AA = this.p[A];
    const AB = this.p[A + 1];
    const B = this.p[X + 1] + Y;
    const BA = this.p[B];
    const BB = this.p[B + 1];

    return this.lerp(
      v,
      this.lerp(u, this.grad(this.p[AA], x, y, 0), this.grad(this.p[BA], x - 1, y, 0)),
      this.lerp(u, this.grad(this.p[AB], x, y - 1, 0), this.grad(this.p[BB], x - 1, y - 1, 0))
    );
  }
}
