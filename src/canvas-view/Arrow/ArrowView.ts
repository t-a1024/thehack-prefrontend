import type { ICanvasArrowModel } from "../../interfaces/canvas-model/ICanvasArrowModel.js";
import type { ICanvasArrowView } from "../../interfaces/canvas-view/ICanvasArrowView.js";
import type { Point } from "../../types/types.js";

const SVG_NS = "http://www.w3.org/2000/svg";

export class ArrowView implements ICanvasArrowView {
  public readonly id: string;
  public readonly element: SVGLineElement;

  constructor(id: string) {
    this.id = id;
    this.element = document.createElementNS(SVG_NS, "line");
    this.element.classList.add("arrow-line");
  }

  public render(model: ICanvasArrowModel): void {
    this.element.setAttribute("data-arrow-id", model.id);
    this.element.setAttribute("x1", String(model.fromPoint.x));
    this.element.setAttribute("y1", String(model.fromPoint.y));
    this.element.setAttribute("x2", String(model.toPoint.x));
    this.element.setAttribute("y2", String(model.toPoint.y));
  }
}
