import { ICrossingService, Points, IWidget } from './interfaces';
import { someInRange } from './helpers/math';
import { actionRunner } from './app';
import { subscriber } from './Subscriber';
import { WidgetEvents, StackEvents, repulsiveLimit } from './constants';
import { staticCanvas } from './helpers/DOM';

class CrossingService implements ICrossingService {
  constructor() {
    subscriber.subscribe(WidgetEvents.SetNewPosition, this.setCrossingIfNeeded);
    subscriber.subscribe(StackEvents.InitStackFromStorage, this.setCrossingIfNeeded);
  }

  private setCrossingIfNeeded = () => {
    const widget = actionRunner.stack.activeWidget;
    const widgetPoints = widget.getPoints();
    if (widget.isRepulsive) {
      widgetPoints.first.x -= repulsiveLimit;
      widgetPoints.first.y -= repulsiveLimit;
      widgetPoints.last.x += repulsiveLimit;
      widgetPoints.last.y += repulsiveLimit;
      }
    const crossingWidgets = this.pointsCrossingWithOtherWidgets(widget.id, widgetPoints, widget.isRepulsive);
    const crossingIds = crossingWidgets.map(crossingWidget => crossingWidget.id);

    // update self and others to set crossing = false
    widget.crossingPair.forEach((id) => {
      if (!crossingIds.includes(id)) {
        const target = actionRunner.stack.getWidgetById(id);
        target.removeCrossingPair(widget.id);
        widget.removeCrossingPair(id);
      }
    });

    // update self and others to set crossing = true
    crossingIds.forEach((id) => {
      const target = actionRunner.stack.getWidgetById(id);
      target.addCrossingPair(widget.id);
      widget.addCrossingPair(id);
    });
  }

  pointsCrossingWithOtherWidgets = (checkedId: number, pointsForCheck: Points, checkedWidgetisRepulsive: boolean) => {
    return actionRunner.stack.getStackWithoutId(checkedId).filter((widget) => {
      const widgetControlPoints = widget.getPoints();
      if (widget.isRepulsive && !checkedWidgetisRepulsive) {
        widgetControlPoints.first.x -= repulsiveLimit;
        widgetControlPoints.first.y -= repulsiveLimit;
        widgetControlPoints.last.x += repulsiveLimit;
        widgetControlPoints.last.y += repulsiveLimit;
        }
      return this.checkCrossing(widgetControlPoints, pointsForCheck);
    });
  }

  isOutOfBorders(widget: IWidget) {
    const points = widget.getPoints();
    return points.first.x < 0 || points.first.y < 0
          || points.last.x > staticCanvas.width || points.last.y > staticCanvas.height;
  }

  private checkCrossing(points: Points, pointsForCheck: Points) {
    return (
      someInRange(points.first.x, points.last.x, [pointsForCheck.first.x, pointsForCheck.last.x])
   || someInRange(pointsForCheck.first.x, pointsForCheck.last.x, [points.first.x, points.last.x])
) && (
      someInRange(points.first.y, points.last.y, [pointsForCheck.first.y, pointsForCheck.last.y])
   || someInRange(pointsForCheck.first.y, pointsForCheck.last.y, [points.first.y, points.last.y])
     );
  }
}

export const crossingChecker = new CrossingService();
