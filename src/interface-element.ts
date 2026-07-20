import { NodeElement } from "./node-element.js";
import type { InterfaceNodeSpec } from "./types.js";

/**
 * インターフェース要素
 */
export class InterfaceElement extends NodeElement {
  public readonly spec: InterfaceNodeSpec;
  private childrenContainer: HTMLDivElement;

  constructor(spec: InterfaceNodeSpec) {
    super(spec);
    this.spec = spec as InterfaceNodeSpec;
  }

  protected createElementImpl(): HTMLDetailsElement {
    const card = document.createElement("details");
    card.className = "interface-card";
    card.open = true;
    card.style.position = "relative";
    card.style.width = "auto";
    card.style.padding = "8px";
    card.style.border = "2px dashed #0066cc";
    card.style.backgroundColor = "#e6f0ff";
    card.style.borderRadius = "4px";

    const summary = document.createElement("summary");
    summary.className = "interface-title";
    summary.style.cursor = "pointer";
    summary.style.fontWeight = "bold";
    summary.style.color = "#0066cc";
    summary.textContent = `<<interface>> ${this.spec.name}`;

    this.childrenContainer = document.createElement("div");
    this.childrenContainer.className = "children";
    this.childrenContainer.style.display = "flex";
    this.childrenContainer.style.flexDirection = "column";
    this.childrenContainer.style.gap = "8px";
    this.childrenContainer.style.marginTop = "8px";

    card.appendChild(summary);
    card.appendChild(this.childrenContainer);

    return card;
  }

  protected getChildrenContainer(): HTMLElement {
    return this.childrenContainer;
  }

  protected onElementClick(event: PointerEvent): void {
    const target = event.target as HTMLElement;

    // summary をクリックした場合は、details のデフォルト動作（開閉）に任せる
    if (target.tagName === "SUMMARY") {
      return;
    }

    console.log(`Interface "${this.spec.name}" clicked`);
  }
}
