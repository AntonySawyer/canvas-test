import RectWidget from './RectWidget';
import { IWidget, Size, WidgetTypes, IWidgetParams } from '../interfaces';
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

  const isSticky = dataset.sticky === 'true';
  const isRepulsive = dataset.repulsive === 'true';
  const color = getColor(isSticky, isRepulsive);
  const coordinate = { x: convertXForStaticLayer(e.pageX), y: e.pageY };

  const widgetCategory: WidgetCategories = getCategory(isSticky, isRepulsive);

  const targetSample = widgetSamples[widgetCategory]
                  .filter(sample => sample.id === +dataset.id)[0];
  const { width, height } = targetSample;
  const type = targetSample.type as WidgetTypes;
  const size: Size = { width, height };

  return { id, coordinate, size, color, type, isSticky, isRepulsive };
}

function getCategory(isSticky: boolean, isRepulsive: boolean) {
  if (isSticky) {
    return WidgetCategories.sticky;
  }
  if (isRepulsive) {
    return WidgetCategories.repulsive;
  }
  return WidgetCategories.default;
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
