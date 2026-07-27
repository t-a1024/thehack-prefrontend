import { MethodView } from "../../canvas-view/block/MethodView.js";
import type { ICanvasBlockModel } from "../../interfaces/canvas-model/ICanvasBlockModel.js";
import type { ICanvasElementView } from "../../interfaces/canvas-view/ICanvasElementView.js";

export interface MethodModelInit {
  id?: string;
  label: string;
  x?: number;
  y?: number;
}

export class MethodModel implements ICanvasBlockModel {
  public static readonly WIDTH = 216;
  public static readonly HEIGHT = 26;
  public static readonly PADDING_X = 12;

  public readonly id: string;
  public label: string;
  public x: number;
  public y: number;

  constructor(init: MethodModelInit) {
    this.id = init.id ?? MethodModel.generateId();
    this.label = init.label;
    this.x = init.x ?? 0;
    this.y = init.y ?? 0;
  }

  createView(): ICanvasElementView<this> {
    return new MethodView(this.id);
  }

  public measure(): { width: number; height: number } {
    return MethodModel.measure();
  }

  public static measure(): { width: number; height: number } {
    return {
      width: MethodModel.WIDTH,
      height: MethodModel.HEIGHT,
    };
  }

  private static generateId(): string {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
      return crypto.randomUUID();
    }
    return `method-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }
}
