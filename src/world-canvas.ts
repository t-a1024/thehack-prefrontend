import { Camera } from "./camera.js";
import { ClassNode } from "./class-node.js";
import type { ClassNodeSpec } from "./types.js";

export class WorldCanvas {
  private root: HTMLElement;
  private viewport: HTMLDivElement;
  private scene: HTMLDivElement;
  private camera: Camera;

  private dragging = false;
  private dragStart = { x: 0, y: 0 };
  private cameraStart = { x: 0, y: 0 };

  constructor(root: HTMLElement, viewport: HTMLDivElement, scene: HTMLDivElement) {
    this.root = root;
    this.viewport = viewport;
    this.scene = scene;
    this.camera = new Camera();

    this.bindEvents();
    this.renderCamera();
  }

  addClassNode(spec: ClassNodeSpec): ClassNode {
    const node = new ClassNode(spec);
    this.scene.appendChild(node.element);
    return node;
  }

  private renderCamera(): void {
    const { x, y, scale } = this.camera;
    this.viewport.style.transform = `scale(${scale}) translate(${-x}px, ${-y}px)`;
  }

  private zoomAt(screenX: number, screenY: number, nextScale: number): void {
    const before = this.camera.toWorld(screenX, screenY);

    this.camera.scale = nextScale;
    this.camera.x = before.x - screenX / this.camera.scale;
    this.camera.y = before.y - screenY / this.camera.scale;

    this.renderCamera();
  }

  private bindEvents(): void {
    this.root.addEventListener("pointerdown", (e) => {
      const target = e.target as HTMLElement;

      if (target.closest(".class-card")) {
        return;
      }

      this.dragging = true;
      this.root.style.cursor = "grabbing";
      this.dragStart = { x: e.clientX, y: e.clientY };
      this.cameraStart = { x: this.camera.x, y: this.camera.y };
    });

    window.addEventListener("pointermove", (e) => {
      if (!this.dragging) return;

      const dx = e.clientX - this.dragStart.x;
      const dy = e.clientY - this.dragStart.y;

      this.camera.x = this.cameraStart.x - dx / this.camera.scale;
      this.camera.y = this.cameraStart.y - dy / this.camera.scale;

      this.renderCamera();
    });

    window.addEventListener("pointerup", () => {
      this.dragging = false;
      this.root.style.cursor = "grab";
    });

    this.root.addEventListener(
      "wheel",
      (e) => {
        e.preventDefault();

        const zoomFactor = Math.exp(-e.deltaY * 0.001);
        const nextScale = Math.min(3, Math.max(0.25, this.camera.scale * zoomFactor));

        this.zoomAt(e.clientX, e.clientY, nextScale);
      },
      { passive: false }
    );
  }
}