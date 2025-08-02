// User types
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  aboutMe?: string;
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  birthdate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  aboutMe?: string;
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  birthdate?: string;
}

// Onboarding configuration types
export interface OnboardingConfig {
  id: string;
  page: number;
  component: 'aboutMe' | 'address' | 'birthdate';
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateConfigRequest {
  page: number;
  components: Array<{
    component: 'aboutMe' | 'address' | 'birthdate';
    order: number;
  }>;
}

// Component types
export type OnboardingComponent = 'aboutMe' | 'address' | 'birthdate';

// Wizard step types
export interface WizardStep {
  step: number;
  title: string;
  description: string;
  isCompleted: boolean;
}

// Form data types
export interface OnboardingFormData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  aboutMe?: string;
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  birthdate?: string;
} 