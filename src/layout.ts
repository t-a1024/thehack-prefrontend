import ELK from "elkjs/lib/elk.bundled.js";
import { ClassNode } from "./class-node.js";
import type {
  ArrowSpec,
  ClassNodeSpec,
  PositionedClassNodeSpec,
} from "./types.js";

type LayoutNodeSpec = ClassNodeSpec & { id: string };

type ElkGraph = {
  id: string;
  layoutOptions: Record<string, string>;
  children: Array<{ id: string; width: number; height: number }>;
  edges: Array<{ id: string; sources: string[]; targets: string[] }>;
};

export class ElkPlacementManager {
  private readonly elk: ELK;

  constructor() {
    this.elk = new ELK({
      defaultLayoutOptions: {
        "elk.algorithm": "layered",
        "elk.direction": "DOWN",
      },
    });
  }

  async layout(
    nodes: LayoutNodeSpec[],
    arrows: ArrowSpec[]
  ): Promise<PositionedClassNodeSpec[]> {
    if (nodes.length === 0) return [];

    const graph: ElkGraph = {
      id: "root",
      layoutOptions: {
        "elk.algorithm": "layered",
        "elk.direction": "DOWN",
      },
      children: nodes.map((node) => ({
        id: node.id,
        ...ClassNode.measure(node),
      })),
      edges: arrows.map((arrow, index) => ({
        id: arrow.id ?? `arrow-${index}`,
        sources: [arrow.fromId],
        targets: [arrow.toId],
      })),
    };

    const result = await this.elk.layout(graph);

    const placed = new Map(
      (result.children ?? []).map((child) => [child.id, child])
    );

    return nodes.map((node) => {
      const p = placed.get(node.id);
      return {
        ...node,
        x: p?.x ?? 0,
        y: p?.y ?? 0,
      };
    });
  }
}