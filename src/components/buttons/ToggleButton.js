import { Component } from 'react';
import Button from './Button';

export default class ToggleButton extends Component {
  constructor(props) {
    super(props);
    this.handleToggle = this.handleToggle.bind(this);
  }

  handleToggle(event) {
    event.preventDefault();
    this.props.onToggle();
  }

  render() {
    const data = this.props.active
      ? this.props.activeData
      : this.props.inactiveData;

    return (
      <Button
        type={this.props.type}
        className={this.props.className}
        data={data}
        onClick={this.handleToggle}
      />
    );
  }
}
