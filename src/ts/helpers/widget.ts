import { stickyColor, widgetSamples, stickyWidgetClassName, defaultColor } from '../constants';

export function getWidgetParams(e: MouseEvent) {
  const target = e.target as HTMLElement;
  const { id, type } = target.dataset;
  const { width, height } = widgetSamples.filter(el => el.id === +id)[0]; // ?
  const isSticky = target.classList.contains(stickyWidgetClassName);

  return {
    type,
    isSticky,
    color: isSticky ? stickyColor : defaultColor, // temp
    coordinate: { x: e.clientX, y: e.clientY },
    size: { width, height },
  };
}
