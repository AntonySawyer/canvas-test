import RectWidget from './RectWidget';
import { IWidget, IWidgetParams } from '../interfaces';
import { widgetTypes } from '../constants';

function widgetFactory(stack: IWidget[], params: IWidgetParams) {
  const id = stack.length === 0 ? 0 : stack.reduce((a, b) => a.id > b.id ? a : b).id + 1;
  const { type, isSticky, color, coordinate, size } = params;
  let widget: IWidget;

  switch (type) {
    case widgetTypes.rect:
      widget = new RectWidget(id, coordinate, isSticky, color, size);
    default:
      break;
  }

  widget.moveToGeometricCenter(coordinate.x, coordinate.y);
  widget.draw();
  return widget;
}

export default widgetFactory;
