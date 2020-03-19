import { Layer } from './Layer';
import { canvasWidth, sidebarWidth, canvasHeight } from '../constants';
import { IWidget, IRenderStack } from '../interfaces';
import RenderStack from '../helpers/RenderStack';
import { checkBorders } from '../helpers/math';

const widgetsCanvas = document.getElementById('widgetCanvas') as HTMLCanvasElement;
const ctxWidgets = widgetsCanvas.getContext('2d');

class Widget extends Layer {
  constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
    super(ctx, width, height);
  }
  renderStack: IRenderStack = new RenderStack();

  addWidget(widget: IWidget) {
    const needToAdd = checkBorders(widget, 0, this.width, this.height, 0);
    if (needToAdd) {
      this.renderStack.push(widget);
    }
    this.render();
  }

  deleteWidget(id: number) {
    const index = this.renderStack.findWidgetIndex(id);
    this.renderStack.splice(index, 1);
    this.render();
  }

  highlight(id: number, color: string) {
    this.renderStack.getWidgetById(id).color = color;
    this.render();
  }

  private render() {
    this.clearCanvas();
    this.renderStack.forEach(el => this.draw(el));
  }
}

export const widgetLayer = new Widget(ctxWidgets, canvasWidth - sidebarWidth, canvasHeight);
