import type { ICanvasArrowModel } from "../canvas-model/ICanvasArrowModel.js";
import type { ICanvasBlockModel } from "../canvas-model/ICanvasBlockModel.js";

export interface ICanvasPlacement<
  TBlock extends ICanvasBlockModel = ICanvasBlockModel,
  TArrow extends ICanvasArrowModel = ICanvasArrowModel,
> {
  layout(blocks: TBlock[], arrows: TArrow[]): Promise<TBlock[]>;
}
