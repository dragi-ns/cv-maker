import { Component } from 'react';
import { TextInput, SelectInput } from '../inputs';
import * as Yup from 'yup';
import ListSection from './ListSection';
import ListItemPreview from './ListItemPreview';
import SectionControls from './SectionControls';
import { toggleListItemLocked } from './helpers';
import { withTranslation } from 'react-i18next';

class SkillsSection extends Component {
  render() {
    const { t, formik } = this.props;

    return (
      <ListSection
        legend={t('skills.title')}
        addLabel={t('skills.addLabel')}
        emptyLabel={t('skills.emptyLabel')}
        fieldName="skills"
        field={formik.values.skills}
        formik={formik}
        initialValues={SkillsInitalValues}
        InputComponent={SkillsInputsTranslated}
        maxItems={10}
      />
    );
  }
}

export default withTranslation('form')(SkillsSection);

class SkillsInputs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      locked: false,
    };
    this.toggleLocked = this.toggleLocked.bind(this);
    this.isSkillValid = this.isSkillValid.bind(this);
  }

  async toggleLocked() {
    const toggle = await toggleListItemLocked(
      this.props.formik,
      this.isSkillValid,
      'skills',
      this.props.index,
      { skill: true, level: true }
    );

    if (toggle) {
      this.setState((prevState) => {
        return { locked: !prevState.locked };
      });
    }
  }

  isSkillValid() {
    const { errors } = this.props.formik;
    return !errors.skills || !errors.skills[this.props.index];
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
            title={field[index].skill}
            subtitle={t(
              LEVELS.find((level) => level.value === field[index].level).label
            )}
            listItemControls={listItemControls}
          />
        ) : (
          <>
            <div className="form-row row">
              <TextInput
                label={t('skills.skill.label')}
                type="text"
                name={`skills[${index}].skill`}
                placeholder={t('skills.skill.placeholder')}
                getFieldProps={getFieldProps}
                getFieldMeta={getFieldMeta}
              />
              <SelectInput
                label={t('skills.level.label')}
                name={`skills[${index}].level`}
                getFieldProps={getFieldProps}
                getFieldMeta={getFieldMeta}>
                <option value="">{t('skills.level.placeholder')}</option>
                {LEVELS.map((level, levelIndex) => (
                  <option key={levelIndex} value={level.value}>
                    {t(level.label)}
                  </option>
                ))}
              </SelectInput>
            </div>
            {listItemControls}
          </>
        )}
      </>
    );
  }
}

const SkillsInputsTranslated = withTranslation('form')(SkillsInputs);

export const LEVELS = [
  { value: 'beginner', label: 'skills.level.beginner' },
  { value: 'intermediate', label: 'skills.level.intermediate' },
  { value: 'skilful', label: 'skills.level.skilful' },
  { value: 'experienced', label: 'skills.level.experienced' },
  { value: 'expert', label: 'skills.level.expert' },
];

export const SkillsValidationSchema = {
  skill: Yup.string()
    .min(2, 'skills.skill.error.tooShort')
    .max(64, 'skills.skill.error.tooLong')
    .required('skills.skill.error.required'),
  level: Yup.string()
    .oneOf(
      LEVELS.map((level) => level.value),
      'skills.level.error.invalid'
    )
    .required('skills.level.error.required'),
};

export const SkillsInitalValues = {
  skill: '',
  level: '',
};
