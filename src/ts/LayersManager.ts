import { activeLayer } from './layers/Active';
import { widgetLayer } from './layers/Widget';
import widgetFactory from './widgetFactory';

import { isClickInsideWidget, checkCrossing, findNeabors } from './helpers/math';
import { sidebarWidth, activeWidgetColor, stickyWidgetColor, defaultWidgetColor, highlightColor } from './constants';
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
    activeLayer.move(e);
    // duplicate
    if (activeLayer.widget.isSticky) {
      this.makeSticky(activeLayer.widget);
    }
    // duplicate
    this.findCrossing({ ...activeLayer.widget, x: activeLayer.widget.x - sidebarWidth });
  }

  private onKeyboardMove(e: KeyboardEvent) {
    if (activeLayer.widget !== null) {
      // add sticky here
      activeLayer.onKeyDown(e);
      if (activeLayer.widget.isSticky) {
        this.makeSticky(activeLayer.widget);
      }
      this.findCrossing({ ...activeLayer.widget, x: activeLayer.widget.x - sidebarWidth });
    }
  }

  private makeSticky(widget: IWidget) {
    // при движении вдоль оси - замыкать на перпендикулярную ось, если меньше лимита
    // а если пересекается и подсвечивается - то нужно вычитать эту фигуру из подсветки или нет?
    const stickyLimit = 50;
    // !!!!!!!!!!!! перепроверь, по идее часть должна минусоваться, а в другую сторону двойная доза
    const stickyArea = { ...widget,
      x: widget.x  - sidebarWidth - stickyLimit,
      y: widget.y - stickyLimit,
      width: widget.width + stickyLimit * 2,
      height: widget.height + stickyLimit * 2 };
// ещё, кроме минуса сайдбара тут, надо будет его добавить к итогу. НАДО что-то с этиим сделать
    const candidates = widgetLayer.renderStack
      .onlySticky()
      .filter(el => checkCrossing(stickyArea, el));
// в будущем по-хорошему нужно будет отдельно искать по осям
// а ещё нельзя забывать про границы самого канваса
// а ещё надо двигать только одну координату, при пересечении с пространством - как узнать которую?
  if (candidates.length === 1) {
      const { newX, newY } = findNeabors(stickyLimit, stickyArea, candidates[0]);
      const reallyNewX = newX === widget.x ? newX : newX + sidebarWidth;
      activeLayer.changeActiveWidget({ ...activeLayer.widget, x: reallyNewX, y: newY });
    } else if (candidates.length === 2) {
      const results = [];
      candidates.map(el => results.push(findNeabors(stickyLimit, widget, el)));
      const newX = results.reduce((a, b) => a.newX < b.newX ? a.newX : b.newX);
      const newY = results.reduce((a, b) => a.newY < b.newY ? a.newY : b.newY);
      const reallyNewX = newX === widget.x ? newX : newX - sidebarWidth;
      activeLayer.changeActiveWidget({ ...activeLayer.widget, x: reallyNewX, y: newY });
    } else if (candidates.length > 2) {
// temporary the same, but need to change logic !!!
      const results = [];
      candidates.map(el => results.push(findNeabors(stickyLimit, widget, el)));
      const newX = results.reduce((a, b) => a.newX < b.newX ? a.newX : b.newX);
      const newY = results.reduce((a, b) => a.newY < b.newY ? a.newY : b.newY);
      const reallyNewX = newX === widget.x ? newX : newX - sidebarWidth;
      activeLayer.changeActiveWidget({ ...activeLayer.widget, x: reallyNewX, y: newY });
    }
// надо учитывать новые координаты виджета и координаты всех из стэка + не забыть про ширину сайдбара
// если одна из границ виджета на расстоянии 15 пикселей
// и при этом на новом месте не будет ни с кем пересекаться, то переместить к той границе -1
// надо контролировать при последующем движении - что если граница всё ещё рядом, то двигать по оси вдоль
// не меняя координату той оси
// и если курсор мыши подвинулся дальше чем на 5-15 пикселей в противоположную от виджета сторону - то отлепить
// в том числе и на пересечение, после чего провериить на красный
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
