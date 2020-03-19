import { IShape } from "./interfaces";
import { space, sidebar, highlightColor } from "./constants";
import { mouseDownHandler, mouseUpHandler, moveHandler, GlobalVars } from "./dragAndDrop";
import { spaceMap } from "./app";
import { draw } from "./canvasUtils";


export function setListeners() {
    [space, sidebar].map(el => {
        el.addEventListener('mousedown', mouseDownHandler);
        el.addEventListener('mouseup', mouseUpHandler);
        el.addEventListener('mousemove', moveHandler);
    });
    document.querySelectorAll('.unit').forEach(el => el.addEventListener('click', mouseDownHandler));
}

export const findShapeById = (id: string, target: IShape[]) => target.filter(el => el.id === id)[0];

const someInRange = (first: number, last: number, arrToCheck: number[]) => {
    return arrToCheck.some(el => first <= el && el <= last)
};

export function findCrossing(shape: IShape) {
    const x1 = shape.x;
    const x2 = shape.x+shape.width;
    const y1 = shape.y;
    const y2 = shape.y+shape.height;
    const otherShapes = spaceMap.filter(el => el.id !== GlobalVars.dragId && el.id !== shape.id); 
    const xCrossing = (start: number, end: number) => someInRange(start, end, [x1, x2]) || someInRange(x1, x2, [start, end]);
    const yCrossing = (start: number, end: number) => someInRange(start, end, [y1, y2]) || someInRange(y1, y2, [start, end]);
    if (otherShapes.some(el => xCrossing(el.x, el.x+el.width) && yCrossing(el.y, el.y+el.height))) {
        highlight(shape);
    } else if (shape.color !== undefined) {
        deleteHighlight(shape);
    }
}

export const findShapeIndex = (id: string) => spaceMap.findIndex(el => el.id === id);

export const moveShapeFromToolbar = (isMoving: boolean = false) => space.style.zIndex = isMoving ? '3' : null;

export function setCursorStyle(style: ('default' | 'move')) {
    space.style.cursor = style;
    sidebar.style.cursor = style;
}

export const isToolbar = (target: HTMLElement) => target.id === 'sidebar';

export function highlight(shape: IShape) {
    const newShape = Object.assign({}, shape);
    newShape.color = highlightColor;
    replaceShapeById(shape.id, newShape);
}

export function deleteHighlight(shape: IShape) {
    const newShape = Object.assign({}, shape);
    delete newShape.color;
    replaceShapeById(shape.id, newShape);
}

export function replaceShapeById(id: string, newShape?: IShape) {
    const index = findShapeIndex(id);
    if (index === -1) {
        spaceMap.push(newShape);
    } else {
        spaceMap.splice(index, 1);
        if (Object.keys(newShape).length !== 0) { // FIX ME
            spaceMap.push(newShape);
        }
    }
    GlobalVars.dragId = newShape.id;
    draw();
}
