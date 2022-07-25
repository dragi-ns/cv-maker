import React, { Component } from 'react';
import { FieldArray } from 'formik';
import { EditorState } from 'draft-js';
import { format } from 'date-fns';
import { nanoid } from 'nanoid';
import {
  MdOutlineAdd,
  MdDeleteForever,
  MdLockOpen,
  MdLockOutline,
} from 'react-icons/md';
import { TextInput, RichInput } from '../inputs';
import { Button, ToggleButton } from '../buttons';
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
    const { education } = this.props.formik.values;

    return (
      <fieldset className="form-section education-section">
        <legend>Education</legend>
        <FieldArray name="education">
          {(arrayHelpers) => (
            <>
              {education &&
                education.length > 0 &&
                education.map((edu, index) => (
                  <EducationInputSection
                    key={edu.id}
                    index={index}
                    education={education}
                    arrayHelpers={arrayHelpers}
                    formik={this.props.formik}
                  />
                ))}
              {education.length <= 0 && <p>No education provided.</p>}
              <Button
                data={{ icon: <MdOutlineAdd />, label: 'Add education' }}
                className="btn--secondary"
                onClick={() =>
                  arrayHelpers.push({ ...EducationInitialValues, id: nanoid() })
                }
                disabled={education.length >= 5}
              />
            </>
          )}
        </FieldArray>
      </fieldset>
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
    const { index, education, arrayHelpers } = this.props;
    const { errors, setFieldValue, setFieldTouched } = this.props.formik;

    let startDate = null;
    let endDate = null;
    if (this.state.locked) {
      ({ startDate, endDate } = education[index]);
      startDate = format(new Date(startDate), 'LLL yyyy');
      endDate = endDate ? format(new Date(endDate), 'LLL yyyy') : 'Present';
    }
    return (
      <>
        {this.state.locked ? (
          <div className="education-preview row">
            <div className="education-info col">
              <p>
                <span className="school-name">{education[index].school}</span>,{' '}
                {education[index].degree}
              </p>
              <p className="duration">
                {startDate} - {endDate}
              </p>
            </div>
            <div className="section-controls row">
              <Button
                data={{ icon: <MdDeleteForever />, label: 'Delete' }}
                onClick={() => arrayHelpers.remove(index)}
              />
              <ToggleButton
                active={this.state.locked}
                activeData={{ icon: <MdLockOpen />, label: 'Unlock' }}
                inactiveData={{ icon: <MdLockOutline />, label: 'Lock' }}
                onToggle={this.toggleLocked}
              />
            </div>
          </div>
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
                editorState={education[index].educationDescription}
                error={
                  errors.education && errors.education.educationDescription
                }
                onChange={setFieldValue}
                onFocus={setFieldTouched}
                maxLength={MAX_LENGTH}
              />
            </div>

            <div className="section-controls row">
              <Button
                data={{ icon: <MdDeleteForever />, label: 'Delete' }}
                onClick={() => arrayHelpers.remove(index)}
              />
              <ToggleButton
                active={this.state.locked}
                activeData={{ icon: <MdLockOpen />, label: 'Unlock' }}
                inactiveData={{ icon: <MdLockOutline />, label: 'Lock' }}
                onToggle={this.toggleLocked}
              />
            </div>
          </>
        )}
      </>
    );
  }
}
