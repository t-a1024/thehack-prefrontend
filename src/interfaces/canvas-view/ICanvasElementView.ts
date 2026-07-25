import type { ICanvasElementModel } from "../canvas-model/ICanvasElementModel.js";

export interface ICanvasElementView<TModel extends ICanvasElementModel = ICanvasElementModel> {
  readonly id: string;
  render(model: TModel): void;
}
