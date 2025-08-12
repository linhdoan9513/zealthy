import { OnboardingConfig, UpdateUserRequest, OnboardingFormData } from '@/types';

export const mapConfigToUpdateData = (
  config: OnboardingConfig[],
  formData: OnboardingFormData
): UpdateUserRequest => {
  const updateData: UpdateUserRequest = {};

  config.forEach(comp => {
    switch (comp.component) {
      case 'aboutMe':
        if (formData.aboutMe) {
          updateData.aboutMe = formData.aboutMe;
        }
        break;
      case 'address':
        if (formData.street || formData.city || formData.state || formData.zip) {
          updateData.street = formData.street;
          updateData.city = formData.city;
          updateData.state = formData.state;
          updateData.zip = formData.zip;
        }
        break;
      case 'birthdate':
        if (formData.birthdate) {
          updateData.birthdate = formData.birthdate;
        }
        break;
    }
  });

  return updateData;
};