import * as Yup from 'yup';

export const MAX_LENGTH = 256;

const ObjectiveSchema = {
  objective: Yup.object().test(
    'max length',
    'Description is too long!',
    (value) => {
      return value.getCurrentContent().getPlainText('').length < MAX_LENGTH + 1;
    }
  ),
};

export default ObjectiveSchema;
