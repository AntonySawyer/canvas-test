import { IShape } from "./interfaces";

export const canvasHeight = 0.9 * window.innerHeight;
export const canvasWidth = 0.9 * window.innerWidth;
export const toolbarWidth = 330; // 0.25 * window.innerWidth

export const toolsColor = '#ffffff00';
export const defaultShapeColor = '#cebf64'; // #f3906d with borders #000000
export const highlightColor = '#f3906d'; 

export const space = document.getElementById('space') as HTMLCanvasElement;
export const ctxSpace = space.getContext('2d');

export const sidebar = document.getElementById('sidebar') as HTMLCanvasElement;
export const ctxToolbar = sidebar.getContext('2d');

export const toolbarMap: IShape[] = [
    {id: '15', x: 10, y: 120, width: 15, height: 58.9},
    {id: '20', x: 113, y: 120, width: 20, height: 58.9},
    {id: '25', x: 216, y: 120, width: 25, height: 58.9},
    {id: '30', x: 10, y: 163, width: 30, height: 58.9},
    {id: '35', x: 113, y: 163, width: 35, height: 58.9},
    {id: '40', x: 216, y: 163, width: 40, height: 58.9},
    {id: '45', x: 10, y: 206, width: 45, height: 58.9},
    {id: '50', x: 113, y: 206, width: 50, height: 58.9},
    {id: '55', x: 216, y: 206, width: 55, height: 58.9},
    {id: '60', x: 10, y: 249, width: 60, height: 58.9},
    {id: '65', x: 113, y: 249, width: 65, height: 58.9},
    {id: '70', x: 216, y: 249, width: 70, height: 58.9},
    {id: '75', x: 10, y: 292, width: 75, height: 58.9},
    {id: '80', x: 113, y: 292, width: 80, height: 58.9},
    {id: '85', x: 216, y: 292, width: 85, height: 58.9},
    {id: '90', x: 10, y: 335, width: 90, height: 58.9},
    {id: '95', x: 113, y: 335, width: 95, height: 58.9},
    {id: '100', x: 216, y: 335, width: 100, height: 58.9}
];