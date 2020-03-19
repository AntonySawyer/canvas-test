import { activeLayer } from './layers/Active';
import { staticLayer } from './layers/Static';
import widgetFactory from './widgets/widgetFactory';
import { ICoordinate, IRenderStack } from './interfaces';
import RenderStack from './RenderStack';
import { attemptMoveToSticking } from './helpers/rect';
import { activeCanvas, staticCanvas } from './helpers/DOM';
import { getWidgetParams } from './helpers/widget';
import { isPrimaryBtnPressed, getArrowMovement } from './helpers/events';

export default class LayersActionRunner {
  constructor() {
    staticCanvas.addEventListener('mousedown',
                                  (e: MouseEvent) => this.handleMouseDown(e, 'canvas'));
    document.querySelectorAll('.widgetSample').forEach((el) => {
      el.addEventListener('mousedown', (e: MouseEvent) => this.handleMouseDown(e, 'div'));
    });
    activeCanvas.addEventListener('mousemove', (e: MouseEvent) => this.onMouseMove(e));
    document.addEventListener('keydown', (e: KeyboardEvent) => this.onKeyboardMove(e));
    document.addEventListener('mouseup', e => this.actionEnd());
    document.addEventListener('keyup', e => this.actionEnd());
  }

  stack: IRenderStack = new RenderStack();

  private handleMouseDown(e: MouseEvent, mode: ('div' | 'canvas')) {
    if (isPrimaryBtnPressed(e.buttons)) {
      this.placeActiveWidgetIntoStatic();
      activeLayer.setActiveLayerOnTop(true);
      switch (mode) {
        case 'div':
          this.createNewWidget(e);
          break;
        case 'canvas':
          this.changeActiveWidgetIfNeeded(e);
          break;
      }
    }
  }

  private actionEnd() {
    activeLayer.setActiveLayerOnTop(false);
    if (this.stack.activeIsExist()) {
      this.deleteWidgetIfOutOfBorders();
    }
  }

  private deleteWidgetIfOutOfBorders() {
    const widget = this.stack.getActive();
    if (!widget.inBorders()) {
      this.stack.deleteWidget(widget.id);
      activeLayer.clearCanvas();
    }
  }

  private onMouseMove(e: MouseEvent) {
    if (this.stack.activeIsExist() && isPrimaryBtnPressed(e.buttons)) {
      const { offsetX, offsetY, movementX, movementY } = e;
      const movement = { x: movementX, y: movementY };
      const activeWidget = this.stack.getActive();
      activeWidget.moveToGeometricCenter(offsetX, offsetY);
      this.makeNextStep(movement, 'mouse');
    }
  }

  private onKeyboardMove(e: KeyboardEvent) {
    const movement: ICoordinate = getArrowMovement(e.key);
    if (this.stack.activeIsExist() && movement !== undefined) {
      this.makeNextStep(movement, 'keyboard');
    }
  }

  private makeNextStep(movement: ICoordinate, mode: ('keyboard' | 'mouse')) {
    const widget = this.stack.getActive();
    widget.setPosition(widget.x + movement.x, widget.y + movement.y);
    if (widget.isSticky) {
      attemptMoveToSticking(this.stack, mode, movement);
    }
    this.findCrossing();
  }

  private createNewWidget(e: MouseEvent) {
    const params = getWidgetParams(e);
    const widget = widgetFactory(this.stack.getStack(), params);
    this.stack.addWidget(widget);
  }

  private changeActiveWidgetIfNeeded(e: MouseEvent) {
    for (const el of this.stack.getStack()) {
      if (el.coordinateIsInside(e.offsetX, e.offsetY)) {
        this.stack.setNewActive(el);
        return;
      }
    }
  }

  private placeActiveWidgetIntoStatic() {
    activeLayer.resetCanvas();
    if (this.stack.activeIsExist()) {
      this.stack.resetActive();
    }
    this.findCrossing();
  }

  private findCrossing() {
    this.stack.getStack().map(el => el.setCrossing(this.stack.isCrossingWithOthers(el)));
    activeLayer.clearCanvas();
    staticLayer.clearCanvas();
    this.stack.rerender();
  }
}
