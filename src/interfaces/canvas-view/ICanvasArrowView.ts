import type { ICanvasArrowModel } from "../canvas-model/ICanvasArrowModel.js";
import type { ICanvasElementView } from "./ICanvasElementView.js";

export interface ICanvasArrowView extends ICanvasElementView<ICanvasArrowModel> {
  render(model: ICanvasArrowModel): void;
}
