import * as React from 'react';
import './alertbar.css';
import Alert from '../Alert';
import { subscriber } from '../../ts/Subscriber';
import { WidgetEvents } from '../../ts/constants';

interface AlertbarProps {
  crossingList: number[][];
  setHighlightBordersByIds: (ids: number[]) => void;
}

interface AlertbarState {
  activeAlertId: string;
}

export default class Alertbar extends React.Component<AlertbarProps, AlertbarState> {
  constructor(props) {
    super(props);
    this.state = {
      activeAlertId: null,
    };
    subscriber.subscribe(WidgetEvents.ChangeActiveStatus, () => this.changeActiveAlert(null));
  }

  changeActiveAlert(activeAlertId: string) {
    this.setState({ activeAlertId });
  }

  render() {
    return (
      <section className="alertBar">
        <h3>Alerts here</h3>
        <ul>
          {this.props.crossingList.map((pair) => {
            const pairKey = `${pair[0]}${pair[1]}`;
            const isActiveAlert = this.state.activeAlertId === pairKey;
            return <Alert key={pairKey} widgetId={pair[0]}
                          isActiveAlert={isActiveAlert}
                          targetId={pair[1]}
                          changeActiveAlert={id => this.changeActiveAlert(id)}
                          setHighlightBordersByIds={this.props.setHighlightBordersByIds} />;
          })}
        </ul>
      </section>
    );
  }
}
