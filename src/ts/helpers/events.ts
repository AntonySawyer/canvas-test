import { primaryBtnIndex, arrowSpeed } from '../constants';
import { KeyboardKeysForListen } from '../interfaces';

export function isPrimaryBtnPressed(eventBtnValue: number) {
  return eventBtnValue === primaryBtnIndex;
}

export function getArrowMovement(arrowKey: KeyboardKeysForListen) {
  switch (arrowKey) {
    case 'ArrowUp':
      return { x: 0, y: -arrowSpeed };
    case 'ArrowDown':
      return { x: 0, y: arrowSpeed };
    case 'ArrowRight':
      return { x: arrowSpeed, y: 0 };
    case 'ArrowLeft':
      return { x: -arrowSpeed, y: 0 };
    default: // ignore other keys
      return;
  }
}
