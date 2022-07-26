import { useField } from 'formik';
import { format } from 'date-fns';
import classNames from 'classnames';

export default function TextInput({ label, locked, ...props }) {
  const [field, meta] = useField(props);
  return (
    <div className="form-field col">
      {locked ? (
        <>
          <p className="preview-name">{label.replace('*', '')}</p>
          <p className="preview-value">
            {field.value
              ? props.type === 'date'
                ? format(new Date(field.value), 'LL MMM, yyyy')
                : field.value
              : 'Not provided'}
          </p>
        </>
      ) : (
        <>
          <label htmlFor={props.id || props.name}>{label}</label>
          <input
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
