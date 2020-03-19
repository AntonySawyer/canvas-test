import * as React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Alertbar from './Alertbar';
import { widgetSamplesForReact, CanvasEvents, StackEvents } from '../ts/constants';
import { IRenderStack, MouseDownTarget } from 'src/ts/interfaces';
import { subscriber } from '../ts/Subscriber';

interface AppProps {
  appState: IRenderStack;
  handleClickOnWidgetSample: (e: MouseEvent, mode: MouseDownTarget) => void;
}

interface AppState {
  widgetCount: number;
}

export class App extends React.Component<AppProps, AppState> {
  constructor(props) {
    super(props);
    this.state = {
      widgetCount: 0,
    };
    this.updateWidgetCounter = this.updateWidgetCounter.bind(this);
    subscriber.subscribe(CanvasEvents.StaticLayerCleared, this.updateWidgetCounter);
    subscriber.subscribe(StackEvents.ActiveWidgetRemoved, this.updateWidgetCounter);
  }

  updateWidgetCounter() {
    const widgetCount = this.props.appState.getStack().length;
    this.setState({ widgetCount });
  }

  render() {
    return (
      <>
        <Header widgetCount={this.state.widgetCount} />
        <section className="wrapper">
          <Sidebar widgetSamples={widgetSamplesForReact}
            handleClickOnWidgetSample={this.props.handleClickOnWidgetSample} />
          <Alertbar />
        </section>
      </>
    );
  }
}
