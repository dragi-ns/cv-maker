import { Component } from 'react';
import { EditorState } from 'draft-js';
import * as Yup from 'yup';
import { RichInput } from '../inputs';
import SectionControls from './SectionControls';
import { withTranslation } from 'react-i18next';

class ObjectiveSection extends Component {
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
    const { t } = this.props;
    const { values, errors, setFieldValue, setFieldTouched } =
      this.props.formik;
    return (
      <fieldset className="form-section">
        <legend>{t('objective.title')}</legend>
        <div className="form-row row">
          <RichInput
            label={t('objective.description.label')}
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

export default withTranslation('form')(ObjectiveSection);

export const MAX_LENGTH = 256;

export const ObjectiveValidationSchema = {
  objective: Yup.object().test(
    'max length',
    'objective.description.error.tooLong',
    (value) => {
      return value.getCurrentContent().getPlainText('').length < MAX_LENGTH + 1;
    }
  ),
};

export const ObjectiveInitialValues = {
  objective: EditorState.createEmpty(),
};
