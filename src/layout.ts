import type { ClassNodeSpec, PositionedClassNodeSpec } from "./types.js";

export class SimpleLayout {
  constructor(
    private readonly startX = 100,
    private readonly startY = 100,
    private readonly gapY = 220
  ) {}

  layout(nodes: Array<ClassNodeSpec & { id: string }>): PositionedClassNodeSpec[] {
    return nodes.map((node, index) => ({
      ...node,
      x: this.startX,
      y: this.startY + index * this.gapY,
    }));
  }
}