import { Component } from 'react';

export default class Button extends Component {
  render() {
    const { data, onClick, onMouseDown } = this.props;
    const type = this.props.type || 'button';
    const className = `btn${
      this.props.className ? ' ' + this.props.className : ''
    }`;
    return (
      <button
        type={type}
        className={className}
        {...(onClick && { onClick })}
        {...(onMouseDown && { onMouseDown })}>
        {data.icon && <span className="icon">{data.icon}</span>}
        {data.label && <span>{data.label}</span>}
      </button>
    );
  }
}
