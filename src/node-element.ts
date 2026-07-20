import { DiagramElement } from "./diagram-element.js";
import type { NodeSpec } from "./types.js";

/**
 * ノード要素の抽象クラス
 * ClassElement, MethodElement, InterfaceElement などの基底クラス
 */
export abstract class NodeElement extends DiagramElement {
  constructor(spec: NodeSpec) {
    super(spec);
  }

  /**
   * 要素の中心座標を取得（レイアウト計算用）
   */
  getCenterPosition(): { x: number; y: number } {
    const bounds = this.getBounds();
    return {
      x: bounds.left + bounds.width / 2,
      y: bounds.top + bounds.height / 2,
    };
  }

  /**
   * 接続点の座標を取得（矢印描画用、Canvas移行時に使用）
   */
  getConnectorPosition(
    side: "top" | "right" | "bottom" | "left"
  ): { x: number; y: number } {
    const bounds = this.getBounds();
    const centerX = bounds.left + bounds.width / 2;
    const centerY = bounds.top + bounds.height / 2;

    switch (side) {
      case "top":
        return { x: centerX, y: bounds.top };
      case "bottom":
        return { x: centerX, y: bounds.bottom };
      case "left":
        return { x: bounds.left, y: centerY };
      case "right":
        return { x: bounds.right, y: centerY };
    }
  }
}
