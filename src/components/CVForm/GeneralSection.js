import { Component } from 'react';
import { format } from 'date-fns';
import { MdOutlineAdd, MdRemove } from 'react-icons/md';
import { TextInput, SelectInput, AvatarInput } from '../inputs';
import { ToggleButton } from '../buttons';
import SectionControls from './SectionControls';
import * as Yup from 'yup';
import { withTranslation } from 'react-i18next';

class GeneralSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAdditionalInformation: false,
    };
    this.maxDateOfBirth = format(new Date(), 'yyyy-MM-dd');
    this.toggleAdditionalInformation =
      this.toggleAdditionalInformation.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  toggleAdditionalInformation() {
    this.setState((prevState) => {
      return {
        showAdditionalInformation: !prevState.showAdditionalInformation,
      };
    });
  }

  handleReset() {
    const { values, errors, touched, resetForm } = this.props.formik;
    resetForm({
      ...this.props.formik,
      values: { ...values, general: GeneralInitialValues },
      errors: { ...errors, general: {} },
      touched: { ...touched, general: {} },
    });
  }

  render() {
    const { t, formik } = this.props;
    const { values, errors, setFieldValue, getFieldProps, getFieldMeta } =
      formik;

    return (
      <fieldset className="form-section">
        <legend>{t('general.title')}</legend>
        <div className="form-row row">
          <AvatarInput
            name="general.avatar"
            value={values.general.avatar}
            error={errors.general && errors.general.avatar}
            accept={AVATAR_SUPPORTED_FORMATS.join(', ')}
            onChange={setFieldValue}
          />

          <div className="form-full-name-container col">
            <TextInput
              label={t('general.firstName.label')}
              type="text"
              name="general.firstName"
              placeholder={t('general.firstName.placeholder')}
              getFieldProps={getFieldProps}
              getFieldMeta={getFieldMeta}
            />

            <TextInput
              label={t('general.lastName.label')}
              type="text"
              name="general.lastName"
              placeholder={t('general.lastName.placeholder')}
              getFieldProps={getFieldProps}
              getFieldMeta={getFieldMeta}
            />
          </div>
        </div>

        <div className="form-row row">
          <TextInput
            label={t('general.email.label')}
            type="email"
            name="general.email"
            placeholder={t('general.email.placeholder')}
            getFieldProps={getFieldProps}
            getFieldMeta={getFieldMeta}
          />

          <TextInput
            label={t('general.phone.label')}
            type="tel"
            name="general.phone"
            placeholder={t('general.phone.placeholder')}
            getFieldProps={getFieldProps}
            getFieldMeta={getFieldMeta}
          />
        </div>

        {this.state.showAdditionalInformation && (
          <>
            <div className="form-row row">
              <TextInput
                label={t('general.address.label')}
                type="text"
                name="general.address"
                placeholder={t('general.address.placeholder')}
                getFieldProps={getFieldProps}
                getFieldMeta={getFieldMeta}
              />
            </div>

            <div className="form-row row">
              <TextInput
                label={t('general.city.label')}
                type="text"
                name="general.city"
                placeholder={t('general.city.placeholder')}
                getFieldProps={getFieldProps}
                getFieldMeta={getFieldMeta}
              />

              <TextInput
                label={t('general.country.label')}
                type="text"
                name="general.country"
                placeholder={t('general.country.placeholder')}
                getFieldProps={getFieldProps}
                getFieldMeta={getFieldMeta}
              />
            </div>

            <div className="form-row row">
              <TextInput
                label={t('general.dateOfBirth.label')}
                type="date"
                name="general.dateOfBirth"
                max={this.maxDateOfBirth}
                getFieldProps={getFieldProps}
                getFieldMeta={getFieldMeta}
              />

              <SelectInput
                label={t('general.gender.label')}
                name="general.gender"
                getFieldProps={getFieldProps}
                getFieldMeta={getFieldMeta}>
                <option value="">{t('general.gender.placeholder')}</option>
                {GENDERS.map((gender, index) => (
                  <option key={index} value={gender.value}>
                    {t(gender.label)}
                  </option>
                ))}
              </SelectInput>
            </div>

            <div className="form-row row">
              <TextInput
                label={t('general.website.label')}
                type="url"
                name="general.website"
                placeholder={t('general.website.placeholder')}
                getFieldProps={getFieldProps}
                getFieldMeta={getFieldMeta}
              />
            </div>
          </>
        )}
        <ToggleButton
          active={this.state.showAdditionalInformation}
          activeData={{
            icon: <MdRemove />,
            label: t('general.hideAdditionalInformation'),
          }}
          inactiveData={{
            icon: <MdOutlineAdd />,
            label: t('general.showAdditionalInformation'),
          }}
          className="btn--secondary"
          onToggle={this.toggleAdditionalInformation}
        />
        <SectionControls handleReset={this.handleReset} />
      </fieldset>
    );
  }
}

export default withTranslation('form')(GeneralSection);

const PHONE_REGEX = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
export const GENDERS = [
  { value: 'male', label: 'general.gender.male' },
  { value: 'female', label: 'general.gender.female' },
];
export const AVATAR_SUPPORTED_FORMATS = [
  'image/jpg',
  'image/jpeg',
  'image/gif',
  'image/png',
];

export const GeneralValidationSchema = {
  avatar: Yup.mixed().test(
    'file format',
    'general.avatar.error.unsupportedFileType',
    (value) => {
      if (value && value.type) {
        return AVATAR_SUPPORTED_FORMATS.includes(value.type);
      }
      return true;
    }
  ),
  firstName: Yup.string()
    .min(2, 'general.firstName.error.tooShort')
    .max(50, 'general.firstName.error.tooLong')
    .required('general.firstName.error.required'),
  lastName: Yup.string()
    .min(2, 'general.lastName.error.tooShort')
    .max(50, 'general.lastName.error.tooLong')
    .required('general.lastName.error.required'),
  email: Yup.string()
    .email('general.email.error.invalid')
    .max(64, 'general.email.error.tooLong')
    .required('general.email.error.required'),
  phone: Yup.string()
    .matches(PHONE_REGEX, 'general.phone.error.invalid')
    .required('general.phone.error.required'),
  address: Yup.string().max(64, 'general.address.error.tooLong'),
  city: Yup.string().max(64, 'general.city.error.tooLong'),
  country: Yup.string().max(64, 'general.country.error.tooLong'),
  dateOfBirth: Yup.date()
    .typeError('general.dateOfBirth.error.invalid')
    .max(new Date(), 'general.dateOfBirth.error.tooLong'),
  gender: Yup.string().oneOf(
    GENDERS.map((gender) => gender.value),
    'general.gender.error.invalid'
  ),
  website: Yup.string()
    .max(64, 'general.website.error.tooLong')
    .url('general.website.error.invalid'),
};

export const GeneralInitialValues = {
  avatar: null,
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  country: '',
  dateOfBirth: '',
  gender: '',
  website: '',
};
