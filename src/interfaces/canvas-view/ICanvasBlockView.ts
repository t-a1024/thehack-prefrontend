import type { ICanvasBlockModel } from "../canvas-model/ICanvasBlockModel.js";
import type { ICanvasElementView } from "./ICanvasElementView.js";

export interface ICanvasBlockView<TModel extends ICanvasBlockModel = ICanvasBlockModel>
  extends ICanvasElementView<TModel> {
  render(model: TModel): void;
  measure(): {
    width: number;
    height: number;
  };
}
