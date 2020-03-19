import { activeLayer } from './layers/Active';
import { widgetLayer } from './layers/Widget';
import Subscriber from './Subscriber';
import widgetFactory from './widgetFactory';

import { isClickInsideWidget, calculateMiddle } from './helpers/math';
import { sidebarWidth } from './constants';

import { IControl } from './interfaces';

class Controller implements IControl { // rename
  init() {
    activeLayer.init();
    widgetLayer.setSizes();
    Subscriber.subscribe('control', '#widgetCanvas', 'mousedown', this.fromWidgetsToActive); // add EventListener
    Subscriber.subscribe('control', '#activeCanvas', 'mouseup', this.updateRenderStack);
    Subscriber.subscribe('control', '.widgetSample', 'mousedown', this.createNewWidget);
  }

  private createNewWidget(e: MouseEvent) {
    const idFromEvent = (e.target as HTMLElement).dataset.id;
    const widget = widgetFactory(widgetLayer.renderStack, +idFromEvent, e.clientX, e.clientY);
    activeLayer.changeActiveWidget(widget);
  }

  private fromWidgetsToActive(e: MouseEvent) {
    for (const el of widgetLayer.renderStack.reverse()) {
      const isInside = isClickInsideWidget(el, e.offsetX, e.offsetY);
      if (isInside) {
        const { x, y } = calculateMiddle(el.width, el.height, e.offsetX + sidebarWidth, e.offsetY);
        activeLayer.changeActiveWidget({ ...el, x, y });
        widgetLayer.deleteWidget(el.id);
        break;
      }
    }
  }

  private updateRenderStack() {
    widgetLayer.addWidget(activeLayer.widget);
    activeLayer.changeActiveWidget(null);
  }
}

export default Controller;
