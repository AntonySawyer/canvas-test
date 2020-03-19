import { IWidget } from '../interfaces';

// сделать класс для стека, кинуть методы

export const getNewId = (stack: IWidget[]) => {
  return stack.length === 0
          ? 0
          : stack.reduce((a, b) => a.id > b.id ? a : b).id + 1;
};

export const findWidgetIndex = (id: number, stack: IWidget[]) => {
  return stack.findIndex(el => el.id === id);
};

export function outOfBorders(widget: IWidget, top: number, right: number,
                             bottom: number, left: number) {
  return widget.x > left
      && widget.y > top
      && widget.y + widget.height < bottom
      && widget.x + widget.width < right;
}

export const stackWithoutId = (id: number, stack: IWidget[]) => {
  return stack.filter(el => el.id !== id);
};


