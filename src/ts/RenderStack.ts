import { IRenderStack, IWidget, IWidgetParams } from './interfaces';
import { subscriber } from './Subscriber';
import { StackEvents, CanvasEvents, WidgetEvents } from './constants';
import { widgetFactory } from './widgets/widgetFactory';

export default class RenderStack  implements IRenderStack {
  constructor() {
    this.stack = [];
    subscriber.subscribe(CanvasEvents.ActiveLayerCleared, this.renderActiveWidget);
    subscriber.subscribe(CanvasEvents.StaticLayerCleared, this.renderStaticWidgets);
    subscriber.subscribe(WidgetEvents.SetNewPosition, this.resetHighLightBorders);
    subscriber.subscribe(WidgetEvents.ChangeActiveStatus, this.resetHighLightBorders);
  }

  private stack: IWidget[];

  get activeWidget(): IWidget {
    return this.getActive();
  }

  initStackFromStorage = (stackParams: IWidgetParams[]) => {
    this.stack.length = 0;
    stackParams.forEach((widgetParams) => {
      const widget = widgetFactory(widgetParams);
      this.addWidget(widget);
      subscriber.notify(StackEvents.InitStackFromStorage);
      this.resetActive();
    });
  }

  addWidget = (widget: IWidget) => {
    this.stack.push(widget);
    this.setNewActive(widget);
  }

  deleteActiveWidget() {
    this.deleteWidget(this.activeWidget.id);
    subscriber.notify(StackEvents.ActiveWidgetRemoved);
  }

  getCrossingPairs = () => {
    const crossingWidgets = this.stack.filter(widget => widget.isCrossing);
    return this.getPairs(crossingWidgets);
  }

  setHighlightBordersByIds = (ids: number[]) => {
    if (this.hasActiveWidget()) {
      this.resetActive();
    }
    this.resetHighLightBorders();
    ids.forEach((id) => {
      const widget = this.getWidgetById(id);
      widget.setHighlightBorders(true);
    });
    subscriber.notify(StackEvents.BorderHightlight);
  }

  resetHighLightBorders = () => {
    this.stack.filter(widget => widget.isHighlightBorders)
              .forEach(widget => widget.setHighlightBorders(false));
  }

  getStack = () => this.stack;

  getStackWithoutId = (id: number) => this.stack.filter(widget => widget.id !== id);

  getWidgetById = (id: number) => this.stack.filter(widget => widget.id === id)[0];

  getOnlySticky = () => this.stack.filter(widget => widget.isSticky);

  resetActive = () => this.activeWidget.setActive(false);

  setNewActive(widget: IWidget) {
    if (this.hasActiveWidget()) {
      this.resetActive();
    }
    widget.setHighlightBorders(false);
    widget.setActive(true);
  }

  hasActiveWidget = () => this.activeWidget !== undefined;

  private renderStaticWidgets = () => {
    this.getOnlyStaticWidgets().forEach(widget => widget.draw());
  }

  private renderActiveWidget = () => {
    if (this.hasActiveWidget()) {
      this.activeWidget.draw();
    }
  }

  private deleteWidget(id: number) {
    const index = this.stack.findIndex(widget => widget.id === id);
    this.stack.splice(index, 1);
    this.stack
    .filter(widget => widget.isCrossing)
    .forEach((widget) => {
      if (widget.crossingPair.includes(id)) {
        widget.removeCrossingPair(id);
      }
    });
  }

  private getActive = () => this.stack.filter(widget => widget.isActive)[0];

  private getOnlyStaticWidgets = () => {
    return this.hasActiveWidget() ? this.getStackWithoutId(this.activeWidget.id)
          : this.getStack();
  }

  private getPairs = (crossingWidgets: IWidget[]) => {
    const result: number[][] = [];
    crossingWidgets.forEach((widget) => {
      widget.crossingPair.forEach((id) => {
        result.push([widget.id, id].sort());
      });
    });
    const joined = result.map(pair => pair.join());
    return Array.from(new Set(joined)).map(str => str.split(',').map(i => +i));
  }

}
