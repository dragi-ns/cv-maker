import { Component } from 'react';
import { format } from 'date-fns';
import {
  MdLockOutline,
  MdLockOpen,
  MdOutlineClear,
  MdOutlineAdd,
  MdRemove,
} from 'react-icons/md';
import TextInput from '../inputs/TextInput';
import SelectInput from '../inputs/SelectInput';
import AvatarInput from '../inputs/AvatarInput';
import GeneralInformationInitialValues from './GeneralInformationIntitialValues';

export default class GeneralInformationForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAdditionalInformation: false,
      locked: false,
    };
    this.maxDateOfBirth = format(new Date(), 'yyyy-MM-dd');
    this.toggleAdditionalInformation =
      this.toggleAdditionalInformation.bind(this);
    this.toggleLocked = this.toggleLocked.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  toggleAdditionalInformation() {
    this.setState((prevState) => {
      return {
        showAdditionalInformation: !prevState.showAdditionalInformation,
      };
    });
  }

  async toggleLocked() {
    const { validateForm, setTouched, ...formik } = this.props.formik;
    await validateForm();
    if (!this.isGeneralValid()) {
      setTouched({
        ...formik.touched,
        general: {
          ...formik.touched.general,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
        },
      });
    } else {
      this.setState((prevState) => {
        return { locked: !prevState.locked };
      });
    }
  }

  isGeneralValid() {
    return !this.props.formik.errors.general;
  }

  handleReset() {
    const { values, errors, touched, resetForm } = this.props.formik;
    resetForm({
      ...this.props.formik,
      values: { ...values, general: GeneralInformationInitialValues },
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
            locked={this.state.locked}
            value={values.general.avatar}
            error={errors.general && errors.general.avatar}
            onChange={setFieldValue}
          />

          <div className="form-full-name-container col">
            <TextInput
              locked={this.state.locked}
              label="First Name*"
              type="text"
              name="general.firstName"
              placeholder="Jane"
            />

            <TextInput
              locked={this.state.locked}
              label="Last Name*"
              type="text"
              name="general.lastName"
              placeholder="Doe"
            />
          </div>
        </div>

        <div className="form-row row">
          <TextInput
            locked={this.state.locked}
            label="Email address*"
            type="email"
            name="general.email"
            placeholder="jane.doe@example.com"
          />

          <TextInput
            locked={this.state.locked}
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
                locked={this.state.locked}
                label="Address"
                type="text"
                name="general.address"
                placeholder="123 Main Street"
              />
            </div>

            <div className="form-row row">
              <TextInput
                locked={this.state.locked}
                label="City/Town"
                type="text"
                name="general.city"
                placeholder="New York"
              />

              <TextInput
                locked={this.state.locked}
                label="Country"
                type="text"
                name="general.country"
                placeholder="USA"
              />
            </div>

            <div className="form-row row">
              <TextInput
                locked={this.state.locked}
                label="Date of birth"
                type="date"
                name="general.dateOfBirth"
                max={this.maxDateOfBirth}
              />

              <SelectInput
                locked={this.state.locked}
                label="Gender"
                name="general.gender">
                <option value="">Select a gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </SelectInput>
            </div>

            <div className="form-row row">
              <TextInput
                locked={this.state.locked}
                label="Linkedin"
                type="url"
                name="general.linkedin"
                placeholder="https://www.linkedin.com/in/jane-doe/"
              />

              <TextInput
                locked={this.state.locked}
                label="Github"
                type="url"
                name="genral.github"
                placeholder="https://github.com/jane-doe"
              />
            </div>

            <div className="form-row row">
              <TextInput
                locked={this.state.locked}
                label="Twitter"
                type="url"
                name="general.twitter"
                placeholder="https://twitter.com/jane-doe"
              />

              <TextInput
                locked={this.state.locked}
                label="Website"
                type="url"
                name="general.website"
                placeholder="https://janedoe.io"
              />
            </div>
          </>
        )}
        <button
          type="button"
          className="btn btn--secondary"
          onClick={this.toggleAdditionalInformation}>
          {this.state.showAdditionalInformation ? (
            <>
              <span>
                <MdRemove />
              </span>
              <span>Hide Additional information</span>
            </>
          ) : (
            <>
              <span>
                <MdOutlineAdd />
              </span>
              <span>Show Additional information</span>
            </>
          )}
        </button>
        <div className="section-controls row">
          {!this.state.locked && (
            <button type="button" className="btn" onClick={this.handleReset}>
              <span>
                <MdOutlineClear />
              </span>
              <span>Reset</span>
            </button>
          )}
          <button type="button" className="btn" onClick={this.toggleLocked}>
            {this.state.locked ? (
              <>
                <span>
                  <MdLockOpen />
                </span>
                <span>Unlock</span>
              </>
            ) : (
              <>
                <span>
                  <MdLockOutline />
                </span>
                <span>Lock</span>
              </>
            )}
          </button>
        </div>
      </fieldset>
    );
  }
}
