import { useField } from 'formik';

export default function MySelect({ label, locked, ...props }) {
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
          <select {...field} {...props} />
          {meta.touched && meta.error ? (
            <p className="error">{meta.error}</p>
          ) : null}
        </>
      )}
    </div>
  );
}
