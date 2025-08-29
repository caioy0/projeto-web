// src/lib/auth.ts
'use server'; // Mark this as a server-only utility

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db'; // Your DB connection
import { LoginUserInput, RegisterUserInput } from '@/types';

// A secret key for JWT signing. Use a strong key from environment variables.
const JWT_SECRET = process.env.JWT_SECRET!;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not set.');
}

// Hash a password (for user registration)
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12; // The cost factor for hashing
  return await bcrypt.hash(password, saltRounds);
}

// Compare a password with a hash (for user login)
export async function verifyPassword(
  plainTextPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
}

// Create a JWT token for a user
export async function createToken(payload: { userId: string }): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      // jwt.sign is synchronous, but we wrap it in a Promise for consistency
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
      resolve(token);
    } catch (error) {
      // Reject the promise if signing fails (e.g., invalid payload)
      reject(new Error('Failed to create authentication token'));
    }
  });
}

// Verify a JWT token and return the payload
export async function verifyToken(token: string): Promise<{ userId: string }> {
  return new Promise((resolve, reject) => {
    try {
      // jwt.verify is synchronous, but we wrap it in a Promise
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      resolve(decoded);
    } catch (error) {
      // Reject the promise if verification fails
      reject(new Error('Invalid or expired token'));
    }
  });
}

// --- Core Authentication Functions --- //

// 1. Register a new user
export async function registerUser(userData: RegisterUserInput): Promise<void> {
  const { email, password, name } = userData;

  // Check if user already exists
  const existingUser = await db.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (existingUser) {
    throw new Error('A user with this email already exists.');
  }

  // Hash the password
  const hashedPassword = await hashPassword(password);

  // Create the user in the database
  await db.user.create({
    data: {
      email: email.toLowerCase(), // Store email in lowercase for consistency
      name,
      password: hashedPassword,
    },
  });
}

// 2. Login a user (verify credentials)
export async function loginUser(
  credentials: LoginUserInput
): Promise<{ token: string; user: { id: string; email: string; name: string } }> {
  const { email, password } = credentials;

  // Find the user by email
  const user = await db.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  // If user doesn't exist or password is wrong, throw error
  if (!user || !(await verifyPassword(password, user.password))) {
    throw new Error('Invalid email or password.');
  }

  // Create a JWT token - NOW WE MUST 'AWAIT' IT
  const token = await createToken({ userId: user.id }); // <-- Added 'await' here

  // Return the token and user info (excluding the password hash)
  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
  };
}

// 3. Get the current user from a JWT token
export async function getCurrentUser(token: string | undefined) {
  if (!token) return null;

  try {
    // Now we can 'await' the verification because it's an async function
    const decoded = await verifyToken(token);
    const user = await db.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, name: true },
    });
    return user;
  } catch (error) {
    return null;
  }
}