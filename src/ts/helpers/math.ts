import { IWidget } from '../interfaces';
import { stackWithoutId } from './widgetsHelper';

export function calculateMiddle(width: number, height: number, xEvent: number, yEvent: number) {
  const x = xEvent - width / 2;
  const y = yEvent - height / 2;
  return { x, y };
}

export function checkCrossing(widget: IWidget, stack: IWidget[]) {
  const { x1, y1, x2, y2 } = getCoordinates(widget);
  const otherWidgets = stackWithoutId(widget.id, stack);

  return otherWidgets.some((el) => {
    return isCrossing([el.x, el.x + el.width], [x1, x2])
        && isCrossing([el.y, el.y + el.height], [y1, y2]);
  });
}

export function isClickInsideWidget(widget: IWidget, xEvent: number, yEvent: number) {
  const xInside = someInRange(widget.x, (widget.x + widget.width), [xEvent]);
  const yInside = someInRange(widget.y, (widget.y + widget.height), [yEvent]);
  return xInside && yInside;
}

const isCrossing = (firstPair: number[], secondPair: number[]) => {
  return someInRange(firstPair[0], firstPair[1], secondPair)
        || someInRange(secondPair[0], secondPair[1], firstPair);
};

const getCoordinates = (widget: IWidget) => {
  return {
    x1: widget.x,
    y1: widget.y,
    x2: widget.x + widget.width,
    y2: widget.y + widget.height,
  };
};

const someInRange = (first: number, last: number, arrToCheck: number[]) => {
  return arrToCheck.some(el => first <= el && el <= last);
};
