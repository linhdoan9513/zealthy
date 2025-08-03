'use client';

import { Box, Typography, TextField } from '@mui/material';
import { useFormContext } from 'react-hook-form';

export default function AccountCreationForm() {
  const { register, formState: { errors } } = useFormContext();

  return (
    <Box sx={{ py: 2 }}>
      <Typography variant="h5" gutterBottom>
        Create Your Account
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Please provide your information to get started.
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
          <TextField
            {...register('firstName')}
            label="First Name"
            fullWidth
            error={!!errors.firstName}
            helperText={errors.firstName?.message?.toString()}
          />

          <TextField
            {...register('lastName')}
            label="Last Name"
            fullWidth
            error={!!errors.lastName}
            helperText={errors.lastName?.message?.toString()}
          />
        </Box>

        <TextField
          {...register('email')}
          label="Email Address"
          type="email"
          fullWidth
          error={!!errors.email}
          helperText={errors.email?.message?.toString()}
        />

        <TextField
          {...register('password')}
          label="Password"
          type="password"
          fullWidth
          error={!!errors.password}
          helperText={errors.password?.message?.toString()}
        />
      </Box>
    </Box>
  );
} 