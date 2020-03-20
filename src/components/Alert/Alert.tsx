import * as React from 'react';
import './alert.css';

interface AlertProps {
  widgetId: number;
  targetId: number;
}

export default class Alert extends React.Component<AlertProps, {}> {
  render() {
    const { widgetId, targetId } = this.props;
    return (
      <li className="alert">Widget#{widgetId} is crossing with widget #{targetId}!</li>
    );
  }
}
