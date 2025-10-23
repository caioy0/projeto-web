import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Clear the authentication cookie
    const response = NextResponse.json({ message: 'Logged out successfully' });
    
    // If using cookies for authentication
    response.cookies.set('session', '', {
      expires: new Date(0),
      path: '/',
    });
    
    // If using NextAuth.js, you might need different approach
    // await signOut({ redirect: false });
    
    return response;
  } catch {
    return NextResponse.json(
      { error: 'Failed to logout' },
      { status: 500 }
    );
  }
}