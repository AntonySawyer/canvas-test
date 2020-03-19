import { IWidget, IRenderStack } from '../interfaces';

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

// rename
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

// wtf with reduce initial ?
export function getNearest(axis: ('x' | 'y'), candidates: number[],
                           target: IWidget, emptyValue: number) {
  if (candidates.length !== 0) {
    return candidates.reduce((a, b) => {
      return Math.abs(a - target[axis]) < Math.abs(b - target[axis]) ? a : b;
    });
  }
  return emptyValue;
}

export function getStickyCoordinates(axis: ('x' | 'y'), stack: IRenderStack,
                                     widget: IWidget, limit: number) {
  const side = getSide(axis);
  const result: number[] = [];
  stack.onlySticky()
  .filter(el => getStickyCandidates(widget, el, limit))
  .forEach((el) => {
    result.push(getCorrectSide(axis, side, el, widget));
    if (someSideInLimit(axis, side, el, widget, limit)) {
      result.push(el[axis], el[axis] + el[side] - widget[side]);
      if (isSameLine(axis, side, el, widget)) {
        result.push(el[axis] + el[side]);
      }
    }
  });
  return result;
}

function isSameLine(axis: string, side: string, el: IWidget, widget: IWidget) {
  return el[axis] + el[side] === widget[axis];
}

export function unstickKeyboard(arr: number[], movement: number, supposed: number) {
  if (movement > 0) {
    return arr.filter(el => el > supposed);
  }
  if (movement < 0) {
    return arr.filter(el => el < supposed);
  }
  return [];
}

const getSide = (axis: ('x' | 'y')) => axis === 'x' ? 'width' : 'height';

function getStickyCandidates(widget: IWidget, target: IWidget, lim: number) {
  return checkCrossing({ ...widget, x: widget.x + lim }, target) // move right
  || checkCrossing({ ...widget, x: widget.x - lim }, target)   // move left
  || checkCrossing({ ...widget, y: widget.y + lim }, target)   // move down
  || checkCrossing({ ...widget, y: widget.y - lim }, target);  // move up
}

// rename
function getCorrectSide(axis: ('x' | 'y'), side: ('width' | 'height'),
                        target: IWidget, widget: IWidget) {
  return target[axis] > widget[axis]
        ? target[axis] - widget[side] - 1
        : target[axis] + target[side] + 1;
}

// ugly
function someSideInLimit(axis: ('x' | 'y'), side: ('width' | 'height'),
                         a: IWidget, b: IWidget, limit: number) {
  // left to left && top to top
  return inLimit(a[axis], b[axis], limit)
  // right to left && bottom to top
  || inLimit(a[axis] + a[side], b[axis], limit)
    // left to right && top to bottom
  || inLimit(a[axis], b[axis] + b[side], limit)
    // right to right && bottom to bottom
  || inLimit(a[axis] + a[side], b[axis] + b[side], limit);
}

function inLimit(a: number, b: number, lim: number) {
  return Math.abs(a - lim) < b && (a + lim) > b;
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
