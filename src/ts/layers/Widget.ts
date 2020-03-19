import { Layer } from './Layer';
import { canvasWidth, sidebarWidth, canvasHeight, highlightColor } from '../constants';
import { IWidget } from '../interfaces';
import { findWidgetIndex, outOfBorders } from '../helpers/widgetsHelper';
import { checkCrossing } from '../helpers/math';

const widgetsCanvas = document.getElementById('widgetCanvas') as HTMLCanvasElement;
const ctxWidgets = widgetsCanvas.getContext('2d');

class Widget extends Layer {
  constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
    super(ctx, width, height);
    // sizes here
  }
  renderStack: IWidget[] = [];

  addWidget(widget: IWidget) {
    const isOutOfBorders = outOfBorders(widget, 0, canvasWidth, canvasHeight, sidebarWidth);
    if (isOutOfBorders) {
      this.renderStack.push({ ...widget, x: widget.x - sidebarWidth });
    }
    this.renderStack.map(el => this.findCrossing(el));
    this.render();
  }

  deleteWidget(id: number) {
    const index = findWidgetIndex(id, this.renderStack);
    this.renderStack.splice(index, 1);
    this.render();
  }

  private findCrossing(widget: IWidget) {
    const somethingIsCrossing = checkCrossing(widget, this.renderStack);
    if (somethingIsCrossing) {
      this.highlight(widget);
    } else if (widget.color !== undefined) {
      this.deleteHighlight(widget);
    }
  }

  private highlight(widget: IWidget) {
    widget.color = highlightColor;
  }

  private deleteHighlight(widget: IWidget) {
    widget.color = null;
  }

  private render() {
    this.clearCanvas();
    this.renderStack.forEach(el => this.draw(el));
  }
}

export const widgetLayer = new Widget(ctxWidgets, canvasWidth - sidebarWidth, canvasHeight);
