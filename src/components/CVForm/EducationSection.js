import { Component } from 'react';
import { EditorState } from 'draft-js';
import { format } from 'date-fns';
import { TextInput, RichInput } from '../inputs';
import * as Yup from 'yup';
import ListSection from './ListSection';
import ListItemPreview from './ListItemPreview';
import SectionControls from './SectionControls';
import { formatPeriod, toggleListItemLocked } from './helpers';

const MAX_LENGTH = 256;

export const EducationValidationSchema = {
  school: Yup.string()
    .min(2, 'School/Organization is too short!')
    .max(64, 'School/Organization is too long!')
    .required('School/Organization is required!'),
  degree: Yup.string()
    .min(2, 'Degree/Course is too short!')
    .max(64, 'Degree/Course is too long!')
    .required('Degree/Course is required!'),
  startDate: Yup.date()
    .nullable()
    .transform((value) =>
      value instanceof Date && !isNaN(value) ? value : null
    )
    .max(new Date(), 'Start date cannot be in the future!')
    .required('Start date is required!'),
  endDate: Yup.date()
    .typeError('Invalid date!')
    .when(
      'startDate',
      (startDate, schema) =>
        (startDate &&
          schema.min(startDate, 'End date cannot be before start date!')) ||
        schema
    ),
  description: Yup.object().test(
    'max length',
    'Education description is too long!',
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

export default class EducationSection extends Component {
  render() {
    const { formik } = this.props;

    return (
      <ListSection
        legend="Education"
        fieldName="education"
        field={formik.values.education}
        formik={formik}
        initialValues={EducationInitialValues}
        InputComponent={EducationInputSection}
        maxItems={5}
      />
    );
  }
}

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
    const { index, field, arrayHelpers } = this.props;
    const { errors, setFieldValue, setFieldTouched } = this.props.formik;

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
            title={`${field[index].school}, ${field[index].degree}`}
            subtitle={period}
            listItemControls={listItemControls}
          />
        ) : (
          <>
            <div className="form-row row">
              <div className="form-field col">
                <TextInput
                  label="School/Organization"
                  type="text"
                  name={`education[${index}].school`}
                  placeholder="New York University"
                />
              </div>
            </div>

            <div className="form-row row">
              <div className="form-field col">
                <TextInput
                  label="Degree/Course"
                  type="text"
                  name={`education[${index}].degree`}
                  placeholder="Bachelor of Science"
                />
              </div>
            </div>

            <div className="form-row row">
              <div className="form-field col">
                <TextInput
                  label="Start date"
                  type="date"
                  name={`education[${index}].startDate`}
                  max={this.maxStartDate}
                  onChange={this.handleStartDateChange}
                />
              </div>

              <div className="form-field col">
                <TextInput
                  label="End date"
                  type="date"
                  name={`education[${index}].endDate`}
                  min={this.state.minEndDate}
                />
              </div>
            </div>

            <div className="form-row row">
              <RichInput
                label="Description"
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
