import { Component } from 'react';
import { withTranslation } from 'react-i18next';
import classNames from 'classnames';

class TextInput extends Component {
  render() {
    const { t, i18n, tReady, label, getFieldProps, getFieldMeta, ...props } =
      this.props;

    const field = getFieldProps(props);
    const meta = getFieldMeta(props.name);

    return (
      <div className="form-field col">
        <label htmlFor={props.id || props.name}>{label}</label>
        <input
          id={props.id || props.name}
          className={classNames({
            invalid: meta.touched && meta.error,
          })}
          {...field}
          {...props}
        />
        {meta.touched && meta.error ? (
          <p className="error">{t(meta.error)}</p>
        ) : null}
      </div>
    );
  }
}

export default withTranslation('form')(TextInput);
