import type { CameraState } from "./types.js";

export class Camera {
  public x: number;
  public y: number;
  public scale: number;

  constructor(initial?: Partial<CameraState>) {
    this.x = initial?.x ?? 0;
    this.y = initial?.y ?? 0;
    this.scale = initial?.scale ?? 1;
  }

  toScreen(worldX: number, worldY: number) {
    return {
      x: (worldX - this.x) * this.scale,
      y: (worldY - this.y) * this.scale,
    };
  }

  toWorld(screenX: number, screenY: number) {
    return {
      x: screenX / this.scale + this.x,
      y: screenY / this.scale + this.y,
    };
  }
}