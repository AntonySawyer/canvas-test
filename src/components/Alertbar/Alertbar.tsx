import * as React from 'react';
import './alertbar.css';
import { IWidget } from 'src/ts/interfaces';
import Alert from '../Alert';

interface AlertbarProps {
  crossingList: IWidget[];
}

export default class Alertbar extends React.Component<AlertbarProps, {}> {
  render() {
    return (
      <section className="alertBar">
        <h3>Alerts here</h3>
        <ul>
          {this.props.crossingList.map((widget) => {
            return widget.crossingPair.map((target) => {
              return <Alert key={`${widget.id}${target}`} widgetId={widget.id}
                            targetId={target} />;
            });
          })}
        </ul>
      </section>
    );
  }
}
