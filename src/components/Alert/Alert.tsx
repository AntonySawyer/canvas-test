import * as React from 'react';
import './alert.css';

export default class Alert extends React.Component<{}, {}> {
  render() {
    return (
        <li className="alert">It's alert!</li>
    );
  }
}
