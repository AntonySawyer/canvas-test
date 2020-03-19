export interface IWidget {
  id: number;
  x?: number;
  y?: number;
  readonly width: number;
  readonly height: number;
  color?: string;
}

export interface ILayer {
  draw: (widget: IWidget) => void;
  setSizes: (width: number, height: number) => void;
  clearCanvas: () => void;
}

export interface IControl {
  init: () => void;
}

export interface ISubscriber {
  subscribe (parent: string, selector: 'string',
             type: string, fn: (data: MouseEventInit) => void): void;
  unSubscribe (parent: string, type: string, selector: string): void;
}

export type IObserver = {
  parent: string;
  selector: string;
  type: string;
  fn: (data: MouseEventInit) => void;
};
