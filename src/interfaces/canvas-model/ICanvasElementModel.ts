import type { ICanvasElementView } from "../canvas-view/ICanvasElementView.js";

export interface ICanvasElementModel {
  readonly id: string;
  createView(): ICanvasElementView<this>;
}
