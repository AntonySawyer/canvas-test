import { ISubscriber, IObserver, SinteticEvents } from './interfaces';

class Subscribe implements ISubscriber {
  private observers: IObserver[] = [];

  subscribe(trigger: SinteticEvents, callback: () => void) {
    const observer = { trigger, callback };
    this.observers.push(observer);
  }

  unsubscribe(trigger: SinteticEvents, callback: () => void) {
    this.observers = this.observers.filter((observer) => {
      return observer.trigger !== trigger && observer.callback !== callback; // ={
    });
  }

  notify(trigger: SinteticEvents) {
    this.observers.filter(observer => observer.trigger === trigger)
                  .forEach(observer => observer.callback());
  }
}

export const subscriber = new Subscribe();
