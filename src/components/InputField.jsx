import React from 'react';
import { TextField } from '@mui/material';

export function InputField({ label, name, value, onChange, required = false }) {
  return (
    <TextField
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      variant="outlined"
      fullWidth
      margin="normal"
    />
  );

}


