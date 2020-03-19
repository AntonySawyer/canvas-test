import * as React from 'react';
import './counter.css';

interface CounterProps {
  widgetCount: number;
}

export default class Counter extends React.Component<CounterProps, {}> {
  render() {
    return (
        <span>Widget count: {this.props.widgetCount}</span>
    );
  }
}
