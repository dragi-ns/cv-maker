import { Component } from 'react';
import { FieldArray } from 'formik';
import { nanoid } from 'nanoid';
import { MdOutlineAdd } from 'react-icons/md';
import { Button } from '../buttons';

export default class ListSection extends Component {
  render() {
    const { legend, fieldName, field, formik, initialValues, InputComponent } =
      this.props;
    const label = legend.toLowerCase();

    return (
      <fieldset className="form-section form-section--list">
        <legend>{legend}</legend>
        <FieldArray name={fieldName}>
          {(arrayHelpers) => (
            <>
              {field &&
                field.length > 0 &&
                field.map((item, index) => (
                  <InputComponent
                    key={item.id}
                    index={index}
                    field={field}
                    arrayHelpers={arrayHelpers}
                    formik={formik}
                  />
                ))}
              {field.length <= 0 && <p>No {label} provided.</p>}
              <Button
                data={{ icon: <MdOutlineAdd />, label: `Add ${label}` }}
                className="btn--secondary"
                onClick={() =>
                  arrayHelpers.push({ ...initialValues, id: nanoid() })
                }
                disabled={field.length >= 5}
              />
            </>
          )}
        </FieldArray>
      </fieldset>
    );
  }
}
