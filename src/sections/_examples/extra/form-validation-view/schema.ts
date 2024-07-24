import * as Yup from 'yup';

// ----------------------------------------------------------------------

export const FormSchema = Yup.object().shape({
  fullName: Yup.string()
    .required('Full name is required')
    .min(6, 'Mininum 6 characters')
    .max(32, 'Maximum 32 characters'),
  email: Yup.string().required('Email is required').email('Email must be a valid email address'),
  age: Yup.number()
    .required('Age is required')
    .moreThan(18, 'Age must be between 18 and 100')
    .lessThan(100, 'Age must be between 18 and 100'),
  //
  startDate: Yup.mixed<any>().nullable().required('Start date is required'),
  endDate: Yup.mixed<any>()
    .required('End date is required')
    .test(
      'date-min',
      'End date must be later than start date',
      (value, { parent }) => value.getTime() > parent.startDate.getTime()
    ),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password should be of minimum 6 characters length'),
  confirmPassword: Yup.string()
    .required('Confirm password is required')
    .oneOf([Yup.ref('password')], "Password's not match"),
  //
  slider: Yup.number().required('Slider is required').min(10, 'Mininum value is >= 10'),
  sliderRange: Yup.mixed()
    .required('Slider range is is required')
    .test('min', 'Range must be between 20 and 80', (value: any) => value[0] >= 20)
    .test('max', 'Range must be between 20 and 80', (value: any) => value[1] <= 80),
  //
  singleUpload: Yup.mixed<any>().nullable().required('Single upload is required'),
  multiUpload: Yup.array().min(2, 'Must have at least 2 items'),
  //
  checkbox: Yup.boolean().oneOf([true], 'Checkbox is required'),
  multiCheckbox: Yup.array().min(1, 'Choose at least one option'),
  //
  singleSelect: Yup.string().required('Single select is required'),
  multiSelect: Yup.array().min(2, 'Must have at least 2 items'),
  //
  switch: Yup.boolean().oneOf([true], 'Switch is required'),
  radioGroup: Yup.string().required('Choose at least one option'),
  editor: Yup.string().required('Editor is required'),
  autocomplete: Yup.mixed<any>().nullable().required('Autocomplete is required'),
});
