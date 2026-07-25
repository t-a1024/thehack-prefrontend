import type { ICanvasArrowModel } from "../../interfaces/canvas-model/ICanvasArrowModel.js";

export interface ArrowModelInit {
  id?: string;
  fromId: string;
  toId: string;
}

export class ArrowModel implements ICanvasArrowModel {
  public readonly id: string;
  public readonly fromId: string;
  public readonly toId: string;

  constructor(init: ArrowModelInit) {
    this.id = init.id ?? ArrowModel.generateId();
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
