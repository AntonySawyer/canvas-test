import { ILayer } from '../interfaces';

export default abstract class Layer implements ILayer {
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

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

}
