import { ICrossingService, Points } from './interfaces';
import { someInRange } from './helpers/math';
import { actionRunner } from './app';
import { subscriber } from './Subscriber';
import { WidgetEvents, StackEvents } from './constants';

class CrossingService implements ICrossingService {
  constructor() {
    subscriber.subscribe(WidgetEvents.SetNewPosition, this.setCrossingIfNeeded);
    subscriber.subscribe(StackEvents.ActiveWidgetRemoved, this.setCrossingIfNeeded);
  }

  setCrossingIfNeeded = () => {
    actionRunner.stack.getStack().forEach((widget) => {
      const widgetPoints = widget.getPoints();
      const crossingStatus = this.pointsCrossingWithOtherWidgets(widget.id, widgetPoints);
      if (crossingStatus !== widget.isCrossing) {
        return widget.setCrossing(crossingStatus);
      }
    });
  }

  pointsCrossingWithOtherWidgets = (checkedId: number, pointsForCheck: Points) => {
    return actionRunner.stack.getStackWithoutId(checkedId).some((widget) => {
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
