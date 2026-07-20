import { NodeElement } from "./node-element.js";
import type { MethodNodeSpec } from "./types.js";

/**
 * メソッド要素
 */
export class MethodElement extends NodeElement {
  public readonly spec: MethodNodeSpec;
  private childrenContainer: HTMLDivElement;
  private isExpanded: boolean = true;

  constructor(spec: MethodNodeSpec) {
    super(spec);
    this.spec = spec as MethodNodeSpec;
  }

  protected createElementImpl(): HTMLDivElement {
    const container = document.createElement("div");
    container.className = "method-item";
    container.style.position = "relative";
    container.style.width = "auto";
    container.style.padding = "8px";
    container.style.backgroundColor = "#f5f5f5";
    container.style.border = "1px solid #ddd";
    container.style.borderRadius = "4px";
    container.style.cursor = "pointer";

    const label = document.createElement("div");
    label.className = "method-label";
    label.textContent = this.spec.label;
    label.style.fontWeight = "500";

    this.childrenContainer = document.createElement("div");
    this.childrenContainer.className = "sub-methods";
    this.childrenContainer.style.display = "flex";
    this.childrenContainer.style.flexDirection = "column";
    this.childrenContainer.style.gap = "8px";
    this.childrenContainer.style.marginTop = "8px";
    this.childrenContainer.style.marginLeft = "16px";
    this.childrenContainer.style.borderLeft = "2px solid #ccc";
    this.childrenContainer.style.paddingLeft = "8px";

    // 子要素がない場合は非表示
    if (!this.spec.children || this.spec.children.length === 0) {
      this.childrenContainer.style.display = "none";
    }

    container.appendChild(label);
    container.appendChild(this.childrenContainer);

    return container;
  }

  protected getChildrenContainer(): HTMLElement {
    return this.childrenContainer;
  }

  protected onElementClick(event: PointerEvent): void {
    const target = event.target as HTMLElement;

    // method-label をクリックした場合は、展開/折畳を切り替える
    if (
      target === this.childrenContainer ||
      target.closest(".method-label") === this.element.querySelector(".method-label")
    ) {
      if (this.children.length > 0) {
        this.isExpanded = !this.isExpanded;
        this.childrenContainer.style.display = this.isExpanded ? "flex" : "none";
      }
      return;
    }

    console.log(`Method "${this.spec.label}" clicked`);
  }

  /**
   * 展開状態を設定
   */
  setExpanded(expanded: boolean) {
    this.isExpanded = expanded;
    if (this.children.length > 0) {
      this.childrenContainer.style.display = expanded ? "flex" : "none";
    }
  }

  /**
   * 展開状態を取得
   */
  getIsExpanded(): boolean {
    return this.isExpanded;
  }
}
