import classNames from 'classnames';
import { Component } from 'react';
import {
  MdLockOutline,
  MdLockOpen,
  MdOutlineClear,
  MdDeleteForever,
} from 'react-icons/md';
import { Button, ToggleButton } from '../buttons';

export default class SectionControls extends Component {
  render() {
    const { isList, index, arrayHelpers, locked, handleReset, handleToggle } =
      this.props;

    return (
      <div
        className={classNames({
          row: true,
          'section-controls': true,
          'section-controls--list': isList,
        })}>
        {isList ? (
          <>
            <Button
              data={{ icon: <MdDeleteForever />, label: 'Delete' }}
              onClick={() => arrayHelpers.remove(index)}
            />

            <ToggleButton
              active={locked}
              activeData={{ icon: <MdLockOpen />, label: 'Unlock' }}
              inactiveData={{ icon: <MdLockOutline />, label: 'Lock' }}
              onToggle={handleToggle}
            />
          </>
        ) : (
          <>
            <Button
              data={{ icon: <MdOutlineClear />, label: 'Reset' }}
              onClick={handleReset}
            />
          </>
        )}
      </div>
    );
  }
}
