import { Layer } from './Layer';
import { canvasWidth, sidebarWidth, canvasHeight } from '../constants';
import { IWidget, IRenderStack } from '../interfaces';
import RenderStack from '../helpers/RenderStack';
import { checkBorders } from '../helpers/math';

const staticCanvas = document.getElementById('staticCanvas') as HTMLCanvasElement;
const ctxWidgets = staticCanvas.getContext('2d');

class Static extends Layer {
  constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
    super(ctx, width, height);
    this.draw = this.draw.bind(this);
  }
  stack: IRenderStack = new RenderStack();

  addWidget(widget: IWidget) {
    const needToAdd = checkBorders(widget, 0, this.width, this.height, 0);
    if (needToAdd) {
      this.stack.addWidget(widget);
    }
    this.render();
  }

  highlight(id: number) {
    this.stack.getWidgetById(id).setCrossing();
    this.render();
  }

  render() {
    this.clearCanvas();
    this.stack.iterate(this.draw);
  }
}

export const staticLayer = new Static(ctxWidgets, canvasWidth - sidebarWidth, canvasHeight);
