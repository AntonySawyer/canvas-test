import Layer from './Layer';
import { zIndexTop, zIndexBottom, cursorMove, cursorDefault, listenEvents, ignoreEvents } from '../constants';
import { activeCanvas, ctxActiveLayer, activeWidth, activeHeight } from '../helpers/DOM';

class Active extends Layer {
  constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
    super(ctx, width, height);
  }

  setActiveLayerOnTop(isActive: boolean) {
    activeCanvas.style.zIndex = isActive ? zIndexTop : zIndexBottom;
    activeCanvas.style.cursor = isActive ? cursorMove : cursorDefault;
    activeCanvas.style.pointerEvents = isActive ? listenEvents : ignoreEvents;
  }

  resetCanvas() {
    this.clearCanvas();
    this.setActiveLayerOnTop(false);
  }

}

export const activeLayer = new Active(ctxActiveLayer, activeWidth, activeHeight);
