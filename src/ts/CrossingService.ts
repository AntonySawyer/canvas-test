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
      const crossingWidgets = this.pointsCrossingWithOtherWidgets(widget.id, widgetPoints);
      const crossingStatus = crossingWidgets.length > 0;
      // if (crossingStatus) {
      //   crossingIds = this.getCrossingIds(widget);
      // }
      // const newIds = crossingIds.filter(id => !widget.crossingPair.includes(id));
      // console.log(newIds);
      console.log(crossingWidgets);
      console.log(widget.crossingPair);
      const crossingIds = crossingWidgets.map(crossingWidget => crossingWidget.id);
      const isNew = crossingIds.filter(id => !widget.crossingPair.includes(id)).length > 0;
      const isOld = widget.crossingPair.filter(id => !crossingIds.includes(id)).length > 0;
      // заморочиться и обновлять только если это надо (убрались или добавились)
      if (crossingStatus !== widget.isCrossing || isNew || isOld) {
        widget.setCrossing(crossingStatus, crossingIds);
        return;
      }
    });
  }

  pointsCrossingWithOtherWidgets = (checkedId: number, pointsForCheck: Points) => {
    return actionRunner.stack.getStackWithoutId(checkedId).filter((widget) => {
      return this.checkCrossing(widget.getPoints(), pointsForCheck);
    });
  }

  // private getCrossingIds(checkeWidget: IWidget) {
  //   const result = [];
  //   const widgetPoints = checkeWidget.getPoints2();
  //   actionRunner.stack.getOnlyCrossing()
  //   .filter(widget => widget.id !== checkeWidget.id)
  //   .forEach((widget) => {
  //     widgetPoints.forEach((coordinate) => {
  //       if (widget.coordinateIsInside(coordinate)) {
  //         result.push(widget.id);
  //       }
  //     });
  //   });
  //   return result.filter((val, ind, arr) => arr.lastIndexOf(val) === ind);
  // }

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
