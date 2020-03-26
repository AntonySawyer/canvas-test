import * as React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Alertbar from './Alertbar';
import { widgetSamples, CanvasEvents, WidgetEvents, StackEvents } from '../ts/constants';
import { IRenderStack, MouseDownTarget } from 'src/ts/interfaces';
import { subscriber } from '../ts/Subscriber';
import { serializeStack, deserializeStack } from '../utils/localstorage';

interface AppProps {
  stack: IRenderStack;
  handleClickOnWidgetSample: (e: MouseEvent, mode: MouseDownTarget) => void;
}

interface AppState {
  widgetCount: number;
  crossingList: number[][];
}

export class App extends React.Component<AppProps, AppState> {
  constructor(props) {
    super(props);
    this.state = {
      widgetCount: 0,
      crossingList: [],
    };
    subscriber.subscribe(CanvasEvents.StaticLayerCleared, () => this.updateWidgetCounter());
    subscriber.subscribe(StackEvents.ActiveWidgetRemoved, () => this.updateWidgetCounter());
    subscriber.subscribe(WidgetEvents.ChangeCrossingPair, () => this.updateAlertWidgets());
  }

  saveStack(name: string) {
    const serializedStack = serializeStack(this.props.stack.getStack());
    localStorage.setItem(name, serializedStack);
  }

  loadStack(name: string) {
    const serializedStack = localStorage.getItem(name);
    const stackParams = deserializeStack(serializedStack);
    this.props.stack.initStackFromStorage(stackParams);
  }

  updateWidgetCounter() {
    const widgetCount = this.props.stack.getStack().length;
    this.setState({ widgetCount });
  }

  updateAlertWidgets() {
    const crossingList = this.props.stack.getCrossingPairs();
    this.setState({ crossingList });
  }

  render() {
    return (
      <>
        <Header widgetCount={this.state.widgetCount}
                saveStack={name => this.saveStack(name)}
                loadStack={name => this.loadStack(name)} />
        <section className="wrapper">
          <Sidebar widgetSamples={widgetSamples}
            handleClickOnWidgetSample={this.props.handleClickOnWidgetSample} />
          <Alertbar crossingList={this.state.crossingList}
          setHighlightBordersByIds={this.props.stack.setHighlightBordersByIds} />
        </section>
      </>
    );
  }
}
