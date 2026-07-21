import { Camera } from "./camera.js";
import { ArrowLayer } from "./arrow-layer.js";
import { ClassNode } from "./class-node.js";
import { ElkLayout } from "./layout.js";
import type { ArrowSpec, ClassNodeSpec } from "./types.js";

export class WorldCanvas {
  private root: HTMLElement;
  private viewport: HTMLDivElement;
  private scene: HTMLDivElement;

  private camera: Camera;

  private dragging = false;
  private dragStart = { x: 0, y: 0 };
  private cameraStart = { x: 0, y: 0 };

  private classSpecs = new Map<string, ClassNodeSpec & { id: string }>();
  private nodeMap = new Map<string, HTMLDetailsElement>();
  private arrowLayer: ArrowLayer;
  private layoutEngine: ElkLayout;

  constructor(root: HTMLElement, viewport: HTMLDivElement, scene: HTMLDivElement) {
    this.root = root;
    this.viewport = viewport;
    this.scene = scene;
    this.camera = new Camera();

    this.arrowLayer = new ArrowLayer(this.root, this.camera, this.nodeMap);
    this.layoutEngine = new ElkLayout();

    this.bindEvents();
    this.renderCamera();
  }

  addClassNode(spec: ClassNodeSpec): string {
    const id = spec.id ?? this.generateId();
    this.classSpecs.set(id, { ...spec, id });
    return id;
  }

  addArrow(spec: ArrowSpec): string {
    return this.arrowLayer.addArrow(spec);
  }

  async layout(): Promise<void> {
    const positionedNodes = await this.layoutEngine.layout(
      [...this.classSpecs.values()],
      this.arrowLayer.getArrows()
    );

    this.scene.replaceChildren();
    this.nodeMap.clear();

    for (const spec of positionedNodes) {
      const node = new ClassNode(spec.id, spec);
      this.scene.appendChild(node.element);
      this.nodeMap.set(spec.id, node.element);

      node.element.addEventListener("toggle", () => {
        this.arrowLayer.render();
      });
    }

    this.arrowLayer.render();
  }

  private renderCamera(): void {
    const { x, y, scale } = this.camera;
    this.viewport.style.transform = `scale(${scale}) translate(${-x}px, ${-y}px)`;
    this.arrowLayer.render();
  }

  private zoomAt(screenX: number, screenY: number, nextScale: number): void {
    const before = this.camera.toWorld(screenX, screenY);

    this.camera.scale = nextScale;
    this.camera.x = before.x - screenX / this.camera.scale;
    this.camera.y = before.y - screenY / this.camera.scale;

    this.renderCamera();
  }

  private generateId(): string {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
      return crypto.randomUUID();
    }
    return `node-${Date.now()}-${Math.random().toString(16).slice(2)}`;
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