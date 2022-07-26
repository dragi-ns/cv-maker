import { Component } from 'react';
import { TextInput } from '../inputs';
import * as Yup from 'yup';
import ListSection from './ListSection';
import ListItemPreview from './ListItemPreview';
import SectionControls from './SectionControls';
import { toggleListItemLocked } from './helpers';

export const TraitsValidationSchema = {
  trait: Yup.string()
    .min(2, 'Trait name is too short')
    .max(64, 'Trait name is too long!')
    .required('Trait name is required!'),
};

export const TraitsInitalValues = {
  trait: '',
};

export default class TraitsSection extends Component {
  render() {
    const { formik } = this.props;

    return (
      <ListSection
        legend="Traits"
        fieldName="traits"
        field={formik.values.traits}
        formik={formik}
        initialValues={TraitsInitalValues}
        InputComponent={TraitsInputs}
        maxItems={10}
      />
    );
  }
}

class TraitsInputs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      locked: false,
    };
    this.toggleLocked = this.toggleLocked.bind(this);
    this.isTraitValid = this.isTraitValid.bind(this);
  }

  async toggleLocked() {
    const toggle = await toggleListItemLocked(
      this.props.formik,
      this.isTraitValid,
      'traits',
      this.props.index,
      { trait: true }
    );

    if (toggle) {
      this.setState((prevState) => {
        return { locked: !prevState.locked };
      });
    }
  }

  isTraitValid() {
    const { errors } = this.props.formik;
    return !errors.traits || !errors.traits[this.props.index];
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
            title={field[index].trait}
            listItemControls={listItemControls}
          />
        ) : (
          <>
            <div className="form-row row">
              <TextInput
                label="Trait"
                type="text"
                name={`traits[${index}].trait`}
                placeholder="Technologically competent"
              />
            </div>
            {listItemControls}
          </>
        )}
      </>
    );
  }
}
