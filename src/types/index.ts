// src/types/index.ts
export interface User {
  id: string;
  email: string;
  name: string;
  password: string; 
}

// The shape of the data we expect for registration
export interface RegisterUserInput {
  email: string;
  password: string;
  name: string;
}

// The shape of the data we expect for login
export interface LoginUserInput {
  email: string;
  password: string;
}