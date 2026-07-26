import ELK from "elkjs/lib/elk.bundled.js";
import type { ICanvasPlacement } from "../interfaces/canvas-placement/ICanvasPlacement.js";
import type { ICanvasBlockModel } from "../interfaces/canvas-model/ICanvasBlockModel.js";
import type { ICanvasArrowModel } from "../interfaces/canvas-model/ICanvasArrowModel.js";

type ElkGraph = {
  id: string;
  layoutOptions: Record<string, string>;
  children: Array<{ id: string; width: number; height: number }>;
  edges: Array<{ id: string; sources: string[]; targets: string[] }>;
};

export class CanvasPlacementElk implements ICanvasPlacement {
  private readonly elk: ELK;

  constructor() {
    this.elk = new ELK({
      defaultLayoutOptions: {
        "elk.algorithm": "layered",
        "elk.direction": "DOWN",
      },
    });
  }

  public async layout(blocks: ICanvasBlockModel[], arrows: ICanvasArrowModel[]): Promise<ICanvasBlockModel[]> {
    if (blocks.length === 0) return [];

    const graph: ElkGraph = {
      id: "root",
      layoutOptions: {
        "elk.algorithm": "layered",
        "elk.direction": "DOWN",
      },
      children: blocks.map((block) => ({
        id: block.id,
        ...block.measure(),
      })),
      edges: arrows.map((arrow, index) => ({
        id: arrow.id ?? `arrow-${index}`,
        sources: [arrow.fromId],
        targets: [arrow.toId],
      })),
    };

    const result = await this.elk.layout(graph);

    const placed = new Map<string, { x?: number; y?: number }>(
      (result.children ?? []).map((child: { id: string; x?: number; y?: number }) => [child.id, child])
    );

    return blocks.map((block) => {
      const p = placed.get(block.id);
      block.x = p?.x ?? 0;
      block.y = p?.y ?? 0;
      return block;
    });
  }
}
