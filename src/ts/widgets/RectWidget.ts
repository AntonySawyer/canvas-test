import Widget from './Widget';
import { IWidget, Coordinate, Size, WidgetTypes } from '../interfaces';
import { BorderWidth, BorderColor } from '../constants';
import { getXForActiveLayer } from '../helpers/coordinate';

export default class RectWidget extends Widget implements IWidget {
  constructor(id: number, coordinate: Coordinate, isSticky: boolean,
              isRepulsive: boolean, color: string, sizes: Size, type: WidgetTypes) {
    super(id, coordinate, isSticky, isRepulsive, color, type);
    this.width = sizes.width;
    this.height = sizes.height;
  }
  width: number;
  height: number;

  draw() {
    const ctx = this.getTargetLayer().getContext('2d');
    const x = this.isActive ? getXForActiveLayer(this.x) : this.x;
    ctx.fillStyle = this.color;
    ctx.fillRect(x, this.y, this.width, this.height);
    this.drawBorder(x, ctx);
  }

  drawBorder(x: number, ctx: CanvasRenderingContext2D) {
    ctx.lineWidth = this.isHighlightBorders ? BorderWidth.hidghlighted : BorderWidth.default;
    ctx.strokeStyle = this.isHighlightBorders ? BorderColor.hidghlighted : BorderColor.default;
    ctx.strokeRect(x, this.y, this.width, this.height);
  }

  moveToGeometricCenter(xEvent: number, yEvent: number) {
    this.x = xEvent - this.width / 2;
    this.y = yEvent - this.height / 2;
  }

}
