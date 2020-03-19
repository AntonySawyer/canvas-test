import { IAxisPoint, Coordinate } from '../interfaces';
import { subscriber } from '../Subscriber';
import { WidgetEvents } from '../constants';
import { sidebarWidth } from '../helpers/DOM';
import { someInRange } from '../helpers/math';

abstract class AxisPoint implements IAxisPoint {
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  x: number;
  y: number;

  abstract width: number;
  abstract height: number;

  setPosition = (x: number, y: number) => {
    this.x = x;
    this.y = y;
    subscriber.notify(WidgetEvents.SetNewPosition);
  }

  commitMovement = (movement: Coordinate) => {
    this.setPosition(this.x + movement.x, this.y + movement.y);
  }

  getCoordinate() {
    return { x: this.x, y: this.y };
  }

  getPoints() { // widget
    const first = this.getCoordinate();
    const last = { x: this.x + this.width, y: this.y + this.height };
    return { first, last };
  }

  getPoints2() { // widget
    const points = this.getPoints();
    return [ points.first, { x: points.first.x, y: points.last.y }, { x: points.last.x, y: points.first.y}, points.last ]

  }

  coordinateIsInside(coordinate: Coordinate) { // math.ts
    const points = this.getPoints();
    const xInside = someInRange(points.first.x, points.last.x, [coordinate.x]);
    const yInside = someInRange(points.first.y, points.last.y, [coordinate.y]);
    return xInside && yInside;
  }

  protected getXForActiveLayer() { // place into newhalper
    return this.x + sidebarWidth;
  }

}

export default AxisPoint;
