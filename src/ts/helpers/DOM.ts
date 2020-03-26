export const activeCanvas = document.getElementById('activeCanvas') as HTMLCanvasElement;
export const ctxActive = activeCanvas.getContext('2d');
export const activeWidth = activeCanvas.width;
export const activeHeight = activeCanvas.height;

export const staticCanvas = document.getElementById('staticCanvas') as HTMLCanvasElement;
export const ctxStatic = staticCanvas.getContext('2d');
export const staticWidth = staticCanvas.width;
export const staticHeight = staticCanvas.height;

export const sidebarWidth = staticCanvas.offsetLeft - activeCanvas.offsetLeft;
