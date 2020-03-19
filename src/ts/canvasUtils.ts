import { canvasWidth, canvasHeight, sidebarWidth, zIndActiveLayerOnTop, zIndActiveLayerBottom } from './constants';
import Items from './Items';
import { IWidget } from './interfaces';
import Widget from './Widget';
import DragNDrop from './DragNDrop';

export const items = document.getElementById('items') as HTMLCanvasElement;
export const ctxItems = items.getContext('2d');

export const activeLayer = document.getElementById('activeLayer') as HTMLCanvasElement;
export const ctxActiveLayer = activeLayer.getContext('2d');

export function setSizes() {
  ctxItems.canvas.width = canvasWidth - sidebarWidth;
  ctxItems.canvas.height = canvasHeight;
  ctxActiveLayer.canvas.width = canvasWidth;
  ctxActiveLayer.canvas.height = canvasHeight;
}

export function drawItems() {
  clearCanvas(ctxItems);
  Items.renderStack.forEach(widget => Widget.draw(ctxItems, widget));
}

export function drawMove(widget?: IWidget) {
  clearCanvas(ctxActiveLayer);
  Widget.draw(ctxActiveLayer, widget);
}

export const clearCanvas = (ctx: CanvasRenderingContext2D) => {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
};

export function setListeners() {
  [activeLayer].map((el) => {
    el.addEventListener('mouseup', DragNDrop.mouseUpHandler);
    el.addEventListener('mousemove', DragNDrop.moveHandler);
  });
  items.addEventListener('mousedown', DragNDrop.mouseDownHandler);
  document.querySelectorAll('.unit').forEach((el) => {
    el.addEventListener('mousedown', DragNDrop.mouseDownHandler);
  });
}

export const activeLayerHoisted = (isMoving: boolean = false) => {
  activeLayer.style.zIndex = isMoving ? zIndActiveLayerOnTop : zIndActiveLayerBottom;
};

export function setCursorStyle(newCursor: ('default' | 'move')) {
  activeLayer.style.cursor = newCursor;
}
