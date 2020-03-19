import { IRenderStack, IWidget } from '../interfaces';

export default class RenderStack  implements IRenderStack {
  constructor() {
    this.stack = [];
  }

  private stack: IWidget[];

  addWidget(widget: IWidget) {
    this.stack.push(widget);
  }

  deleteWidget(id: number) {
    const index = this.findWidgetIndex(id);
    this.stack.splice(index, 1);
  }

  iterate(callback: (el: IWidget) => void) {
    this.stack.forEach(el => callback(el));
  }

  some(checkFn) {
    return this.stack.some(el => checkFn(el));
  }

  reverse() {
    return this.stack.reverse();
  }

  filter(criteriaFn: (el: IWidget) => boolean) {
    return this.stack.filter(criteriaFn);
  }

  map(applyFn) {
    this.stack.map(applyFn);
    return this.stack;
  }

  getNewId = () => {
    return this.stack.length === 0
            ? 0
            : this.stack.reduce((a, b) => a.id > b.id ? a : b).id + 1;
  }

  findWidgetIndex = (id: number) => {
    return this.stack.findIndex(el => el.id === id);
  }

  stackWithoutId = (id: number) => {
    return this.stack.filter(el => el.id !== id);
  }

  getWidgetById = (id: number) => {
    return this.stack[this.findWidgetIndex(id)];
  }

  onlySticky = () => this.stack.filter(el => el.isSticky);
// rename hightlight and crossing
  onlyHightLighted = () => this.stack.filter(el => el.isCrossing);
}
