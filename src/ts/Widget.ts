import { IWidget } from './interfaces';
import Items from './Items';
import { highlightColor, widgetSamples, defaultWidgetColor, sidebarWidth } from './constants';
// import * as data from '../data/sample.json';

export default class Widget {
  static create(id: string, x: number, y: number) {
    const widget = Object.assign({}, findSample(id));
    return { ...widget, x, y, id: getNewId(id, x, y) };
  }

  static move(widget: IWidget, movementX: number, movementY: number) {
    const x = widget.x + movementX;
    const y = widget.y + movementY;
    return { ...widget, x, y, id: getNewId(widget.id, x, y) };
  }

  static getIdForItems = (widget: IWidget) => {
    return getNewId(widget.id, widget.x - sidebarWidth, widget.y);
  }

  static highlight(widget: IWidget) {
    widget.color = highlightColor;
    Items.replaceWidgetById(widget.id, widget);
  }

  static deleteHighlight(widget: IWidget) {
    delete widget.color;
    Items.replaceWidgetById(widget.id, widget);
  }

  static getCoordinates = (widget: IWidget) => {
    return {
      x1: widget.x,
      y1: widget.y,
      x2: widget.x + widget.width,
      y2: widget.y + widget.height,
    };
  }

  static draw(ctx: CanvasRenderingContext2D, widget?: IWidget) {
    const el = widget !== undefined ? widget : Items.activeWidget;
    ctx.fillStyle = el.color === undefined ? defaultWidgetColor : el.color;
    ctx.fillRect(el.x, el.y, el.width, el.height);
    ctx.lineWidth = 0.5;
    ctx.strokeRect(el.x, el.y, el.width, el.height);
  }

}

const findSample = (id: string) => widgetSamples.filter(el => el.id === id)[0];

const getNewId = (id: string, x: number, y: number) => `${id.split('_')[0]}_${x}_${y}`;
