import { Component } from 'react';
import { TextInput } from '../inputs';
import * as Yup from 'yup';
import ListSection from './ListSection';
import ListItemPreview from './ListItemPreview';
import SectionControls from './SectionControls';
import { toggleListItemLocked } from './helpers';

export const InterestsValidationSchema = {
  interest: Yup.string()
    .min(2, 'Interest name is too short')
    .max(64, 'Interest name is too long!')
    .required('Interest name is required!'),
};

export const InterestsInitalValues = {
  interest: '',
};

export default class InterestsSection extends Component {
  render() {
    const { formik } = this.props;

    return (
      <ListSection
        legend="Interests"
        fieldName="interests"
        field={formik.values.interests}
        formik={formik}
        initialValues={InterestsInitalValues}
        InputComponent={InterestsInputs}
        maxItems={10}
      />
    );
  }
}

class InterestsInputs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      locked: false,
    };
    this.toggleLocked = this.toggleLocked.bind(this);
    this.isInterestValid = this.isInterestValid.bind(this);
  }

  async toggleLocked() {
    const toggle = await toggleListItemLocked(
      this.props.formik,
      this.isInterestValid,
      'interests',
      this.props.index,
      { interest: true }
    );

    if (toggle) {
      this.setState((prevState) => {
        return { locked: !prevState.locked };
      });
    }
  }

  isInterestValid() {
    const { errors } = this.props.formik;
    return !errors.interests || !errors.interests[this.props.index];
  }

  render() {
    const { index, field, arrayHelpers } = this.props;

    const listItemControls = (
      <SectionControls
        isList={true}
        index={index}
        arrayHelpers={arrayHelpers}
        locked={this.state.locked}
        handleToggle={this.toggleLocked}
      />
    );
    return (
      <>
        {this.state.locked ? (
          <ListItemPreview
            title={field[index].interest}
            listItemControls={listItemControls}
          />
        ) : (
          <>
            <div className="form-row row">
              <TextInput
                label="Interest"
                type="text"
                name={`interests[${index}].interest`}
                placeholder="Football"
              />
            </div>
            {listItemControls}
          </>
        )}
      </>
    );
  }
}
