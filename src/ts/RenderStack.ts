import { IRenderStack, IWidget } from './interfaces';
import { subscriber } from './Subscriber';
import { StackEvents, CanvasEvents } from './constants';

export default class RenderStack  implements IRenderStack {
  constructor() {
    this.stack = [];
    subscriber.subscribe(CanvasEvents.ActiveLayerCleared, this.renderActiveWidget);
    subscriber.subscribe(CanvasEvents.StaticLayerCleared, this.renderStaticWidgets);
  }

  private stack: IWidget[];

  get activeWidget(): IWidget {
    return this.getActive();
  }

  addWidget = (widget: IWidget) => {
    this.stack.push(widget);
    this.setNewActive(widget);
  }

  deleteActiveWidget() {
    this.deleteWidget(this.activeWidget.id);
    subscriber.notify(StackEvents.ActiveWidgetRemoved);
  }

  getOnlyCrossing = () => this.stack.filter(widget => widget.isCrossing);

  getStack = () => this.stack;

  getStackWithoutId = (id: number) => this.stack.filter(widget => widget.id !== id);

  getOnlySticky = () => this.stack.filter(widget => widget.isSticky);

  resetActive = () => this.activeWidget.setActive(false);

  setNewActive(widget: IWidget) {
    if (this.hasActiveWidget()) {
      this.resetActive();
    }
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
  }

  private getActive = () => this.stack.filter(widget => widget.isActive)[0];

  private getOnlyStaticWidgets = () => {
    return this.hasActiveWidget() ? this.getStackWithoutId(this.activeWidget.id)
          : this.getStack();
  }

}
