import { stickyLimit } from '../constants';
import { sidebarWidth } from './DOM';

// rename
export function somePointInRangeWithLimit(controlPoints: number[], // into axisPoints ?
                                          pointsToCheck: number[]) {
  return someInRange(controlPoints[0] - stickyLimit, controlPoints[0] + stickyLimit, pointsToCheck)
      || someInRange(controlPoints[1] - stickyLimit, controlPoints[1] + stickyLimit, pointsToCheck);
}

export const someInRange = (first: number, last: number, arrToCheck: number[]) => {
// numbToCheck?
  return arrToCheck.some(numbToCheck => first <= numbToCheck && numbToCheck <= last);
};

export function convertXForStaticLayer(x: number) {
  return x - sidebarWidth;
}
