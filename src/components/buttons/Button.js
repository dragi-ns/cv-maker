import { Component } from 'react';

export default class Button extends Component {
  render() {
    const { data, type, className, ...props } = this.props;
    const newType = type || 'button';
    const newClassName = `btn${className ? ' ' + className : ''}`;
    return (
      <button {...props} type={newType} className={newClassName}>
        {data.icon && <span className="icon">{data.icon}</span>}
        {data.label && <span>{data.label}</span>}
      </button>
    );
  }
}
