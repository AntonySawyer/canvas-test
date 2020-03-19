import { IRenderStack } from '../interfaces';

export default class RenderStack extends Array implements IRenderStack {
  getNewId = () => {
    return this.length === 0
            ? 0
            : this.reduce((a, b) => a.id > b.id ? a : b).id + 1;
  }

  findWidgetIndex = (id: number) => {
    return this.findIndex(el => el.id === id);
  }

  stackWithoutId = (id: number) => {
    return this.filter(el => el.id !== id);
  }

  getWidgetById = (id: number) => {
    return this[this.findWidgetIndex(id)];
  }

  onlySticky = () => this.filter(el => el.isSticky);
}
