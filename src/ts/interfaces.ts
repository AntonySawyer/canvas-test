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
  setActive: (isActive: boolean) => void;
  setCrossing: (isCrossing: boolean) => void;
  draw: () => void;
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
  getOnlySticky: () => IWidget[];
  hasActiveWidget: () => boolean;
}

export interface ICrossingService {
  pointsCrossingWithOtherWidgets: (checkedId: number, checkedPoints: Points) => boolean;
}

export interface ILayersActionRunner {
  stack: IRenderStack;
}

// React
export interface WidgetSampleProps {
  id: number;
  type: string; // fix me: widgetTypes
  width: number;
  height: number;
  sticky: boolean;
  scared: boolean;
}

export interface WidgetSamplesGroupProps {
  samples: WidgetSampleProps[];
}

export interface SidebarProps {
  widgetSamples: WidgetSampleProps[][];
}
