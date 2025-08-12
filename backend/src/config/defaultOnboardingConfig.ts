export interface DefaultConfigItem {
  page: number;
  component: string;
  order: number;
  description?: string;
}

export const DEFAULT_ONBOARDING_CONFIG: DefaultConfigItem[] = [
  // Page 2: Personal Information
  { 
    page: 2, 
    component: 'aboutMe', 
    order: 0,
    description: 'About Me section for personal introduction'
  },
  // Page 3: Additional Details
  { 
    page: 3, 
    component: 'address', 
    order: 0,
    description: 'Address information for user profile'
  }
];

export const getDefaultConfigForPage = (pageNumber: number): DefaultConfigItem[] => {
  return DEFAULT_ONBOARDING_CONFIG.filter(config => config.page === pageNumber);
};

export const getAllDefaultConfigs = (): DefaultConfigItem[] => {
  return [...DEFAULT_ONBOARDING_CONFIG];
};