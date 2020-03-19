import { widgetSamples } from '../constants';

export const activeCanvas = document.getElementById('activeCanvas') as HTMLCanvasElement;
export const ctxActiveLayer = activeCanvas.getContext('2d');
export const activeWidth = activeCanvas.width;
export const activeHeight = activeCanvas.height;

export const staticCanvas = document.getElementById('staticCanvas') as HTMLCanvasElement;
export const ctxWidgets = staticCanvas.getContext('2d');
export const staticWidth = staticCanvas.width;
export const staticHeight = staticCanvas.height;

export const sidebarWidth = staticCanvas.offsetLeft - activeCanvas.offsetLeft;

export function generateSidebar() { // FIX ME
  const container = document.createElement('div');
  container.className = 'widgetsContainer';
  const stickyContainer = document.createElement('div');
  stickyContainer.classList.add('widgetsContainer', 'sticky');

  widgetSamples.forEach((widget) => {
    container.innerHTML += `<div class="widgetSample" data-id="${widget.id.toString()}" data-type="${widget.type}">
                              <span class="widgetSampleDescr">${widget.id}0mm</span>
                              <span class="widgetSampleIcon">☰</span>
                            </div>`;
    stickyContainer.innerHTML += `<div class="widgetSample stickyWidget" data-id="${widget.id.toString()}" data-type="${widget.type}">
                            <span class="widgetSampleDescr">${widget.width}x${widget.height}</span>
                            <span class="widgetSampleIcon">☰</span>
                          </div>`;
  });

  document.querySelector('.sidebarWrapper').insertBefore(stickyContainer, document.querySelectorAll('select')[0]);
  document.querySelector('.sidebarWrapper').insertBefore(container, document.querySelectorAll('select')[0]);
}
