import { Layer } from './Layer';
import { zIndActiveLayerOnTop, zIndActiveLayerBottom, canvasWidth, canvasHeight } from '../constants';
import { IWidget } from '../interfaces';
import Subscriber from '../Subscriber';

const activeCanvas = document.getElementById('activeCanvas') as HTMLCanvasElement;
const ctxActiveLayer = activeCanvas.getContext('2d');

class Active extends Layer {
  constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
    super(ctx, width, height);
    // subscribe here
    // sizes here
  }

  widget: IWidget = null;

  init() {
    this.setSizes();
    Subscriber.subscribe('active', '#activeCanvas', 'mousemove', (e: MouseEvent) => this.move(e));
  }

  changeActiveWidget(widget: IWidget) {
    this.widget = widget;
    widget !== null ? this.render() : this.activeLayerHoisted(false);
  }

  activeLayerHoisted(isHoisted: boolean) {
    activeCanvas.style.zIndex = isHoisted ? zIndActiveLayerOnTop : zIndActiveLayerBottom;
    activeCanvas.style.cursor = isHoisted ? 'move' : 'default';
    activeCanvas.style.pointerEvents = isHoisted ? 'all' : 'none';
    if (!isHoisted && this.widget === null) {
      this.clearCanvas();
    }
  }

  move(e: MouseEvent) { // set position.
    if (this.widget !== null && e.buttons) {
      const x = this.widget.x + e.movementX;
      const y = this.widget.y + e.movementY;
      this.changeActiveWidget({ ...this.widget, x, y });
    }
  }

  render() {
    this.activeLayerHoisted(true);
    this.clearCanvas();
    this.draw(this.widget);
  }
}

export const activeLayer = new Active(ctxActiveLayer, canvasWidth, canvasHeight);
