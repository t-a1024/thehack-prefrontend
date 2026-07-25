import { ArrowLayer } from "./arrow-layer.js";
import { Camera } from "./camera.js";
import { ClassNode } from "./class-node.js";
import { ElkPlacementManager } from "./layout.js";
import type { ArrowSpec, ClassNodeSpec, NodeBounds } from "./types.js";

const SVG_NS = "http://www.w3.org/2000/svg";

export class CanvasMain {
  private root: HTMLElement;
  private svg: SVGSVGElement;
  private nodeLayer: SVGGElement;

  private camera: Camera;

  private dragging = false;
  private dragStart = { x: 0, y: 0 };
  private cameraStart = { x: 0, y: 0 };

  private classSpecs = new Map<string, ClassNodeSpec & { id: string }>();
  private nodeMap = new Map<string, SVGGElement>();
  private nodeBounds = new Map<string, NodeBounds>();

  private arrowLayer: ArrowLayer;
  private layoutEngine: ElkPlacementManager;

  constructor(root: HTMLElement) {
    this.root = root;
    this.camera = new Camera();
    this.svg = this.createSvg();
    this.nodeLayer = this.createNodeLayer();

    this.arrowLayer = new ArrowLayer(this.svg, this.nodeBounds);
    this.layoutEngine = new ElkPlacementManager();

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

    this.nodeLayer.replaceChildren();
    this.nodeMap.clear();
    this.nodeBounds.clear();

    for (const spec of positionedNodes) {
      const node = new ClassNode(spec.id, spec);
      this.nodeLayer.appendChild(node.element);
      this.nodeMap.set(spec.id, node.element);
      this.nodeBounds.set(spec.id, {
        x: spec.x,
        y: spec.y,
        ...ClassNode.measure(spec),
      });
    }

    this.arrowLayer.render();
    this.renderCamera();
  }

  private createSvg(): SVGSVGElement {
    const svg = document.createElementNS(SVG_NS, "svg");
    svg.classList.add("diagram-svg");
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svg.setAttribute("preserveAspectRatio", "xMinYMin meet");
    this.root.appendChild(svg);
    return svg;
  }

  private createNodeLayer(): SVGGElement {
    const g = document.createElementNS(SVG_NS, "g");
    g.classList.add("node-layer");
    this.svg.appendChild(g);
    return g;
  }

  private renderCamera(): void {
    const width = this.root.clientWidth || 1;
    const height = this.root.clientHeight || 1;

    this.svg.setAttribute(
      "viewBox",
      `${this.camera.x} ${this.camera.y} ${width / this.camera.scale} ${height / this.camera.scale}`
    );

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

      if (target.closest(".class-node")) {
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

    window.addEventListener("resize", () => {
      this.renderCamera();
    });
  }
}