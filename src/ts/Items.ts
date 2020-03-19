import { IWidget } from './interfaces';
import { drawItems } from './canvasUtils';
import { someInRange } from './utils';
import Widget from './Widget';

export default class Items {
  public static renderStack: IWidget[] = [];
  public static activeWidget: IWidget = null;

  public static findCrossing(widget: IWidget) {
    const { x1, y1, x2, y2 } = Widget.getCoordinates(widget);
    const otherWidgets = Items.renderStack.filter((el) => {
      return el.id !== Widget.getIdForItems(el) && el.id !== widget.id;
    });
    const xCrossing = (start: number, end: number) => {
      return someInRange(start, end, [x1, x2]) || someInRange(x1, x2, [start, end]);
    };
    const yCrossing = (start: number, end: number) => {
      return someInRange(start, end, [y1, y2]) || someInRange(y1, y2, [start, end]);
    };
    if (otherWidgets.some((el) => {
      return xCrossing(el.x, el.x + el.width) && yCrossing(el.y, el.y + el.height);
    })) {
      Widget.highlight(widget);
    } else if (widget.color !== undefined) {
      Widget.deleteHighlight(widget);
    }
  }

  public static replaceWidgetById(id: string, widget?: IWidget) {
    const index = findWidgetIndex(id);
    if (index === -1 || (index !== -1 && widget !== undefined)) {
      Items.renderStack.push(widget);
    }
    if (index !== -1) {
      Items.renderStack.splice(index, 1);
    }
    drawItems();
  }
}

const findWidgetIndex = (id: string) => Items.renderStack.findIndex(el => el.id === id);
