import { NextResponse } from 'next/server';

// This runs SERVER-SIDE - LinkedIn redirects here, we exchange code once, then redirect to dashboard
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.redirect(new URL(`/?auth_error=${encodeURIComponent(error)}`, request.url));
  }

  if (!code) {
    return NextResponse.redirect(new URL('/?auth_error=no_code', request.url));
  }

  try {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002/api';
    const res = await fetch(`${apiBaseUrl}/auth/linkedin/callback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });

    if (!res.ok) {
      const err = await res.json();
      return NextResponse.redirect(
        new URL(`/?auth_error=${encodeURIComponent(err.error || 'auth_failed')}`, request.url)
      );
    }

    const data = await res.json();

    if (!data.success || !data.data?.user) {
      return NextResponse.redirect(new URL('/?auth_error=invalid_response', request.url));
    }

    const { user, token } = data.data;
    const userToStore = {
      ...user,
      fullName: user.fullName || `${user.firstName} ${user.lastName}`,
      profile: { isOnboardingComplete: true },
    };

    // Pass data to client via query params (token + user as base64)
    const userData = Buffer.from(JSON.stringify({ user: userToStore, token })).toString('base64');
    return NextResponse.redirect(new URL(`/auth/success?d=${userData}`, request.url));

  } catch (err) {
    console.error('Auth callback error:', err);
    return NextResponse.redirect(
      new URL(`/?auth_error=${encodeURIComponent(err.message)}`, request.url)
    );
  }
}
