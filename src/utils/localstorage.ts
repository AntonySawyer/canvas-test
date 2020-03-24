import { IWidget } from 'src/ts/interfaces';

export function serializeStack(stack: IWidget[]) {
  let serialized = '';
  stack.forEach((widget, index) => {
    serialized += `${widget.id}&`;
    serialized += `${widget.x}&`;
    serialized += `${widget.y}&`;
    serialized += `${widget.width}&`;
    serialized += `${widget.height}&`;
    serialized += `${widget.defaultColor}&`;
    serialized += `${widget.type}&`;
    serialized += `${widget.isSticky}&`;
    serialized += `${widget.isRepulsive}`;
    if (index + 1 !== stack.length) {
      serialized += '||';
    }
  });
  return serialized;
}

export function deserializeStack(serialized: string) {
  const stack = [];
  serialized.split('||')
            .forEach((widgetInfo) => {
              const fields = widgetInfo.split('&');
              const widget = {
                id: +fields[0],
                coordinate: {
                  x: +fields[1],
                  y: +fields[2],
                },
                size: {
                  width: +fields[3],
                  height: +fields[4],
                },
                color: fields[5],
                type: fields[6],
                isSticky: fields[7] === 'true',
                isRepulsive: fields[8] === 'true',
              };
              stack.push(widget);
            });
  return stack;
}
