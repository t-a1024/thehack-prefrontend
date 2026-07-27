import { ArrowView } from "../../canvas-view/Arrow/ArrowView.js";
import type { ICanvasArrowModel } from "../../interfaces/canvas-model/ICanvasArrowModel.js";
import type { ICanvasElementModel } from "../../interfaces/canvas-model/ICanvasElementModel.js";
import type { ICanvasElementView } from "../../interfaces/canvas-view/ICanvasElementView.js";
import type { Point } from "../../types/types.js";

export interface ArrowModelInit {
  id?: string;
  fromId: string;
  toId: string;
}

export class ArrowModel implements ICanvasArrowModel {
  public readonly id: string;
  public readonly fromId: string;
  public readonly toId: string;

  public fromPoint: Point;
  public toPoint: Point;

  constructor(init: ArrowModelInit) {
    this.id = init.id ?? ArrowModel.generateId();
    this.fromId = init.fromId;
    this.toId = init.toId;

    this.fromPoint = { x:0, y:0 };
    this.toPoint = { x:0, y:0 };
  }

  createView(): ICanvasElementView<ICanvasElementModel> {
    return new ArrowView(this.id);
  }

  private static generateId(): string {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
      return crypto.randomUUID();
    }
    return `arrow-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }
}
