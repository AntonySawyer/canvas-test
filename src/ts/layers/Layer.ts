import { IWidget, ILayer } from '../interfaces';
import { defaultWidgetColor } from '../constants';

export class Layer implements ILayer {
  constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
  }

  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;

  draw(widget: IWidget) {
    this.ctx.fillStyle = (widget.color === undefined || widget.color === null)
                        ? defaultWidgetColor : widget.color;
    this.ctx.fillRect(widget.x, widget.y, widget.width, widget.height);
    this.ctx.lineWidth = 0.5;
    this.ctx.strokeRect(widget.x, widget.y, widget.width, widget.height);
  }

  setSizes() {
    this.ctx.canvas.width = this.width;
    this.ctx.canvas.height = this.height;
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }
}
