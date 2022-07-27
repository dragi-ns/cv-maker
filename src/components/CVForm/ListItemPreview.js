import classNames from 'classnames';
import { Component } from 'react';

export default class ListItemPreview extends Component {
  render() {
    const { title, subtitle, listItemControls } = this.props;

    return (
      <div className="list-item-preview row">
        <div className="list-item-info col">
          <p className="list-item-title">
            {Array.isArray(title) ? (
              title.map((value, index, array) => {
                return (
                  <span
                    key={index}
                    className={classNames({ bold: index === 0 })}>
                    {value}
                    {index === 0 && array.length > 1 && ', '}
                  </span>
                );
              })
            ) : (
              <span className="bold">{title}</span>
            )}
          </p>
          <p className="list-item-subtitle">{subtitle}</p>
        </div>
        {listItemControls}
      </div>
    );
  }
}
