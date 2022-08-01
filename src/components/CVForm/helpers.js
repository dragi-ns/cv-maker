import { format } from 'date-fns';
import { enUS as en, srLatn as sr } from 'date-fns/locale';

export function formatDate(date, dateFormat = 'dd.MM.yyyy.', lang = 'en') {
  const locale = lang === 'en' ? en : sr;
  if (!date) {
    return 'date.ongoing';
  }
  return format(new Date(date), dateFormat, { locale });
}

export function formatPeriod(startDate, endDate, lang = 'en') {
  let formatedEndDate = 'date.ongoing';
  if (endDate) {
    formatedEndDate = formatDate(endDate, 'MMM yyyy', lang);
  }
  return [formatDate(startDate, 'MMM yyyy', lang), formatedEndDate];
}

export async function toggleListItemLocked(
  formik,
  isSectionValid,
  fieldName,
  index,
  newTouched
) {
  const { validateForm, setTouched, ...formikOther } = formik;
  await validateForm();
  if (!isSectionValid()) {
    const oldField = formikOther.touched[fieldName];
    const newField = oldField ? [...oldField] : [];
    const oldTouched = newField[index];
    if (oldTouched) {
      newField[index] = {
        ...oldTouched,
        ...newTouched,
      };
    } else {
      newField[index] = { ...newTouched };
    }

    setTouched({
      ...formikOther.touched,
      [fieldName]: newField,
    });
    return false;
  }
  return true;
}
