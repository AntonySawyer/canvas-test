import { ICoordinate, IWidget } from '../interfaces';
import { sidebarWidth } from './DOM';

export function filterCandidatesForKeyboardUnstick(candidates: { x: number[], y: number[] },
                                                   movement: ICoordinate, activeWidget: IWidget) {
  candidates.x = filterOppositeToMovement(candidates.x, movement.x, activeWidget.x - sidebarWidth);
  candidates.y = filterOppositeToMovement(candidates.y, movement.y, activeWidget.y);
}

// move into ?
function filterOppositeToMovement(supposed: number[], movement: number, active: number) {
  // return supposed.filter(el => movement > 0 !== el > active + movement);
  if (movement > 0) {
    return supposed.filter(el => el > active + movement);
  }
  if (movement < 0) {
    return supposed.filter(el => el < active + movement);
  }
  return [];
}
