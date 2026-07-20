import { MethodNode } from "./method-node.js";
import type { ClassNodeSpec } from "./types.js";

export class ClassNode {
  public readonly id: string;
  public readonly spec: ClassNodeSpec;
  public readonly element: HTMLDetailsElement;

  constructor(id: string, spec: ClassNodeSpec) {
    this.id = id;
    this.spec = spec;
    this.element = this.createElement();
  }

  private createElement(): HTMLDetailsElement {
    const card = document.createElement("details");
    card.className = "class-card";
    card.open = true;
    card.dataset.nodeId = this.id;
    card.style.left = `${this.spec.x}px`;
    card.style.top = `${this.spec.y}px`;

    const summary = document.createElement("summary");
    summary.className = "class-title";
    summary.textContent = this.spec.name;

    const methods = document.createElement("div");
    methods.className = "methods";

    for (const methodSpec of this.spec.methods) {
      const methodNode = new MethodNode(methodSpec);
      methods.appendChild(methodNode.createElement());
    }

    card.appendChild(summary);
    card.appendChild(methods);

    return card;
  }
}