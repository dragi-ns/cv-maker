import { Component } from 'react';
import { MdLockOutline, MdLockOpen, MdOutlineClear } from 'react-icons/md';
import { Button, ToggleButton } from '../buttons';

export default class SectionControls extends Component {
  render() {
    const { locked, handleReset, handleToggle } = this.props;

    return (
      <div className="section-controls row">
        {!locked && (
          <Button
            data={{ icon: <MdOutlineClear />, label: 'Reset' }}
            onClick={handleReset}
          />
        )}
        <ToggleButton
          active={locked}
          activeData={{ icon: <MdLockOpen />, label: 'Unlock' }}
          inactiveData={{ icon: <MdLockOutline />, label: 'Lock' }}
          onToggle={handleToggle}
        />
      </div>
    );
  }
}
