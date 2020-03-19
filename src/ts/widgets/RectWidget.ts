import Widget from './Widget';
import { IWidget, ICoordinate, ISize } from '../interfaces';
import { someInRange } from '../helpers/math';
import { stickingLimit } from '../constants';
import { sidebarWidth } from '../helpers/DOM';

export default class RectWidget extends Widget implements IWidget {
  constructor(id: number, coordinate: ICoordinate, isSticky: boolean, color: string, sizes: ISize) {
    super(id, coordinate, isSticky, color);
    this.width = sizes.width;
    this.height = sizes.height;
  }
  width: number;
  height: number;

  draw() {
    const ctx = this.getTargetLayer().getContext('2d');
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.lineWidth = 0.5;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    // temp border
    if (this.isSticky && this.isActive) {
      ctx.lineWidth = 0.5;
      const stickyArea = { ...this,
        x: this.x  - stickingLimit,
        y: this.y - stickingLimit,
        width: this.width + stickingLimit * 2,
        height: this.height + stickingLimit * 2 };
      ctx.strokeRect(stickyArea.x, stickyArea.y, stickyArea.width, stickyArea.height);
    }
  }

  coordinateIsInside(x: number, y: number) {
    const points = this.getPointsFromStatic();
    const xInside = someInRange(points.x1, points.x2, [x]);
    const yInside = someInRange(points.y1, points.y2, [y]);
    return xInside && yInside;
  }

  getPointsFromStatic() {
    const points = { x1: this.x, y1: this.y, x2: this.x + this.width, y2: this.y + this.height };
    if (this.isActive) {
      points.x1 -= sidebarWidth;
      points.x2 -= sidebarWidth;
    }
    return points;
  }

  getPointsFromActive() {
    return { x1: this.x, y1: this.y, x2: this.x + this.width, y2: this.y + this.height };
  }

  // and set, if needed ?
  checkCrossing(target: IWidget) {
    const currPoints = this.getPointsFromStatic();
    const targPoints = target.getPointsFromStatic();
    return (
           someInRange(currPoints.x1, currPoints.x2, [targPoints.x1, targPoints.x2])
        || someInRange(targPoints.x1, targPoints.x2, [currPoints.x1, currPoints.x2])
    ) && (
           someInRange(currPoints.y1, currPoints.y2, [targPoints.y1, targPoints.y2])
        || someInRange(targPoints.y1, targPoints.y2, [currPoints.y1, currPoints.y2])
          );
  }

  moveToGeometricCenter(xEvent: number, yEvent: number) {
    this.x = xEvent - this.width / 2;
    this.y = yEvent - this.height / 2;
  }

  inBorders() {
    const target = this.getTargetLayer();
    const { x1, y1, x2, y2 } = this.getPointsFromActive();
    return x1 > sidebarWidth && y1 > 0 && x2 < target.width && y2 < target.height;
  }

}
