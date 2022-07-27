import { useField } from 'formik';
import classNames from 'classnames';

export default function SelectInput({ label, ...props }) {
  const [field, meta] = useField(props);
  return (
    <div className="form-field col">
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
    </div>
  );
}
