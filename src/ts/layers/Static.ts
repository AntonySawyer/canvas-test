import Layer from './Layer';
import { ctxWidgets, staticHeight, staticWidth } from '../helpers/DOM';

class Static extends Layer {
  constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
    super(ctx, width, height);
  }
}

export const staticLayer = new Static(ctxWidgets, staticWidth, staticHeight);
