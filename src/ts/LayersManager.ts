import { activeLayer } from './layers/Active';
import { widgetLayer } from './layers/Widget';
import widgetFactory from './widgetFactory';

import { isClickInsideWidget, checkCrossing, calculateMiddle } from './helpers/math';
import { sidebarWidth, activeWidgetColor, stickyWidgetColor, defaultWidgetColor, highlightColor, stickyLimit } from './constants';
import { IWidget } from './interfaces';

export default class LayersManager {
  constructor() {
    document.getElementById('widgetCanvas')
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
    this.move(e);
    // duplicate
    this.findCrossing({ ...activeLayer.widget, x: activeLayer.widget.x - sidebarWidth });
  }

  private onKeyboardMove(e: KeyboardEvent) {
    activeLayer.onKeyDown(e);
    if (activeLayer.widget !== null) {
      this.findCrossing({ ...activeLayer.widget, x: activeLayer.widget.x - sidebarWidth });
    }
  }

  private move(e: MouseEvent) { // set position.
    const actWidget = activeLayer.widget; // for short
    if (actWidget !== null && e.buttons) {
      const { x, y } = calculateMiddle(actWidget.width, actWidget.height, e.offsetX, e.offsetY);
      let xMiddle = x + e.movementX;
      let yMiddle = y + e.movementY;
      const staticWidget = { ...actWidget, x: xMiddle - sidebarWidth, y: yMiddle };
      const candidates = widgetLayer.renderStack
        .onlySticky()
        .filter((el) => {
          return checkCrossing({ ...staticWidget, x: staticWidget.x + stickyLimit }, el) // move right
            || checkCrossing({ ...staticWidget, x: staticWidget.x - stickyLimit }, el)   // move left
            || checkCrossing({ ...staticWidget, y: staticWidget.y + stickyLimit }, el)   // move down
            || checkCrossing({ ...staticWidget, y: staticWidget.y - stickyLimit }, el);  // move up
        });
        let resultsX: {x: number }[] = [];
        let resultsY: {y: number }[] = [];

      const neabors = widgetLayer.renderStack
        .onlySticky()
        .filter((el) => {
          return Math.abs(el.x - stickyLimit) < staticWidget.x && el.x + stickyLimit > staticWidget.x
            || Math.abs(el.y - stickyLimit) < staticWidget.y && el.y + stickyLimit > staticWidget.y
            || Math.abs(el.x + el.width - stickyLimit) < staticWidget.x && el.x + el.width + stickyLimit > staticWidget.x
            || Math.abs(el.y + el.height - stickyLimit) < staticWidget.y && el.y + el.height + stickyLimit > staticWidget.y;
        });
        if (neabors.length !== 0) {
          console.log('neabors');
          console.log(neabors);
          neabors.forEach((el) => {
            // const stickyX = el.x > staticWidget.x ? el.x + 1 : el.x + 1;
            resultsX.push({ x: el.x });
          });
          neabors.forEach((el) => {
            // const stickyY = el.y > staticWidget.y ? el.y - 1 : el.y + 1;
            // console.log(stickyY);
            resultsY.push({ y: el.y });
          });
        }

      if (candidates.length !== 0) {
        console.log('candidates');
        console.log(candidates);

        candidates.forEach((el) => {
          const stickyX = el.x > staticWidget.x ? el.x - staticWidget.width - 1 : el.x + el.width + 1;
          resultsX.push({ x: stickyX });
        });
        candidates.forEach((el) => {
          const stickyY = el.y > staticWidget.y ? el.y - staticWidget.height - 1 : el.y + el.height + 1;
          resultsY.push({ y: stickyY });
        });
        resultsX = resultsX.filter(el => Math.abs(staticWidget.x - el.x) < stickyLimit);
        resultsY = resultsY.filter(el => Math.abs(staticWidget.y - el.y) < stickyLimit);
        if (resultsX.length !== 0 && resultsY.length !== 0) {
          const control = widgetLayer.renderStack.filter((el) => {
            return checkCrossing({ ...staticWidget, x: resultsX[0].x, y: resultsY[0].y }, el);
          });
          console.log(resultsX);
          console.log(resultsY);
          if (control.length === 0) {
            xMiddle = resultsX[0].x + sidebarWidth;
            yMiddle = resultsY[0].y;
          }
        } else {
          if (resultsX.length !== 0) {
            console.log(resultsX);
              const controlX = widgetLayer.renderStack.filter((el) => {
              return checkCrossing({ ...staticWidget, x: resultsX[0].x, y: yMiddle }, el);
            });
            if (controlX.length === 0) {
              xMiddle = resultsX[0].x + sidebarWidth;
            }
          }
          if (resultsY.length !== 0) {
            console.log(resultsY);
              const controlY = widgetLayer.renderStack.filter((el) => {
              return checkCrossing({ ...staticWidget, x: xMiddle, y: resultsY[0].y }, el);
            });
            if (controlY.length === 0) {
              yMiddle = resultsY[0].y;
            }
          }
        }
      }
      console.log(`and x = ${xMiddle}, y = ${yMiddle}`);
      activeLayer.changeActiveWidget({ ...actWidget, x: xMiddle, y: yMiddle });
    }
  }

  private createNewWidget(e: MouseEvent) {
    if (activeLayer.widget !== null) {
      this.mergeActiveIntoWidget();
    }
    const idFromEvent = (e.target as HTMLElement).dataset.id;
    const newId = widgetLayer.renderStack.getNewId();
    const isSticky = (e.target as HTMLElement).classList.contains('stickyWidget');
    const widget = widgetFactory(newId, +idFromEvent, e.clientX, e.clientY, isSticky);
    activeLayer.changeActiveWidget({ ...widget, color: activeWidgetColor });
  }

  private fromWidgetsToActive(e: MouseEvent) {
    const xForActive = e.offsetX + sidebarWidth;
    const inActive = activeLayer.widget !== null
                    && isClickInsideWidget(activeLayer.widget, xForActive, e.offsetY);
    if (inActive) {
      // костыль
      // сам себя назначает, чтобы поднять холст для отслеживания движения И! меняет цвет
      activeLayer.changeActiveWidget({ ...activeLayer.widget, color: activeWidgetColor });
    } else {
      this.mergeActiveIntoWidget();
      for (const el of widgetLayer.renderStack.reverse()) {
        const isInside = isClickInsideWidget(el, e.offsetX, e.offsetY);
        if (isInside) {
          activeLayer.changeActiveWidget({ ...el, x: el.x + sidebarWidth, color: activeWidgetColor });
          widgetLayer.deleteWidget(el.id);
          return;
        }
      }
      activeLayer.changeActiveWidget(null);
    }
  }

  private mergeActiveIntoWidget() {
    if (activeLayer.widget !== null) {
      if (activeLayer.widget.color !== highlightColor) {
        widgetLayer.addWidget({ ...activeLayer.widget,
          x: activeLayer.widget.x - sidebarWidth,
          color: this.getColor(activeLayer.widget) });
        activeLayer.changeActiveWidget(null);
      } else {
        this.crossingIds.forEach((id) => {
          widgetLayer.highlight(id, this.getColor(widgetLayer.renderStack.getWidgetById(id)));
        });
        this.crossingIds.length = 0;
      }
    }
  }

  private findCrossing(widget: IWidget) {
    // T____T
    // может добавить проверки на текущий цвет, типа не перекрашивать активный, если он уже красный
    const crossingWidgets = widgetLayer.renderStack
                            .filter(el => checkCrossing(el, widget));
    crossingWidgets.map((el) => {
      widgetLayer.highlight(el.id, highlightColor);
    });
    if (crossingWidgets.length > 0 && !crossingWidgets.includes(widget)) {
      activeLayer.changeActiveWidget({ ...widget, x: widget.x + sidebarWidth, color: highlightColor });
      if (this.crossingIds.length !== crossingWidgets.length) {
        this.crossingIds.map((id) => {
          if (crossingWidgets.filter(el => el.id === id).length > 0) {
            return id;
          }
          widgetLayer.highlight(id, this.getColor(widgetLayer.renderStack.getWidgetById(id)));
          return null;
        });
      }
      this.crossingIds = this.crossingIds.filter(id => id !== null);
    } else {
      activeLayer.changeActiveWidget({ ...widget, x: widget.x + sidebarWidth, color: activeWidgetColor });
      this.crossingIds.map(id => widgetLayer.highlight(id, this.getColor(widgetLayer.renderStack.getWidgetById(id))));
      this.crossingIds.length = 0;
    }
    widgetLayer.renderStack
        .filter(el => el.color === highlightColor)
        .forEach((el) => {
          if (!this.crossingIds.includes(el.id)) {
            this.crossingIds.push(el.id);
          }
        });
    widgetLayer.renderStack.map((el) => {
      return !crossingWidgets.includes(el)
                ? { ...el, color: this.getColor(el) }
                : { ...el, color: highlightColor };
    });
  }

  private getColor(widget: IWidget) {
    return widget.isSticky ? stickyWidgetColor : defaultWidgetColor;
  }
}
