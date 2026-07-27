import { ClassView } from "../../canvas-view/block/ClassView.js";
import type { ICanvasBlockModel } from "../../interfaces/canvas-model/ICanvasBlockModel.js";
import type { ICanvasElementModel } from "../../interfaces/canvas-model/ICanvasElementModel.js";
import type { ICanvasElementView } from "../../interfaces/canvas-view/ICanvasElementView.js";

export interface ClassModelInit {
  id?: string;
  name: string;
  children: ICanvasElementModel[];
  x?: number;
  y?: number;
}

function isCanvasBlockLike(model: ICanvasElementModel): model is ICanvasBlockModel {
  return typeof (model as Partial<ICanvasBlockModel>).measure === "function";
}

export class ClassModel implements ICanvasBlockModel {
  public static readonly WIDTH = 240;
  public static readonly PADDING = 12;
  public static readonly TITLE_HEIGHT = 28;
  public static readonly HEADER_GAP = 8;

  public readonly id: string;
  public name: string;
  public children: ICanvasElementModel[];
  public x: number;
  public y: number;

  constructor(init: ClassModelInit) {
    this.id = init.id ?? ClassModel.generateId();
    this.name = init.name;
    this.children = init.children;
    this.x = init.x ?? 0;
    this.y = init.y ?? 0;
  }

  createView(): ICanvasElementView<this> {
    return new ClassView(this.id)
  }

  public measure(): { width: number; height: number } {
    return ClassModel.measure(this);
  }

  public static measure(model: Pick<ClassModel, "children">): { width: number; height: number } {
    let widestChildWidth = 0;
    let childrenHeight = 0;

    for (const child of model.children) {
      if (!isCanvasBlockLike(child)) {
        continue;
      }

      const childSize = child.measure();
      widestChildWidth = Math.max(widestChildWidth, childSize.width);
      childrenHeight += childSize.height;
    }

    return {
      width: Math.max(ClassModel.WIDTH, widestChildWidth + ClassModel.PADDING * 2),
      height:
        ClassModel.PADDING * 2 +
        ClassModel.TITLE_HEIGHT +
        ClassModel.HEADER_GAP +
        childrenHeight,
    };
  }

  private static generateId(): string {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
      return crypto.randomUUID();
    }
    return `class-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }
}
