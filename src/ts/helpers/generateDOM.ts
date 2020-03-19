import { widgetSamples } from '../constants';

export function generateSidebar() { // FIX ME
  const container = document.createElement('div');
  container.className = 'widgetsContainer';
  const stickyContainer = document.createElement('div');
  stickyContainer.classList.add('widgetsContainer', 'sticky');

  widgetSamples.forEach((widget) => {
    container.innerHTML += `<div class="widgetSample" data-id="${widget.id.toString()}">
                              <span class="widgetSampleDescr">${widget.id}0mm</span>
                              <span class="widgetSampleIcon">☰</span>
                            </div>`;
  });

  widgetSamples.forEach((widget) => {
    stickyContainer.innerHTML += `<div class="widgetSample stickyWidget" data-id="${widget.id.toString()}">
                              <span class="widgetSampleDescr">${widget.width}x${widget.height}</span>
                              <span class="widgetSampleIcon">☰</span>
                            </div>`;
  });

  document.querySelector('.sidebarWrapper').insertBefore(stickyContainer, document.querySelectorAll('select')[0]); // FIX ME
  document.querySelector('.sidebarWrapper').insertBefore(container, document.querySelectorAll('select')[0]);
}
