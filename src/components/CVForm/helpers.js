import { format } from 'date-fns';

export function formatPeriod(startDate, endDate) {
  let formatedEndDate = 'Present';
  if (endDate) {
    formatedEndDate = format(new Date(endDate), 'MMM yyyy');
  }
  return `${format(new Date(startDate), 'MMM yyyy')} - ${formatedEndDate}`;
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
