import type { Point } from "../../types/types.js";
import type { ICanvasArrowView } from "../canvas-view/ICanvasArrowView.js";
import type { ICanvasElementModel } from "./ICanvasElementModel.js";

export interface ICanvasArrowModel extends ICanvasElementModel {
  fromId: string;
  toId: string;

  fromPoint: Point;
  toPoint: Point;
}
