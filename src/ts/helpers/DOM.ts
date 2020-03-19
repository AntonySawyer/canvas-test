import { widgetSamples } from '../constants';

export const activeCanvas = document.getElementById('activeCanvas') as HTMLCanvasElement;
export const ctxActive = activeCanvas.getContext('2d');
export const activeWidth = activeCanvas.width;
export const activeHeight = activeCanvas.height;

export const staticCanvas = document.getElementById('staticCanvas') as HTMLCanvasElement;
export const ctxStatic = staticCanvas.getContext('2d');
export const staticWidth = staticCanvas.width;
export const staticHeight = staticCanvas.height;

export const sidebarWidth = staticCanvas.offsetLeft - activeCanvas.offsetLeft;

export function generateSidebar() { // FIX ME
  const container = document.createElement('div');
  container.className = 'widgetsContainer';
  const stickyContainer = document.createElement('div');
  stickyContainer.classList.add('widgetsContainer', 'sticky');

  widgetSamples.forEach((sample) => {
    container.innerHTML += `<div class="widgetSample" data-id="${sample.id.toString()}" data-type="${sample.type}" data-sticky="false">
                              <span class="widgetSampleDescr">${sample.id}0mm</span>
                              <span class="widgetSampleIcon">☰</span>
                            </div>`;
    stickyContainer.innerHTML += `<div class="widgetSample stickyWidget" data-id="${sample.id.toString()}" data-type="${sample.type}" data-sticky="true">
                            <span class="widgetSampleDescr">${sample.width}x${sample.height}</span>
                            <span class="widgetSampleIcon">☰</span>
                          </div>`;
  });

  document.querySelector('.sidebarWrapper').insertBefore(stickyContainer, document.querySelectorAll('select')[0]);
  document.querySelector('.sidebarWrapper').insertBefore(container, document.querySelectorAll('select')[0]);
}
