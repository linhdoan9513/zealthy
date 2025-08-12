'use client';

import { Box, TextField } from '@mui/material';
import { useFormContext } from 'react-hook-form';

export default function AddressField() {
  const { register, formState: { errors } } = useFormContext();

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
      <TextField
        {...register('street')}
        label="Street Address"
        fullWidth
        error={!!errors.street}
        helperText={errors.street?.message?.toString()}
      />
      <TextField
        {...register('city')}
        label="City"
        fullWidth
        error={!!errors.city}
        helperText={errors.city?.message?.toString()}
      />
      <TextField
        {...register('state')}
        label="State"
        fullWidth
        error={!!errors.state}
        helperText={errors.state?.message?.toString()}
      />
      <TextField
        {...register('zip')}
        label="ZIP Code"
        fullWidth
        error={!!errors.zip}
        helperText={errors.zip?.message?.toString()}
      />
    </Box>
  );
}