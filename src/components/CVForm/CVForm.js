import { Component } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import GeneralSection, {
  GeneralInitialValues,
  GeneralValidationSchema,
} from './GeneralSection';
import ObjectiveSection, {
  ObjectiveInitialValues,
  ObjectiveValidationSchema,
} from './ObjectiveSection';
import EducationSection, {
  EducationValidationSchema,
} from './EducationSection';
import WorkSection, { WorkValidationSchema } from './WorkSection';
import SkillsSection, { SkillsValidationSchema } from './SkillsSection';
import InterestsSection, {
  InterestsValidationSchema,
} from './InterestsSection';
import TraitsSection, { TraitsValidationSchema } from './TraitsSection';
import { MdBuild, MdOutlineClear } from 'react-icons/md';
import { Button } from '../buttons';

export default class CVForm extends Component {
  render() {
    return (
      <Formik
        initialValues={{
          general: GeneralInitialValues,
          ...ObjectiveInitialValues,
          education: [],
          work: [],
          skills: [],
          interests: [],
          traits: [],
        }}
        validationSchema={Yup.object().shape({
          general: Yup.object().shape(GeneralValidationSchema),
          ...ObjectiveValidationSchema,
          education: Yup.array().of(
            Yup.object().shape(EducationValidationSchema)
          ),
          work: Yup.array().of(Yup.object().shape(WorkValidationSchema)),
          skills: Yup.array().of(Yup.object().shape(SkillsValidationSchema)),
          interests: Yup.array().of(
            Yup.object().shape(InterestsValidationSchema)
          ),
          traits: Yup.array().of(Yup.object().shape(TraitsValidationSchema)),
        })}
        onSubmit={(values) => {
          alert(JSON.stringify(values, null, 2));
        }}>
        {(props) => (
          <Form className="form">
            <GeneralSection formik={props} />
            <ObjectiveSection formik={props} />
            <EducationSection formik={props} />
            <WorkSection formik={props} />
            <SkillsSection formik={props} />
            <InterestsSection formik={props} />
            <TraitsSection formik={props} />
            <div className="form-controls row">
              <Button
                data={{ icon: <MdOutlineClear />, label: 'Reset All' }}
                onClick={props.handleReset}
              />
              <Button
                type="submit"
                className="btn--primary"
                data={{ icon: <MdBuild />, label: 'Generate PDF' }}
              />
            </div>
          </Form>
        )}
      </Formik>
    );
  }
}
