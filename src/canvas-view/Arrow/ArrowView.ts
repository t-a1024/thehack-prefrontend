import type { ICanvasArrowView } from "../../interfaces/canvas-view/ICanvasArrowView.js";
import type { ICanvasArrowModel } from "../../interfaces/canvas-model/ICanvasArrowModel.js";

const SVG_NS = "http://www.w3.org/2000/svg";

type Point = {
  x: number;
  y: number;
};

export class ArrowView implements ICanvasArrowView {
  public readonly id: string;
  public readonly element: SVGLineElement;

  private readonly from: Point;
  private readonly to: Point;

  constructor(id: string, from: Point, to: Point) {
    this.id = id;
    this.from = from;
    this.to = to;
    this.element = document.createElementNS(SVG_NS, "line");
    this.element.classList.add("arrow-line");
  }

  public render(model: ICanvasArrowModel): void {
    this.element.setAttribute("data-arrow-id", model.id);
    this.element.setAttribute("x1", String(this.from.x));
    this.element.setAttribute("y1", String(this.from.y));
    this.element.setAttribute("x2", String(this.to.x));
    this.element.setAttribute("y2", String(this.to.y));
  }
}
