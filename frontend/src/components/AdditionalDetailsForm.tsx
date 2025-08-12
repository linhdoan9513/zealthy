'use client';

import { Box, Typography } from '@mui/material';
import { OnboardingConfig } from '@/types';
import DynamicFormRenderer from './DynamicFormRenderer';

interface AdditionalDetailsFormProps {
  config: OnboardingConfig[];
}

export default function AdditionalDetailsForm({ config }: AdditionalDetailsFormProps) {
  return (
    <Box sx={{ py: 2 }}>
      <Typography variant="h5" gutterBottom>
        Additional Details
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Please provide any additional information to complete your profile.
      </Typography>

      <DynamicFormRenderer config={config} />
    </Box>
  );
} 