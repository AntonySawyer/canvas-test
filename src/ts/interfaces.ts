export interface IWidget {
  id: number;
  x?: number;
  y?: number;
  readonly width: number;
  readonly height: number;
  color?: string;
  isSticky?: boolean;
}

export interface IRenderStack extends Array<IWidget> {
  [index: number]: IWidget;
  getNewId: () => number;
  findWidgetIndex: (id: number) => number;
  stackWithoutId: (id: number) => IWidget[];
  getWidgetById: (id: number) => IWidget;
  onlySticky: () => IWidget[];
}

export interface ILayer {
  draw: (widget: IWidget) => void;
  clearCanvas: () => void;
}
