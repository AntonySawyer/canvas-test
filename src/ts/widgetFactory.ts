import { stickyColor, defaultColor } from './constants';
import RectWidget from './RectWidget';

export default function widgetFactory(id: number, coords: {x: number, y: number},
                                      isSticky: boolean, width: number, height: number) {
// type detect here

  // temp
  const color = isSticky ? stickyColor : defaultColor;
  return new RectWidget(id, coords, isSticky, color, width, height);
}
