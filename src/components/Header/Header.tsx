import * as React from 'react';
import './header.css';
import Counter from '../Counter';

interface HeaderProps {
  widgetCount: number;
}

export default class Header extends React.Component<HeaderProps, {}> {
  render() {
    return (
      <header>
        <section className="headerData">
          <Counter widgetCount={this.props.widgetCount} />
        </section>
        <section className="backup">
          <input type="text" name="" id="" placeholder="Type smthg" />
          <input type="button" value="Save" />
          <input type="button" value="Load" />
        </section>
      </header>
    );
  }
}
