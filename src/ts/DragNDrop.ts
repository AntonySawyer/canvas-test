import { IWidget } from './interfaces';
import { someInRange } from './utils';
import Items from './Items';
import Widget from './Widget';
import { drawMove, setCursorStyle, activeLayerHoisted, clearCanvas, ctxActiveLayer } from './canvasUtils';
import { sidebarWidth } from './constants';

export default class DragNDrop {
  static mouseDownHandler(e: MouseEvent) {
    const xEvent = e.pageX - (e.target as HTMLElement).offsetLeft;
    const yEvent = e.pageY - (e.target as HTMLElement).offsetTop;
    const idFromEvent = (e.target as HTMLElement).dataset.id;
    if (idFromEvent === undefined) { // вынести отдельно
      for (const widget of Items.renderStack.reverse()) {
        const isInside = DragNDrop.checkWidgetBorders(widget, xEvent, yEvent);
        if (isInside) {
          startMove();
          Items.activeWidget = Widget.move(widget, sidebarWidth, 0);
          Items.replaceWidgetById(widget.id);
          drawMove(Items.activeWidget);
          break;
        }
      }
    } else {
      startMove();
      Items.activeWidget = Widget.create(idFromEvent, e.clientX, e.clientY);
    }
  }

  static checkWidgetBorders(widget: IWidget, xEvent: number, yEvent: number) {
    const xInside = someInRange(widget.x, (widget.x + widget.width), [xEvent]);
    const yInside = someInRange(widget.y, (widget.y + widget.height), [yEvent]);
    return xInside && yInside;
  }

  static moveHandler(e: MouseEvent) {
    if (e.buttons) {
      Items.activeWidget = Widget.move(Items.activeWidget, e.movementX, e.movementY);
      drawMove(Items.activeWidget);
    }
  }

  static mouseUpHandler(e: MouseEvent) { // try add to items here
    stopMove();
    if (Items.activeWidget.x > sidebarWidth) {
      const widget = Widget.move(Items.activeWidget, -sidebarWidth, 0);
      Items.replaceWidgetById(Items.activeWidget.id, widget);
      Items.renderStack
        .filter(el => el.color !== undefined || el.id === Widget.getIdForItems(Items.activeWidget))
        .map(el => Items.findCrossing(el));
    } else {
      Items.activeWidget = null;
      clearCanvas(ctxActiveLayer);
      Items.renderStack.map(el => Items.findCrossing(el));
    }
  }
}

function startMove() {
  setCursorStyle('move');
  activeLayerHoisted(true);
}

function stopMove() {
  setCursorStyle('default');
  activeLayerHoisted();
}