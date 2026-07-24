import { Arrow } from "./arrow.js";
import type { ArrowSpec, NodeBounds } from "./types.js";

type Point = {
  x: number;
  y: number;
};

const SVG_NS = "http://www.w3.org/2000/svg";

export class ArrowLayer {
  private readonly svg: SVGSVGElement;
  private readonly nodeBounds: Map<string, NodeBounds>;
  private readonly layer: SVGGElement;
  private readonly arrows: Arrow[] = [];

  constructor(svg: SVGSVGElement, nodeBounds: Map<string, NodeBounds>) {
    this.svg = svg;
    this.nodeBounds = nodeBounds;
    this.layer = this.createArrowLayer();
    this.ensureDefs();
  }

  addArrow(spec: ArrowSpec): string {
    const arrow = new Arrow(spec);
    this.arrows.push(arrow);
    return arrow.id;
  }

  getArrows(): ArrowSpec[] {
    return this.arrows.map((arrow) => ({
      id: arrow.id,
      fromId: arrow.fromId,
      toId: arrow.toId,
    }));
  }

  render(): void {
    this.layer.replaceChildren();

    for (const arrow of this.arrows) {
      const from = this.nodeBounds.get(arrow.fromId);
      const to = this.nodeBounds.get(arrow.toId);

      if (!from || !to) continue;

      const endpoints = this.resolveEndpoints(from, to);

      const line = document.createElementNS(SVG_NS, "line");
      line.classList.add("arrow-line");
      line.setAttribute("x1", String(endpoints.from.x));
      line.setAttribute("y1", String(endpoints.from.y));
      line.setAttribute("x2", String(endpoints.to.x));
      line.setAttribute("y2", String(endpoints.to.y));

      this.layer.appendChild(line);
    }
  }

  private createArrowLayer(): SVGGElement {
    const g = document.createElementNS(SVG_NS, "g");
    g.classList.add("arrow-layer");
    this.svg.appendChild(g);
    return g;
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
}