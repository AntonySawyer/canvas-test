import Layer from './Layer';
// import { ctxStatic, staticHeight, staticWidth } from '../helpers/DOM';
import { subscriber } from '../Subscriber';
import { CanvasEvents, WidgetEvents } from '../constants';

export class Static extends Layer {
  constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
    super(ctx, width, height);
    subscriber.subscribe(WidgetEvents.ChangeActiveStatus, () => this.clearCanvas());
  }

  protected clearCanvas() {
    super.clearCanvas();
    // console.warn('we clear Static');
    subscriber.notify(CanvasEvents.StaticLayerCleared);
  }

}

// export const staticLayer = new Static(ctxStatic, staticWidth, staticHeight);
