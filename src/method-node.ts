import type { MethodNodeSpec } from "./types.js";

export class MethodNode {
  public readonly spec: MethodNodeSpec;

  constructor(spec: MethodNodeSpec) {
    this.spec = spec;
  }

  createElement(): HTMLDivElement {
    const item = document.createElement("div");
    item.className = "method-item";
    item.textContent = this.spec.label;

    item.addEventListener("click", (_event) => {
      console.log(this.spec.label + " click");
    });

    return item;
  }
}
