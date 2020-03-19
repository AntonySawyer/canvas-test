import { IWidget, Coordinate } from '../interfaces';
import { activeCanvas, staticCanvas } from '../helpers/DOM';
import { WidgetColor, WidgetEvents } from '../constants';
import { subscriber } from '../Subscriber';
import AxisPoint from './AxisPoint';

export default abstract class Widget extends AxisPoint implements IWidget {
  constructor(id: number, coordinate: Coordinate, isSticky: boolean, color: string) {
    super(coordinate.x, coordinate.y);
    this.id = id;
    this.isSticky = isSticky;
    this.defaultColor = color as WidgetColor;
    this.draw = this.draw.bind(this); // ?
  }

  id: number;
  isSticky: boolean;
  defaultColor: WidgetColor;
  color: WidgetColor = WidgetColor.active;
  isActive: boolean;
  isCrossing: boolean = false;

  abstract draw(): void;
  abstract moveToGeometricCenter(xEvent: number, yEvent: number): void;
  abstract isOutOfBorders(): boolean;

  setActive = (isActive: boolean) => {
    this.isActive = isActive;
    this.setCorrectColorProperty();
    subscriber.notify(WidgetEvents.ChangeActiveStatus);
  }

  setCrossing = (isCrossing: boolean) => {
    this.isCrossing = isCrossing;
    this.setCorrectColorProperty();
  }

  protected getTargetLayer = () => {
    return this.isActive ? activeCanvas : staticCanvas;
  }

  private setCorrectColorProperty = () => {
    this.color = this.isCrossing ? WidgetColor.hightlight
                : this.isActive ? WidgetColor.active : this.defaultColor;
    this.draw();
  }

}
