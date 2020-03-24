import { IWidget } from 'src/ts/interfaces';

export function serializeStack(stack: IWidget[]) {
  const stackParams = stack.map((widget) => {
    const { id, x, y, width, height, defaultColor, type, isSticky, isRepulsive } = widget;
    return {
      id,
      type,
      isSticky,
      isRepulsive,
      coordinate: { x, y },
      size: { width, height },
      color: defaultColor,
    };
  });
  return JSON.stringify(stackParams);
}

export function deserializeStack(serialized: string) {
  return JSON.parse(serialized);
}
