import { Component } from 'react';
import { Formik, Form } from 'formik';
import {
  GeneralInformation,
  GeneralInformationSchema,
  GeneralInformationInitialValues,
} from './GeneralInformation';

export default class Main extends Component {
  render() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return (
      <main>
        <Formik
          initialValues={GeneralInformationInitialValues}
          validationSchema={GeneralInformationSchema}
          onSubmit={(values) => {
            alert(JSON.stringify(values, null, 2));
          }}>
          {(props) => (
            <Form className="form">
              <GeneralInformation formik={props} />
              <button type="submit">Generate PDF</button>
            </Form>
          )}
        </Formik>
      </main>
    );
  }
}
