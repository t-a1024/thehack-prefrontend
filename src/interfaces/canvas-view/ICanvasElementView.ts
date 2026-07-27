import type { ICanvasElementModel } from "../canvas-model/ICanvasElementModel.js";

export interface ICanvasElementView<TModel extends ICanvasElementModel = ICanvasElementModel> {
  element: SVGGElement;
  readonly id: string;
  render(model: TModel): void;
}
