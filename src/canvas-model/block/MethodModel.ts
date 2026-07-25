import type { ICanvasElementModel } from "../../interfaces/canvas-model/ICanvasElementModel.js";

export interface MethodModelInit {
  id?: string;
  label: string;
}

export class MethodModel implements ICanvasElementModel {
  public static readonly HEIGHT = 26;
  public static readonly PADDING_X = 12;

  public readonly id: string;
  public label: string;

  constructor(init: MethodModelInit) {
    this.id = init.id ?? MethodModel.generateId();
    this.label = init.label;
  }

  private static generateId(): string {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
      return crypto.randomUUID();
    }
    return `method-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }
}
