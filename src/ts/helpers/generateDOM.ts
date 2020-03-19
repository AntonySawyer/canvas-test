import { widgetSamples } from '../constants';

export function generateSidebar() { // FIX ME
  const container = document.createElement('div');
  container.className = 'widgetsContainer';
  widgetSamples.forEach((widget) => {
    const widgetSample = document.createElement('div');
    widgetSample.className = 'widgetSample';
    widgetSample.setAttribute('data-id', widget.id.toString());
    const descr = document.createElement('span');
    descr.className = 'widgetSampleDescr';
    descr.innerText = `${widget.id}0mm`;
    const icon = document.createElement('span');
    icon.className = 'widgetSampleIcon';
    icon.innerText = '☰';
    widgetSample.append(descr, icon);
    container.appendChild(widgetSample);
  });
  document.querySelector('.sidebarWrapper').insertBefore(container, document.querySelectorAll('select')[0]);
}
