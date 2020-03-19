import { toolbarMap, toolbarWidth } from "./constants";
import { spaceMap } from "./app";
import { IShape } from "./interfaces";
import { findShapeById, findCrossing, moveShapeFromToolbar, setCursorStyle, isToolbar, replaceShapeById } from "./utils";


// export let dragging: Boolean = false;
// export let dragId: string;

export class GlobalVars {
    public static dragId: string;
    public static dragging: Boolean = false;
}

export function mouseDownHandler(e: MouseEvent) {
    const targetIsToolbar = isToolbar(e.target as HTMLElement);
    const xEvent = e.pageX - (e.target as HTMLElement).offsetLeft;
    const yEvent = e.pageY - (e.target as HTMLElement).offsetTop;
    const target = targetIsToolbar ? toolbarMap : spaceMap;
    target.forEach(shape => {
        const isInside = checkShapeBorders(shape, xEvent, yEvent);
        if (isInside) {
            GlobalVars.dragging = true;
            GlobalVars.dragId = shape.id;
            setCursorStyle('move');
            return ;
       }
    })

    function checkShapeBorders(shape: IShape, xEvent: number, yEvent: number) {
        const width = targetIsToolbar ? 100 : shape.width;
        const height = targetIsToolbar ? 40 : shape.height;
        const xInside = xEvent > shape.x && xEvent < (shape.x + width);
        const yInside = yEvent > shape.y && yEvent < (shape.y + height);
        return xInside && yInside;
    }
}

export function moveHandler(e: MouseEvent) {
    if (GlobalVars.dragging) {
        isToolbar(e.target as HTMLElement) && moveShapeFromToolbar(true);
        const oldDragId = GlobalVars.dragId;
        const isShapeExist = findShapeById(GlobalVars.dragId, spaceMap);
        const oldCopy = isShapeExist ? findShapeById(oldDragId, spaceMap) : findShapeById(oldDragId, toolbarMap);
        const newShape = Object.assign({}, oldCopy);
        GlobalVars.dragId = oldDragId.split('_')[0];
        newShape.x += e.movementX;
        newShape.y += e.movementY;
        newShape.id = `${GlobalVars.dragId}_${newShape.x}_${newShape.y}`;
        replaceShapeById(oldDragId, newShape);
    }
}

export function mouseUpHandler(e: MouseEvent) {
    setCursorStyle('default');
    moveShapeFromToolbar();
    spaceMap.filter(el => el.x < toolbarWidth).map(el => replaceShapeById(el.id));
    spaceMap.filter(el => el.color !== undefined || el.id === GlobalVars.dragId).map(el => findCrossing(el));
    GlobalVars.dragging = false;
}
