// src/app/login/api/route.tsx

import { NextResponse } from 'next/server';
import { loginUser } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    const loginResult = await loginUser({ email, password });
    const { token, user } = loginResult;
    
    const res = NextResponse.json({ user });

    res.cookies.set('token', String(token), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return res;
  } catch (error: unknown) {
    let message = 'Invalid credentials';
    if (error instanceof Error && error.message) {
      message = error.message;
    }
    return NextResponse.json(
      { message },
      { status: 401 }
    );
  }
}
