import type { ICanvasElementModel } from "./ICanvasElementModel.js";

export interface ICanvasBlockModel extends ICanvasElementModel {
  x: number;
  y: number;
  measure(): {
    width: number;
    height: number;
  };
}
