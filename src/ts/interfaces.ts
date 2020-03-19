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
  isActive: boolean;
  setPosition: (x: number, y: number) => void;
  setActive: () => void;
  setInactive: () => void;
  setCrossing: (isCrossing: boolean) => void;
  draw: () => void;
  coordinateIsInside: (x: number, y: number) => boolean;
  getPointsFromStatic: () => { x1: number, y1: number, x2: number, y2: number };
  getPointsFromActive: () => { x1: number, y1: number, x2: number, y2: number };
  moveToGeometricCenter: (xEvent: number, yEvent: number) => void;
  inBorders: () => boolean;
  checkCrossing: (widget: IWidget, limit?: number) => boolean;
}

export interface ISize {
  width?: number;
  height?: number;
}

export interface ICoordinate {
  x: number;
  y: number;
}

export interface IWidgetParams {
  type: string;
  isSticky: boolean;
  color: string;
  coordinate: ICoordinate;
  size: ISize;
}

export interface IRenderStack {
  rerender: () => void;
  addWidget: (widget: IWidget) => void;
  deleteWidget: (id: number) => void;
  getActive: () => IWidget;
  setNewActive: (widget: IWidget) => void;
  getStack: () => IWidget[];
  resetActive: () => void;
  stackWithoutId: (id: number) => IWidget[];
  onlySticky: () => IWidget[];
  activeIsExist: () => boolean;
  isCrossingWithOthers: (widget: IWidget) => boolean;
}

export interface ILayer {
  clearCanvas: () => void;
}
