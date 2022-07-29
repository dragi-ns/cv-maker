import classNames from 'classnames';
import { Component } from 'react';
import { withTranslation } from 'react-i18next';
import {
  MdLockOutline,
  MdLockOpen,
  MdOutlineClear,
  MdDeleteForever,
} from 'react-icons/md';
import { Button, ToggleButton } from '../buttons';

class SectionControls extends Component {
  render() {
    const {
      t,
      isList,
      index,
      arrayHelpers,
      locked,
      handleReset,
      handleToggle,
    } = this.props;

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
              data={{ icon: <MdDeleteForever />, label: t('delete') }}
              onClick={() => arrayHelpers.remove(index)}
            />

            <ToggleButton
              active={locked}
              activeData={{ icon: <MdLockOpen />, label: t('unlock') }}
              inactiveData={{ icon: <MdLockOutline />, label: t('lock') }}
              onToggle={handleToggle}
            />
          </>
        ) : (
          <>
            <Button
              data={{ icon: <MdOutlineClear />, label: t('reset') }}
              onClick={handleReset}
            />
          </>
        )}
      </div>
    );
  }
}

export default withTranslation('form')(SectionControls);
