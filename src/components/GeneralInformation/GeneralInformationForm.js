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
import AvatarInput from './AvatarInput';

export default class GeneralInformationForm extends Component {
  constructor(props) {
    super(props);
    this.maxDateOfBirth = format(new Date(), 'yyyy-MM-dd');
    this.state = {
      showAdditionalInformation: false,
      locked: false,
    };

    this.toggleAdditionalInformation =
      this.toggleAdditionalInformation.bind(this);

    this.toggleLocked = this.toggleLocked.bind(this);
  }

  toggleAdditionalInformation() {
    this.setState((prevState) => {
      return {
        showAdditionalInformation: !prevState.showAdditionalInformation,
      };
    });
  }

  async toggleLocked() {
    await this.props.formik.validateForm();
    if (!this.props.formik.isValid) {
      this.props.formik.setTouched({
        ...this.props.formik.touched,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
      });
    } else {
      this.setState((prevState) => {
        return { locked: !prevState.locked };
      });
    }
  }

  render() {
    const { values, errors, setFieldValue, resetForm } = this.props.formik;
    return (
      <fieldset className="form-section">
        <legend>General Information</legend>
        <div className="form-row row">
          <AvatarInput
            locked={this.state.locked}
            name="avatar"
            value={values.avatar}
            error={errors.avatar}
            setFieldValue={setFieldValue}
          />

          <div className="form-full-name-container col">
            <TextInput
              locked={this.state.locked}
              label="First Name*"
              type="text"
              name="firstName"
              placeholder="Jane"
            />

            <TextInput
              locked={this.state.locked}
              label="Last Name*"
              type="text"
              name="lastName"
              placeholder="Doe"
            />
          </div>
        </div>

        <div className="form-row row">
          <TextInput
            locked={this.state.locked}
            label="Email address*"
            type="email"
            name="email"
            placeholder="jane.doe@example.com"
          />

          <TextInput
            locked={this.state.locked}
            label="Phone number*"
            type="tel"
            name="phone"
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
                name="address"
                placeholder="123 Main Street"
              />
            </div>

            <div className="form-row row">
              <TextInput
                locked={this.state.locked}
                label="City/Town"
                type="text"
                name="city"
                placeholder="New York"
              />

              <TextInput
                locked={this.state.locked}
                label="Country"
                type="text"
                name="country"
                placeholder="USA"
              />
            </div>

            <div className="form-row row">
              <TextInput
                locked={this.state.locked}
                label="Date of birth"
                type="date"
                name="dateOfBirth"
                max={this.maxDateOfBirth}
              />

              <SelectInput
                locked={this.state.locked}
                label="Gender"
                name="gender">
                <option value="">Select a gener</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </SelectInput>
            </div>

            <div className="form-row row">
              <TextInput
                locked={this.state.locked}
                label="Linkedin"
                type="url"
                name="linkedin"
                placeholder="https://www.linkedin.com/in/jane-doe/"
              />

              <TextInput
                locked={this.state.locked}
                label="Github"
                type="url"
                name="github"
                placeholder="https://github.com/jane-doe"
              />
            </div>

            <div className="form-row row">
              <TextInput
                locked={this.state.locked}
                label="Twitter"
                type="url"
                name="twitter"
                placeholder="https://twitter.com/jane-doe"
              />

              <TextInput
                locked={this.state.locked}
                label="Website"
                type="url"
                name="website"
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
            <button type="button" className="btn" onClick={resetForm}>
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
