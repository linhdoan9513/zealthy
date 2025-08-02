/**
 * Formats a user's full name from firstName and lastName
 * @param firstName - User's first name
 * @param lastName - User's last name
 * @returns Formatted full name or fallback text
 */
export const formatFullName = (firstName?: string, lastName?: string): string => {
  if (!firstName && !lastName) {
    return 'Not provided';
  }
  
  return [firstName, lastName].filter(Boolean).join(' ');
};

/**
 * Formats a user's display name with fallback to email if no name is provided
 * @param firstName - User's first name
 * @param lastName - User's last name
 * @param email - User's email (fallback)
 * @returns Formatted display name
 */
export const formatDisplayName = (firstName?: string, lastName?: string, email?: string): string => {
  const fullName = formatFullName(firstName, lastName);
  
  if (fullName === 'Not provided' && email) {
    return email;
  }
  
  return fullName;
}; 