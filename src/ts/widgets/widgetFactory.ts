import RectWidget from './RectWidget';
import { IWidget, Size, WidgetTypes, IWidgetParams, IWidgetSample } from '../interfaces';
import { WidgetColor, widgetSamples, WidgetCategories } from '../constants';
import { convertXForStaticLayer } from '../helpers/coordinate';

export function widgetFactory(params: IWidgetParams) {
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

  let category: WidgetCategories;
  let targetSample: IWidgetSample;

  for (const sampleCategory in widgetSamples) {
    if (widgetSamples[sampleCategory].filter(sample => sample.id === dataset.id).length !== 0) {
      category = sampleCategory as WidgetCategories;
      targetSample = widgetSamples[sampleCategory].filter(sample => sample.id === dataset.id)[0];
    }
  }

  const isSticky = category === WidgetCategories.sticky;
  const isRepulsive = category === WidgetCategories.repulsive;
  const color = getColor(isSticky, isRepulsive);
  const type = targetSample.type as WidgetTypes;
  const coordinate = { x: convertXForStaticLayer(e.pageX), y: e.pageY };
  const { width, height } = targetSample;
  const size: Size = { width, height };

  return { id, coordinate, size, color, type, isSticky, isRepulsive };
}

function getColor(isSticky: boolean, isRepulsive: boolean) {
  if (isSticky) {
    return WidgetColor.sticky;
  }
  if (isRepulsive) {
    return WidgetColor.repulsive;
  }
  return WidgetColor.default;
}
