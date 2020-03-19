import * as React from 'react';
import { SidebarProps } from '../../ts/interfaces';
import WidgetSamplesGroup from '../WidgetSamplesGroup';
import './sidebar.css';

export default class Sidebar extends React.Component<SidebarProps, {}> {
  render() {
    return (
      <section className="sidebarWrapper">
        {/* FIX ME: index as key */ }
          {this.props.widgetSamples.map((samples, index) => {
            return <WidgetSamplesGroup key={index}
                      samples={samples}
                      handleClickOnWidgetSample={this.props.handleClickOnWidgetSample} />;
          })}
      </section>
    );
  }
}
