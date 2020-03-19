import { widgetSamples } from './constants';
import { calculateMiddle } from './helpers/math';

export default function widgetFactory(id: number, sampleId: number,
                                      xEvent: number, yEvent: number, isSticky: boolean) {
  const sample = widgetSamples.filter(el => el.id === sampleId)[0];
  const widget = Object.assign({}, sample);
  const { x, y } = calculateMiddle(widget.width, widget.height, xEvent, yEvent);
  return { ...widget, x, y, id, isSticky };
}
