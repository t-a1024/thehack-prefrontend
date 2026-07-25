import type { ICanvasElementModel } from "./ICanvasElementModel.js";

export interface ICanvasArrowModel extends ICanvasElementModel {
  fromId: string;
  toId: string;
}
