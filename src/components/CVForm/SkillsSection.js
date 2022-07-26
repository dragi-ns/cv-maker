import { Component } from 'react';
import { TextInput, SelectInput } from '../inputs';
import * as Yup from 'yup';
import ListSection from './ListSection';
import ListItemPreview from './ListItemPreview';
import SectionControls from './SectionControls';
import { toggleListItemLocked } from './helpers';

const LEVELS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'skilful', label: 'Skilful' },
  { value: 'experienced', label: 'Experienced' },
  { value: 'Expert', label: 'Expert' },
];

export const SkillsValidationSchema = {
  skill: Yup.string()
    .min(2, 'Skill name is too short')
    .max(64, 'Skill name is too long!')
    .required('Skill name is required!'),
  level: Yup.string()
    .oneOf(
      LEVELS.map((level) => level.value),
      'Invalid skill level!'
    )
    .required('Skill level is required!'),
};

export const SkillsInitalValues = {
  skill: '',
  level: '',
};

export default class SkillsSection extends Component {
  render() {
    const { formik } = this.props;

    return (
      <ListSection
        legend="Skills"
        fieldName="skills"
        field={formik.values.skills}
        formik={formik}
        initialValues={SkillsInitalValues}
        InputComponent={SkillsInputs}
        maxItems={10}
      />
    );
  }
}

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
            title={field[index].skill}
            subtitle={
              LEVELS.find((level) => level.value === field[index].level).label
            }
            listItemControls={listItemControls}
          />
        ) : (
          <>
            <div className="form-row row">
              <TextInput
                label="Skill"
                type="text"
                name={`skills[${index}].skill`}
                placeholder="MS Word"
              />
              <SelectInput label="Level" name={`skills[${index}].level`}>
                <option value="">Select a level</option>
                {LEVELS.map((level, levelIndex) => (
                  <option key={levelIndex} value={level.value}>
                    {level.label}
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
