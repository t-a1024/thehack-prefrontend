import { Arrow } from "./arrow.js";
import { ArrowNode } from "./arrow-node.js";
import type { Camera } from "./camera.js";
import type { ArrowSpec } from "./types.js";

type Box = {
  left: number;
  top: number;
  width: number;
  height: number;
};

type Point = {
  x: number;
  y: number;
};

const SVG_NS = "http://www.w3.org/2000/svg";

export class ArrowLayer {
  private readonly root: HTMLElement;
  private readonly camera: Camera;
  private readonly nodeMap: Map<string, HTMLDetailsElement>;

  private readonly svg: SVGSVGElement;
  private readonly group: SVGGElement;

  private readonly arrows: Arrow[] = [];

  constructor(
    root: HTMLElement,
    camera: Camera,
    nodeMap: Map<string, HTMLDetailsElement>
  ) {
    this.root = root;
    this.camera = camera;
    this.nodeMap = nodeMap;

    this.svg = this.createArrowLayer();
    this.group = this.createArrowGroup();
  }

  addArrow(spec: ArrowSpec): string {
    const arrow = new Arrow(spec);
    this.arrows.push(arrow);
    this.render();
    return arrow.id;
  }

  render(): void {
    while (this.group.firstChild) {
      this.group.removeChild(this.group.firstChild);
    }

    for (const arrow of this.arrows) {
      const from = this.nodeMap.get(arrow.fromId);
      const to = this.nodeMap.get(arrow.toId);
      if (!from || !to) continue;

      const fromBox = this.getNodeBox(from);
      const toBox = this.getNodeBox(to);

      const endpoints = this.resolveEndpoints(fromBox, toBox);

      const p1 = this.camera.toScreen(endpoints.from.x, endpoints.from.y);
      const p2 = this.camera.toScreen(endpoints.to.x, endpoints.to.y);

      const arrowNode = new ArrowNode();
      arrowNode.update(p1, p2);
      this.group.appendChild(arrowNode.element);
    }
  }

  private createArrowLayer(): SVGSVGElement {
    const svg = document.createElementNS(SVG_NS, "svg");
    svg.classList.add("arrow-layer");

    const defs = document.createElementNS(SVG_NS, "defs");
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
    svg.appendChild(defs);

    this.root.appendChild(svg);
    return svg;
  }

  private createArrowGroup(): SVGGElement {
    const g = document.createElementNS(SVG_NS, "g");
    this.svg.appendChild(g);
    return g;
  }

  private getNodeBox(node: HTMLDetailsElement): Box {
    return {
      left: node.offsetLeft,
      top: node.offsetTop,
      width: node.offsetWidth,
      height: node.offsetHeight,
    };
  }

  private resolveEndpoints(fromBox: Box, toBox: Box): { from: Point; to: Point } {
    const fromCenterX = fromBox.left + fromBox.width / 2;
    const fromCenterY = fromBox.top + fromBox.height / 2;
    const toCenterX = toBox.left + toBox.width / 2;
    const toCenterY = toBox.top + toBox.height / 2;

    let from: Point = { x: fromCenterX, y: fromCenterY };
    let to: Point = { x: toCenterX, y: toCenterY };

    if (toCenterY > fromCenterY) {
      from = { x: fromCenterX, y: fromBox.top + fromBox.height };
      to = { x: toCenterX, y: toBox.top };
    } else if (toCenterY < fromCenterY) {
      from = { x: fromCenterX, y: fromBox.top };
      to = { x: toCenterX, y: toBox.top + toBox.height };
    } else if (toCenterX > fromCenterX) {
      from = { x: fromBox.left + fromBox.width, y: fromCenterY };
      to = { x: toBox.left, y: toCenterY };
    } else if (toCenterX < fromCenterX) {
      from = { x: fromBox.left, y: fromCenterY };
      to = { x: toBox.left + toBox.width, y: toCenterY };
    }

    return { from, to };
  }
}