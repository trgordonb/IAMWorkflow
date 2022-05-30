import React, { memo } from 'react';
import { FormGroup, Label, FormMessage } from '@adminjs/design-system';
import DatePicker, {
  Calendar,
  Day,
  utils,
} from 'react-modern-calendar-datepicker';


const pad = (n) => (n < 10 ? `0${n.toString()}` : n.toString());

const format = (date) =>
  `${date.year}-${pad(date.month)}-${pad(date.day)}`;

const dateStringToDay = (date) => {
  const [year, month, day] = date.split('-').map((value) => Number(value));
  return { day, month, year };
};

const DateControl = (props) => {
  const { value, onChange, property, record, ...other } = props;
  console.log(property)
  const dayValue = record.params && record.params[property.propertyPath];
  const day = dayValue ? dateStringToDay(dayValue) : '';

  const error = record.errors && record.errors[property.propertyPath];
  const onDatePickerChange = (day) => {
    onChange(property.propertyPath, format(day));
  };

  return (
    // eslint-disable-next-line react/jsx-filename-extension
    <FormGroup error={!!error}>
      <Label htmlFor={property.propertyPath}>{property.label}</Label>
      <DatePicker
        value={day}
        inputPlaceholder="Select a day"
        shouldHighlightWeekends
        onChange={(day) => onChange(property.propertyPath, format(day))}
        {...other}
      />
      <FormMessage>{error && error.message}</FormMessage>
    </FormGroup>
  );
};

export default DateControl;