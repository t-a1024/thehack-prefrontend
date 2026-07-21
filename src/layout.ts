import ELK from "elkjs/lib/elk.bundled.js";

import type {
  ArrowSpec,
  ClassNodeSpec,
  PositionedClassNodeSpec,
} from "./types.js";

type LayoutNodeSpec = ClassNodeSpec & { id: string };

type MeasureSize = {
  width: number;
  height: number;
};

type ElkGraphNode = {
  id: string;
  width: number;
  height: number;
};

type ElkGraphEdge = {
  id: string;
  sources: string[];
  targets: string[];
};

type ElkGraph = {
  id: string;
  layoutOptions: {
    [key: string]: string;
  };
  children: ElkGraphNode[];
  edges: ElkGraphEdge[];
};

export class ElkLayout {
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
    if (nodes.length === 0) {
      return [];
    }

    const graph: ElkGraph = {
      id: "root",
      layoutOptions: {
        "elk.algorithm": "layered",
        "elk.direction": "DOWN",
      },
      children: nodes.map((node) => {
        const size = this.measureNode(node);
        return {
          id: node.id,
          width: size.width,
          height: size.height,
        };
      }),
      edges: arrows.map((arrow, index) => ({
        id: arrow.id ?? `arrow-${index}`,
        sources: [arrow.fromId],
        targets: [arrow.toId],
      })),
    };

    const result = await this.elk.layout(graph);

    const positionedById = new Map(
      (result.children ?? []).map((child) => [child.id, child])
    );

    return nodes.map((node) => {
      const placed = positionedById.get(node.id);

      return {
        ...node,
        x: placed?.x ?? 0,
        y: placed?.y ?? 0,
      };
    });
  }

  private measureNode(node: LayoutNodeSpec): MeasureSize {
    const nameWidth = node.name.length * 10 + 48;

    const methodWidth = node.methods.reduce((max, method) => {
      const width = method.label.length * 9 + 56;
      return Math.max(max, width);
    }, 0);

    const width = Math.max(880, nameWidth, methodWidth);
    const height = 96 + node.methods.length * 68;

    return { width, height };
  }
}