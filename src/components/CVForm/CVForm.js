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

export default class CVForm extends Component {
  render() {
    return (
      <Formik
        initialValues={{
          general: GeneralInitialValues,
          ...ObjectiveInitialValues,
          education: [],
          work: [],
        }}
        validationSchema={Yup.object().shape({
          general: Yup.object().shape(GeneralValidationSchema),
          ...ObjectiveValidationSchema,
          education: Yup.array().of(
            Yup.object().shape(EducationValidationSchema)
          ),
          work: Yup.array().of(Yup.object().shape(WorkValidationSchema)),
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
            <button type="submit">Generate PDF</button>
          </Form>
        )}
      </Formik>
    );
  }
}
