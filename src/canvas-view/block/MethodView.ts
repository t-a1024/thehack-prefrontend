import type { ICanvasBlockModel } from "../../interfaces/canvas-model/ICanvasBlockModel.js";
import type { ICanvasBlockView } from "../../interfaces/canvas-view/ICanvasBlockView.js";
import { MethodModel } from "../../canvas-model/block/MethodModel.js";

const SVG_NS = "http://www.w3.org/2000/svg";

export class MethodView implements ICanvasBlockView<MethodModel> {
  public readonly id: string;
  public readonly element: SVGGElement;

  private model: MethodModel | null = null;

  constructor(id: string) {
    this.id = id;
    this.element = document.createElementNS(SVG_NS, "g");
    this.element.classList.add("method-node");
    this.element.setAttribute("data-node-id", this.id);
  }

  public measure(): { width: number; height: number } {
    return this.model ? this.model.measure() : MethodModel.measure();
  }

  public render(model: ICanvasBlockModel): void {
    const methodModel = model as MethodModel;
    this.model = methodModel;
    const { width, height } = methodModel.measure();

    this.element.replaceChildren();
    this.element.setAttribute("transform", `translate(${methodModel.x}, ${methodModel.y})`);

    const rect = document.createElementNS(SVG_NS, "rect");
    rect.classList.add("method-node-box");
    rect.setAttribute("x", "0");
    rect.setAttribute("y", "0");
    rect.setAttribute("width", String(width));
    rect.setAttribute("height", String(height));
    rect.setAttribute("rx", "6");
    rect.setAttribute("ry", "6");

    const text = document.createElementNS(SVG_NS, "text");
    text.classList.add("method-label");
    text.setAttribute("x", String(MethodModel.PADDING_X));
    text.setAttribute("y", String(MethodModel.HEIGHT / 2));
    text.textContent = methodModel.label;

    this.element.appendChild(rect);
    this.element.appendChild(text);
  }
}
