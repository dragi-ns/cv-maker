import React, { Component } from 'react';
import { EditorState } from 'draft-js';
import { format } from 'date-fns';
import { TextInput, RichInput } from '../inputs';
import ListSection from './ListSection';
import * as Yup from 'yup';
import SectionControls from './SectionControls';
import ListItemPreview from './ListItemPreview';

const MAX_LENGTH = 256;

export const WorkValidationSchema = {
  company: Yup.string()
    .min(2, 'Company name is too short!')
    .max(64, 'Company name is too long!')
    .required('Company name is required!'),
  jobTitle: Yup.string()
    .min(2, 'Job title is too short!')
    .max(64, 'Job title is too long!')
    .required('Job title is required!'),
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
  workDescription: Yup.object().test(
    'max length',
    'Work description is too long!',
    (value) => {
      return value.getCurrentContent().getPlainText('').length < MAX_LENGTH + 1;
    }
  ),
};

export const WorkInitialValues = {
  company: '',
  jobTitle: '',
  startDate: '',
  endDate: '',
  workDescription: EditorState.createEmpty(),
};

export default class WorkSection extends Component {
  render() {
    const { formik } = this.props;

    return (
      <ListSection
        legend="Work experience"
        fieldName="work"
        field={formik.values.work}
        formik={formik}
        initialValues={WorkInitialValues}
        InputComponent={WorkInputSection}
      />
    );
  }
}

class WorkInputSection extends Component {
  constructor(props) {
    super(props);
    this.maxStartDate = format(new Date(), 'yyyy-MM-dd');
    this.state = {
      locked: false,
      minEndDate: this.maxStartDate,
    };
    this.toggleLocked = this.toggleLocked.bind(this);
    this.isWorkValid = this.isWorkValid.bind(this);
    this.handleStartDateChange = this.handleStartDateChange.bind(this);
  }

  async toggleLocked() {
    const { validateForm, setTouched, ...formik } = this.props.formik;
    await validateForm();
    if (!this.isWorkValid()) {
      const { work } = formik.touched;
      const newWork = work ? [...work] : [];
      const oldTouched = newWork[this.props.index];
      if (oldTouched) {
        newWork[this.props.index] = {
          ...oldTouched,
          company: true,
          jobTitle: true,
          startDate: true,
        };
      } else {
        newWork[this.props.index] = {
          company: true,
          jobTitle: true,
          startDate: true,
        };
      }

      setTouched({
        ...formik.touched,
        work: newWork,
      });
    } else {
      this.setState((prevState) => {
        return { locked: !prevState.locked };
      });
    }
  }

  isWorkValid() {
    const { errors } = this.props.formik;
    return !errors.work || !errors.work[this.props.index];
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
            mainInfo={field[index].company}
            subInfo={field[index].jobTitle}
            startDate={field[index].startDate}
            endDate={field[index].endDate}
            SectionControls={listSectionControls}
          />
        ) : (
          <>
            <div className="form-row row">
              <div className="form-field col">
                <TextInput
                  label="Company name"
                  type="text"
                  name={`work[${index}].company`}
                  placeholder="TOPCV Shop"
                />
              </div>
            </div>

            <div className="form-row row">
              <div className="form-field col">
                <TextInput
                  label="Job title"
                  type="text"
                  name={`work[${index}].jobTitle`}
                  placeholder="Sales Manager"
                />
              </div>
            </div>

            <div className="form-row row">
              <div className="form-field col">
                <TextInput
                  label="Start date"
                  type="date"
                  name={`work[${index}].startDate`}
                  max={this.maxStartDate}
                  onChange={this.handleStartDateChange}
                />
              </div>

              <div className="form-field col">
                <TextInput
                  label="End date"
                  type="date"
                  name={`work[${index}].endDate`}
                  min={this.state.minEndDate}
                />
              </div>
            </div>

            <div className="form-row row">
              <RichInput
                label="Description"
                name={`work[${index}].workDescription`}
                editorState={field[index].workDescription}
                error={errors.work && errors.work[index].workDescription}
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
