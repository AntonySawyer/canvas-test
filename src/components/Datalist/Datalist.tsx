import * as React from 'react';
import './datalist.css';

interface DatalistProps {
  options: string[];
}

export default class Datalist extends React.Component<DatalistProps, {}> {
  render() {
    return (
      <datalist id="autocomplete-list">
        {this.props.options.map(option => <option value={option} key={option}></option>)}
    </datalist>
    );
  }
}
