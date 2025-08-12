'use client';

import { TextField } from '@mui/material';
import { useFormContext } from 'react-hook-form';

export default function AboutMeField() {
  const { register, formState: { errors } } = useFormContext();

  return (
    <TextField
      {...register('aboutMe')}
      label="About Me"
      multiline
      rows={4}
      fullWidth
      placeholder="Tell us about yourself..."
      error={!!errors.aboutMe}
      helperText={errors.aboutMe?.message?.toString()}
    />
  );
}