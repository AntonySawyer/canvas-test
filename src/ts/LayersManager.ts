import { activeLayer } from './layers/Active';
import { staticLayer } from './layers/Static';
import widgetFactory from './widgetFactory';

import { isClickInsideWidget, checkCrossing, calculateMiddle, getNearest,
          getStickyCoordinates, unstickKeyboard} from './helpers/math';
import { IWidget } from './interfaces';
import { sidebarWidth, sticking, widgetSamples } from './constants';

export default class LayersManager {
  constructor() {
    document.getElementById('staticCanvas')
            .addEventListener('mousedown', (e: MouseEvent) => this.fromWidgetsToActive(e));
    document.querySelectorAll('.widgetSample').forEach((el) => {
      el.addEventListener('mousedown', (e: MouseEvent) => this.createNewWidget(e));
    });
    document.getElementById('activeCanvas')
            .addEventListener('mousemove', (e: MouseEvent) => this.onMouseMove(e));
    document.addEventListener('keydown', (e: KeyboardEvent) => this.onKeyboardMove(e));
  }

  private crossingIds: number[] = [];

  private onMouseMove(e: MouseEvent) {
    if (activeLayer.widget !== null && e.buttons === 1) {
      const { offsetX, offsetY, movementX, movementY } = e;
      const { x, y } = calculateMiddle(activeLayer.widget.width, activeLayer.widget.height,
                                       offsetX, offsetY);
      this.move(x, y, movementX, movementY, 'mouse');
    }
  }

  private onKeyboardMove(e: KeyboardEvent) {
    if (activeLayer.widget !== null) {
      const coords = [];
      switch (e.key) {
        case 'ArrowUp':
          coords.push(0, -1);
          break;
        case 'ArrowDown':
          coords.push(0, 1);
          break;
        case 'ArrowRight':
          coords.push(1, 0);
          break;
        case 'ArrowLeft':
          coords.push(-1, 0);
          break;
        default: // ignore other keys
          return;
      }
      this.move(activeLayer.widget.x, activeLayer.widget.y, coords[0], coords[1], 'keyboard');
    }
  }

  private move(x: number, y: number, movementX: number, movementY: number, mode: ('keyboard' | 'mouse')) {
    let supposedX = x + movementX - sidebarWidth;
    let supposedY = y + movementY;
    if (activeLayer.widget.isSticky) {
      const widget = activeLayer.widget.setPosition(supposedX, supposedY);
      let resultsX: number[] = getStickyCoordinates('x', staticLayer.stack, widget, sticking);
      let resultsY: number[] = getStickyCoordinates('y', staticLayer.stack, widget, sticking);
      if (mode === 'keyboard') {
        resultsX = unstickKeyboard(resultsX, movementX, supposedX);
        resultsY = unstickKeyboard(resultsY, movementY, supposedY);
      }
      const nearestX = getNearest('x', resultsX, widget, supposedX);
      const nearestY = getNearest('y', resultsY, widget, supposedY);
      const isFailure = staticLayer.stack.some((el) => {
        return checkCrossing(widget.setPosition(nearestX, nearestY), el);
      });
      if (!isFailure) {
        supposedX = nearestX;
        supposedY = nearestY;
      }
    }
    supposedX = supposedX + sidebarWidth;
    activeLayer.widget.setPosition(supposedX, supposedY);
    this.findCrossing();
  }

  private createNewWidget(e: MouseEvent) {
    if (e.buttons === 1) {
      if (activeLayer.widget !== null) {
        this.mergeActiveIntoWidget();
      }
      const idFromEvent = (e.target as HTMLElement).dataset.id;
      const { width, height } = widgetSamples.filter(el => el.id === +idFromEvent)[0];
      const coords = calculateMiddle(width, height, e.clientX, e.clientY);
      const newId = staticLayer.stack.getNewId();
      const isSticky = (e.target as HTMLElement).classList.contains('stickyWidget');
      const widget = widgetFactory(newId, coords, isSticky, width, height);
      activeLayer.changeActiveWidget(widget);
      this.findCrossing();
    }
  }

  private fromWidgetsToActive(e: MouseEvent) {
    const xForActive = e.offsetX + sidebarWidth;
    const inActive = activeLayer.widget !== null
                    && isClickInsideWidget(activeLayer.widget, xForActive, e.offsetY);
    if (inActive && e.buttons === 1) {
      activeLayer.changeActiveWidget(activeLayer.widget); // really bad
    } else {
      this.mergeActiveIntoWidget();
      for (const el of staticLayer.stack.reverse()) {
        const isInside = isClickInsideWidget(el, e.offsetX, e.offsetY);
        if (isInside && e.buttons === 1) {
          activeLayer.changeActiveWidget(el.setActive());
          staticLayer.stack.deleteWidget(el.id);
          staticLayer.render();
          return;
        }
      }
      activeLayer.changeActiveWidget(null);
    }
  }

  private mergeActiveIntoWidget() {
    if (activeLayer.widget !== null) {
      if (!activeLayer.widget.isCrossing) {
        staticLayer.addWidget(activeLayer.widget.setInactive());
        activeLayer.changeActiveWidget(null);
      } else {
        this.crossingIds.forEach((id) => {
          staticLayer.highlight(id);
        });
        this.crossingIds.length = 0;
      }
    }
  }

  private findCrossing() {
    const widget = activeLayer.widget.setInactive();
    const crossingWidgets = staticLayer.stack.filter(el => checkCrossing(el, widget));
// убрать нафиг переменную потом, брать по флагам
    crossingWidgets.map(el => el.setCrossing());
    if (crossingWidgets.length > 0) {
      activeLayer.widget.setActive().setCrossing();
      if (this.crossingIds.length !== crossingWidgets.length) {
        this.crossingIds.map((id) => {
          if (crossingWidgets.filter(el => el.id === id).length > 0) {
            return id;
          }
          staticLayer.stack.getWidgetById(id).resetColor();
          return null;
        });
      }
      this.crossingIds = this.crossingIds.filter(id => id !== null);
    } else {
// либо чейнить и рендер выносить, либо позже с подписками что-то станет яснее
      activeLayer.widget.setActive().setUncrossing();
      staticLayer.stack.onlyHightLighted().map(el => el.resetColor());
      this.crossingIds.length = 0;
    }
    staticLayer.stack
      .onlyHightLighted()
// вот тут косяк, как бы не должно быть метода
        .forEach((el) => {
          if (!this.crossingIds.includes(el.id)) {
            this.crossingIds.push(el.id);
          }
        });
    staticLayer.stack.map((el: IWidget) => {
      return !crossingWidgets.includes(el) ? el.resetColor() : el.setCrossing();
    });
    activeLayer.render();
    staticLayer.render();
  }
}
