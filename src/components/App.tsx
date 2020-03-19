import * as React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Alertbar from './Alertbar';
import { widgetSamplesForReact } from '../ts/constants';

export class App extends React.Component<{}, {}> {
  render() {
    return (
      <>
        <Header widgetCount={13} />
        <section className="wrapper">
          <Sidebar widgetSamples={widgetSamplesForReact} />
          <canvas id="staticCanvas" width="1249" height="900"></canvas>
          <canvas id="activeCanvas" width="1600" height="900"></canvas>
          <Alertbar />
        </section>
      </>
    );
  }
}
