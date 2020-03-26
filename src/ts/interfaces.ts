import { WidgetColor, WidgetEvents, StackEvents, CanvasEvents } from './constants';

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
  readonly width?: number;
  readonly height?: number;
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

export interface IWidgetParams {
  type: WidgetTypes;
  isSticky: boolean;
  color: WidgetColor;
  coordinate: Coordinate;
  size: Size;
}

export interface IRenderStack {
  activeWidget: IWidget;
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
  setHighlightBordersByIds: (widgetIds: number[]) => void;
  resetHighLightBorders: () => void;
}

export interface ICrossingService {
  pointsCrossingWithOtherWidgets: (checkedId: number, checkedPoints: Points) => IWidget[];
}

export interface ILayersActionRunner {
  stack: IRenderStack;
  handleMouseDown: (e: MouseEvent, mode: MouseDownTarget) => void;
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
  samples: WidgetSample[];
  handleClickOnWidgetSample: (e: MouseEvent, mode: MouseDownTarget) => void;
}

export interface SidebarProps {
  widgetSamples: WidgetSample[][];
  handleClickOnWidgetSample: (e: MouseEvent, mode: MouseDownTarget) => void;
}
