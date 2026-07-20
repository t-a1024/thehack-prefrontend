type Point = {
  x: number;
  y: number;
};

const SVG_NS = "http://www.w3.org/2000/svg";

export class ArrowNode {
  public readonly element: SVGLineElement;

  constructor() {
    this.element = document.createElementNS(SVG_NS, "line");
    this.element.classList.add("arrow-line");
  }

  update(from: Point, to: Point): void {
    this.element.setAttribute("x1", String(from.x));
    this.element.setAttribute("y1", String(from.y));
    this.element.setAttribute("x2", String(to.x));
    this.element.setAttribute("y2", String(to.y));
  }
}