import { Camera } from "./camera.js";
import { NodeElement } from "./node-element.js";
import { Scene } from "./scene.js";
import type { RootNodeSpec } from "./types.js";

/**
 * Viewport
 * シーンの表示、ユーザーインタラクション（パン・ズーム）を管理
 * 将来的には Canvas API にも対応可能な汎用的な名前
 */
export class Viewport {
  private root: HTMLElement;
  private viewportElement: HTMLDivElement;
  private scene: Scene;
  private camera: Camera;

  private dragging = false;
  private dragStart = { x: 0, y: 0 };
  private cameraStart = { x: 0, y: 0 };

  constructor(
    root: HTMLElement,
    viewportElement: HTMLDivElement,
    sceneElement: HTMLDivElement
  ) {
    this.root = root;
    this.viewportElement = viewportElement;
    this.scene = new Scene(sceneElement);
    this.camera = new Camera();

    this.bindEvents();
    this.renderCamera();
  }

  /**
   * シーンを取得
   */
  getScene(): Scene {
    return this.scene;
  }

  /**
   * カメラを取得
   */
  getCamera(): Camera {
    return this.camera;
  }

  /**
   * ルートレベルのノードを追加
   */
  addRootNode(node: NodeElement, x: number, y: number): NodeElement {
    this.scene.addRootNode(node, x, y);

    // DOM が描画されるまで待つ
    requestAnimationFrame(() => {
      const size = node.getSize();
      console.log(`Node "${node.id}" size:`, size);
    });

    return node;
  }

  /**
   * 任意のノードに子ノードを追加
   */
  addChildNode(parentId: string, child: NodeElement) {
    this.scene.addChildNode(parentId, child);
  }

  /**
   * カメラを基に viewport を描画
   */
  private renderCamera(): void {
    const { x, y, scale } = this.camera;
    this.viewportElement.style.transform = `scale(${scale}) translate(${-x}px, ${-y}px)`;
  }

  /**
   * マウス位置を中心にズーム
   */
  private zoomAt(screenX: number, screenY: number, nextScale: number): void {
    const before = this.camera.toWorld(screenX, screenY);

    this.camera.scale = nextScale;
    this.camera.x = before.x - screenX / this.camera.scale;
    this.camera.y = before.y - screenY / this.camera.scale;

    this.renderCamera();
  }

  /**
   * イベントリスナーをバインド
   */
  private bindEvents(): void {
    // ポインターダウン（ドラッグ開始）
    this.root.addEventListener("pointerdown", (e) => {
      const target = e.target as HTMLElement;

      // ノード上でのドラッグは除外
      if (target.closest(".class-card") || target.closest(".method-item") ||
          target.closest(".interface-card")) {
        return;
      }

      this.dragging = true;
      this.root.style.cursor = "grabbing";
      this.dragStart = { x: e.clientX, y: e.clientY };
      this.cameraStart = { x: this.camera.x, y: this.camera.y };
    });

    // ポインタームーブ（ドラッグ中のパン）
    window.addEventListener("pointermove", (e) => {
      if (!this.dragging) return;

      const dx = e.clientX - this.dragStart.x;
      const dy = e.clientY - this.dragStart.y;

      this.camera.x = this.cameraStart.x - dx / this.camera.scale;
      this.camera.y = this.cameraStart.y - dy / this.camera.scale;

      this.renderCamera();
    });

    // ポインターアップ（ドラッグ終了）
    window.addEventListener("pointerup", () => {
      this.dragging = false;
      this.root.style.cursor = "grab";
    });

    // ホイール（ズーム）
    this.root.addEventListener(
      "wheel",
      (e) => {
        e.preventDefault();

        // スケールを計算（0.25 ～ 3 の範囲）
        const zoomFactor = Math.exp(-e.deltaY * 0.001);
        const nextScale = Math.min(3, Math.max(0.25, this.camera.scale * zoomFactor));

        this.zoomAt(e.clientX, e.clientY, nextScale);
      },
      { passive: false }
    );
  }

  /**
   * ノードをドラッグ移動（将来機能）
   */
  moveRootNode(nodeId: string, deltaX: number, deltaY: number) {
    const pos = this.scene.getRootNodePosition(nodeId);
    if (pos) {
      this.scene.setRootNodePosition(nodeId, pos.x + deltaX, pos.y + deltaY);
    }
  }

  /**
   * ズームリセット
   */
  resetCamera() {
    this.camera.x = 0;
    this.camera.y = 0;
    this.camera.scale = 1;
    this.renderCamera();
  }
}
