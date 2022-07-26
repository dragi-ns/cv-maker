import classNames from 'classnames';
import { Component } from 'react';

export default class ListItemPreview extends Component {
  render() {
    const { title, subtitle, listItemControls } = this.props;

    // const formatedStartDate = format(new Date(startDate), 'LLL yyyy');
    // let formatedEndDate = endDate
    //   ? format(new Date(endDate), 'LLL yyyy')
    //   : 'Present';

    return (
      <div className="list-item-preview row">
        <div className="list-item-info col">
          <p className="list-item-title">
            {title.split(',').map((value, index) => {
              return (
                <span key={index} className={classNames({ bold: index === 0 })}>
                  {value}
                </span>
              );
            })}
          </p>
          <p className="list-item-subtitle">{subtitle}</p>
        </div>
        {listItemControls}
      </div>
    );
  }
}
