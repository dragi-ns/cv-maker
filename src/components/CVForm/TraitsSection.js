import { Component } from 'react';
import { TextInput } from '../inputs';
import * as Yup from 'yup';
import ListSection from './ListSection';
import ListItemPreview from './ListItemPreview';
import SectionControls from './SectionControls';
import { toggleListItemLocked } from './helpers';
import { withTranslation } from 'react-i18next';

class TraitsSection extends Component {
  render() {
    const { t, formik } = this.props;

    return (
      <ListSection
        legend={t('traits.title')}
        addLabel={t('traits.addLabel')}
        emptyLabel={t('traits.emptyLabel')}
        fieldName="traits"
        field={formik.values.traits}
        formik={formik}
        initialValues={TraitsInitalValues}
        InputComponent={TraitsInputsTranslated}
        maxItems={10}
      />
    );
  }
}

export default withTranslation('form')(TraitsSection);

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
    const { t, index, field, arrayHelpers } = this.props;
    const { getFieldProps, getFieldMeta } = this.props.formik;

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
                label={t('traits.trait.label')}
                type="text"
                name={`traits[${index}].trait`}
                placeholder={t('traits.trait.placeholder')}
                getFieldProps={getFieldProps}
                getFieldMeta={getFieldMeta}
              />
            </div>
            {listItemControls}
          </>
        )}
      </>
    );
  }
}

const TraitsInputsTranslated = withTranslation('form')(TraitsInputs);

export const TraitsValidationSchema = {
  trait: Yup.string()
    .min(2, 'traits.trait.error.tooShort')
    .max(64, 'traits.trait.error.tooLong')
    .required('traits.trait.error.required'),
};

export const TraitsInitalValues = {
  trait: '',
};
