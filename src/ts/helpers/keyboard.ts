import { Coordinate, IWidget } from '../interfaces';

export function filterCandidatesForKeyboardUnstick(candidates: { x: number[], y: number[] },
                                                   movement: Coordinate, activeWidget: IWidget) {
  candidates.x = filterOppositeToMovement(candidates.x, movement.x, activeWidget.x);
  candidates.y = filterOppositeToMovement(candidates.y, movement.y, activeWidget.y);
}
// rename filterOppositeToMovement coords + supposedPoints
function filterOppositeToMovement(candidates: number[], movement: number, currentPoint: number) {
  if (movement === 0) {
    return [];
  }

  const offset = currentPoint + movement;
  return candidates.filter((point) => {
    return movement > 0 ? point > offset : point < offset;
  });

}
