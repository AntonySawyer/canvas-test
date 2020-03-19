import { Layer } from './Layer';
import { zIndActiveLayerOnTop, zIndActiveLayerBottom, canvasWidth,
        canvasHeight, sidebarWidth, sticking } from '../constants';
import { IWidget } from '../interfaces';
import { checkBorders } from '../helpers/math';

const activeCanvas = document.getElementById('activeCanvas') as HTMLCanvasElement;
const ctxActiveLayer = activeCanvas.getContext('2d');

class Active extends Layer {
  constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
    super(ctx, width, height);
    document.addEventListener('mouseup', e => this.activeLayerHoisted(false));
    document.addEventListener('keyup', e => this.activeLayerHoisted(false));
  }

  widget: IWidget = null;

  changeActiveWidget(widget: IWidget) {
// опять костыль ccccccombo
    this.widget = widget === null ? null : widget;
    widget !== null ? this.render() : this.activeLayerHoisted(false);
  }

  private activeLayerHoisted(isHoisted: boolean) {
    activeCanvas.style.zIndex = isHoisted ? zIndActiveLayerOnTop : zIndActiveLayerBottom;
    activeCanvas.style.cursor = isHoisted ? 'move' : 'default';
    activeCanvas.style.pointerEvents = isHoisted ? 'all' : 'none';
    const needToReset = this.widget !== null
                      && !checkBorders(this.widget, 0, this.width, this.height, sidebarWidth);
    if (!isHoisted && needToReset) {
      this.changeActiveWidget(null);
    }
    if (!isHoisted && this.widget === null) {
      this.clearCanvas();
    }
  }

  render() {
    this.activeLayerHoisted(true);
    this.clearCanvas();
    this.widget.draw();
// temp
    if (this.widget.isSticky) {
      this.ctx.lineWidth = 0.5;
      const stickyArea = { ...this.widget,
        x: this.widget.x  - sticking,
        y: this.widget.y - sticking,
        width: this.widget.width + sticking * 2,
        height: this.widget.height + sticking * 2 };
      this.ctx.strokeRect(stickyArea.x, stickyArea.y, stickyArea.width, stickyArea.height);
    }

  }
}

export const activeLayer = new Active(ctxActiveLayer, canvasWidth, canvasHeight);
