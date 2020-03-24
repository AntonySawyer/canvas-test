import { stickyLimit } from '../constants';

export function somePointInRangeWithLimit(controlPoints: number[],
                                          pointsToCheck: number[]) {
  return someInRange(controlPoints[0] - stickyLimit, controlPoints[0] + stickyLimit, pointsToCheck)
      || someInRange(controlPoints[1] - stickyLimit, controlPoints[1] + stickyLimit, pointsToCheck);
}

export const someInRange = (firstNumb: number, lastNumb: number, arrToCheck: number[]) => {
  return arrToCheck.some(numbToCheck => firstNumb <= numbToCheck && numbToCheck <= lastNumb);
};
