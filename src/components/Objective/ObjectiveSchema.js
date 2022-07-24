import * as Yup from 'yup';

const ObjectiveSchema = {
  objective: Yup.object().test(
    'max length',
    'Description is too long!',
    (value) => {
      return value.getCurrentContent().getPlainText('').length < 257;
    }
  ),
};

export default ObjectiveSchema;
