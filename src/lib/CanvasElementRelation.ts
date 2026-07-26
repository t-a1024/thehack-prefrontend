export enum CanvasElementRelation {
  ClassBlock = 'ClassModel <-> ClassView',
  MethodBlock = 'MethodModel <-> MethodView',
  Arrow = 'ArrowModel <-> ArrowView',
}

export const canvasElementRelationList = [
  CanvasElementRelation.ClassBlock,
  CanvasElementRelation.MethodBlock,
  CanvasElementRelation.Arrow,
] as const;
