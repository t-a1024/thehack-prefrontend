import type { ICamera, ICameraPoint } from "../interfaces/canvas-camera/ICamera.js";

export type CameraState = Pick<ICamera, "x" | "y" | "scale">;

export class Camera implements ICamera {
  public x: number;
  public y: number;
  public scale: number;

  constructor(initial?: Partial<CameraState>) {
    this.x = initial?.x ?? 0;
    this.y = initial?.y ?? 0;
    this.scale = initial?.scale ?? 1;
  }

  public toScreen(worldX: number, worldY: number): ICameraPoint {
    return {
      x: (worldX - this.x) * this.scale,
      y: (worldY - this.y) * this.scale,
    };
  }

  public toWorld(screenX: number, screenY: number): ICameraPoint {
    return {
      x: screenX / this.scale + this.x,
      y: screenY / this.scale + this.y,
    };
  }
}
