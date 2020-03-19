import widgetFactory from './widgets/widgetFactory';
import { Coordinate, IRenderStack, MouseDownTarget, KeyboardKeysForListen,
         NextMoveMode, ILayersActionRunner } from './interfaces';
import RenderStack from './RenderStack';
import { attemptMoveToSticking } from './helpers/sticking';
import { staticCanvas, ctxStatic, staticWidth, staticHeight, activeCanvas } from './helpers/DOM';
import { isPrimaryBtnPressed, getArrowMovement } from './helpers/events';
import { Static } from './layers/Static';
import { activeLayer } from './layers/Active';
import { convertXForStaticLayer } from './helpers/math';

export default class LayersActionRunner implements ILayersActionRunner { // rename
  constructor() {
    staticCanvas.addEventListener('mousedown',
                                  (e: MouseEvent) => this.handleMouseDown(e, 'canvas'));
    document.querySelectorAll('.widgetSample').forEach((el) => {
      el.addEventListener('mousedown', (e: MouseEvent) => this.handleMouseDown(e, 'div'));
    });
    activeCanvas.addEventListener('mousemove', (e: MouseEvent) => this.onMouseMove(e));
    document.addEventListener('keydown', (e: KeyboardEvent) => this.onKeyboardMove(e));
    document.addEventListener('mouseup', () => this.actionEnd());
    document.addEventListener('keyup', () => this.actionEnd());
    this.stack = new RenderStack();
    // tslint:disable-next-line: no-unused-expression
    new Static(ctxStatic, staticWidth, staticHeight);
  }

  stack: IRenderStack;

  private handleMouseDown(e: MouseEvent, mode: MouseDownTarget) {
    if (isPrimaryBtnPressed(e.buttons)) {
      const isActiveLayerOnTop = true;
      activeLayer.setLayerOnTop(isActiveLayerOnTop);
      switch (mode) {
        case 'div':
          this.createNewWidget(e);
          break;
        case 'canvas':
          this.setActiveWidgetIfNeeded(e);
          break;
      }
    }
  }

  private actionEnd() { // rename ???? OR remove
    const isActiveLayerOnTop = false;
    activeLayer.setLayerOnTop(isActiveLayerOnTop);
    if (this.stack.hasActiveWidget() && this.stack.activeWidget.isOutOfBorders()) {
      this.stack.deleteActiveWidget();
    }
  }

  private onMouseMove(e: MouseEvent) {
    if (this.stack.hasActiveWidget() && isPrimaryBtnPressed(e.buttons)) {
      const { offsetX, offsetY, movementX, movementY } = e;
      const movement = { x: movementX, y: movementY };
      this.stack.activeWidget.moveToGeometricCenter(convertXForStaticLayer(offsetX), offsetY);
      this.makeNextStep(movement, 'mouse');
    }
  }

  private onKeyboardMove(e: KeyboardEvent) {
    const movement: Coordinate = getArrowMovement(e.key as KeyboardKeysForListen);
    if (this.stack.hasActiveWidget() && movement !== undefined) {
      this.makeNextStep(movement, 'keyboard'); // mode is needed ?
    }
  }

  private makeNextStep(movement: Coordinate, mode: NextMoveMode) {
    const widget = this.stack.activeWidget;
    widget.commitMovement(movement);
    if (widget.isSticky) {
      attemptMoveToSticking(this.stack, mode, movement);
    }
  }

  private createNewWidget(e: MouseEvent) {
    const widget = widgetFactory(this.stack.getStack(), e);
    this.stack.addWidget(widget);
  }

  private setActiveWidgetIfNeeded(e: MouseEvent) {
    const clickCoordinate = { x: e.offsetX, y: e.offsetY };
    for (const widget of this.stack.getStack()) {
      if (widget.coordinateIsInside(clickCoordinate)) {
        if (!widget.isActive) { // =(
          this.stack.setNewActive(widget);
        }
        return;
      }
    }
    if (this.stack.hasActiveWidget()) { // =(
      this.stack.resetActive();
    }
  }

}
