import { Component } from 'react';
import { EditorState } from 'draft-js';
import { format } from 'date-fns';
import * as Yup from 'yup';
import { TextInput, RichInput } from '../inputs';
import ListSection from './ListSection';
import ListItemPreview from './ListItemPreview';
import SectionControls from './SectionControls';
import { formatPeriod, toggleListItemLocked } from './helpers';

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
  description: EditorState.createEmpty(),
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
        maxItems={5}
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
    const toggle = await toggleListItemLocked(
      this.props.formik,
      this.isWorkValid,
      'work',
      this.props.index,
      { company: true, jobTitle: true, startDate: true }
    );

    if (toggle) {
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
            title={`${field[index].company}, ${field[index].jobTitle}`}
            subtitle={period}
            listItemControls={listItemControls}
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
                name={`work[${index}].description`}
                editorState={field[index].description}
                error={
                  errors.work &&
                  errors.work[index] &&
                  errors.work[index].description
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
