import { DiagramElement } from "./diagram-element.js";
import type { NodeSpec } from "./types.js";

/**
 * 接続要素の抽象クラス
 * ArrowElement などの基底クラス
 * 現在は形だけ実装、機能は後回し
 */
export abstract class ConnectionElement extends DiagramElement {
  constructor(spec: NodeSpec) {
    super(spec);
  }

  /**
   * 接続を更新（ノード位置が変わった時など）
   * 機能実装は後回し
   */
  update(): void {
    // TODO: 実装予定
  }
}
