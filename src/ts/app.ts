import { generateSidebar } from './utils';
import { setSizes, setListeners } from './canvasUtils';

window.onload = () => {
  setSizes();
  generateSidebar();
  setListeners();
};
