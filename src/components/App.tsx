import * as React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Alertbar from './Alertbar';
import { widgetSamplesForReact, CanvasEvents, WidgetEvents, StackEvents } from '../ts/constants';
import { IRenderStack, MouseDownTarget } from 'src/ts/interfaces';
import { subscriber } from '../ts/Subscriber';

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
    this.updateWidgetCounter = this.updateWidgetCounter.bind(this);
    this.updateAlertWidgets = this.updateAlertWidgets.bind(this);
    subscriber.subscribe(CanvasEvents.StaticLayerCleared, this.updateWidgetCounter);
    subscriber.subscribe(StackEvents.ActiveWidgetRemoved, this.updateWidgetCounter);
    subscriber.subscribe(WidgetEvents.ChangeCrossingPair, this.updateAlertWidgets);
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
        <Header widgetCount={this.state.widgetCount} />
        <section className="wrapper">
          <Sidebar widgetSamples={widgetSamplesForReact}
            handleClickOnWidgetSample={this.props.handleClickOnWidgetSample} />
          <Alertbar crossingList={this.state.crossingList}
          setHighlightBordersByIds={this.props.stack.setHighlightBordersByIds} />
        </section>
      </>
    );
  }
}
