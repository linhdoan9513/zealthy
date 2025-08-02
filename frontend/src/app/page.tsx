'use client';

import { useState, useEffect } from 'react';
import { Box, Typography, Button, Container, Paper, Stepper, Step, StepLabel } from '@mui/material';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminAPI, userAPI } from '../services/api';
import { OnboardingFormData, UpdateUserRequest } from '../types';
import OnboardingStep1 from '../components/OnboardingStep1';
import OnboardingStep2 from '../components/OnboardingStep2';
import OnboardingStep3 from '../components/OnboardingStep3';

const validationSchema = yup.object({
  firstName: yup.string().optional(),
  lastName: yup.string().optional(),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  aboutMe: yup.string().optional(),
  street: yup.string().optional(),
  city: yup.string().optional(),
  state: yup.string().optional(),
  zip: yup.string().optional(),
  birthdate: yup.string().optional(),
}) as yup.ObjectSchema<OnboardingFormData>;

const steps = [
  { label: 'Account Setup', description: 'Create your account' },
  { label: 'Personal Info', description: 'Tell us about yourself' },
  { label: 'Additional Details', description: 'Complete your profile' },
];

export default function OnboardingWizard() {
  const [activeStep, setActiveStep] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Fetch onboarding configuration
  const { data: config, isLoading: configLoading, error: configError } = useQuery({
    queryKey: ['onboardingConfig'],
    queryFn: adminAPI.getOnboardingConfig,
    retry: false,
  });

  // Initialize default config if none exists
  const initializeConfigMutation = useMutation({
    mutationFn: adminAPI.initializeDefaultConfig,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['onboardingConfig'] });
    },
  });

  useEffect(() => {
    if (!config && !configLoading) {
      initializeConfigMutation.mutate();
    }
  }, [config, configLoading, initializeConfigMutation]);

  const methods = useForm<OnboardingFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      aboutMe: '',
      street: '',
      city: '',
      state: '',
      zip: '',
      birthdate: '',
    },
  });

  const createUserMutation = useMutation({
    mutationFn: userAPI.createUser,
    onSuccess: (data) => {
      setUserId(data.id);
      setActiveStep(1);
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserRequest }) => userAPI.updateUser(id, data),
    onSuccess: () => {
      if (activeStep < 2) {
        setActiveStep(activeStep + 1);
      } else {
        // Onboarding complete
        alert('Onboarding completed successfully!');
      }
    },
  });

  const onSubmit = (data: OnboardingFormData) => {
    if (activeStep === 0) {
      createUserMutation.mutate({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
      });
    } else if (userId) {
      const updateData: UpdateUserRequest = {};
      
      if (activeStep === 1 && config?.page2) {
        config.page2.forEach(comp => {
          if (comp.component === 'aboutMe') updateData.aboutMe = data.aboutMe;
          if (comp.component === 'address') {
            updateData.street = data.street;
            updateData.city = data.city;
            updateData.state = data.state;
            updateData.zip = data.zip;
          }
          if (comp.component === 'birthdate') updateData.birthdate = data.birthdate;
        });
      } else if (activeStep === 2 && config?.page3) {
        config.page3.forEach(comp => {
          if (comp.component === 'aboutMe') updateData.aboutMe = data.aboutMe;
          if (comp.component === 'address') {
            updateData.street = data.street;
            updateData.city = data.city;
            updateData.state = data.state;
            updateData.zip = data.zip;
          }
          if (comp.component === 'birthdate') updateData.birthdate = data.birthdate;
        });
      }

      updateUserMutation.mutate({ id: userId, data: updateData });
    }
  };

  const handleNext = () => {
    methods.handleSubmit(onSubmit)();
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Welcome to Zealthy
        </Typography>
        <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
          Complete your onboarding to get started
        </Typography>

        <Stepper 
          activeStep={activeStep} 
          sx={{ 
            mb: 4,
            '& .MuiStepLabel-root': {
              minWidth: 0,
            },
            '& .MuiStepLabel-label': {
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              lineHeight: { xs: 1.2, sm: 1.4 },
            },
            '& .MuiStepLabel-labelContainer': {
              paddingRight: { xs: 0.5, sm: 1 },
            }
          }}
        >
          {steps.map((step, index) => (
            <Step key={index}>
              <StepLabel>
                <Box sx={{ 
                  display: { xs: 'block', sm: 'block' },
                  textAlign: { xs: 'left', sm: 'left' }
                }}>
                  <Typography 
                    variant="body2" 
                    fontWeight="medium"
                    sx={{
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      lineHeight: { xs: 1.2, sm: 1.4 },
                    }}
                  >
                    {step.label}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    color="text.secondary"
                    sx={{
                      fontSize: { xs: '0.625rem', sm: '0.75rem' },
                      lineHeight: { xs: 1.1, sm: 1.3 },
                      display: { xs: 'block', sm: 'block' },
                    }}
                  >
                    {step.description}
                  </Typography>
                </Box>
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            {activeStep === 0 && <OnboardingStep1 />}
            {activeStep === 1 && config?.page2 && <OnboardingStep2 config={config.page2} />}
            {activeStep === 2 && config?.page3 && <OnboardingStep3 config={config.page3} />}

            <Box sx={{ display: 'flex', justifyContent: activeStep === 0 ? 'flex-end' : 'space-between', mt: 4 }}>
              {activeStep > 0 && (
                <Button
                  onClick={handleBack}
                >
                  Back
                </Button>
              )}
              <Button
                variant="contained"
                onClick={handleNext}
              >
                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </Box>
          </form>
        </FormProvider>
      </Paper>
    </Container>
  );
}
