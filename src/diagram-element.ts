import type { NodeSpec } from "./types.js";

/**
 * 全ての図要素の抽象基底クラス
 */
export abstract class DiagramElement {
  public readonly id: string;
  protected spec: NodeSpec;
  public readonly element: HTMLElement;
  protected children: DiagramElement[] = [];

  constructor(spec: NodeSpec) {
    this.id = spec.id ?? generateId();
    this.spec = spec;
    this.element = this.createElementWithEventListener();
  }

  /**
   * 内部用：要素作成とイベントリスナーの追加
   */
  private createElementWithEventListener(): HTMLElement {
    const element = this.createElementImpl();

    // クリックイベントをバインド
    element.addEventListener("click", (e) => {
      e.stopPropagation();
      this.onElementClick(e as PointerEvent);
    });

    return element;
  }

  /**
   * サブクラスで実装：実際のDOM要素を生成
   */
  protected abstract createElementImpl(): HTMLElement;

  /**
   * サブクラスで実装：クリック時の動作
   */
  protected abstract onElementClick(event: PointerEvent): void;

  /**
   * 子要素を追加
   */
  addChild(child: DiagramElement) {
    this.children.push(child);
    this.getChildrenContainer().appendChild(child.element);
  }

  /**
   * 子要素を削除
   */
  removeChild(child: DiagramElement) {
    const index = this.children.indexOf(child);
    if (index > -1) {
      this.children.splice(index, 1);
      child.element.remove();
    }
  }

  /**
   * サブクラスで実装：子要素を配置するコンテナを返す
   */
  protected abstract getChildrenContainer(): HTMLElement;

  /**
   * 要素の実際のサイズを取得
   */
  getSize(): { width: number; height: number } {
    const rect = this.element.getBoundingClientRect();
    return {
      width: rect.width,
      height: rect.height,
    };
  }

  /**
   * 親要素内でのオフセット位置を取得
   */
  getOffset(): { top: number; left: number } {
    return {
      top: this.element.offsetTop,
      left: this.element.offsetLeft,
    };
  }

  /**
   * 要素の実際の矩形情報を取得
   */
  getBounds(): DOMRect {
    return this.element.getBoundingClientRect();
  }

  /**
   * 要素にスタイルを設定
   */
  setStyle(styles: Partial<CSSStyleDeclaration>) {
    Object.assign(this.element.style, styles);
  }
}

/**
 * ユーティリティ関数：一意のIDを生成
 */
function generateId(): string {
  return `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
