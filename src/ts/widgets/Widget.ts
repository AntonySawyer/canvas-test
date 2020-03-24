import { IWidget, Coordinate, WidgetTypes } from '../interfaces';
import { activeCanvas, staticCanvas } from '../helpers/DOM';
import { WidgetColor, WidgetEvents } from '../constants';
import { subscriber } from '../Subscriber';
import AxisPoint from './AxisPoint';

export default abstract class Widget extends AxisPoint implements IWidget {
  constructor(id: number, coordinate: Coordinate, isSticky: boolean,
              isRepulsive: boolean, color: string, type: WidgetTypes) {
    super(coordinate.x, coordinate.y);
    this.id = id;
    this.type = type;
    this.isSticky = isSticky;
    this.isRepulsive = isRepulsive;
    this.defaultColor = color as WidgetColor;
    this.draw = this.draw.bind(this); // ?
  }

  id: number;
  isSticky: boolean;
  isRepulsive: boolean;
  defaultColor: WidgetColor;
  color: WidgetColor = WidgetColor.active;
  type: WidgetTypes;
  isActive: boolean;
  isCrossing: boolean = false;
  crossingPair: number[] = [];
  isHighlightBorders: boolean = false;

  abstract draw(): void;
  abstract moveToGeometricCenter(xEvent: number, yEvent: number): void;
  abstract isOutOfBorders(): boolean;
  abstract drawBorder(x, ctx): void;

  setActive = (isActive: boolean) => {
    this.isActive = isActive;
    this.setCorrectColorProperty();
    subscriber.notify(WidgetEvents.ChangeActiveStatus);
  }

  setCrossing = (isCrossing: boolean) => {
    this.isCrossing = isCrossing;
    this.setCorrectColorProperty();
  }

  addCrossingPair = (crossingId: number) => {
    if (!this.crossingPair.includes(crossingId)) {
      this.crossingPair.push(crossingId);
      subscriber.notify(WidgetEvents.ChangeCrossingPair);
    }
    if (!this.isCrossing) {
      this.setCrossing(true);
    }
  }

  removeCrossingPair = (crossingId: number) => {
    const index = this.crossingPair.findIndex(id => id === crossingId);
    this.crossingPair.splice(index, 1);
    subscriber.notify(WidgetEvents.ChangeCrossingPair);
    if (this.crossingPair.length === 0) {
      this.setCrossing(false);
    }
  }

  setHighlightBorders = (isHighlightBorders: boolean) => {
    this.isHighlightBorders = isHighlightBorders;
  }

  protected getTargetLayer = () => {
    return this.isActive ? activeCanvas : staticCanvas;
  }

  private setCorrectColorProperty = () => {
    this.color = this.isCrossing ? WidgetColor.hightlight // remove !
                : this.isActive ? WidgetColor.active : this.defaultColor;
    this.draw();
  }

}
