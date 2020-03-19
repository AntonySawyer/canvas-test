export default abstract class Layer {
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

  protected clearCanvas() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

}
