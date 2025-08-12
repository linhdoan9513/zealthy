'use client';

import { useState, useEffect } from 'react';
import { Box, Typography, Button, Container, Paper, Stepper, Step, StepLabel } from '@mui/material';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminAPI, userAPI } from '../services/api';
import { OnboardingFormData, UpdateUserRequest } from '../types';
import AccountCreationForm from '../components/AccountCreationForm';
import PersonalInfoForm from '../components/PersonalInfoForm';
import AdditionalDetailsForm from '../components/AdditionalDetailsForm';
import { WIZARD_STEPS, getStepByIndex, isLastStep } from '../config/wizardConfig';
import { mapConfigToUpdateData } from '../utils/fieldMapper';
import styles from './page.module.css';

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


export default function OnboardingWizard() {
  const [activeStep, setActiveStep] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Fetch onboarding configuration
  const { data: config, isLoading: configLoading } = useQuery({
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
      if (!isLastStep(activeStep)) {
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
      const currentStep = getStepByIndex(activeStep);
      if (currentStep?.configKey && config?.[currentStep.configKey]) {
        const updateData = mapConfigToUpdateData(config[currentStep.configKey], data);
        updateUserMutation.mutate({ id: userId, data: updateData });
      }
    }
  };

  const handleNext = () => {
    methods.handleSubmit(onSubmit)();
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  return (
    <Container maxWidth="md" className={styles.container}>
      <Paper elevation={0} className={styles.paper}>
        <Typography variant="h4" component="h1" className={styles.title}>
          Welcome to Zealthy
        </Typography>
        <Typography variant="body1" className={styles.subtitle}>
          Complete your onboarding to get started
        </Typography>

        <Stepper 
          activeStep={activeStep} 
          className={styles.stepper}
        >
          {WIZARD_STEPS.map((step) => (
            <Step key={step.id}>
              <StepLabel className={styles.stepperLabel}>
                <Box>
                  <Typography 
                    variant="body2" 
                    className={styles.stepperLabelText}
                  >
                    {step.label}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    className={styles.stepperDescription}
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
            {(() => {
              const currentStep = getStepByIndex(activeStep);
              if (!currentStep) return null;

              switch (currentStep.component) {
                case 'AccountCreationForm':
                  return <AccountCreationForm />;
                case 'PersonalInfoForm':
                  return currentStep.configKey && config?.[currentStep.configKey] ? (
                    <PersonalInfoForm config={config[currentStep.configKey]} />
                  ) : null;
                case 'AdditionalDetailsForm':
                  return currentStep.configKey && config?.[currentStep.configKey] ? (
                    <AdditionalDetailsForm config={config[currentStep.configKey]} />
                  ) : null;
                default:
                  return null;
              }
            })()}

            <Box className={activeStep === 0 ? styles.buttonContainerFirstStep : styles.buttonContainer}>
              {activeStep > 0 && (
                <Button
                  onClick={handleBack}
                  className={styles.backButton}
                >
                  Back
                </Button>
              )}
              <Button
                variant="contained"
                onClick={handleNext}
                className={styles.nextButton}
              >
                {isLastStep(activeStep) ? 'Finish' : 'Next'}
              </Button>
            </Box>
          </form>
        </FormProvider>
      </Paper>
    </Container>
  );
}
