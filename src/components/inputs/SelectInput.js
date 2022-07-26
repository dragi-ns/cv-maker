import { useField } from 'formik';
import classNames from 'classnames';

export default function SelectInput({ label, locked, ...props }) {
  const [field, meta] = useField(props);
  return (
    <div className="form-field col">
      {locked ? (
        <>
          <p className="preview-name">{label.replace('*', '')}</p>
          <p className="preview-value">
            {field.value
              ? props.children.find(
                  (child) => child.props.value === field.value
                ).props.children
              : 'Not provided'}
          </p>
        </>
      ) : (
        <>
          <label htmlFor={props.id || props.name}>{label}</label>
          <select
            className={classNames({
              invalid: meta.touched && meta.error,
            })}
            id={props.id || props.name}
            {...field}
            {...props}
          />
          {meta.touched && meta.error ? (
            <p className="error">{meta.error}</p>
          ) : null}
        </>
      )}
    </div>
  );
}
