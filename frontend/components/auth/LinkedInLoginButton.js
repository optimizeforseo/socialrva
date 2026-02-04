"use client";

export default function LinkedInLoginButton({ className = "" }) {
  const handleLogin = () => {
    // Get environment variables
    const clientId = process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID;
    const redirectUri = encodeURIComponent(
      process.env.NEXT_PUBLIC_LINKEDIN_REDIRECT_URI ||
        `${window.location.origin}/auth/callback`
    );

    // Check if credentials are configured
    if (!clientId) {
      alert(
        "LinkedIn OAuth is not configured. Please set NEXT_PUBLIC_LINKEDIN_CLIENT_ID in your .env.local file.\n\nFor now, you can use Demo Mode to explore the app."
      );
      return;
    }

    // Required scopes - MUST match what's enabled in LinkedIn Developer App
    // openid, profile, email = Sign In with LinkedIn (required)
    // w_member_social = Share on LinkedIn (for posting)
    const scopes = encodeURIComponent("openid profile email w_member_social");

    // Generate random state for CSRF protection with expected prefix
    const state = `socialrva-auth-${Math.random().toString(36).substring(7)}`;
    localStorage.setItem("linkedin_oauth_state", state);

    // Build LinkedIn OAuth URL
    const authUrl =
      `https://www.linkedin.com/oauth/v2/authorization?` +
      `response_type=code&` +
      `client_id=${clientId}&` +
      `redirect_uri=${redirectUri}&` +
      `scope=${scopes}&` +
      `state=${state}`;

    console.log("Redirecting to LinkedIn OAuth:", {
      clientId: clientId.substring(0, 10) + "...",
      redirectUri: decodeURIComponent(redirectUri),
      scopes: decodeURIComponent(scopes),
    });

    // Redirect to LinkedIn
    window.location.href = authUrl;
  };

  return (
    <button
      onClick={handleLogin}
      className={`flex items-center justify-center space-x-3 w-full bg-[#0A66C2] hover:bg-[#004182] text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 ${className}`}
    >
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.771v20.451C0 23.2.774 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
      </svg>
      <span>Sign in with LinkedIn</span>
    </button>
  );
}