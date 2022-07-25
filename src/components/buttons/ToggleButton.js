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
    const { active, activeData, inactiveData, onToggle, ...props } = this.props;
    const data = active ? this.props.activeData : this.props.inactiveData;

    return <Button {...props} data={data} onClick={this.handleToggle} />;
  }
}
