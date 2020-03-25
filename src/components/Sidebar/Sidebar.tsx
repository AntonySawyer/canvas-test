import * as React from 'react';
import { IWidgetSampleGroups, MouseDownTarget } from '../../ts/interfaces';
import WidgetSamplesGroup from '../WidgetSamplesGroup';
import './sidebar.css';

interface SidebarProps {
  widgetSamples: IWidgetSampleGroups;
  handleClickOnWidgetSample: (e: MouseEvent, mode: MouseDownTarget) => void;
}

export default class Sidebar extends React.Component<SidebarProps, {}> {
  render() {
    const keys = Object.keys(this.props.widgetSamples);
    return (
      <section className="sidebarWrapper">
          {keys.map((key) => {
            return <WidgetSamplesGroup key={key}
                      header={key}
                      samples={this.props.widgetSamples[key]}
                      handleClickOnWidgetSample={this.props.handleClickOnWidgetSample} />;
          })}
      </section>
    );
  }
}
