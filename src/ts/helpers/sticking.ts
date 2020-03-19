import { IRenderStack, Coordinate, IWidget, NextMoveMode } from '../interfaces';
import { somePointInRangeWithLimit } from './math';
import { filterCandidatesForKeyboardUnstick } from './keyboard';
import { crossingChecker } from '../CrossingService';
import { stickyLimit } from '../constants';

export function attemptMoveToSticking(stack: IRenderStack, mode: NextMoveMode,
                                      movement: Coordinate) {
  const test = andAgain(stack, mode, movement);
  const activeWidget = stack.activeWidget;
  const staticCoords = activeWidget.getCoordinate();
  const candidates = { x: [], y: [] };

  stack.getOnlySticky()
      .filter(widget => widget.id !== activeWidget.id)
      .filter(widget => onlyNearbyInStickingLimit(activeWidget, widget))
      .forEach((widget) => {
        candidates.x.push(...prepareCoordsOfNeibor(widget.x, widget.width, activeWidget.width, activeWidget.x, mode, movement.x));
        candidates.y.push(...prepareCoordsOfNeibor(widget.y, widget.height, activeWidget.height, activeWidget.y, mode, movement.y));
      });
  if (mode === 'keyboard') { // без - X на расстоянии 10px не липнет, Y - перепрыгивает один вариант
    filterCandidatesForKeyboardUnstick(candidates, movement, activeWidget);
  }

  const nearest = chooseNearestCoordinate(candidates, staticCoords);
  if (test.activePoint.x === nearest.x && test.activePoint.y === nearest.y) {
    console.warn('everything is correct!');
  } else {
    console.log(test);
    console.log(nearest);
    if (test.activePoint.x === nearest.x) {
      console.log('X is correct');
    } else {
      console.error(`X must be ${nearest.x}, but was ${test.activePoint.x}`);
    }
    if (test.activePoint.y === nearest.y) {
      console.log('Y is correct');
    } else {
      console.error(`Y must be ${nearest.y}, but was ${test.activePoint.y}`);
    }
  }

  // if (test.activePoint.x !== undefined && test.activePoint.y !== undefined) {
  //   trySetStickyCoordinates(activeWidget, test.activePoint);
  // }

  // если не к точке, а к грани - добавить тут проверку на направление движения (мышь?)
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
  // activeSize = points.last.x - points.first.x
  const offset = activeCoord + movement;
  let arr = [nearbyCoord, nearbyCoord - activeSize - 1, nearbyCoord + nearbySize + 1, nearbyCoord + nearbySize - activeSize];
  if (mode === 'keyboard') {
    arr = arr.filter((point) => {
      if (movement === 0) {
        return false;
      }
      return movement > 0 ? point > offset : point < offset;
    });
  }
  // return arr.reduce((previousPoint, currentPoint) => {
  //   const previousDelta = previousPoint - activeCoord;
  //   const currentDelta = currentPoint - activeCoord;
  //   return Math.abs(previousDelta) < Math.abs(currentDelta) && previousDelta !== 0 ? previousPoint : currentPoint;
  // }, activeCoord);
  return arr;
  // return [nearbyCoord, // left to left && top to top
  //   nearbyCoord - activeSize - 1, // right to left && bottom to top
  //   nearbyCoord + nearbySize + 1, // left to right && top to bottom
  //   nearbyCoord + nearbySize - activeSize]; // right to right && bottom to bottom
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

function andAgain(stack: IRenderStack, mode: NextMoveMode, movement: Coordinate) {
  const activeWidget = stack.activeWidget;
  const points2 = activeWidget.getPoints2();
  const result = [];
  stack.getOnlySticky()
        .filter(widget => !widget.isActive)
        .forEach((widget) => {
          points2.forEach((point: Coordinate, activePointIndex) => {
            widget.getPoints2().forEach((widgetPoint: Coordinate, nearestPointIndex) => { // index ?
              const distance = distanceBetweenPoints(point, widgetPoint);
// only if distance < stickingLimit (но получаается окружность, углы не учитываются)
              if (distance < stickyLimit) {
                result.push({
                  widgetPoint,
                  activePointIndex,
                  nearestPointIndex,
                  distance: distanceBetweenPoints(point, widgetPoint),
                });
              }
            });
          });

// найти ближайшую у предыдущего
// найти ближайшую у текущего
// запомнить координату для активного, если это окажется лучшим вариантом ??
// вернуть что ближе к активному
        });
  const nearestPoint = result.sort((a, b) => a.distance - b.distance)[0];
  console.log(result.sort((a, b) => a.distance - b.distance));
  nearestPoint.activePoint = getPointForActiveMove(activeWidget, nearestPoint);
  // console.error(result.sort((a, b) => a.distance - b.distance)[0]);
  return nearestPoint;
}

// function getNearestPoint(targetPoints, pointsToCheck) {
//   return pointsToCheck.reduce((previuousPoint, currentPoint) => {
//     const previousDistance = distanceBetweenPoints(previuousPoint, targetPoints);
//     const currentDistance = distanceBetweenPoints(currentPoint, targetPoints);
//     return previousDistance < currentDistance ? previuousPoint : currentPoint;
//   });
// }

function distanceBetweenPoints(firstPoint: Coordinate, secondPoint: Coordinate) {
  return Math.sqrt((secondPoint.x - firstPoint.x) ** 2 + (secondPoint.y - firstPoint.y) ** 2);
}

function getPointForActiveMove(activeWidget: IWidget, nearestPoint) { // add types
  let x: number;
  let y: number;
  const widgetPoint: Coordinate = nearestPoint.widgetPoint;
  const activePointIndex = nearestPoint.activePointIndex;
  const nearestPointIndex = nearestPoint.nearestPointIndex;

  switch (activePointIndex) {
    case 0:
      if (nearestPointIndex === 1) {
        console.log('0-1');
        x = widgetPoint.x;
        y = widgetPoint.y + 1;
      } else if (nearestPointIndex === 2) {
        console.log('0-2');
        x = widgetPoint.x + 1;
        y = widgetPoint.y;
      } else if (nearestPointIndex === 3) {
        console.log('0-3');
        x = widgetPoint.x + 1;
        y = widgetPoint.y + 1;
      }
      break;
    case 1:
      if (nearestPointIndex === 0) {
        console.log('1-0');
        x = widgetPoint.x;
        y = widgetPoint.y - activeWidget.height - 1;
      } else if (nearestPointIndex === 2) {
        console.log('1-2');
        x = widgetPoint.x + 1;
        y = widgetPoint.y - activeWidget.height - 1;
      } else if (nearestPointIndex === 3) {
        console.log('1-3');
        x = widgetPoint.x  - activeWidget.width - 1;
        y = widgetPoint.y + 1;
      }
      break;
    case 2:
      if (nearestPointIndex === 0) {
        console.log('2-0');
        x = widgetPoint.x - activeWidget.width - 1;
        y = widgetPoint.y;
      } else if (nearestPointIndex === 1) {
        console.log('2-1');
        x = widgetPoint.x - activeWidget.width - 1;
        y = widgetPoint.y + 1;
      } else if (nearestPointIndex === 3) {
        console.log('2-3');
        x = widgetPoint.x - activeWidget.width - 1;
        y = widgetPoint.y - activeWidget.height;
      }
      break;
    case 3:
      if (nearestPointIndex === 0) {
        console.log('3-0');
        x = widgetPoint.x - activeWidget.width - 1;
        y = widgetPoint.y - activeWidget.height - 1;
      } else if (nearestPointIndex === 1) {
        console.log('3-1');
        x = widgetPoint.x + 1;
        y = widgetPoint.y - activeWidget.height - 1;
      } else if (nearestPointIndex === 2) {
        console.log('3-2');
        x = widgetPoint.x + 1;
        y = widgetPoint.y - activeWidget.height;
      }
      break;
  }

  return { x, y };

  // const widgetPoint: Coordinate = nearestPoint.widgetPoint;
  // const nearestPointIndex = nearestPoint.nearestPointIndex;
  // let x: number;
  // let y: number;
  // const activePoints = activeWidget.getPoints();
  // const cond1 = activePoints.last.y < widgetPoint.y; // active on left/right/top      2,3,4,5,7,12
  // const cond2 = activePoints.first.y > widgetPoint.y; // active on left/right/bottom  1,6,8,9,10,11
  // const cond3 = activePoints.last.x < widgetPoint.x; // active on left/top/bottom     1,2,4,9,11,12
  // const cond4 = activePoints.first.x > widgetPoint.x; // active on right/top/bottom   3,5,6,7,8,10

  // const cond5 = nearestPointIndex === 0; // active on left/top         1,2,3
  // const cond6 = nearestPointIndex === 1; // active on right/top        4,5,6
  // const cond7 = nearestPointIndex === 2; // active on right/bottom     7,8,9
  // const cond8 = nearestPointIndex === 3; // active on left/bottom      10,11,12

  // // tt
  // if (cond5 || cond6) {
  //   console.log('t1');
  //   x = widgetPoint.x - activeWidget.width - 1;
  //   y = widgetPoint.y - activeWidget.height - 1;
  // }
  // if (cond6) {
  //   console.log('t2');
  //   x = widgetPoint.x + 1;
  // }
  // if (cond7) {
  //   console.log('t3');
  //   x = widgetPoint.x + 1;
  //   y = widgetPoint.y + 1;
  // }
  // if (cond8) {
  //   console.log('t4');
  //   x = widgetPoint.x - activeWidget.width;
  //   y = widgetPoint.y + 1;
  // }

  // if (cond3 && (cond5 || cond8)) {          // 1,2,11,12
  //   console.log('1');
  //   x = widgetPoint.x - activeWidget.width - 1;
  // } else if (cond4 && (cond6 || cond7)) {   // 5,6,7,8
  //   console.log('2');
  //   x = widgetPoint.x + 1;
  // } else if (cond4 && (cond5 || cond8)) {   // 3,10
  //   console.log('3');
  //   x = widgetPoint.x + 1;
  // } else if (cond3 && (cond6 || cond7)) {   // 4,9
  //   console.log('4');
  //   x = widgetPoint.x - activeWidget.width - 1;
  // }

  // if (x === undefined) {
  //   console.warn(`X undefined because: cond1 = ${cond1}, cond2 = ${cond2}, cond3 = ${cond3},
  //   cond4 = ${cond4}, cond5 = ${cond5}, cond6 = ${cond6}, cond7 = ${cond7}, cond8 = ${cond8}`);
  // }

  // if (cond1 && (cond5 || cond6)) {          // 2,3,4,5
  //   console.log('5');
  //   y = widgetPoint.y - activeWidget.height - 1;
  // } else if (cond2 && (cond7 || cond8)) {   // 8,9,10,11
  //   console.log('6');
  //   y = widgetPoint.y + 1;
  // } else if (cond2 && (cond5 || cond6)) {   // 1,6
  //   console.log('7');
  //   y = widgetPoint.y;
  // } else if (cond1 && (cond7 || cond8)) {   // 7,12
  //   console.log('8');
  //   y = widgetPoint.y - activeWidget.height - 1;
  // }

  // if (y === undefined) {
  //   console.warn(`Y undefined because: cond1 = ${cond1}, cond2 = ${cond2}, cond3 = ${cond3},
  //   cond4 = ${cond4}, cond5 = ${cond5}, cond6 = ${cond6}, cond7 = ${cond7}, cond8 = ${cond8}`);
  // }

  // return { x, y };

  // //

//   // может быть наоборот, убрать свич и добавить индексы сюда?
//   const isWidgetOnLeft = activeWidget.x < widgetPoint.x;
// // const isWidgetOnRight = activeWidget.x > widgetPoint.x;
//   const isWidgetOnTop = activeWidget.y < widgetPoint.y;
// // const isWidgetBottom = activeWidget.y > widgetPoint.y;
// // console.log(`isWidgetOnLeft = ${isWidgetOnLeft} isWidgetOnTop = ${isWidgetOnTop}`);
  // switch (pointIndex) {
  //   case 0:
  //     x = isWidgetOnLeft // +
  //       ? widgetPoint.x - activeWidget.width - 1 : widgetPoint.x;
  //     y = isWidgetOnTop
  //       ? widgetPoint.y : widgetPoint.y - activeWidget.height - 1;
  //     console.log(`case 0 x = ${x}`);
  //     return { x, y };
  //   case 1:
  //     x = isWidgetOnLeft
  //       ? widgetPoint.x : widgetPoint.x + 1;
  //     y = isWidgetOnTop
  //       ? widgetPoint.y : widgetPoint.y - activeWidget.height - 1;
  //     console.log(`case 1 x = ${x}`);
  //     return { x, y };
  //   case 2:
  //     x = isWidgetOnLeft // +
  //       ? widgetPoint.x - activeWidget.width : widgetPoint.x + 1;
  //     y = isWidgetOnTop
  //       ? widgetPoint.y - activeWidget.height : widgetPoint.y + 1;
  //     console.log(`case 2 x = ${x}`);
  //     return { x, y };
  //   case 3:
  //     x = isWidgetOnLeft
  //       ? widgetPoint.x - activeWidget.width - 1 : widgetPoint.x + 1;
  //     y = isWidgetOnTop
  //       ? widgetPoint.y - activeWidget.height : widgetPoint.y + 1;
  //     console.log(`case 3 x = ${x}`);
  //     return { x, y };
  // }

// //

  // const isActiveWidgetOnTop = activeWidget.y < widgetPoint.y;
  // const isActiveWidgetOnRight = activeWidget.x > widgetPoint.x;
  // const isActiveWidgetBottom = activeWidget.y > widgetPoint.y;
  // const isActiveWidgetOnLeft = activeWidget.x < widgetPoint.x;
  // switch (pointIndex) {
  //   case 0:
  //     x = isActiveWidgetOnTop && isActiveWidgetOnRight
  //         ? widgetPoint.x : widgetPoint.x - activeWidget.width - 1;
  //     y = isActiveWidgetBottom && isActiveWidgetOnLeft
  //         ? widgetPoint.y : widgetPoint.y - activeWidget.height - 1;
  //     return { x, y };
  //   case 1:
  //     x = isActiveWidgetOnTop && isActiveWidgetOnLeft
  //         ? widgetPoint.x - activeWidget.width : widgetPoint.x + 1;
  //     y = isActiveWidgetBottom && isActiveWidgetOnRight
  //         ? widgetPoint.y : widgetPoint.y - activeWidget.height - 1;
  //     return { x, y };
  //   case 2:
  //     x = isActiveWidgetBottom && isActiveWidgetOnRight
  //         ? widgetPoint.x - activeWidget.width : widgetPoint.x + 1;
  //     y = isActiveWidgetBottom && isActiveWidgetOnRight
  //         ? widgetPoint.y - activeWidget.height : widgetPoint.y + 1;
  //     return { x, y };
  //   case 3:
  //     x = isActiveWidgetBottom && isActiveWidgetOnRight
  //         ? widgetPoint.x : widgetPoint.x - activeWidget.width - 1;
  //     y = isActiveWidgetOnTop && isActiveWidgetOnLeft
  //         ? widgetPoint.y - activeWidget.height : widgetPoint.y + 1;
  //     return { x, y };
  // }
}
