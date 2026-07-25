import type { ICanvasBlockModel } from "../../interfaces/canvas-model/ICanvasBlockModel.js";
import { MethodModel } from "./MethodModel.js";

export interface ClassModelInit {
  id?: string;
  name: string;
  methods: MethodModel[];
  x?: number;
  y?: number;
}

export class ClassModel implements ICanvasBlockModel {
  public static readonly WIDTH = 240;
  public static readonly PADDING = 12;
  public static readonly TITLE_HEIGHT = 28;
  public static readonly HEADER_GAP = 8;

  public readonly id: string;
  public name: string;
  public methods: MethodModel[];
  public x: number;
  public y: number;

  constructor(init: ClassModelInit) {
    this.id = init.id ?? ClassModel.generateId();
    this.name = init.name;
    this.methods = init.methods;
    this.x = init.x ?? 0;
    this.y = init.y ?? 0;
  }

  public measure(): { width: number; height: number } {
    return ClassModel.measure(this);
  }

  public static measure(model: Pick<ClassModel, "methods">): { width: number; height: number } {
    return {
      width: ClassModel.WIDTH,
      height:
        ClassModel.PADDING * 2 +
        ClassModel.TITLE_HEIGHT +
        ClassModel.HEADER_GAP +
        model.methods.length * MethodModel.HEIGHT,
    };
  }

  private static generateId(): string {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
      return crypto.randomUUID();
    }
    return `class-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }
}
