import Layer from './Layer';
// import { ctxStatic, staticHeight, staticWidth } from '../helpers/DOM';
import { subscriber } from '../Subscriber';
import { CanvasEvents, WidgetEvents, StackEvents } from '../constants';

export class Static extends Layer {
  constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
    super(ctx, width, height);
    subscriber.subscribe(WidgetEvents.ChangeActiveStatus, () => this.clearCanvas());
    subscriber.subscribe(StackEvents.BorderHightlight, () => this.clearCanvas());
  }

  protected clearCanvas() {
    super.clearCanvas();
    subscriber.notify(CanvasEvents.StaticLayerCleared);
  }

}

// export const staticLayer = new Static(ctxStatic, staticWidth, staticHeight);
