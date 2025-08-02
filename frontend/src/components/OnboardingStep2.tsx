'use client';

import { Box, Typography, TextField } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { OnboardingConfig } from '@/types';

interface OnboardingStep2Props {
  config: OnboardingConfig[];
}

export default function OnboardingStep2({ config }: OnboardingStep2Props) {
  const { register, formState: { errors } } = useFormContext();

  const renderComponent = (component: OnboardingConfig) => {
    switch (component.component) {
      case 'aboutMe':
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

      case 'address':
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

      case 'birthdate':
        return (
          <TextField
            {...register('birthdate')}
            label="Birth Date"
            type="date"
            fullWidth
            error={!!errors.birthdate}
            helperText={errors.birthdate?.message?.toString()}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ py: 2 }}>
      <Typography variant="h5" gutterBottom>
        Personal Information
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Please provide the following information to complete your profile.
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {config.map((component) => (
          <Box key={component.id}>
            {renderComponent(component)}
          </Box>
        ))}
      </Box>
    </Box>
  );
} 