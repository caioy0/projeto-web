// @/app/api/auth/status/route.ts
import { NextRequest, NextResponse } from 'next/server';
// import { getToken } from 'next-auth/jwt'; // NextAuth.js

export async function GET(request: NextRequest) {
  try {
    // NextAuth.js:
    // const token = await getToken({ req: request });
    // const isAuthenticated = !!token;
    
    // For custom session management, check your session/token
    const sessionToken = request.cookies.get('session')?.value;
    const isAuthenticated = !!sessionToken; // Simple check
    
    return NextResponse.json({ isAuthenticated });
  } catch {
    return NextResponse.json(
      { isAuthenticated: false, error: 'Failed to check authentication status' },
      { status: 500 }
    );
  }
}