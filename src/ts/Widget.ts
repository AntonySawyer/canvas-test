import { highlightColor, activeColor, sidebarWidth } from './constants';
import { IWidget } from './interfaces';

export default class Widget implements IWidget {
  constructor(id: number, coords: {x: number, y: number}, isSticky: boolean, color: string) {
    this.id = id;
    this.x = coords.x;
    this.y = coords.y;
    this.isSticky = isSticky;
    this.defaultColor = color;
    this.setPosition = this.setPosition.bind(this);
    this.setActive = this.setActive.bind(this);
    this.setInactive = this.setInactive.bind(this);
    this.resetColor = this.resetColor.bind(this);
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

  draw() {
    // а как правильно объявлять методы, которые потомки точно переопределят,
    // но при этом он в интерфейсе обязательный?
  }

  setPosition(x: number, y: number) {
    this.x = x;
    this.y = y;
    return this;
  }

  setActive() {
    this.x += sidebarWidth;
    this.isActive = true;
    this.color = activeColor;
    return this;
  }

  setInactive() {
    this.x -= sidebarWidth;
    this.isActive = false;
    this.resetColor();
    return this;
  }

  hightlight() {
    this.color = highlightColor;
    return this;
  }

  resetColor() {
    this.isCrossing = false; // коряво
    this.color = this.isCrossing ? highlightColor : this.defaultColor;
    return this;
  }

  setCrossing() {
    this.isCrossing = true;
    this.hightlight();
  }

  setUncrossing() { // rename
    this.isCrossing = false;
  }

  getCtx() {
    const activeCanvas = (document.getElementById('activeCanvas') as HTMLCanvasElement).getContext('2d');
    const staticCanvas = (document.getElementById('staticCanvas') as HTMLCanvasElement).getContext('2d');
    return this.isActive ? activeCanvas : staticCanvas;
  }

}
