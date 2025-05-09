import React from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface DatePickerProps {
  selected: Date | null;
  onChange: (date: Date | null) => void;
  name: string;
  id?: string;
  placeholder?: string;
  hasError?: boolean;
  className?: string;
  maxDate?: Date;
  minDate?: Date;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  selected,
  onChange,
  name,
  id = name,
  placeholder = 'Select date',
  hasError = false,
  className = '',
  maxDate,
  minDate,
}) => {
  return (
    <ReactDatePicker
      selected={selected}
      onChange={onChange}
      name={name}
      id={id}
      placeholderText={placeholder}
      className={`w-full px-3 py-2 border ${
        hasError ? 'border-red-500' : 'border-gray-300'
      } rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${className}`}
      dateFormat="yyyy-MM-dd"
      maxDate={maxDate}
      minDate={minDate}
      isClearable
      showMonthDropdown
      showYearDropdown
      dropdownMode="select"
    />
  );
}; 