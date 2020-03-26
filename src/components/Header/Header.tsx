import * as React from 'react';
import './header.css';
import Counter from '../Counter';
import Datalist from '../Datalist';

interface HeaderProps {
  widgetCount: number;
  saveStack: (name: string) => void;
  loadStack: (name: string) => void;
}

interface HeaderState {
  inputValue: string;
  autocompleteOptions: string[];
}

export default class Header extends React.Component<HeaderProps, HeaderState> {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: '',
      autocompleteOptions: Object.keys(localStorage),
    };
    this.handleInput = this.handleInput.bind(this);
    this.handleLoadBtn = this.handleLoadBtn.bind(this);
    this.handleSaveBtn = this.handleSaveBtn.bind(this);
  }

  handleInput(e) {
    const inputValue = e.target.value;
    this.setState({ inputValue });
  }

  handleSaveBtn() {
    this.props.saveStack(this.state.inputValue);
    if (!this.state.autocompleteOptions.includes(this.state.inputValue)) {
      this.setState((prevState) => {
        const newAutocompleteOptions = [...prevState.autocompleteOptions];
        newAutocompleteOptions.push(prevState.inputValue);
        return { autocompleteOptions: newAutocompleteOptions };
      });
    }
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
                list="autocomplete-list"
                placeholder="Type name here"
                value={this.state.inputValue}
                onChange={this.handleInput} />
          <Datalist options={this.state.autocompleteOptions} />
          <input type="button" value="Save" onClick={this.handleSaveBtn} />
          <input type="button" value="Load" onClick={this.handleLoadBtn} />
        </section>
      </header>
    );
  }
}
