'use client';

import { TextField } from '@mui/material';
import { useFormContext } from 'react-hook-form';

export default function BirthdateField() {
  const { register, formState: { errors } } = useFormContext();

  return (
    <TextField
      {...register('birthdate')}
      label="Birth Date"
      type="date"
      fullWidth
      InputLabelProps={{ shrink: true }}
      error={!!errors.birthdate}
      helperText={errors.birthdate?.message?.toString()}
    />
  );
}