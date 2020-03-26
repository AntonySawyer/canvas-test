import { IAxisPoint, Coordinate } from '../interfaces';
import { subscriber } from '../Subscriber';
import { WidgetEvents } from '../constants';

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

}

export default AxisPoint;
