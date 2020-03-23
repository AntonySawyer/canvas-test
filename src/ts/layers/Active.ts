import Layer from './Layer';
import { eventsStatus, StackEvents, WidgetEvents, CanvasEvents,
         zIndex, cursor } from '../constants';
import { activeCanvas, ctxActive, activeWidth, activeHeight } from '../helpers/DOM';
import { subscriber } from '../Subscriber';

class Active extends Layer {
  constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
    super(ctx, width, height);
    subscriber.subscribe(StackEvents.ActiveWidgetRemoved, () => this.clearCanvas());
    subscriber.subscribe(WidgetEvents.ChangeActiveStatus, () => this.clearCanvas());
    subscriber.subscribe(WidgetEvents.SetNewPosition, () => this.clearCanvas());
    subscriber.subscribe(StackEvents.BorderHightlight, () => this.clearCanvas());
  }

  protected clearCanvas = () => {
    super.clearCanvas();
    subscriber.notify(CanvasEvents.ActiveLayerCleared);
  }

  setLayerOnTop(isActive: boolean) {
    activeCanvas.style.zIndex = isActive ? zIndex.top : zIndex.bottom;
    activeCanvas.style.cursor = isActive ? cursor.move : cursor.default;
    activeCanvas.style.pointerEvents = isActive ? eventsStatus.listen : eventsStatus.ignore;
  }

}

export const activeLayer = new Active(ctxActive, activeWidth, activeHeight);
