import { ConnectionElement } from "./connection-element.js";
import type { NodeSpec } from "./types.js";

/**
 * 矢印要素
 * 現在は形だけ実装、機能は後回し
 */
export class ArrowElement extends ConnectionElement {
  constructor(spec: NodeSpec) {
    super(spec);
  }

  protected createElementImpl(): SVGElement {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "arrow-element");
    svg.setAttribute("width", "200");
    svg.setAttribute("height", "50");
    svg.style.position = "absolute";
    svg.style.pointerEvents = "none";

    // 矢印の線
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", "10");
    line.setAttribute("y1", "25");
    line.setAttribute("x2", "180");
    line.setAttribute("y2", "25");
    line.setAttribute("stroke", "#666");
    line.setAttribute("stroke-width", "2");
    line.setAttribute("marker-end", "url(#arrowhead)");

    // 矢印の先端定義
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    const marker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
    marker.setAttribute("id", "arrowhead");
    marker.setAttribute("markerWidth", "10");
    marker.setAttribute("markerHeight", "10");
    marker.setAttribute("refX", "9");
    marker.setAttribute("refY", "3");
    marker.setAttribute("orient", "auto");

    const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    polygon.setAttribute("points", "0 0, 10 3, 0 6");
    polygon.setAttribute("fill", "#666");

    marker.appendChild(polygon);
    defs.appendChild(marker);

    svg.appendChild(defs);
    svg.appendChild(line);

    return svg;
  }

  protected getChildrenContainer(): HTMLElement {
    // 矢印は子要素を持たない
    return this.element;
  }

  protected onElementClick(_event: PointerEvent): void {
    // 矢印の機能は後回し
    console.log("Arrow clicked (feature not yet implemented)");
  }
}
