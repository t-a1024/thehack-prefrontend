import { ClassModel } from "../../canvas-model/block/ClassModel.js";
import { MethodModel } from "../../canvas-model/block/MethodModel.js";
import type { ICanvasBlockModel } from "../../interfaces/canvas-model/ICanvasBlockModel.js";
import type { ICanvasElementModel } from "../../interfaces/canvas-model/ICanvasElementModel.js";
import type { ICanvasBlockView } from "../../interfaces/canvas-view/ICanvasBlockView.js";
import { MethodView } from "./MethodView.js";

const SVG_NS = "http://www.w3.org/2000/svg";

function isCanvasBlockLike(model: ICanvasElementModel): model is ICanvasBlockModel {
  return typeof (model as Partial<ICanvasBlockModel>).measure === "function";
}

export class ClassView implements ICanvasBlockView<ClassModel> {
  public readonly id: string;
  public readonly element: SVGGElement;

  private model: ClassModel | null = null;

  constructor(id: string) {
    this.id = id;
    this.element = document.createElementNS(SVG_NS, "g");
    this.element.classList.add("class-node");
    this.element.setAttribute("data-node-id", this.id);
  }

  public measure(): { width: number; height: number } {
    return this.model ? this.model.measure() : ClassModel.measure({ children: [] });
  }

  public render(model: ICanvasBlockModel): void {
    const classModel = model as ClassModel;
    this.model = classModel;
    const { width, height } = classModel.measure();

    this.element.replaceChildren();
    this.element.setAttribute("transform", `translate(${classModel.x}, ${classModel.y})`);

    const box = document.createElementNS(SVG_NS, "rect");
    box.classList.add("class-node-box");
    box.setAttribute("x", "0");
    box.setAttribute("y", "0");
    box.setAttribute("width", String(width));
    box.setAttribute("height", String(height));
    box.setAttribute("rx", "10");
    box.setAttribute("ry", "10");

    const title = document.createElementNS(SVG_NS, "text");
    title.classList.add("class-title");
    title.setAttribute("x", String(ClassModel.PADDING));
    title.setAttribute("y", String(ClassModel.PADDING + ClassModel.TITLE_HEIGHT / 2));
    title.textContent = classModel.name;

    const separator = document.createElementNS(SVG_NS, "line");
    separator.classList.add("class-separator");
    separator.setAttribute("x1", String(ClassModel.PADDING));
    separator.setAttribute("x2", String(width - ClassModel.PADDING));
    separator.setAttribute(
      "y1",
      String(ClassModel.PADDING + ClassModel.TITLE_HEIGHT + ClassModel.HEADER_GAP / 2)
    );
    separator.setAttribute(
      "y2",
      String(ClassModel.PADDING + ClassModel.TITLE_HEIGHT + ClassModel.HEADER_GAP / 2)
    );

    this.element.appendChild(box);
    this.element.appendChild(title);
    this.element.appendChild(separator);

    const childrenStartY = ClassModel.PADDING + ClassModel.TITLE_HEIGHT + ClassModel.HEADER_GAP;
    let currentY = childrenStartY;

    for (const child of classModel.children) {
      if (!isCanvasBlockLike(child)) {
        continue;
      }

      child.x = ClassModel.PADDING;
      child.y = currentY;

      const childView = child.kind;
      childView.render(child);
      this.element.appendChild(childView.element);

      currentY += child.measure().height;
    }
  }
}
