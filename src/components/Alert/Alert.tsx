import * as React from 'react';
import './alert.css';

interface AlertProps {
  widgetId: number;
  targetId: number;
  setHighlightBordersByIds: (ids: number[]) => void;
}

export default class Alert extends React.Component<AlertProps, {}> {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    const { widgetId, targetId } = this.props;
    this.props.setHighlightBordersByIds([widgetId, targetId]);
  }

  render() {
    const { widgetId, targetId } = this.props;
    return (
      <li className="alert"
          onClick={this.handleClick}>Widget#{widgetId} is crossing with widget #{targetId}!</li>
    );
  }
}
