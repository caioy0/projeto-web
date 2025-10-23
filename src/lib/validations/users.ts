// src/lib/users.ts
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const ERROR_MESSAGES = {
  USER_EXISTS: 'User already exists with this email',
  INVALID_EMAIL: 'Please provide a valid email address',
  PASSWORD_TOO_WEAK: 'Password must be at least 8 characters with uppercase, lowercase, number and special character',
  USER_NOT_FOUND: 'User not found',
  UNAUTHORIZED: 'Unauthorized access'
};

export interface UserCreateInput {
  name: string;
  email: string;
  password: string;
}

export class UserValidator {
  static validateCreateInput(input: UserCreateInput): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!input.name || input.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters long');
    }
    
    if (!this.isValidEmail(input.email)) {
      errors.push(ERROR_MESSAGES.INVALID_EMAIL);
    }
    
    if (!this.isValidPassword(input.password)) {
      errors.push(ERROR_MESSAGES.PASSWORD_TOO_WEAK);
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  static isValidPassword(password: string): boolean {
    return PASSWORD_REGEX.test(password);
  }
}