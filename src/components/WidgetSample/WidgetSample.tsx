import * as React from 'react';
import { WidgetSampleProps } from '../../ts/interfaces';
import './widgetSample.css';

export default class WidgetSample extends React.Component<WidgetSampleProps, {}> {
  render() {
    const { id, type, width, height, sticky, scared } = this.props;
    let tempClassname = 'widgetSample';
    tempClassname += sticky ? ' stickyWidget' : ''; // fix me
    tempClassname += scared ? ' scaredWidget' : '';
    return (
        <div className={tempClassname}
          data-id={id}
          data-type={type}
          data-sticky={sticky}
          data-scared={scared}>
          <span className="widgetSampleDescr">{width}0x{height}0mm</span>
          <span className="widgetSampleIcon">☰</span>
        </div>
    );
  }
}
