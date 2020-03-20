import { ICrossingService, Points } from './interfaces';
import { someInRange } from './helpers/math';
import { actionRunner } from './app';
import { subscriber } from './Subscriber';
import { WidgetEvents } from './constants';

class CrossingService implements ICrossingService {
  constructor() {
    subscriber.subscribe(WidgetEvents.SetNewPosition, this.setCrossingIfNeeded);
    // subscriber.subscribe(StackEvents.ActiveWidgetRemoved, this.setCrossingIfNeeded);
  }

  setCrossingIfNeeded = () => {
    const widget = actionRunner.stack.activeWidget;
    const widgetPoints = widget.getPoints();
    const crossingWidgets = this.pointsCrossingWithOtherWidgets(widget.id, widgetPoints);
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

  pointsCrossingWithOtherWidgets = (checkedId: number, pointsForCheck: Points) => {
    return actionRunner.stack.getStackWithoutId(checkedId).filter((widget) => {
      return this.checkCrossing(widget.getPoints(), pointsForCheck);
    });
  }

  private checkCrossing(points: Points, pointsForCheck: Points) { // ?
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
