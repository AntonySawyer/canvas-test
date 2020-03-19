import { IRenderStack, ICoordinate, IWidget } from 'ts/interfaces';
import { someSideInLimit } from './math';
import { sidebarWidth } from './DOM';
import { filterCandidatesForKeyboardUnstick } from './keyboard';
import { stickingLimit } from '../constants';

export function attemptMoveToSticking(stack: IRenderStack, mode: string, movement: ICoordinate) {
  const activeWidget = stack.getActive();
  const { x1, y1 } = activeWidget.getPointsFromStatic();
  const defaultCoords = { x: activeWidget.x, y: activeWidget.y };
  const staticCoords = { x: x1, y: y1 };
  const candidates = { x: [], y: [] };

  stack.onlySticky()
      .filter(el => onlyNearbyInStickingLimit(activeWidget, el, stickingLimit))
      .forEach((el) => {
        candidates.x.push(...prepareCoordsOfNeibor(el.x, el.width, activeWidget.width));
        candidates.y.push(...prepareCoordsOfNeibor(el.y, el.height, activeWidget.height));
      });
  if (mode === 'keyboard') {
    filterCandidatesForKeyboardUnstick(candidates, movement, activeWidget);
  }

  const nearest = chooseNearestCoordinate(candidates, defaultCoords, staticCoords);
  trySetStickyCoordinates(activeWidget, nearest, stack, defaultCoords);
}

function onlyNearbyInStickingLimit(activeWidget: IWidget, widgetToCheck: IWidget, lim: number) {
  const { x1, x2, y1, y2 } = activeWidget.getPointsFromStatic();
  return someSideInLimit([x1, x2], [widgetToCheck.x, widgetToCheck.x + widgetToCheck.width], lim)
      && someSideInLimit([y1, y2], [widgetToCheck.y, widgetToCheck.y + widgetToCheck.height], lim);
}

function prepareCoordsOfNeibor(nearbyCoord: number, nearbySize: number, activeSize: number) {
  return [nearbyCoord, // left to left
    nearbyCoord - activeSize - 1, // right to left
    nearbyCoord + nearbySize + 1, // left to right
    nearbyCoord + nearbySize - activeSize]; // right to right
}

function chooseNearestCoordinate(candidates: {x: number[], y: number[]},
                                 defaultCoords: ICoordinate, staticCoords: ICoordinate) {
  const nearest = { ...defaultCoords };
  for (const key in candidates) {
    if (candidates[key].length !== 0) {
      nearest[key] = candidates[key].reduce((a, b) => {
        return Math.abs(a - staticCoords[key]) < Math.abs(b - staticCoords[key]) ? a : b;
      });
      if (key === 'x') {
        nearest.x += sidebarWidth;
      }
    }
  }
  return nearest;
}

function trySetStickyCoordinates(activeWidget: IWidget, nearest: ICoordinate,
                                 stack: IRenderStack, defaultCoords: ICoordinate) {
  activeWidget.setPosition(nearest.x, nearest.y);
  const isFailure = stack.isCrossingWithOthers(activeWidget);
  if (isFailure) {
    activeWidget.setPosition(defaultCoords.x, defaultCoords.y);
  }
}
