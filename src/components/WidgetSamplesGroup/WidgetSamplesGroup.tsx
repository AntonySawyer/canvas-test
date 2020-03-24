import * as React from 'react';
import { WidgetSamplesGroupProps } from '../../ts/interfaces';
import WidgetSample from '../WidgetSample';
import './widgetSamplesGroup.css';

export default class WidgetSamplesGroup extends React.Component<WidgetSamplesGroupProps, {}> {
  render() {
    const { header, samples, handleClickOnWidgetSample } = this.props;
    return (
      <section className="widgetsContainer">
        <h3>{`${header} widgets`}</h3>
          {samples.map((sample, index) => {
            return <WidgetSample key={`${header}_${index}`} sample={sample}
              handleClickOnWidgetSample={handleClickOnWidgetSample} />;
          })}
      </section>
    );
  }
}
