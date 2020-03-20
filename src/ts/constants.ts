export const stickyLimit = 50;
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
  nonSticky = '#cebf64',
}

export enum CanvasEvents {
  StaticLayerCleared = 'StaticLayerCleared',
  ActiveLayerCleared = 'ActiveLayerCleared',
}

export enum StackEvents {
  ActiveWidgetRemoved = 'ActiveWidgetRemoved',
}

export enum WidgetEvents {
  SetNewPosition = 'SetNewPosition',
  ChangeActiveStatus = 'ChangeActiveStatus',
  ChangeCrossingStatus = 'ChangeCrossingStatus',
}

export const widgetSamples = [
  { id: 15, type: 'rect', width: 15, height: 75 },
  { id: 20, type: 'rect', width: 20, height: 45 },
  { id: 25, type: 'rect', width: 25, height: 60 },
  { id: 30, type: 'rect', width: 30, height: 80 },
  { id: 35, type: 'rect', width: 35, height: 15 },
  { id: 40, type: 'rect', width: 40, height: 95 },
  { id: 50, type: 'rect', width: 50, height: 50 },
  { id: 45, type: 'rect', width: 45, height: 34 },
  { id: 55, type: 'rect', width: 55, height: 17 },
  { id: 60, type: 'rect', width: 60, height: 96 },
  { id: 65, type: 'rect', width: 65, height: 24 },
  { id: 70, type: 'rect', width: 70, height: 41 },
  { id: 75, type: 'rect', width: 75, height: 64 },
  { id: 80, type: 'rect', width: 80, height: 39 },
  { id: 85, type: 'rect', width: 85, height: 54 },
  { id: 90, type: 'rect', width: 90, height: 67 },
  { id: 95, type: 'rect', width: 95, height: 105 },
  { id: 100, type: 'rect', width: 100, height: 41 },
];

export const widgetSamplesForReact = [
  [
    { id: 15, type: 'rect', sticky: true, scared: false, width: 15, height: 75 },
    { id: 20, type: 'rect', sticky: true, scared: false, width: 20, height: 45 },
    { id: 25, type: 'rect', sticky: true, scared: false, width: 25, height: 60 },
    { id: 30, type: 'rect', sticky: true, scared: false, width: 30, height: 80 },
    { id: 35, type: 'rect', sticky: true, scared: false, width: 35, height: 15 },
    { id: 40, type: 'rect', sticky: true, scared: false, width: 40, height: 95 },
    { id: 50, type: 'rect', sticky: true, scared: false, width: 50, height: 50 },
    { id: 45, type: 'rect', sticky: true, scared: false, width: 45, height: 34 },
    { id: 55, type: 'rect', sticky: true, scared: false, width: 55, height: 17 },
    { id: 60, type: 'rect', sticky: true, scared: false, width: 60, height: 96 },
    { id: 65, type: 'rect', sticky: true, scared: false, width: 65, height: 24 },
    { id: 70, type: 'rect', sticky: true, scared: false, width: 70, height: 41 },
    { id: 75, type: 'rect', sticky: true, scared: false, width: 75, height: 64 },
    { id: 80, type: 'rect', sticky: true, scared: false, width: 80, height: 39 },
    { id: 85, type: 'rect', sticky: true, scared: false, width: 85, height: 54 },
    { id: 90, type: 'rect', sticky: true, scared: false, width: 90, height: 67 },
    { id: 95, type: 'rect', sticky: true, scared: false, width: 95, height: 105 },
    { id: 100, type: 'rect', sticky: true, scared: false, width: 100, height: 41 },
  ], [
    { id: 15, type: 'rect', sticky: false, scared: false, width: 15, height: 75 },
    { id: 20, type: 'rect', sticky: false, scared: false, width: 20, height: 45 },
    { id: 25, type: 'rect', sticky: false, scared: false, width: 25, height: 60 },
    { id: 30, type: 'rect', sticky: false, scared: false, width: 30, height: 80 },
    { id: 35, type: 'rect', sticky: false, scared: false, width: 35, height: 15 },
    { id: 40, type: 'rect', sticky: false, scared: false, width: 40, height: 95 },
    { id: 50, type: 'rect', sticky: false, scared: false, width: 50, height: 50 },
    { id: 45, type: 'rect', sticky: false, scared: false, width: 45, height: 34 },
    { id: 55, type: 'rect', sticky: false, scared: false, width: 55, height: 17 },
    { id: 60, type: 'rect', sticky: false, scared: false, width: 60, height: 96 },
    { id: 65, type: 'rect', sticky: false, scared: false, width: 65, height: 24 },
    { id: 70, type: 'rect', sticky: false, scared: false, width: 70, height: 41 },
    { id: 75, type: 'rect', sticky: false, scared: false, width: 75, height: 64 },
    { id: 80, type: 'rect', sticky: false, scared: false, width: 80, height: 39 },
    { id: 85, type: 'rect', sticky: false, scared: false, width: 85, height: 54 },
    { id: 90, type: 'rect', sticky: false, scared: false, width: 90, height: 67 },
    { id: 95, type: 'rect', sticky: false, scared: false, width: 95, height: 105 },
    { id: 100, type: 'rect', sticky: false, scared: false, width: 100, height: 41 },
  ], [
    { id: 50, type: 'rect', sticky: false, scared: true, width: 50, height: 50 },
    { id: 65, type: 'rect', sticky: false, scared: true, width: 65, height: 24 },
    { id: 70, type: 'rect', sticky: false, scared: true, width: 70, height: 41 },
    { id: 90, type: 'rect', sticky: false, scared: true, width: 90, height: 67 },
    { id: 95, type: 'rect', sticky: false, scared: true, width: 95, height: 105 },
  ],
];
