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
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    const { widgetId, targetId } = this.props;
    this.props.setHighlightBordersByIds([widgetId, targetId]);
    this.props.changeActiveAlert(`${widgetId}${targetId}`);
  }

  render() {
    const { widgetId, targetId, isActiveAlert } = this.props;
    let className = 'alert';
    if (isActiveAlert) {
      className += ' active';
    }
    return (
      <li className={className}
          onClick={this.handleClick}>Widget#{widgetId} is crossing with widget #{targetId}!</li>
    );
  }
}
