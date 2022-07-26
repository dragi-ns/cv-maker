import { Component } from 'react';
import { format } from 'date-fns';

export default class ListItemPreview extends Component {
  render() {
    const { mainInfo, subInfo, startDate, endDate, SectionControls } =
      this.props;

    const formatedStartDate = format(new Date(startDate), 'LLL yyyy');
    let formatedEndDate = endDate
      ? format(new Date(endDate), 'LLL yyyy')
      : 'Present';

    return (
      <div className="list-item-preview row">
        <div className="list-item-info col">
          <p>
            <span className="bold">{mainInfo}</span>, {subInfo}
          </p>
          <p className="list-item-duration">
            {formatedStartDate} - {formatedEndDate}
          </p>
        </div>
        {SectionControls}
      </div>
    );
  }
}
