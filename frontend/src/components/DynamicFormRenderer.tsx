'use client';

import { Box } from '@mui/material';
import { OnboardingConfig } from '@/types';
import AboutMeField from './fields/AboutMeField';
import AddressField from './fields/AddressField';
import BirthdateField from './fields/BirthdateField';

interface DynamicFormRendererProps {
  config: OnboardingConfig[];
}

export default function DynamicFormRenderer({ config }: DynamicFormRendererProps) {
  const renderComponent = (component: OnboardingConfig) => {
    switch (component.component) {
      case 'aboutMe':
        return <AboutMeField key={component.id} />;
      case 'address':
        return <AddressField key={component.id} />;
      case 'birthdate':
        return <BirthdateField key={component.id} />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {config.map((component) => (
        <Box key={component.id}>
          {renderComponent(component)}
        </Box>
      ))}
    </Box>
  );
}