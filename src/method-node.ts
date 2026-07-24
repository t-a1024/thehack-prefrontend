import type { MethodNodeSpec } from "./types.js";

const SVG_NS = "http://www.w3.org/2000/svg";

export class MethodNode {
  public static readonly HEIGHT = 26;
  public static readonly PADDING_X = 12;

  public readonly spec: MethodNodeSpec;

  constructor(spec: MethodNodeSpec) {
    this.spec = spec;
  }

  createElement(x: number, y: number, width: number): SVGGElement {
    const g = document.createElementNS(SVG_NS, "g");
    g.classList.add("method-node");
    g.setAttribute("transform", `translate(${x}, ${y})`);

    const rect = document.createElementNS(SVG_NS, "rect");
    rect.classList.add("method-node-box");
    rect.setAttribute("x", "0");
    rect.setAttribute("y", "0");
    rect.setAttribute("width", String(width));
    rect.setAttribute("height", String(MethodNode.HEIGHT));
    rect.setAttribute("rx", "6");
    rect.setAttribute("ry", "6");

    const text = document.createElementNS(SVG_NS, "text");
    text.classList.add("method-label");
    text.setAttribute("x", String(MethodNode.PADDING_X));
    text.setAttribute("y", String(MethodNode.HEIGHT / 2));
    text.textContent = this.spec.label;

    g.appendChild(rect);
    g.appendChild(text);

    return g;
  }
}