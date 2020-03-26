import * as React from 'react';
import './widgetSample.css';
import { MouseDownTarget, IWidgetSample } from '../../ts/interfaces';

interface WidgetSampleProps {
  sample: IWidgetSample;
  handleClickOnWidgetSample: (e: MouseEvent, mode: MouseDownTarget) => void;
}

export default class WidgetSample extends React.Component<WidgetSampleProps, {}> {

  handleMouseDown(e) { // type?
    this.props.handleClickOnWidgetSample(e, 'div');
  }

  render() {
    const { id, type, width, height, sticky, repulsive } = this.props.sample;
    const sampleClassName = `widgetSample ${sticky ? ' stickyWidget' : ''} ${repulsive ? ' repulsiveWidget' : ''}`;
    return (
        <div className={sampleClassName}
          data-id={id}
          data-sticky={sticky}
          data-repulsive={repulsive}
          onMouseDown={e => this.handleMouseDown(e)}>
          <span className="widgetSampleDescr">{width}0x{height}0mm</span>
          <span className="widgetSampleIcon">☰</span>
        </div>
    );
  }
}
