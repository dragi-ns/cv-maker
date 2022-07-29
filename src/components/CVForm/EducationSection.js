import { Component } from 'react';
import { EditorState } from 'draft-js';
import { format } from 'date-fns';
import { TextInput, RichInput } from '../inputs';
import * as Yup from 'yup';
import ListSection from './ListSection';
import ListItemPreview from './ListItemPreview';
import SectionControls from './SectionControls';
import { formatPeriod, toggleListItemLocked } from './helpers';
import { withTranslation } from 'react-i18next';

class EducationSection extends Component {
  render() {
    const { t, formik } = this.props;

    return (
      <ListSection
        legend={t('education.title')}
        addLabel={t('education.addLabel')}
        emptyLabel={t('education.emptyLabel')}
        fieldName="education"
        field={formik.values.education}
        formik={formik}
        initialValues={EducationInitialValues}
        InputComponent={EducationInputSectionTranslated}
        maxItems={5}
      />
    );
  }
}

export default withTranslation('form')(EducationSection);

class EducationInputSection extends Component {
  constructor(props) {
    super(props);
    this.maxStartDate = format(new Date(), 'yyyy-MM-dd');
    this.state = {
      locked: false,
      minEndDate: this.maxStartDate,
    };
    this.toggleLocked = this.toggleLocked.bind(this);
    this.isEducationValid = this.isEducationValid.bind(this);
    this.handleStartDateChange = this.handleStartDateChange.bind(this);
  }

  async toggleLocked() {
    const toggle = await toggleListItemLocked(
      this.props.formik,
      this.isEducationValid,
      'education',
      this.props.index,
      { school: true, degree: true, startDate: true }
    );

    if (toggle) {
      this.setState((prevState) => {
        return { locked: !prevState.locked };
      });
    }
  }

  isEducationValid() {
    const { errors } = this.props.formik;
    return !errors.education || !errors.education[this.props.index];
  }

  handleStartDateChange(event) {
    const { name, value } = event.target;
    const { setFieldValue } = this.props.formik;
    this.setState({ minEndDate: value });
    setFieldValue(name, value);
  }

  render() {
    const { t, index, field, arrayHelpers } = this.props;
    const {
      errors,
      setFieldValue,
      setFieldTouched,
      getFieldProps,
      getFieldMeta,
    } = this.props.formik;

    const listItemControls = (
      <SectionControls
        isList={true}
        index={index}
        arrayHelpers={arrayHelpers}
        locked={this.state.locked}
        handleToggle={this.toggleLocked}
      />
    );

    let period = null;
    if (this.state.locked) {
      period = formatPeriod(field[index].startDate, field[index].endDate);
    }
    return (
      <>
        {this.state.locked ? (
          <ListItemPreview
            title={[field[index].school, field[index].degree]}
            subtitle={period}
            listItemControls={listItemControls}
          />
        ) : (
          <>
            <div className="form-row row">
              <div className="form-field col">
                <TextInput
                  label={t('education.school.label')}
                  type="text"
                  name={`education[${index}].school`}
                  placeholder={t('education.school.placeholder')}
                  getFieldProps={getFieldProps}
                  getFieldMeta={getFieldMeta}
                />
              </div>
            </div>

            <div className="form-row row">
              <div className="form-field col">
                <TextInput
                  label={t('education.degree.label')}
                  type="text"
                  name={`education[${index}].degree`}
                  placeholder={t('education.degree.placeholder')}
                  getFieldProps={getFieldProps}
                  getFieldMeta={getFieldMeta}
                />
              </div>
            </div>

            <div className="form-row row">
              <div className="form-field col">
                <TextInput
                  label={t('education.startDate.label')}
                  type="date"
                  name={`education[${index}].startDate`}
                  max={this.maxStartDate}
                  onChange={this.handleStartDateChange}
                  getFieldProps={getFieldProps}
                  getFieldMeta={getFieldMeta}
                />
              </div>

              <div className="form-field col">
                <TextInput
                  label={t('education.endDate.label')}
                  type="date"
                  name={`education[${index}].endDate`}
                  min={this.state.minEndDate}
                  getFieldProps={getFieldProps}
                  getFieldMeta={getFieldMeta}
                />
              </div>
            </div>

            <div className="form-row row">
              <RichInput
                label={t('education.description.label')}
                name={`education[${index}].description`}
                editorState={field[index].description}
                error={
                  errors.education &&
                  errors.education[index] &&
                  errors.education[index].description
                }
                onChange={setFieldValue}
                onFocus={setFieldTouched}
                maxLength={MAX_LENGTH}
              />
            </div>
            {listItemControls}
          </>
        )}
      </>
    );
  }
}

const EducationInputSectionTranslated = withTranslation('form')(
  EducationInputSection
);

const MAX_LENGTH = 256;

export const EducationValidationSchema = {
  school: Yup.string()
    .min(2, 'education.school.error.tooShort')
    .max(64, 'education.school.error.tooLong')
    .required('education.school.error.required'),
  degree: Yup.string()
    .min(2, 'education.degree.error.tooShort')
    .max(64, 'education.degree.error.tooLong')
    .required('education.degree.error.required'),
  startDate: Yup.date()
    .nullable()
    .transform((value) =>
      value instanceof Date && !isNaN(value) ? value : null
    )
    .max(new Date(), 'education.startDate.error.tooLong')
    .required('education.startDate.error.required'),
  endDate: Yup.date()
    .typeError('education.endDate.error.invalid')
    .when(
      'startDate',
      (startDate, schema) =>
        (startDate &&
          schema.min(startDate, 'education.endDate.error.tooShort')) ||
        schema
    ),
  description: Yup.object().test(
    'max length',
    'education.description.error.tooLong',
    (value) => {
      return value.getCurrentContent().getPlainText('').length < MAX_LENGTH + 1;
    }
  ),
};

export const EducationInitialValues = {
  school: '',
  degree: '',
  startDate: '',
  endDate: '',
  description: EditorState.createEmpty(),
};
