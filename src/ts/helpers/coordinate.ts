import { sidebarWidth } from './DOM';
import { Points, Coordinate } from '../interfaces';
import { someInRange } from './math';

export function coordinateIsInside(points: Points, coordinate: Coordinate) {
  const xInside = someInRange(points.first.x, points.last.x, [coordinate.x]);
  const yInside = someInRange(points.first.y, points.last.y, [coordinate.y]);
  return xInside && yInside;
}

export function convertXForStaticLayer(x: number) {
  return x - sidebarWidth;
}

export function getXForActiveLayer(x: number) {
  return x + sidebarWidth;
}
