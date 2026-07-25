import { ArrowModel } from "./canvas-model/Arrow/ArrowModel.js";
import { ClassModel } from "./canvas-model/block/ClassModel.js";
import { Camera } from "./canvas-camera/Camera.js";
import { ArrowView } from "./canvas-view/Arrow/ArrowView.js";
import { ClassView } from "./canvas-view/block/ClassView.js";
import { CanvasPlacementElk } from "./canvas-placement/CanvasPlacementElk.js";
import type { ICamera } from "./interfaces/canvas-camera/ICamera.js";
import type { ICanvasPlacement } from "./interfaces/canvas-placement/ICanvasPlacement.js";

const SVG_NS = "http://www.w3.org/2000/svg";

type NodeBounds = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type Point = {
  x: number;
  y: number;
};

export class CanvasMain {
  private readonly root: HTMLElement;
  private readonly svg: SVGSVGElement;
  private readonly nodeLayer: SVGGElement;
  private readonly arrowLayer: SVGGElement;

  private readonly camera: ICamera;

  private dragging = false;
  private dragStart = { x: 0, y: 0 };
  private cameraStart = { x: 0, y: 0 };

  private readonly classModels = new Map<string, ClassModel>();
  private readonly arrowModels = new Map<string, ArrowModel>();
  private readonly nodeBounds = new Map<string, NodeBounds>();

  private readonly placementEngine: ICanvasPlacement<ClassModel, ArrowModel>;

  constructor(root: HTMLElement) {
    this.root = root;
    this.camera = new Camera();
    this.svg = this.createSvg();
    this.arrowLayer = this.createArrowLayer();
    this.nodeLayer = this.createNodeLayer();
    this.placementEngine = new CanvasPlacementElk();

    this.bindEvents();
    this.renderCamera();
  }

  public addClassNode(model: ClassModel): string {
    this.classModels.set(model.id, model);
    return model.id;
  }

  public addArrow(model: ArrowModel): string {
    this.arrowModels.set(model.id, model);
    return model.id;
  }

  public async layout(): Promise<void> {
    const positionedNodes = await this.placementEngine.layout(
      [...this.classModels.values()],
      [...this.arrowModels.values()]
    );

    this.nodeLayer.replaceChildren();
    this.nodeBounds.clear();

    for (const model of positionedNodes) {
      const view = new ClassView(model.id);
      view.render(model);
      this.nodeLayer.appendChild(view.element);
      this.nodeBounds.set(model.id, {
        x: model.x,
        y: model.y,
        ...model.measure(),
      });
    }

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

  private createArrowLayer(): SVGGElement {
    const g = document.createElementNS(SVG_NS, "g");
    g.classList.add("arrow-layer");
    this.svg.appendChild(g);
    return g;
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

    this.renderArrows();
  }

  private renderArrows(): void {
    this.ensureDefs();
    this.arrowLayer.replaceChildren();

    for (const arrowModel of this.arrowModels.values()) {
      const from = this.nodeBounds.get(arrowModel.fromId);
      const to = this.nodeBounds.get(arrowModel.toId);

      if (!from || !to) continue;

      const endpoints = this.resolveEndpoints(from, to);
      const arrowView = new ArrowView(arrowModel.id, endpoints.from, endpoints.to);
      arrowView.render(arrowModel);
      this.arrowLayer.appendChild(arrowView.element);
    }
  }

  private ensureDefs(): void {
    let defs = this.svg.querySelector("defs");
    if (!defs) {
      defs = document.createElementNS(SVG_NS, "defs");
      this.svg.insertBefore(defs, this.svg.firstChild);
    }

    if (defs.querySelector("#arrowhead")) return;

    const marker = document.createElementNS(SVG_NS, "marker");
    marker.setAttribute("id", "arrowhead");
    marker.setAttribute("markerWidth", "10");
    marker.setAttribute("markerHeight", "10");
    marker.setAttribute("refX", "8");
    marker.setAttribute("refY", "3");
    marker.setAttribute("orient", "auto");
    marker.setAttribute("markerUnits", "strokeWidth");

    const path = document.createElementNS(SVG_NS, "path");
    path.setAttribute("d", "M0,0 L8,3 L0,6 Z");
    path.setAttribute("fill", "#555");

    marker.appendChild(path);
    defs.appendChild(marker);
  }

  private resolveEndpoints(from: NodeBounds, to: NodeBounds): { from: Point; to: Point } {
    const fromCenterX = from.x + from.width / 2;
    const fromCenterY = from.y + from.height / 2;
    const toCenterX = to.x + to.width / 2;
    const toCenterY = to.y + to.height / 2;

    let start: Point = { x: fromCenterX, y: fromCenterY };
    let end: Point = { x: toCenterX, y: toCenterY };

    if (toCenterY > fromCenterY) {
      start = { x: fromCenterX, y: from.y + from.height };
      end = { x: toCenterX, y: to.y };
    } else if (toCenterY < fromCenterY) {
      start = { x: fromCenterX, y: from.y };
      end = { x: toCenterX, y: to.y + to.height };
    } else if (toCenterX > fromCenterX) {
      start = { x: from.x + from.width, y: fromCenterY };
      end = { x: to.x, y: toCenterY };
    } else if (toCenterX < fromCenterX) {
      start = { x: from.x, y: fromCenterY };
      end = { x: to.x + to.width, y: toCenterY };
    }

    return { from: start, to: end };
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
