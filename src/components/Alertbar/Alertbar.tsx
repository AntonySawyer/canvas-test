import * as React from 'react';
import './alertbar.css';
import Alert from '../Alert';

interface AlertbarProps {
  crossingList: number[][];
}

export default class Alertbar extends React.Component<AlertbarProps, {}> {
  render() {
    return (
      <section className="alertBar">
        <h3>Alerts here</h3>
        <ul>
          {this.props.crossingList.map((pair) => {
            return <Alert key={`${pair[0]}${pair[1]}`} widgetId={pair[0]}
                          targetId={pair[1]} />;
          })}
        </ul>
      </section>
    );
  }
}
