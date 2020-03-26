import * as React from 'react';
import './alert.css';

interface AlertProps {
  widgetId: number;
  targetId: number;
  isActiveAlert: boolean;
  setHighlightBordersByIds: (ids: number[]) => void;
  changeActiveAlert: (activeAlertId: string) => void;
}

export default class Alert extends React.Component<AlertProps, {}> {
  constructor(props) {
    super(props);
  }

  handleClick() {
    const { widgetId, targetId } = this.props;
    this.props.setHighlightBordersByIds([widgetId, targetId]);
    this.props.changeActiveAlert(`${widgetId}${targetId}`);
  }

  render() {
    const { widgetId, targetId, isActiveAlert } = this.props;
    const alertClassName = `alert ${isActiveAlert ? 'active' : ''}`;
    return (
      <li className={alertClassName}
          onClick={() => this.handleClick()}>
            Widget #{widgetId} is crossing with widget #{targetId}!
      </li>
    );
  }
}
