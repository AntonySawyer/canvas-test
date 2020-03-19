export interface IWidget {
  id: number;
  x?: number;
  y?: number;
  readonly width?: number;
  readonly height?: number;
  color?: string;
  isSticky?: boolean;
  defaultColor: string;
  isCrossing?: boolean;
  setPosition: (x: number, y: number) => this;
  setActive: () => this;
  setInactive: () => this;
  hightlight: () => this;
  resetColor: () => this;
  setCrossing: () => void;
  setUncrossing: () => void;
  getCtx: () => CanvasRenderingContext2D;
  draw: () => void;
}

// разобраться с возвратом IWidget[] и this

export interface IRenderStack {
  addWidget: (widget: IWidget) => void;
  deleteWidget: (id: number) => void;
  iterate: (callback: (el: IWidget) => void) => void;
  some: (checkFn: any) => boolean;
  reverse: () => IWidget[];
  filter: (criteriaFn: (el: IWidget) => boolean) => IWidget[];
  map: (applyFn) => IWidget[];
  onlyHightLighted: () => IWidget[];

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
