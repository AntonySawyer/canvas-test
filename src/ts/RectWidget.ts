import Widget from './Widget';
import { IWidget } from './interfaces';

export default class RectWidget extends Widget implements IWidget {
  constructor(id: number, coords: {x: number, y: number}, isSticky: boolean, color: string,
              width: number, height: number) {
    super(id, coords, isSticky, color);
    this.width = width;
    this.height = height;
  }
  width: number;
  height: number;

  draw() {
    const ctx = this.getCtx();
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.lineWidth = 0.5;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
  }

}
