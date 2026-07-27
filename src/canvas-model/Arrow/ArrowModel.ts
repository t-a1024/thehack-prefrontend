import { ArrowView } from "../../canvas-view/Arrow/ArrowView.js";
import type { ICanvasArrowModel } from "../../interfaces/canvas-model/ICanvasArrowModel.js";

export interface ArrowModelInit {
  id?: string;
  fromId: string;
  toId: string;
}

export class ArrowModel implements ICanvasArrowModel {
  public static readonly KIND = "arrow";

  public readonly id: string;
  public readonly kind: ArrowView;
  public readonly fromId: string;
  public readonly toId: string;

  constructor(init: ArrowModelInit) {
    this.id = init.id ?? ArrowModel.generateId();
    this.kind = new ArrowView(this.id);
    this.fromId = init.fromId;
    this.toId = init.toId;
  }

  private static generateId(): string {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
      return crypto.randomUUID();
    }
    return `arrow-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }
}
