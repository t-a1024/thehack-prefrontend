import type { ICanvasBlockView } from '../../interfaces/canvas-view/ICanvasBlockView.js';
import { MethodModel } from '../../canvas-model/block/MethodModel.js';

const SVG_NS = 'http://www.w3.org/2000/svg';

export class MethodView implements ICanvasBlockView<MethodModel> {
  public readonly id: string;
  public readonly element: SVGGElement;

  private readonly x: number;
  private readonly y: number;
  private readonly width: number;

  constructor(id: string, x: number, y: number, width: number) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.width = width;
    this.element = document.createElementNS(SVG_NS, 'g');
    this.element.classList.add('method-node');
    this.element.setAttribute('data-node-id', this.id);
  }

  public measure(): { width: number; height: number } {
    return {
      width: this.width,
      height: MethodModel.HEIGHT,
    };
  }

  public render(model: MethodModel): void {
    this.element.replaceChildren();
    this.element.setAttribute('transform', `translate(${this.x}, ${this.y})`);

    const rect = document.createElementNS(SVG_NS, 'rect');
    rect.classList.add('method-node-box');
    rect.setAttribute('x', '0');
    rect.setAttribute('y', '0');
    rect.setAttribute('width', String(this.width));
    rect.setAttribute('height', String(MethodModel.HEIGHT));
    rect.setAttribute('rx', '6');
    rect.setAttribute('ry', '6');

    const text = document.createElementNS(SVG_NS, 'text');
    text.classList.add('method-label');
    text.setAttribute('x', String(MethodModel.PADDING_X));
    text.setAttribute('y', String(MethodModel.HEIGHT / 2));
    text.textContent = model.label;

    this.element.appendChild(rect);
    this.element.appendChild(text);
  }
}
