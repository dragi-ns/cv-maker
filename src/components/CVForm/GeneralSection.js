import { Component } from 'react';
import { format } from 'date-fns';
import { MdOutlineAdd, MdRemove } from 'react-icons/md';
import { TextInput, SelectInput, AvatarInput } from '../inputs';
import { ToggleButton } from '../buttons';
import SectionControls from './SectionControls';
import * as Yup from 'yup';

const PHONE_REGEX = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
const GENDERS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
];
export const AVATAR_SUPPORTED_FORMATS = [
  'image/jpg',
  'image/jpeg',
  'image/gif',
  'image/png',
];

export const GeneralValidationSchema = {
  avatar: Yup.mixed().test('fileFormat', 'Unsupported file type!', (value) => {
    if (value && value.type) {
      return AVATAR_SUPPORTED_FORMATS.includes(value.type);
    }
    return true;
  }),
  firstName: Yup.string()
    .min(2, 'First name is too short!')
    .max(50, 'First name is too long!')
    .required('First name is required!'),
  lastName: Yup.string()
    .min(2, 'Last name is too short!')
    .max(50, 'Last name is too long!')
    .required('Last name is required!'),
  email: Yup.string()
    .email('Invalid email address!')
    .max(64, 'Email address is too long!')
    .required('Email address is required!'),
  phone: Yup.string()
    .matches(PHONE_REGEX, 'Invalid phone number!')
    .required('Phone number is required!'),
  address: Yup.string().max(64, 'Address is too long!'),
  city: Yup.string().max(64, 'City name is too long!'),
  country: Yup.string().max(64, 'Country name is too long!'),
  dateOfBirth: Yup.date()
    .typeError('Invalid date!')
    .max(new Date(), 'Date of birth cannot be in the future!'),
  gender: Yup.string().oneOf(
    GENDERS.map((gender) => gender.value),
    'Invalid gender!'
  ),
  website: Yup.string().max(64, 'Website url too long!').url('Invalid url!'),
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

export default class GeneralSection extends Component {
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
    const { values, errors, setFieldValue } = this.props.formik;
    return (
      <fieldset className="form-section">
        <legend>General Information</legend>
        <div className="form-row row">
          <AvatarInput
            name="general.avatar"
            value={values.general.avatar}
            error={errors.general && errors.general.avatar}
            supprotedFormats={AVATAR_SUPPORTED_FORMATS.join(', ')}
            onChange={setFieldValue}
          />

          <div className="form-full-name-container col">
            <TextInput
              label="First Name*"
              type="text"
              name="general.firstName"
              placeholder="Jane"
            />

            <TextInput
              label="Last Name*"
              type="text"
              name="general.lastName"
              placeholder="Doe"
            />
          </div>
        </div>

        <div className="form-row row">
          <TextInput
            label="Email address*"
            type="email"
            name="general.email"
            placeholder="jane.doe@example.com"
          />

          <TextInput
            label="Phone number*"
            type="tel"
            name="general.phone"
            placeholder="061234567"
          />
        </div>

        {this.state.showAdditionalInformation && (
          <>
            <div className="form-row row">
              <TextInput
                label="Address"
                type="text"
                name="general.address"
                placeholder="123 Main Street"
              />
            </div>

            <div className="form-row row">
              <TextInput
                label="City/Town"
                type="text"
                name="general.city"
                placeholder="New York"
              />

              <TextInput
                label="Country"
                type="text"
                name="general.country"
                placeholder="USA"
              />
            </div>

            <div className="form-row row">
              <TextInput
                label="Date of birth"
                type="date"
                name="general.dateOfBirth"
                max={this.maxDateOfBirth}
              />

              <SelectInput label="Gender" name="general.gender">
                <option value="">Select a gender</option>
                {GENDERS.map((gender, index) => (
                  <option key={index} value={gender.value}>
                    {gender.label}
                  </option>
                ))}
              </SelectInput>
            </div>

            <div className="form-row row">
              <TextInput
                label="Website"
                type="url"
                name="general.website"
                placeholder="https://janedoe.io"
              />
            </div>
          </>
        )}
        <ToggleButton
          active={this.state.showAdditionalInformation}
          activeData={{
            icon: <MdRemove />,
            label: 'Hide additional information',
          }}
          inactiveData={{
            icon: <MdOutlineAdd />,
            label: 'Show additional information',
          }}
          className="btn--secondary"
          onToggle={this.toggleAdditionalInformation}
        />
        <SectionControls handleReset={this.handleReset} />
      </fieldset>
    );
  }
}
