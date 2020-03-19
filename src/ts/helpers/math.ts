import { IWidget } from '../interfaces';

export function calculateMiddle(width: number, height: number, xEvent: number, yEvent: number) {
  const x = xEvent - width / 2;
  const y = yEvent - height / 2;
  return { x, y };
}

export function checkCrossing(target: IWidget, widget: IWidget) {
  const { x1, y1, x2, y2 } = getCoordinates(target);
  return isCrossing([widget.x, widget.x + widget.width], [x1, x2])
      && isCrossing([widget.y, widget.y + widget.height], [y1, y2]);
}

export function isClickInsideWidget(widget: IWidget, xEvent: number, yEvent: number) {
  const xInside = someInRange(widget.x, (widget.x + widget.width), [xEvent]);
  const yInside = someInRange(widget.y, (widget.y + widget.height), [yEvent]);
  return xInside && yInside;
}

// rename
export function checkBorders(widget: IWidget, top: number, right: number,
                             bottom: number, left: number) {
  return widget.x > left
      && widget.y > top
      && widget.y + widget.height < bottom
      && widget.x + widget.width < right;
}

export function findNeabors(limit: number, target: IWidget, candidate: IWidget) {
  let newX: number;
  let newY: number;

  if (isLessThanLimit(limit, target.x, candidate.x + candidate.width)) {
    newX = candidate.x + candidate.width + 1;
  }
  if (isLessThanLimit(limit, target.x + target.width, candidate.x)) {
    newX = candidate.x - target.width + limit * 2 - 1;
  }
  if (isLessThanLimit(limit, target.y, candidate.y + candidate.height)) {
    newY = candidate.y + candidate.height + 1;
  }
  if (isLessThanLimit(limit, target.y + target.height, candidate.y)) {
    newY = candidate.y - target.height + limit * 2 - 1;
  }
  if (newX === undefined) {
    newX = target.x;
  }
  if (newY === undefined) {
    newY = target.y;
  }
  return { newX, newY };
}

const isLessThanLimit = (limit: number, a: number, b: number) => {
  return a - b > -limit && a - b < limit;
};

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
