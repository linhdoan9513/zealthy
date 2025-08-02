// User types
export interface CreateUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
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

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  aboutMe?: string;
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  birthdate?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Onboarding configuration types
export interface OnboardingConfig {
  id: string;
  page: number;
  component: 'aboutMe' | 'address' | 'birthdate';
  order: number;
  createdAt: Date;
  updatedAt: Date;
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

export interface ComponentConfig {
  aboutMe: {
    label: string;
    placeholder: string;
  };
  address: {
    street: { label: string; placeholder: string };
    city: { label: string; placeholder: string };
    state: { label: string; placeholder: string };
    zip: { label: string; placeholder: string };
  };
  birthdate: {
    label: string;
  };
} 