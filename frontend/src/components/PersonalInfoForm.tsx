'use client';

import { Box, Typography } from '@mui/material';
import { OnboardingConfig } from '@/types';
import DynamicFormRenderer from './DynamicFormRenderer';

interface PersonalInfoFormProps {
  config: OnboardingConfig[];
}

export default function PersonalInfoForm({ config }: PersonalInfoFormProps) {
  return (
    <Box sx={{ py: 2 }}>
      <Typography variant="h5" gutterBottom>
        Personal Information
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Please provide the following information to complete your profile.
      </Typography>

      <DynamicFormRenderer config={config} />
    </Box>
  );
} 