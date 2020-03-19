import { ISubscriber, IObserver } from './interfaces';
import { selectorIsMatch } from './helpers/string';

class SubscribeClass implements ISubscriber {
  private observers: IObserver[] = [];

  subscribe(parent: string, selector: string, type: string, fn: (data: MouseEventInit) => void) {
    const isNewType = this.observers.filter(el => el.type === type).length === 0;
    if (isNewType) {
      document.addEventListener(type, (e: MouseEvent) => this.notify(e));
    }
    this.observers.push({ parent, selector, type, fn });
  }

  unSubscribe(parent: string, type: string, selector: string) {
    this.observers = this.observers.filter((el) => {
      return el.parent !== parent
          || el.parent === parent && el.type !== type && el.selector !== selector;
    });
  }

  private notify(e: MouseEvent) {
    this.observers.forEach((el) => {
      return el.type === e.type
          && selectorIsMatch(e.target as HTMLElement, el.selector)
          && el.fn(e);
    });
  }
}

const Subscriber = new SubscribeClass(); // lowercase

export default Subscriber;

// import { ISubscriber, IObserver } from './interfaces';
// import { selectorIsMatch } from './helpers/string';

// class SubscribeClass implements ISubscriber {
//   private observers: IObserver[] = [];

//   subscribe(parent: string, selector: string, type: string, fn: (data: MouseEventInit) => void) {
//     document.querySelectorAll(selector).forEach((el) => {
//       el.addEventListener(type, (e: MouseEvent) => this.notify(e));
//     });
//     const uniqObservers = this.observers.filter(el => el.type === type && el.selector === selector);
//     if (uniqObservers.length === 0) {
//       this.observers.push({ parent, selector, type, fn });
//     }
//   }

//   unSubscribe(parent: string, type: string, selector: string) {
//     this.observers = this.observers.filter((el) => {
//       return el.parent !== parent
//           || el.parent === parent && el.type !== type && el.selector !== selector;
//     });
//   }

//   private notify(e: MouseEvent) {
//     this.observers.forEach((el) => {
//       return el.type === e.type
//           && selectorIsMatch(e.target as HTMLElement, el.selector)
//           && el.fn(e);
//     });
//   }
// }

// const Subscriber = new SubscribeClass();

// export default Subscriber;
