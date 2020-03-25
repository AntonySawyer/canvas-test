import { IRenderStack, Coordinate, IWidget, NextMoveMode } from '../interfaces';
import { somePointInRangeWithLimit } from './math';
import { filterCandidatesForKeyboardUnstick } from './keyboard';
import { crossingChecker } from '../CrossingService';
// import { stickyLimit } from '../constants';

export function attemptMoveToSticking(stack: IRenderStack, mode: NextMoveMode,
                                      movement: Coordinate) {
  // const test = andAgain(stack, mode, movement);
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
  if (mode === 'keyboard') {
    filterCandidatesForKeyboardUnstick(candidates, movement, activeWidget);
  }

  const nearest = chooseNearestCoordinate(candidates, staticCoords);
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
  return arr;
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
  const isFailure = crossingChecker.pointsCrossingWithOtherWidgets(activeWidget.id, pointsForCheck, false).length > 0; // false, because sticky can't be repulsive
  if (!isFailure && !crossingChecker.isOutOfBorders(activeWidget)) {
    activeWidget.setPosition(nearest.x, nearest.y);
  }
}

// function andAgain(stack: IRenderStack, mode: NextMoveMode, movement: Coordinate) {
//   const activeWidget = stack.activeWidget;
//   const points2 = activeWidget.getPoints2();
//   const result = [];
//   stack.getOnlySticky()
//         .filter(widget => !widget.isActive)
//         .forEach((widget) => {
//           points2.forEach((point: Coordinate, activePointIndex) => {
//             widget.getPoints2().forEach((widgetPoint: Coordinate, nearestPointIndex) => { // index ?
//               const distance = distanceBetweenPoints(point, widgetPoint);
// // only if distance < stickingLimit (но получаается окружность, углы не учитываются)
//               if (distance < stickyLimit) {
//                 result.push({
//                   widgetPoint,
//                   activePointIndex,
//                   nearestPointIndex,
//                   distance: distanceBetweenPoints(point, widgetPoint),
//                 });
//               }
//             });
//           });

// // найти ближайшую у предыдущего
// // найти ближайшую у текущего
// // запомнить координату для активного, если это окажется лучшим вариантом ??
// // вернуть что ближе к активному
//         });
//   const nearestPoint = result.sort((a, b) => a.distance - b.distance)[0];
//   console.log(result.sort((a, b) => a.distance - b.distance));
//   nearestPoint.activePoint = getPointForActiveMove(activeWidget, nearestPoint);
//   // console.error(result.sort((a, b) => a.distance - b.distance)[0]);
//   return nearestPoint;
// }


// function distanceBetweenPoints(firstPoint: Coordinate, secondPoint: Coordinate) {
//   return Math.sqrt((secondPoint.x - firstPoint.x) ** 2 + (secondPoint.y - firstPoint.y) ** 2);
// }

// function getPointForActiveMove(activeWidget: IWidget, nearestPoint) { // add types
//   let x: number;
//   let y: number;
//   const widgetPoint: Coordinate = nearestPoint.widgetPoint;
//   const activePointIndex = nearestPoint.activePointIndex;
//   const nearestPointIndex = nearestPoint.nearestPointIndex;

//   switch (activePointIndex) {
//     case 0:
//       if (nearestPointIndex === 1) {
//         console.log('0-1');
//         x = widgetPoint.x;
//         y = widgetPoint.y + 1;
//       } else if (nearestPointIndex === 2) {
//         console.log('0-2');
//         x = widgetPoint.x + 1;
//         y = widgetPoint.y;
//       } else if (nearestPointIndex === 3) {
//         console.log('0-3');
//         x = widgetPoint.x + 1;
//         y = widgetPoint.y + 1;
//       }
//       break;
//     case 1:
//       if (nearestPointIndex === 0) {
//         console.log('1-0');
//         x = widgetPoint.x;
//         y = widgetPoint.y - activeWidget.height - 1;
//       } else if (nearestPointIndex === 2) {
//         console.log('1-2');
//         x = widgetPoint.x + 1;
//         y = widgetPoint.y - activeWidget.height - 1;
//       } else if (nearestPointIndex === 3) {
//         console.log('1-3');
//         x = widgetPoint.x  - activeWidget.width - 1;
//         y = widgetPoint.y + 1;
//       }
//       break;
//     case 2:
//       if (nearestPointIndex === 0) {
//         console.log('2-0');
//         x = widgetPoint.x - activeWidget.width - 1;
//         y = widgetPoint.y;
//       } else if (nearestPointIndex === 1) {
//         console.log('2-1');
//         x = widgetPoint.x - activeWidget.width - 1;
//         y = widgetPoint.y + 1;
//       } else if (nearestPointIndex === 3) {
//         console.log('2-3');
//         x = widgetPoint.x - activeWidget.width - 1;
//         y = widgetPoint.y - activeWidget.height;
//       }
//       break;
//     case 3:
//       if (nearestPointIndex === 0) {
//         console.log('3-0');
//         x = widgetPoint.x - activeWidget.width - 1;
//         y = widgetPoint.y - activeWidget.height - 1;
//       } else if (nearestPointIndex === 1) {
//         console.log('3-1');
//         x = widgetPoint.x + 1;
//         y = widgetPoint.y - activeWidget.height - 1;
//       } else if (nearestPointIndex === 2) {
//         console.log('3-2');
//         x = widgetPoint.x + 1;
//         y = widgetPoint.y - activeWidget.height;
//       }
//       break;
//   }

//   return { x, y };
  // }
// }
