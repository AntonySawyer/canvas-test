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
    const { id, width, height } = this.props.sample;
    return (
        <div className="widgetSample"
          data-id={id}
          onMouseDown={e => this.handleMouseDown(e)}>
          <span className="widgetSampleDescr">{width}0x{height}0mm</span>
          <span className="widgetSampleIcon">☰</span>
        </div>
    );
  }
}
