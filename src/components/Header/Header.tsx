import * as React from 'react';
import './header.css';
import Counter from '../Counter';

interface HeaderProps {
  widgetCount: number;
  saveStack: (name: string) => void;
  loadStack: (name: string) => void;
}

interface HeaderState {
  inputValue: string;
}

export default class Header extends React.Component<HeaderProps, HeaderState> {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: '',
    };
    this.handleInput = this.handleInput.bind(this);
    this.handleLoadBtn = this.handleLoadBtn.bind(this);
    this.handleSaveBtn = this.handleSaveBtn.bind(this);
  }

  handleInput(e) {
    this.setState({ inputValue: e.target.value });
  }

  handleSaveBtn() {
    this.props.saveStack(this.state.inputValue);
  }

  handleLoadBtn() {
    this.props.loadStack(this.state.inputValue);
  }

  render() {
    return (
      <header>
        <section className="headerData">
          <Counter widgetCount={this.props.widgetCount} />
        </section>
        <section className="backup">
          <input type="text"
                placeholder="Type name here"
                value={this.state.inputValue}
                onChange={this.handleInput} />
          <input type="button" value="Save" onClick={this.handleSaveBtn} />
          <input type="button" value="Load" onClick={this.handleLoadBtn} />
        </section>
      </header>
    );
  }
}
