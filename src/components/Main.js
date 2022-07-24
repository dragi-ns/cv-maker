import { Component } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import {
  GeneralInformation,
  GeneralInformationSchema,
  GeneralInformationInitialValues,
} from './GeneralInformation';
import { Objective, ObjectiveSchema, ObjectiveIntialValues } from './Objective';

export default class Main extends Component {
  render() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return (
      <main>
        <Formik
          initialValues={{
            ...GeneralInformationInitialValues,
            ...ObjectiveIntialValues,
          }}
          validationSchema={Yup.object().shape({
            ...GeneralInformationSchema,
            ...ObjectiveSchema,
          })}
          onSubmit={(values) => {
            alert(JSON.stringify(values, null, 2));
          }}>
          {(props) => (
            <Form className="form">
              <GeneralInformation formik={props} />
              <Objective formik={props} />
              <button type="submit">Generate PDF</button>
            </Form>
          )}
        </Formik>
      </main>
    );
  }
}
