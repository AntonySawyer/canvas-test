import { widgetSamples } from './constants';

export const someInRange = (first: number, last: number, arrToCheck: number[]) => {
  return arrToCheck.some(el => first <= el && el <= last);
};

export function generateSidebar() { // FIX ME
  const container = document.createElement('div');
  container.className = 'unitsContainer';
  widgetSamples.forEach((widget) => {
    const unit = document.createElement('div');
    unit.className = 'unit';
    unit.setAttribute('data-id', widget.id);
    const descr = document.createElement('span');
    descr.className = 'unitDescr';
    descr.innerText = `${widget.id}0mm`;
    const icon = document.createElement('span');
    icon.className = 'unitIcon';
    icon.innerText = '☰';
    unit.append(descr, icon);
    container.appendChild(unit);
  });
  document.querySelector('.sidebarWrapper').insertBefore(container, document.querySelectorAll('select')[0]);
}
