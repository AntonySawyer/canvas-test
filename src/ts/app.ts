import { generateSidebar } from './helpers/DOM';
import LayersActionRunner from './LayersActionRunner';

generateSidebar();

export const actionRunner = new LayersActionRunner();
