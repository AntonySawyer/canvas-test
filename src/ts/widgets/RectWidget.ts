import Widget from './Widget';
import { IWidget, Coordinate, Size } from '../interfaces';
import { stickyLimit } from '../constants';
import { staticCanvas } from '../helpers/DOM';

export default class RectWidget extends Widget implements IWidget {
  constructor(id: number, coordinate: Coordinate, isSticky: boolean, color: string, sizes: Size) {
    super(id, coordinate, isSticky, color);
    this.width = sizes.width;
    this.height = sizes.height;
  }
  width: number;
  height: number;

  draw() {
    // console.error(`(I DRAW WIDGET #${this.id})`);
    const ctx = this.getTargetLayer().getContext('2d');
    const x = this.isActive ? this.getXForActiveLayer() : this.x;
    ctx.fillStyle = this.color;
    ctx.fillRect(x, this.y, this.width, this.height);
    ctx.lineWidth = 0.5;
    ctx.strokeRect(x, this.y, this.width, this.height);
    // temp border
    if (this.isSticky && this.isActive) {
      ctx.lineWidth = 0.5;
      const stickyArea = { ...this,
        x: x  - stickyLimit,
        y: this.y - stickyLimit,
        width: this.width + stickyLimit * 2,
        height: this.height + stickyLimit * 2 };
      ctx.strokeRect(stickyArea.x, stickyArea.y, stickyArea.width, stickyArea.height);
    }
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
