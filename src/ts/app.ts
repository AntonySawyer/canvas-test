import { generateSidebar } from './helpers/DOM';
import LayersActionRunner from './LayersActionRunner';

window.onload = () => {
  generateSidebar();
  // tslint:disable-next-line: no-unused-expression
  new LayersActionRunner();
};
