import * as React from 'react';
import { WidgetSamplesGroupProps } from '../../ts/interfaces';
import WidgetSample from '../WidgetSample';
import './widgetSamplesGroup.css';

export default class WidgetSamplesGroup extends React.Component<WidgetSamplesGroupProps, {}> {
  render() {
    return (
      <section className="widgetsContainer">
        <h3>Widgets container</h3>
        {/* FIX ME: index as key */ }
          {this.props.samples.map((sample, index) => {
            return <WidgetSample key={index} sample={sample}
              handleClickOnWidgetSample={this.props.handleClickOnWidgetSample} />;
          })}
      </section>
    );
  }
}
