import { Layer } from './Layer';
import { zIndActiveLayerOnTop, zIndActiveLayerBottom, canvasWidth, canvasHeight, sidebarWidth } from '../constants';
import { IWidget } from '../interfaces';
import { checkBorders, calculateMiddle } from '../helpers/math';

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

  onKeyDown(e: KeyboardEvent) {
    switch (e.key) {
      case 'ArrowUp':
        this.moveArr(0, -1);
        break;
      case 'ArrowDown':
        this.moveArr(0, 1);
        break;
      case 'ArrowRight':
        this.moveArr(1, 0);
        break;
      case 'ArrowLeft':
        this.moveArr(-1, 0);
        break;
    }
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

  private moveArr(movementX: number, movementY: number) { // set position.
    if (this.widget !== null) {
      const x = this.widget.x + movementX;
      const y = this.widget.y + movementY;
      this.changeActiveWidget({ ...this.widget, x, y });
    }
  }

  move(e: MouseEvent) { // set position.
    if (this.widget !== null && e.buttons) {
      const { x, y } = calculateMiddle(this.widget.width, this.widget.height, e.offsetX, e.offsetY);
      const xMiddle = x + e.movementX;
      const yMiddle = y + e.movementY;
      this.changeActiveWidget({ ...this.widget, x: xMiddle, y: yMiddle });
    }
  }

  private render() {
    this.activeLayerHoisted(true);
    this.clearCanvas();
    this.draw(this.widget);
  }
}

export const activeLayer = new Active(ctxActiveLayer, canvasWidth, canvasHeight);
