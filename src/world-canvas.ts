import { Camera } from "./camera.js";
import { ClassNode } from "./class-node.js";
import type { ArrowSpec, ClassNodeSpec } from "./types.js";

const SVG_NS = "http://www.w3.org/2000/svg";

export class WorldCanvas {
  private root: HTMLElement;
  private viewport: HTMLDivElement;
  private scene: HTMLDivElement;

  private arrowSvg: SVGSVGElement;
  private arrowGroup: SVGGElement;

  private camera: Camera;

  private dragging = false;
  private dragStart = { x: 0, y: 0 };
  private cameraStart = { x: 0, y: 0 };

  private nodeMap = new Map<string, HTMLDetailsElement>();
  private arrows: ArrowSpec[] = [];

  constructor(root: HTMLElement, viewport: HTMLDivElement, scene: HTMLDivElement) {
    this.root = root;
    this.viewport = viewport;
    this.scene = scene;
    this.camera = new Camera();

    this.arrowSvg = this.createArrowLayer();
    this.arrowGroup = this.createArrowGroup();

    this.bindEvents();
    this.renderCamera();
    this.renderArrows();
  }

  addClassNode(spec: ClassNodeSpec): string {
    const id = spec.id ?? this.generateId();
    const node = new ClassNode(spec);
    this.scene.appendChild(node.element);
    

    this.nodeMap.set(id, node.element);
    this.renderArrows();

    return id;
  }

  //   const id = spec.id ?? this.generateId();

  //   const card = document.createElement("details");
  //   card.className = "class-card";
  //   card.open = true;
  //   card.dataset.nodeId = id;
  //   card.style.left = `${spec.x}px`;
  //   card.style.top = `${spec.y}px`;

  //   const summary = document.createElement("summary");
  //   summary.className = "class-title";
  //   summary.textContent = spec.name;

  //   const methods = document.createElement("div");
  //   methods.className = "methods";

  //   for (const methodName of spec.methods) {
  //     const item = document.createElement("div");
  //     item.className = "method-item";
  //     item.textContent = methodName;
  //     methods.appendChild(item);
  //   }

  //   card.appendChild(summary);
  //   card.appendChild(methods);
  //   this.scene.appendChild(card);

  //   card.addEventListener("toggle", () => {
  //     this.renderArrows();
  //   });

  //   this.nodeMap.set(id, card);
  //   this.renderArrows();

  //   return id;
  // }

  addArrow(spec: ArrowSpec): void {
    this.arrows.push(spec);
    this.renderArrows();
  }

  private createArrowLayer(): SVGSVGElement {
    const svg = document.createElementNS(SVG_NS, "svg");
    svg.style.position = "absolute";
    svg.style.left = "0";
    svg.style.top = "0";
    svg.style.width = "100%";
    svg.style.height = "100%";
    svg.style.pointerEvents = "none";
    svg.style.overflow = "visible";

    const defs = document.createElementNS(SVG_NS, "defs");
    const marker = document.createElementNS(SVG_NS, "marker");
    marker.setAttribute("id", "arrowhead");
    marker.setAttribute("markerWidth", "10");
    marker.setAttribute("markerHeight", "10");
    marker.setAttribute("refX", "8");
    marker.setAttribute("refY", "3");
    marker.setAttribute("orient", "auto");
    marker.setAttribute("markerUnits", "strokeWidth");

    const arrowPath = document.createElementNS(SVG_NS, "path");
    arrowPath.setAttribute("d", "M0,0 L8,3 L0,6 Z");
    arrowPath.setAttribute("fill", "#555");

    marker.appendChild(arrowPath);
    defs.appendChild(marker);
    svg.appendChild(defs);

    this.root.appendChild(svg);
    return svg;
  }

  private createArrowGroup(): SVGGElement {
    const g = document.createElementNS(SVG_NS, "g");
    this.arrowSvg.appendChild(g);
    return g;
  }

  private renderCamera(): void {
    const { x, y, scale } = this.camera;
    this.viewport.style.transform = `scale(${scale}) translate(${-x}px, ${-y}px)`;
    this.renderArrows();
  }

  private zoomAt(screenX: number, screenY: number, nextScale: number): void {
    const before = this.camera.toWorld(screenX, screenY);

    this.camera.scale = nextScale;
    this.camera.x = before.x - screenX / this.camera.scale;
    this.camera.y = before.y - screenY / this.camera.scale;

    this.renderCamera();
  }

  private renderArrows(): void {
    while (this.arrowGroup.firstChild) {
      this.arrowGroup.removeChild(this.arrowGroup.firstChild);
    }

    for (const arrow of this.arrows) {
      const from = this.nodeMap.get(arrow.fromId);
      const to = this.nodeMap.get(arrow.toId);

      if (!from || !to) {
        continue;
      }

      const fromBox = this.getNodeBox(from);
      const toBox = this.getNodeBox(to);

      const fromCenterX = fromBox.left + fromBox.width / 2;
      const fromCenterY = fromBox.top + fromBox.height / 2;
      const toCenterX = toBox.left + toBox.width / 2;
      const toCenterY = toBox.top + toBox.height / 2;

      let x1 = fromCenterX;
      let y1 = fromCenterY;
      let x2 = toCenterX;
      let y2 = toCenterY;

      if (toCenterY > fromCenterY) {
        x1 = fromCenterX;
        y1 = fromBox.top + fromBox.height;
        x2 = toCenterX;
        y2 = toBox.top;
      } else if (toCenterY < fromCenterY) {
        x1 = fromCenterX;
        y1 = fromBox.top;
        x2 = toCenterX;
        y2 = toBox.top + toBox.height;
      } else if (toCenterX > fromCenterX) {
        x1 = fromBox.left + fromBox.width;
        y1 = fromCenterY;
        x2 = toBox.left;
        y2 = toCenterY;
      } else {
        x1 = fromBox.left;
        y1 = fromCenterY;
        x2 = toBox.left + toBox.width;
        y2 = toCenterY;
      }

      const p1 = this.camera.toScreen
        ? this.camera.toScreen(x1, y1)
        : { x: (x1 - this.camera.x) * this.camera.scale, y: (y1 - this.camera.y) * this.camera.scale };

      const p2 = this.camera.toScreen
        ? this.camera.toScreen(x2, y2)
        : { x: (x2 - this.camera.x) * this.camera.scale, y: (y2 - this.camera.y) * this.camera.scale };

      const line = document.createElementNS(SVG_NS, "line");
      line.setAttribute("x1", String(p1.x));
      line.setAttribute("y1", String(p1.y));
      line.setAttribute("x2", String(p2.x));
      line.setAttribute("y2", String(p2.y));
      line.setAttribute("stroke", "#555");
      line.setAttribute("stroke-width", "2");
      line.setAttribute("marker-end", "url(#arrowhead)");

      this.arrowGroup.appendChild(line);
    }
  }

  private getNodeBox(node: HTMLDetailsElement) {
    return {
      left: node.offsetLeft,
      top: node.offsetTop,
      width: node.offsetWidth,
      height: node.offsetHeight,
    };
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