import { Component } from 'react';
import { EditorState } from 'draft-js';
import { format } from 'date-fns';
import * as Yup from 'yup';
import { TextInput, RichInput } from '../inputs';
import ListSection from './ListSection';
import ListItemPreview from './ListItemPreview';
import SectionControls from './SectionControls';
import { formatPeriod, toggleListItemLocked } from './helpers';
import { withTranslation } from 'react-i18next';

class WorkSection extends Component {
  render() {
    const { t, formik } = this.props;

    return (
      <ListSection
        legend={t('work.title')}
        addLabel={t('work.addLabel')}
        emptyLabel={t('work.emptyLabel')}
        fieldName="work"
        field={formik.values.work}
        formik={formik}
        initialValues={WorkInitialValues}
        InputComponent={WorkInputSectionTranslated}
        maxItems={5}
      />
    );
  }
}

export default withTranslation('form')(WorkSection);

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
    const { t, i18n, index, field, arrayHelpers } = this.props;
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
      period = formatPeriod(
        field[index].startDate,
        field[index].endDate,
        i18n.language
      );
    }
    return (
      <>
        {this.state.locked ? (
          <ListItemPreview
            title={[field[index].company, field[index].jobTitle]}
            subtitle={`${period[0]} - ${t(period[1])}`}
            listItemControls={listItemControls}
          />
        ) : (
          <>
            <div className="form-row row">
              <TextInput
                label={t('work.company.label')}
                type="text"
                name={`work[${index}].company`}
                placeholder={t('work.company.placeholder')}
                getFieldProps={getFieldProps}
                getFieldMeta={getFieldMeta}
              />
            </div>

            <div className="form-row row">
              <TextInput
                label={t('work.jobTitle.label')}
                type="text"
                name={`work[${index}].jobTitle`}
                placeholder={t('work.jobTitle.placeholder')}
                getFieldProps={getFieldProps}
                getFieldMeta={getFieldMeta}
              />
            </div>

            <div className="form-row row">
              <TextInput
                label={t('work.startDate.label')}
                type="date"
                name={`work[${index}].startDate`}
                max={this.maxStartDate}
                onChange={this.handleStartDateChange}
                getFieldProps={getFieldProps}
                getFieldMeta={getFieldMeta}
              />

              <TextInput
                label={t('work.endDate.label')}
                type="date"
                name={`work[${index}].endDate`}
                min={this.state.minEndDate}
                getFieldProps={getFieldProps}
                getFieldMeta={getFieldMeta}
              />
            </div>

            <div className="form-row row">
              <RichInput
                label={t('work.description.label')}
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

const WorkInputSectionTranslated = withTranslation('form')(WorkInputSection);

const MAX_LENGTH = 256;

export const WorkValidationSchema = {
  company: Yup.string()
    .min(2, 'work.company.error.tooShort')
    .max(64, 'work.company.error.tooSLong')
    .required('work.company.error.required'),
  jobTitle: Yup.string()
    .min(2, 'work.jobTitle.error.tooShort')
    .max(64, 'work.jobTitle.error.tooLong')
    .required('work.jobTitle.error.required'),
  startDate: Yup.date()
    .nullable()
    .transform((value) =>
      value instanceof Date && !isNaN(value) ? value : null
    )
    .max(new Date(), 'work.startDate.error.tooShort')
    .required('work.startDate.error.required'),
  endDate: Yup.date()
    .typeError('work.endDate.error.invalid')
    .when(
      'startDate',
      (startDate, schema) =>
        (startDate && schema.min(startDate, 'work.endDate.error.tooShort')) ||
        schema
    ),
  description: Yup.object().test(
    'max length',
    'work.description.error.tooLong',
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
