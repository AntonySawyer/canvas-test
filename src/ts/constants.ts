import { IWidgetSampleGroups } from './interfaces';

export const stickyLimit = 50;
export const repulsiveLimit = 100;

export const arrowSpeed = 5;
export const primaryBtnIndex = 1;

export enum zIndex {
  top = '3',
  bottom = '0',
}

export enum cursor {
  move = 'move',
  default = 'default',
}

export enum eventsStatus {
  listen = 'all',
  ignore = 'none',
}

export enum WidgetColor {
  active = '#44bd0d',
  hightlight = '#f3906d',
  sticky = '#846cd6',
  repulsive = '#e1a7e6',
  default = '#cebf64',
}

export enum BorderWidth {
  hidghlighted = 3,
  default = 0.5,
}

export enum BorderColor {
  hidghlighted = 'red',
  default = 'black',
}

export enum CanvasEvents {
  StaticLayerCleared = 'StaticLayerCleared',
  ActiveLayerCleared = 'ActiveLayerCleared',
}

export enum StackEvents {
  ActiveWidgetRemoved = 'ActiveWidgetRemoved',
  BorderHightlight = 'BorderHightlight',
  InitStackFromStorage = 'InitStackFromStorage',
}

export enum WidgetEvents {
  SetNewPosition = 'SetNewPosition',
  ChangeActiveStatus = 'ChangeActiveStatus',
  ChangeCrossingPair = 'ChangeCrossingPair',
}

export enum WidgetCategories {
  repulsive = 'repulsive',
  sticky = 'sticky',
  default = 'default',
}

export const widgetSamples: IWidgetSampleGroups = {
  sticky: [
    { id: 's15', type: 'rect', width: 15, height: 75 },
    { id: 's20', type: 'rect', width: 20, height: 45 },
    { id: 's25', type: 'rect', width: 25, height: 60 },
    { id: 's30', type: 'rect', width: 30, height: 80 },
    { id: 's35', type: 'rect', width: 35, height: 15 },
    { id: 's40', type: 'rect', width: 40, height: 95 },
    { id: 's50', type: 'rect', width: 50, height: 50 },
    { id: 's45', type: 'rect', width: 45, height: 34 },
    { id: 's55', type: 'rect', width: 55, height: 17 },
    { id: 's60', type: 'rect', width: 60, height: 96 },
    { id: 's65', type: 'rect', width: 65, height: 24 },
    { id: 's70', type: 'rect', width: 70, height: 41 },
    { id: 's75', type: 'rect', width: 75, height: 64 },
    { id: 's80', type: 'rect', width: 80, height: 39 },
    { id: 's85', type: 'rect', width: 85, height: 54 },
    { id: 's90', type: 'rect', width: 90, height: 67 },
    { id: 's95', type: 'rect', width: 95, height: 105 },
    { id: 's100', type: 'rect', width: 100, height: 41 },
  ],
  default: [
    { id: 'd15', type: 'rect', width: 15, height: 75 },
    { id: 'd20', type: 'rect', width: 20, height: 45 },
    { id: 'd25', type: 'rect', width: 25, height: 60 },
    { id: 'd30', type: 'rect', width: 30, height: 80 },
    { id: 'd35', type: 'rect', width: 35, height: 15 },
    { id: 'd40', type: 'rect', width: 40, height: 95 },
    { id: 'd50', type: 'rect', width: 50, height: 50 },
    { id: 'd45', type: 'rect', width: 45, height: 34 },
    { id: 'd55', type: 'rect', width: 55, height: 17 },
    { id: 'd60', type: 'rect', width: 60, height: 96 },
    { id: 'd65', type: 'rect', width: 65, height: 24 },
    { id: 'd70', type: 'rect', width: 70, height: 41 },
    { id: 'd75', type: 'rect', width: 75, height: 64 },
    { id: 'd80', type: 'rect', width: 80, height: 39 },
    { id: 'd85', type: 'rect', width: 85, height: 54 },
    { id: 'd90', type: 'rect', width: 90, height: 67 },
    { id: 'd95', type: 'rect', width: 95, height: 105 },
    { id: 'd100', type: 'rect', width: 100, height: 41 },
  ],
  repulsive: [
    { id: 'r50', type: 'rect', width: 50, height: 50 },
    { id: 'r65', type: 'rect', width: 65, height: 24 },
    { id: 'r70', type: 'rect', width: 70, height: 41 },
    { id: 'r90', type: 'rect', width: 90, height: 67 },
    { id: 'r95', type: 'rect', width: 95, height: 105 },
  ],
};
