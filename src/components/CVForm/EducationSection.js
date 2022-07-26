import React, { Component } from 'react';
import { EditorState } from 'draft-js';
import { format } from 'date-fns';
import { TextInput, RichInput } from '../inputs';
import ListSection from './ListSection';
import SectionControls from './SectionControls';
import ListItemPreview from './ListItemPreview';
import * as Yup from 'yup';

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
    .nullable()
    .transform((value) =>
      value instanceof Date && !isNaN(value) ? value : null
    )
    .when(
      'startDate',
      (startDate, schema) =>
        (startDate &&
          schema.min(startDate, 'End date cannot be before start date!')) ||
        schema
    ),
  educationDescription: Yup.object().test(
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
  educationDescription: EditorState.createEmpty(),
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
    const { validateForm, setTouched, ...formik } = this.props.formik;
    await validateForm();
    if (!this.isEducationValid()) {
      const { education } = formik.touched;
      const newEducation = education ? [...education] : [];
      const oldTouched = newEducation[this.props.index];
      if (oldTouched) {
        newEducation[this.props.index] = {
          ...oldTouched,
          school: true,
          degree: true,
          startDate: true,
        };
      } else {
        newEducation[this.props.index] = {
          school: true,
          degree: true,
          startDate: true,
        };
      }

      setTouched({
        ...formik.touched,
        education: newEducation,
      });
    } else {
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

    const listSectionControls = (
      <SectionControls
        isList={true}
        index={index}
        arrayHelpers={arrayHelpers}
        handleToggle={this.toggleLocked}
      />
    );
    return (
      <>
        {this.state.locked ? (
          <ListItemPreview
            mainInfo={field[index].school}
            subInfo={field[index].degree}
            startDate={field[index].startDate}
            endDate={field[index].endDate}
            SectionControls={listSectionControls}
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
                name={`education[${index}].educationDescription`}
                editorState={field[index].educationDescription}
                error={
                  errors.education && errors.education.educationDescription
                }
                onChange={setFieldValue}
                onFocus={setFieldTouched}
                maxLength={MAX_LENGTH}
              />
            </div>

            {listSectionControls}
          </>
        )}
      </>
    );
  }
}
