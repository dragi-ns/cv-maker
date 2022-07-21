import * as Yup from 'yup';

const PHONE_REGEX = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
const GENDERS = ['male', 'female'];

const generateUrlRegex = (name) => {
  return new RegExp(
    `^(http://www.|https://www.|http://|https://)?[a-z0-9]*([-.]?${name}+).[a-z]{2,5}(:[0-9]{1,5})?(/.*)?$`
  );
};

export const AVATAR_SUPPORTED_FORMATS = [
  'image/jpg',
  'image/jpeg',
  'image/gif',
  'image/png',
];

const GeneralInformationSchema = Yup.object().shape({
  avatar: Yup.mixed().test('fileFormat', 'Unsupported file type!', (value) => {
    if (value && value.type) {
      return AVATAR_SUPPORTED_FORMATS.includes(value.type);
    }
    return true;
  }),
  firstName: Yup.string()
    .min(2, 'First name is too short!')
    .max(50, 'First name is too long!')
    .required('First name is required!'),
  lastName: Yup.string()
    .min(2, 'Last name is too short!')
    .max(50, 'Last name is too long!')
    .required('Last name is required!'),
  email: Yup.string()
    .email('Invalid email address!')
    .max(64, 'Email address is too long!')
    .required('Email address is required!'),
  phone: Yup.string()
    .matches(PHONE_REGEX, 'Invalid phone number!')
    .required('Phone number is required!'),
  address: Yup.string().max(64, 'Address is too long!'),
  city: Yup.string().max(64, 'City name is too long!'),
  country: Yup.string().max(64, 'Country name is too long!'),
  dateOfBirth: Yup.date().max(
    new Date(),
    'Date of birth cannot be in the future!'
  ),
  gender: Yup.string().oneOf(GENDERS, 'Invalid gender!'),
  linkedin: Yup.string()
    .max(64, 'Linkedin url too long!')
    .matches(generateUrlRegex('linkedin'), 'Invalid linkedin url!'),
  github: Yup.string()
    .max(64, 'Github link too long!')
    .matches(generateUrlRegex('github'), 'Invalid github url!'),
  twitter: Yup.string()
    .max(64, 'Twitter url too long!')
    .matches(generateUrlRegex('twitter'), 'Invalid twitter url!'),
  website: Yup.string().max(64, 'Website url too long!').url('Invalid url!'),
});

export default GeneralInformationSchema;
