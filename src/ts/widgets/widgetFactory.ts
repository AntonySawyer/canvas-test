import RectWidget from './RectWidget';
import { IWidget, Size, WidgetTypes } from '../interfaces';
import { widgetSamples, WidgetColor } from '../constants';
import { convertXForStaticLayer } from '../helpers/math';

export function widgetFactory(params) {
  const { id, coordinate, size, color, type, isSticky, isRepulsive } = params;
  let widget: IWidget;
  switch (type) {
    case 'rect':
      widget = new RectWidget(id, coordinate, isSticky, isRepulsive, color, size, type);
    default:
      break;
  }
  return widget;
}

export function collectParamsFromEvent(stack: IWidget[], e: MouseEvent) {
  const id = stack.length === 0
          ? 0
          : stack.reduce((previousWidget, currentWidget) => {
            return previousWidget.id > currentWidget.id ? previousWidget : currentWidget;
          }).id + 1;
  const dataset = (e.target as HTMLElement).dataset;
  const { width, height } = widgetSamples.filter(sample => sample.id === +dataset.id)[0]; // ?

  const type = dataset.type as WidgetTypes;
  const isSticky = dataset.sticky === 'true';
  const isRepulsive = dataset.repulsive === 'true';
  const color = isSticky ? WidgetColor.sticky : WidgetColor.nonSticky;
  const size: Size = { width, height };
  const coordinate = { x: convertXForStaticLayer(e.pageX), y: e.pageY };

  return { id, coordinate, size, color, type, isSticky, isRepulsive };
}
