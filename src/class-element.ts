import { NodeElement } from "./node-element.js";
import type { ClassNodeSpec } from "./types.js";

/**
 * クラス要素
 */
export class ClassElement extends NodeElement {
  public readonly spec: ClassNodeSpec;
  private childrenContainer: HTMLDivElement;

  constructor(spec: ClassNodeSpec) {
    super(spec);
    this.spec = spec as ClassNodeSpec;
  }

  protected createElementImpl(): HTMLDetailsElement {
    const card = document.createElement("details");
    card.className = "class-card";
    card.open = true;
    card.style.position = "relative";
    card.style.width = "auto";
    card.style.padding = "8px";
    card.style.border = "1px solid #ccc";
    card.style.backgroundColor = "white";
    card.style.borderRadius = "4px";

    const summary = document.createElement("summary");
    summary.className = "class-title";
    summary.style.cursor = "pointer";
    summary.style.fontWeight = "bold";
    summary.textContent = this.spec.name;

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

    console.log(`Class "${this.spec.name}" clicked`);
  }
}
