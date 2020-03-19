import { IRenderStack, Coordinate, IWidget, NextMoveMode } from '../interfaces';
import { somePointInRangeWithLimit } from './math';
import { filterCandidatesForKeyboardUnstick } from './keyboard';
import { crossingChecker } from '../CrossingService';

export function attemptMoveToSticking(stack: IRenderStack, mode: NextMoveMode,
                                      movement: Coordinate) {
  const activeWidget = stack.activeWidget;
  console.log(activeWidget);
  const staticCoords = activeWidget.getCoordinate();
  const candidates = { x: [], y: [] };

  stack.getOnlySticky()
      .filter(widget => widget.id !== activeWidget.id)
      .filter(widget => onlyNearbyInStickingLimit(activeWidget, widget))
      .forEach((widget) => {
        candidates.x.push(...prepareCoordsOfNeibor(widget.x, widget.width, activeWidget.width, activeWidget.x, mode, movement.x));
        candidates.y.push(...prepareCoordsOfNeibor(widget.y, widget.height, activeWidget.height, activeWidget.y, mode, movement.y));
      });
  if (mode === 'keyboard') {
    filterCandidatesForKeyboardUnstick(candidates, movement, activeWidget);
  }

  const nearest = chooseNearestCoordinate(candidates, staticCoords);
  console.log(nearest);
  trySetStickyCoordinates(activeWidget, nearest);
}

function onlyNearbyInStickingLimit(activeWidget: IWidget, checkWidget: IWidget) {
  const activePoints = activeWidget.getPoints();
  const checkPoints = checkWidget.getPoints();
  return somePointInRangeWithLimit([activePoints.first.x, activePoints.last.x],
                                   [checkPoints.first.x, checkPoints.last.x])
      && somePointInRangeWithLimit([activePoints.first.y, activePoints.last.y],
                                   [checkPoints.first.y, checkPoints.last.y]);
}

function prepareCoordsOfNeibor(nearbyCoord: number, nearbySize: number, activeSize: number, activeCoord: number, mode: NextMoveMode, movement: number) {
  // надо тут сразу возвращать ближайшую подходящую или изначальную
  const offset = activeCoord + movement;
  console.log(`nearbyCoord = ${nearbyCoord}, nearbyCoord - activeSize - 1 = ${nearbyCoord - activeSize - 1}, nearbyCoord + nearbySize + 1 = ${nearbyCoord + nearbySize + 1}, nearbyCoord + nearbySize - activeSize = ${nearbyCoord + nearbySize - activeSize}`);
  let arr = [nearbyCoord, nearbyCoord - activeSize - 1, nearbyCoord + nearbySize + 1, nearbyCoord + nearbySize - activeSize]
  .filter((point) => {
      if (movement === 0) {
        return false;
      }
      return movement > 0 ? point > offset : point < offset;
    }
  );
  console.log(arr);
  console.log(arr.reduce((previousPoint, currentPoint) => { // где-то выбирает себя из-за потери 5 пикселей
    const previousDelta = previousPoint - activeCoord;
    const currentDelta = currentPoint - activeCoord;
    console.log(`activeCoord = ${activeCoord}, curDel = ${currentDelta}, prevDel = ${previousDelta} and result: ${Math.abs(previousDelta) < Math.abs(currentDelta) ? previousPoint : currentPoint}`);
    return Math.abs(previousDelta) < Math.abs(currentDelta) && previousDelta !== 0 ? previousPoint : currentPoint;
  }, activeCoord));
  return [nearbyCoord, // left to left && top to top
    nearbyCoord - activeSize - 1, // right to left && bottom to top
    nearbyCoord + nearbySize + 1, // left to right && top to bottom
    nearbyCoord + nearbySize - activeSize]; // right to right && bottom to bottom
}

function chooseNearestCoordinate(candidates: {x: number[], y: number[]}, staticCoords: Coordinate) {
  const nearest = { ...staticCoords };
  for (const axis in candidates) {
    if (candidates[axis].length !== 0) {
      nearest[axis] = candidates[axis].reduce((previousPoint, currentPoint) => {
        const previousDelta = previousPoint - staticCoords[axis];
        const currentDelta = currentPoint - staticCoords[axis];
        return Math.abs(previousDelta) < Math.abs(currentDelta) ? previousPoint : currentPoint;
      });
    }
  }
  return nearest;
}

function trySetStickyCoordinates(activeWidget: IWidget, nearest: Coordinate) {
  const pointsForCheck = { first: { ...nearest },
    last: { x: nearest.x + activeWidget.width,
      y: nearest.y + activeWidget.height } };
  const isFailure = crossingChecker.pointsCrossingWithOtherWidgets(activeWidget.id, pointsForCheck);
  if (!isFailure && !activeWidget.isOutOfBorders()) {
    activeWidget.setPosition(nearest.x, nearest.y);
  }
}
