import type { CameraState } from "./types.js";

/**
 * カメラ
 * 画面表示位置とズーム倍率を管理
 * スクリーン座標とワールド座標の相互変換を行う
 */
export class Camera {
  public x: number;
  public y: number;
  public scale: number;

  constructor(initial?: Partial<CameraState>) {
    this.x = initial?.x ?? 0;
    this.y = initial?.y ?? 0;
    this.scale = initial?.scale ?? 1;
  }

  /**
   * ワールド座標をスクリーン座標に変換
   */
  toScreen(worldX: number, worldY: number) {
    return {
      x: (worldX - this.x) * this.scale,
      y: (worldY - this.y) * this.scale,
    };
  }

  /**
   * スクリーン座標をワールド座標に変換
   */
  toWorld(screenX: number, screenY: number) {
    return {
      x: screenX / this.scale + this.x,
      y: screenY / this.scale + this.y,
    };
  }

  /**
   * カメラの状態をコピー
   */
  getState(): CameraState {
    return {
      x: this.x,
      y: this.y,
      scale: this.scale,
    };
  }

  /**
   * カメラの状態を復元
   */
  setState(state: CameraState) {
    this.x = state.x;
    this.y = state.y;
    this.scale = state.scale;
  }
}
