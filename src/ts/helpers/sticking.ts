import { IRenderStack, Coordinate, IWidget, NextMoveMode, IDirection } from '../interfaces';
import { crossingChecker } from '../CrossingService';
import { stickyLimit } from '../constants';

export function attemptMoveToSticking(stack: IRenderStack, mode: NextMoveMode,
                                      movement: Coordinate) {
  const direction: IDirection = detectDirection(movement);
  const activeWidget = stack.activeWidget;
  const activePoints = activeWidget.getPoints2();
  const result = [];

  stack.getOnlySticky()
        .filter(widget => !widget.isActive)
        .forEach((widget) => {
          activePoints.forEach((activePoint: Coordinate, activePointIndex) => {
            widget.getPoints2()
                  .forEach((widgetPoint: Coordinate, nearestPointIndex) => {
                    if (pointsByDirection(direction, widgetPoint, activePoint)) {
                      const distance = distanceBetweenPoints(activePoint, widgetPoint);
                      if (distance < stickyLimit) {
                        result.push({ widgetPoint, activePointIndex, nearestPointIndex, distance });
                      }
                    }
                  });
          });
        });
  const nearestPoint = result.sort((a, b) => a.distance - b.distance)[0];
  if (nearestPoint !== undefined) {
    nearestPoint.activePoint = getPointForActiveMove(activeWidget, nearestPoint);
    if (direction.horizontal === 'zero' && mode === 'keyboard') { // move by pixels
      nearestPoint.activePoint.x = activeWidget.x;
    }
    if (direction.vertical === 'zero' && mode === 'keyboard') {
      nearestPoint.activePoint.y = activeWidget.y;
    }
    trySetStickyCoordinates(activeWidget, nearestPoint.activePoint, movement);
  }

}

function trySetStickyCoordinates(activeWidget: IWidget, nearest: Coordinate, movement: Coordinate) {
  const pointsForCheck = { first: { ...nearest },
    last: { x: nearest.x + activeWidget.width,
      y: nearest.y + activeWidget.height } };
  const crossingWidgets = crossingChecker.pointsCrossingWithOtherWidgets(activeWidget.id,
                                                                         pointsForCheck, false);
  if (crossingWidgets.length === 0 && !crossingChecker.isOutOfBorders(activeWidget)) {
    activeWidget.setPosition(nearest.x, nearest.y);
  } else {
    activeWidget.commitMovement(movement);
  }
}

function detectDirection(movement: Coordinate) {
  const direction: IDirection = {
    horizontal: movement.x > 0 ? 'right' : 'left',
    vertical: movement.y > 0 ? 'bottom' : 'top',
  };
  if (movement.x === 0) {
    direction.horizontal = 'zero';
  }
  if (movement.y === 0) {
    direction.vertical = 'zero';
  }
  return direction;
}

function pointsByDirection(direction: IDirection, point: Coordinate, activePoint: Coordinate) {
  const res = [];
  if (direction.horizontal === 'right') {
    res.push(activePoint.x < point.x);
  } else if (direction.horizontal === 'left') {
    res.push(activePoint.x > point.x);
  } else {
    res.push(true);
  }
  if (direction.vertical === 'top') {
    res.push(activePoint.y > point.y);
  } else if (direction.vertical === 'bottom') {
    res.push(activePoint.y < point.y);
  } else {
    res.push(true);
  }
  return res.every(bool => bool);
}

function distanceBetweenPoints(firstPoint: Coordinate, secondPoint: Coordinate) {
  return Math.sqrt((secondPoint.x - firstPoint.x) ** 2 + (secondPoint.y - firstPoint.y) ** 2);
}

function getPointForActiveMove(activeWidget: IWidget, nearestPoint) { // add types
  const widgetPoint: Coordinate = nearestPoint.widgetPoint;
  const activePointIndex = nearestPoint.activePointIndex;
  const nearestPointIndex = nearestPoint.nearestPointIndex;
  let x: number = widgetPoint.x;
  let y: number = widgetPoint.y;

  if (activePointIndex === 0 && nearestPointIndex !== 3) {
    x += 1;
  }
  if (activePointIndex === 0 && nearestPointIndex !== 1) {
    y += 1;
  }
  if (activePointIndex === 1) {
    x -= activeWidget.width;
    if (nearestPointIndex !== 2) {
      x -= 1;
    }
    if (nearestPointIndex !== 0) {
      y += 1;
    }
  }
  if (activePointIndex === 2) {
    x -= activeWidget.width;
    y -= activeWidget.height;
    if (nearestPointIndex !== 1) {
      x -= 1;
    }
    if (nearestPointIndex !== 3) {
      y -= 1;
    }
  }
  if (activePointIndex === 3) {
    y -= activeWidget.height;
    if (nearestPointIndex !== 0) {
      x += 1;
    }
    if (nearestPointIndex !== 2) {
      y -= 1;
    }
  }

  return { x, y };
}
