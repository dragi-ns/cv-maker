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
import { withTranslation } from 'react-i18next';
import demoInitialValues from './demoInitialValues';

class CVForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadDemo: false,
    };
  }

  render() {
    const { t } = this.props;
    return (
      <Formik
        enableReinitialize={true}
        initialValues={
          this.state.loadDemo
            ? demoInitialValues
            : {
                general: GeneralInitialValues,
                ...ObjectiveInitialValues,
                education: [],
                work: [],
                skills: [],
                interests: [],
                traits: [],
              }
        }
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
        onSubmit={async (values) => {
          if (values.general.avatar) {
            const avatarBase64 = await new Promise((resolve, _) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result);
              reader.readAsDataURL(values.general.avatar);
            });
            return await this.props.onSubmit({
              ...values,
              general: { ...values.general, avatar: avatarBase64 },
            });
          }
          return await this.props.onSubmit(values);
        }}>
        {(props) => (
          <Form className="form">
            <Button
              className="load-demo-data"
              data={{ label: 'Load demo data' }}
              onClick={() => this.setState({ loadDemo: true })}
            />
            <GeneralSection formik={props} />
            <ObjectiveSection formik={props} />
            <EducationSection formik={props} />
            <WorkSection formik={props} />
            <SkillsSection formik={props} />
            <InterestsSection formik={props} />
            <TraitsSection formik={props} />
            <div className="form-controls row">
              <Button
                data={{ icon: <MdOutlineClear />, label: t('resetAll') }}
                onClick={() => {
                  this.setState({ loadDemo: false });
                  props.handleReset();
                }}
              />
              <Button
                type="submit"
                className="btn--primary"
                disabled={props.isSubmitting}
                data={{
                  icon: <MdBuild />,
                  label: props.isSubmitting
                    ? t('generatingPdf')
                    : t('generatePdf'),
                }}
              />
            </div>
          </Form>
        )}
      </Formik>
    );
  }
}

export default withTranslation('form')(CVForm);
