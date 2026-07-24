import { MethodNode } from "./method-node.js";
import type { PositionedClassNodeSpec } from "./types.js";

const SVG_NS = "http://www.w3.org/2000/svg";

export class ClassNode {
  public static readonly WIDTH = 240;
  public static readonly PADDING = 12;
  public static readonly TITLE_HEIGHT = 28;
  public static readonly HEADER_GAP = 8;

  public readonly id: string;
  public readonly spec: PositionedClassNodeSpec;
  public readonly element: SVGGElement;

  constructor(id: string, spec: PositionedClassNodeSpec) {
    this.id = id;
    this.spec = spec;
    this.element = this.createElement();
  }

  static measure(spec: Pick<PositionedClassNodeSpec, "methods">): { width: number; height: number } {
    return {
      width: ClassNode.WIDTH,
      height:
        ClassNode.PADDING * 2 +
        ClassNode.TITLE_HEIGHT +
        ClassNode.HEADER_GAP +
        spec.methods.length * MethodNode.HEIGHT,
    };
  }

  private createElement(): SVGGElement {
    const { width, height } = ClassNode.measure(this.spec);

    const g = document.createElementNS(SVG_NS, "g");
    g.classList.add("class-node");
    g.setAttribute("data-node-id", this.id);
    g.setAttribute("transform", `translate(${this.spec.x}, ${this.spec.y})`);

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
    title.setAttribute("x", String(ClassNode.PADDING));
    title.setAttribute("y", String(ClassNode.PADDING + ClassNode.TITLE_HEIGHT / 2));
    title.textContent = this.spec.name;

    const separator = document.createElementNS(SVG_NS, "line");
    separator.classList.add("class-separator");
    separator.setAttribute("x1", String(ClassNode.PADDING));
    separator.setAttribute("x2", String(width - ClassNode.PADDING));
    separator.setAttribute(
      "y1",
      String(ClassNode.PADDING + ClassNode.TITLE_HEIGHT + ClassNode.HEADER_GAP / 2)
    );
    separator.setAttribute(
      "y2",
      String(ClassNode.PADDING + ClassNode.TITLE_HEIGHT + ClassNode.HEADER_GAP / 2)
    );

    g.appendChild(box);
    g.appendChild(title);
    g.appendChild(separator);

    const methodsStartY = ClassNode.PADDING + ClassNode.TITLE_HEIGHT + ClassNode.HEADER_GAP;
    const methodWidth = width - ClassNode.PADDING * 2;

    this.spec.methods.forEach((methodSpec, index) => {
      const methodNode = new MethodNode(methodSpec);
      const methodY = methodsStartY + index * MethodNode.HEIGHT;
      g.appendChild(methodNode.createElement(ClassNode.PADDING, methodY, methodWidth));
    });

    return g;
  }
}