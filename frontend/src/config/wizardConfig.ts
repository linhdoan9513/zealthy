export interface WizardStep {
  id: number;
  label: string;
  description: string;
  component: 'AccountCreationForm' | 'PersonalInfoForm' | 'AdditionalDetailsForm';
  configKey?: 'page2' | 'page3';
}

export const WIZARD_STEPS: WizardStep[] = [
  {
    id: 0,
    label: 'Account Setup',
    description: 'Create your account',
    component: 'AccountCreationForm',
  },
  {
    id: 1,
    label: 'Personal Info',
    description: 'Tell us about yourself',
    component: 'PersonalInfoForm',
    configKey: 'page2',
  },
  {
    id: 2,
    label: 'Additional Details',
    description: 'Complete your profile',
    component: 'AdditionalDetailsForm',
    configKey: 'page3',
  },
];

export const getStepByIndex = (index: number): WizardStep | undefined => {
  return WIZARD_STEPS.find(step => step.id === index);
};

export const isLastStep = (stepIndex: number): boolean => {
  return stepIndex === WIZARD_STEPS.length - 1;
};