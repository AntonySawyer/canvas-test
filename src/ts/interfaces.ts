import { WidgetEvents, StackEvents, CanvasEvents, WidgetColor } from './constants';

export type Coordinate = { x: number, y: number };
export type Size = { width?: number; height?: number };
export type WidgetTypes = ('rect');
export type MouseDownTarget = ('div' | 'canvas');
export type KeyboardKeysForListen = ('ArrowUp' | 'ArrowDown' | 'ArrowRight' | 'ArrowLeft');
export type NextMoveMode = ('mouse' | 'keyboard');

export type Points = { first: Coordinate, last: Coordinate };

export type SinteticEvents = (WidgetEvents | StackEvents | CanvasEvents);

export interface ISubscriber {
  subscribe: (trigger: SinteticEvents, callback: () => void) => void;
  unsubscribe: (trigger: SinteticEvents, callback: () => void) => void;
  notify: (trigger: SinteticEvents) => void;
}

export interface IObserver {
  trigger: SinteticEvents;
  callback: () => void;
}

export interface IAxisPoint {
  x: number;
  y: number;
  setPosition: (x: number, y: number) => void;
  commitMovement: (movement: Coordinate) => void;
  getCoordinate: () => Coordinate;
  getPoints: () => Points;
  getPoints2: () => Coordinate[];
  coordinateIsInside: (coordinate: Coordinate) => boolean;
}

export interface IWidget extends IAxisPoint {
  readonly id: number;
  readonly isSticky: boolean;
  readonly isRepulsive: boolean;
  readonly width?: number;
  readonly height?: number;
  readonly type: WidgetTypes;
  color: string;
  defaultColor: string;
  isCrossing: boolean;
  isActive: boolean;
  crossingPair: number[];
  isHighlightBorders: boolean;
  setActive: (isActive: boolean) => void;
  setCrossing: (isCrossing: boolean) => void;
  addCrossingPair: (crossingId: number) => void;
  removeCrossingPair: (crossingId: number) => void;
  setHighlightBorders: (isHighlightBorders: boolean) => void;
  draw: () => void;
  drawBorder: (x: number, ctx: CanvasRenderingContext2D) => void;
  moveToGeometricCenter: (xEvent: number, yEvent: number) => void;
  isOutOfBorders: () => boolean;
}

export interface IRenderStack {
  activeWidget: IWidget;
  initStackFromStorage: (stackParams) => void;
  addWidget: (widget: IWidget) => void;
  deleteActiveWidget: () => void;
  setNewActive: (widget: IWidget) => void;
  getStack: () => IWidget[];
  resetActive: () => void;
  getStackWithoutId: (id: number) => IWidget[];
  getWidgetById: (id: number) => IWidget;
  getOnlySticky: () => IWidget[];
  getCrossingPairs: () => number[][];
  hasActiveWidget: () => boolean;
  setHighlightBordersByIds: (ids: number[]) => void;
  resetHighLightBorders: () => void;
}

export interface ICrossingService {
  pointsCrossingWithOtherWidgets: (checkedId: number, checkedPoints: Points) => IWidget[];
}

export interface ILayersActionRunner {
  stack: IRenderStack;
  handleMouseDown: (e: MouseEvent, mode: MouseDownTarget) => void;
}

export interface IWidgetParams {
  id: number;
  coordinate: Coordinate;
  isSticky: boolean;
  isRepulsive: boolean;
  color: WidgetColor;
  size: Size;
  type: WidgetTypes;
}

interface WidgetSample {
  id: number;
  type: string; // fix me: widgetTypes
  width: number;
  height: number;
  sticky: boolean;
  repulsive: boolean;
}

// React
export interface WidgetSampleProps {
  sample: WidgetSample;
  handleClickOnWidgetSample: (e: MouseEvent, mode: MouseDownTarget) => void;
}

export interface WidgetSamplesGroupProps {
  header: string;
  samples: WidgetSample[];
  handleClickOnWidgetSample: (e: MouseEvent, mode: MouseDownTarget) => void;
}

export interface SidebarProps {
  widgetSamples: {sticky: WidgetSample[], default: WidgetSample[], repulsive: WidgetSample[] };
  handleClickOnWidgetSample: (e: MouseEvent, mode: MouseDownTarget) => void;
}
