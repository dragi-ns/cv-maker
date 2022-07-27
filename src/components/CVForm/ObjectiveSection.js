import { Component } from 'react';
import { EditorState } from 'draft-js';
import * as Yup from 'yup';
import { RichInput } from '../inputs';
import SectionControls from './SectionControls';

export const MAX_LENGTH = 256;

export const ObjectiveValidationSchema = {
  objective: Yup.object().test(
    'max length',
    'Description is too long!',
    (value) => {
      return value.getCurrentContent().getPlainText('').length < MAX_LENGTH + 1;
    }
  ),
};

export const ObjectiveInitialValues = {
  objective: EditorState.createEmpty(),
};

export default class ObjectiveSection extends Component {
  constructor(props) {
    super(props);
    this.handleReset = this.handleReset.bind(this);
  }

  handleReset() {
    const { values, errors, resetForm } = this.props.formik;
    resetForm({
      ...this.props.formik,
      values: { ...values, ...ObjectiveInitialValues },
      errors: { ...errors, objective: '' },
    });
  }

  render() {
    const { values, errors, setFieldValue, setFieldTouched } =
      this.props.formik;
    return (
      <fieldset className="form-section">
        <legend>Objective/Goal</legend>
        <div className="form-row row">
          <RichInput
            label="Description"
            name="objective"
            editorState={values.objective}
            error={errors.objective}
            onChange={setFieldValue}
            onFocus={setFieldTouched}
            maxLength={MAX_LENGTH}
          />
        </div>
        <SectionControls handleReset={this.handleReset} />
      </fieldset>
    );
  }
}
