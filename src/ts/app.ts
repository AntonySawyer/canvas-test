import { generateSidebar } from './helpers/generateDOM';
import LayersManager from './LayersManager';

window.onload = () => {
  generateSidebar();
  // tslint:disable-next-line: no-unused-expression
  new LayersManager();
};
