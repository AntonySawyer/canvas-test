import { IWidget, ILayer } from '../interfaces';
import { defaultColor } from '../constants';

export class Layer implements ILayer {
  constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    ctx.canvas.width = width;
    ctx.canvas.height = height;
  }

  protected ctx: CanvasRenderingContext2D;
  protected width: number;
  protected height: number;

  draw(widget: IWidget) {
    this.ctx.fillStyle = (widget.color === undefined || widget.color === null)
                        ? defaultColor : widget.color;
    this.ctx.fillRect(widget.x, widget.y, widget.width, widget.height);
    this.ctx.lineWidth = 0.5;
    this.ctx.strokeRect(widget.x, widget.y, widget.width, widget.height);
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }
}
