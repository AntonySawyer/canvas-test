import { generateSidebar } from './helpers/generateDOM';
import Controller from './Controller';

const controlLayers = new Controller(); // or like Subscriber ?

window.onload = () => {
  generateSidebar();
  controlLayers.init(); // remove
};
