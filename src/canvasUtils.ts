import { ctxSpace, canvasWidth, canvasHeight, ctxToolbar, toolbarWidth, defaultShapeColor, toolbarMap, toolsColor } from "./constants";
import { spaceMap } from "./app";


export function setSizes() {
    ctxSpace.canvas.width = canvasWidth;
    ctxSpace.canvas.height = canvasHeight;
    ctxToolbar.canvas.width = toolbarWidth;
    ctxToolbar.canvas.height = canvasHeight;
}

export function draw() {
    ctxSpace.clearRect(0, 0, canvasWidth, canvasHeight);
    spaceMap.forEach(shape => {
        ctxSpace.fillStyle = shape.color === undefined ? defaultShapeColor : shape.color;
        ctxSpace.fillRect(shape.x, shape.y, shape.width, shape.height)
    });
}

export function buildToolbar() {
    toolbarMap.forEach(shape => {
        ctxToolbar.fillStyle = toolsColor;
        ctxToolbar.fillRect(shape.x, shape.y, 100, 40)
    });  
}