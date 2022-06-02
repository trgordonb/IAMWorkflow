import React from 'react';
import { FormGroup, Label, FormMessage, Box } from '@adminjs/design-system';
import DatePicker from 'react-modern-calendar-datepicker';
import moment from 'moment'

const pad = (n) => (n < 10 ? `0${n.toString()}` : n.toString());

const format = (date) =>
  `${date.year}-${pad(date.month)}-${pad(date.day)}`;

const dateStringToDay = (date) => {
  if (date) {
    const [year, month, day] = date.split('T')[0].split('-').map((value) => Number(value))
    return { day, month, year }
  } else {
    date = moment()
    const year = date.year()
    const month = date.month() + 1
    const day = date.date()
    return { day, month, year }
  }
};

const DateControl = (props) => {
  const { value, onChange, property, record, ...other } = props;
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
      <Box style={{ position:"relative", zIndex:"999" }}>
        <DatePicker
          value={day}
          inputPlaceholder="Select a day"
          shouldHighlightWeekends
          onChange={(day) => onChange(property.propertyPath, format(day))}
          {...other}
        />
      </Box>
      <FormMessage>{error && error.message}</FormMessage>
    </FormGroup>
  );
};

export default DateControl;