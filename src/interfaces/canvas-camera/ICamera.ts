export interface ICameraPoint {
  x: number;
  y: number;
}

export interface ICamera {
  x: number;
  y: number;
  scale: number;

  toScreen(worldX: number, worldY: number): ICameraPoint;
  toWorld(screenX: number, screenY: number): ICameraPoint;
}
