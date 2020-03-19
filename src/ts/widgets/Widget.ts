import { highlightColor, activeColor } from '../constants';
import { IWidget, ICoordinate } from '../interfaces';
import { activeCanvas, staticCanvas, sidebarWidth } from '../helpers/DOM';

export default abstract class Widget implements IWidget {
  constructor(id: number, coordinate: ICoordinate, isSticky: boolean, color: string) {
    this.id = id;
    this.x = coordinate.x;
    this.y = coordinate.y;
    this.isSticky = isSticky;
    this.defaultColor = color;
    this.draw = this.draw.bind(this);
  }

  id: number;
  x: number;
  y: number;
  isSticky: boolean;
  defaultColor: string;
  color: string = activeColor;
  isActive: boolean = true;
  isCrossing: boolean = false;

  abstract draw();
  abstract coordinateIsInside(x: number, y: number);
  abstract getPointsFromStatic();
  abstract getPointsFromActive();
  abstract moveToGeometricCenter(xEvent: number, yEvent: number);
  abstract inBorders();
  abstract checkCrossing(target: IWidget);

  setPosition = (x: number, y: number) => {
    this.x = x;
    this.y = y;
  }

  setActive = () => {
    this.x += sidebarWidth;
    this.isActive = true;
    this.resetColor();
  }

  setInactive = () => {
    this.x -= sidebarWidth;
    this.isActive = false;
    this.resetColor();
  }

  setCrossing = (isCrossing: boolean) => {
    this.isCrossing = isCrossing;
    isCrossing ? this.hightlight() : this.resetColor();
  }

  protected getTargetLayer = () => {
    return this.isActive ? activeCanvas : staticCanvas;
  }

  private hightlight = () => {
    this.color = highlightColor;
    this.draw();
  }

  private resetColor = () => {
    this.color = this.isCrossing ? highlightColor
                : this.isActive ? activeColor : this.defaultColor;
    this.draw();
  }

}
