import { IRenderStack, IWidget } from './interfaces';

export default class RenderStack  implements IRenderStack {
  constructor() {
    this.stack = [];
  }

  private stack: IWidget[];

  rerender = () => this.stack.forEach(el => el.draw());

  addWidget = (widget: IWidget) => this.stack.push(widget);

  deleteWidget(id: number) {
    const index = this.stack.findIndex(el => el.id === id);
    this.stack.splice(index, 1);
  }

  getStack = () => this.stack;

  stackWithoutId = (id: number) => this.stack.filter(el => el.id !== id);

  isCrossingWithOthers = (widget: IWidget) => {
    return this.stackWithoutId(widget.id).some(i => widget.checkCrossing(i));
  }

  onlySticky = () => this.stack.filter(el => el.isSticky);

  getActive = () => this.stack.filter(el => el.isActive)[0];

  resetActive = () => this.getActive().setInactive();

  setNewActive(widget: IWidget) {
    if (this.activeIsExist()) {
      this.resetActive();
    }
    widget.setActive();
  }

  activeIsExist = () => this.getActive() !== undefined;

}
