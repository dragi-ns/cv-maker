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

export default class CVForm extends Component {
  render() {
    return (
      <Formik
        initialValues={{
          general: GeneralInitialValues,
          ...ObjectiveInitialValues,
        }}
        validationSchema={Yup.object().shape({
          general: Yup.object().shape(GeneralValidationSchema),
          ...ObjectiveValidationSchema,
        })}
        onSubmit={(values) => {
          alert(JSON.stringify(values, null, 2));
        }}>
        {(props) => (
          <Form className="form">
            <GeneralSection formik={props} />
            <ObjectiveSection formik={props} />
            <button type="submit">Generate PDF</button>
          </Form>
        )}
      </Formik>
    );
  }
}
