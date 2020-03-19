import { getNewId } from './helpers/widgetsHelper';
import { widgetSamples } from './constants';
import { calculateMiddle } from './helpers/math';
import { IWidget } from './interfaces';

export default function widgetFactory(stack: IWidget[], id: number,
                                      xEvent: number, yEvent: number) {
  const widget = Object.assign({}, findSample(id, widgetSamples));
  const { x, y } = calculateMiddle(widget.width, widget.height, xEvent, yEvent);
  return { ...widget, x, y, id: getNewId(stack) };
}

// its must be inside factory ?
const findSample = (id: number, samples: readonly IWidget[]) => {
  return samples.filter(el => el.id === id)[0];
};
