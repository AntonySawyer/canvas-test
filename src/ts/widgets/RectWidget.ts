import Widget from './Widget';
import { IWidget, Coordinate, Size, WidgetTypes } from '../interfaces';
import { staticCanvas } from '../helpers/DOM';
import { BorderWidth, BorderColor } from '../constants';

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
    const x = this.isActive ? this.getXForActiveLayer() : this.x;
    ctx.fillStyle = this.color;
    ctx.fillRect(x, this.y, this.width, this.height);
    this.drawBorder(x, ctx);
  }

  drawBorder(x: number, ctx: CanvasRenderingContext2D) {
    ctx.lineWidth = this.isHighlightBorders ? BorderWidth.hidghlighted : BorderWidth.default;
    ctx.strokeStyle = this.isHighlightBorders ? BorderColor.hidghlighted : BorderColor.default;
    ctx.strokeRect(x, this.y, this.width, this.height);
  }

// выглядит как не особо нужная дичь, которую можно вынести отсюда, как минимум на верхний уровень
  moveToGeometricCenter(xEvent: number, yEvent: number) {
    this.x = xEvent - this.width / 2;
    this.y = yEvent - this.height / 2;
  }
// или вообще добавить в проверку пересечений
  isOutOfBorders() { // in crossing checker ?
    const points = this.getPoints();
    return points.first.x < 0 || points.first.y < 0
          || points.last.x > staticCanvas.width || points.last.y > staticCanvas.height;
  }

}
