import { stickyLimit } from '../constants';
import { sidebarWidth } from './DOM';

// rename
export function somePointInRangeWithLimit(controlPoints: number[], // into axisPoints ?
                                          pointsToCheck: number[]) {
  return someInRange(controlPoints[0] - stickyLimit, controlPoints[0] + stickyLimit, pointsToCheck)
      || someInRange(controlPoints[1] - stickyLimit, controlPoints[1] + stickyLimit, pointsToCheck);
}

export const someInRange = (firstNumb: number, lastNumb: number, arrToCheck: number[]) => {
  return arrToCheck.some(numbToCheck => firstNumb <= numbToCheck && numbToCheck <= lastNumb);
};

export function convertXForStaticLayer(x: number) { // place into new helper
  return x - sidebarWidth;
}
