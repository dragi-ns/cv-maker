import { Component } from 'react';
import { TextInput } from '../inputs';
import * as Yup from 'yup';
import ListSection from './ListSection';
import ListItemPreview from './ListItemPreview';
import SectionControls from './SectionControls';
import { toggleListItemLocked } from './helpers';
import { withTranslation } from 'react-i18next';

class InterestsSection extends Component {
  render() {
    const { t, formik } = this.props;

    return (
      <ListSection
        legend={t('interests.title')}
        addLabel={t('interests.addLabel')}
        emptyLabel={t('interests.emptyLabel')}
        fieldName="interests"
        field={formik.values.interests}
        formik={formik}
        initialValues={InterestsInitalValues}
        InputComponent={InterestsInputsTranslated}
        maxItems={10}
      />
    );
  }
}

export default withTranslation('form')(InterestsSection);

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
            title={field[index].interest}
            listItemControls={listItemControls}
          />
        ) : (
          <>
            <div className="form-row row">
              <TextInput
                label={t('interests.interest.label')}
                type="text"
                name={`interests[${index}].interest`}
                placeholder={t('interests.interest.placeholder')}
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

const InterestsInputsTranslated = withTranslation('form')(InterestsInputs);

export const InterestsValidationSchema = {
  interest: Yup.string()
    .min(2, 'interests.interest.error.tooShort')
    .max(64, 'interests.interest.error.tooLong')
    .required('interests.interest.error.required'),
};

export const InterestsInitalValues = {
  interest: '',
};
