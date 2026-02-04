import { NextResponse } from "next/server";

// Handle POST requests (from callback page)
export async function POST(request) {
  try {
    const { code, state } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: "Authorization code is required" },
        { status: 400 }
      );
    }

    // Verify state parameter (basic format check)
    // Note: Full validation should be done client-side against localStorage
    if (!state || !state.startsWith("socialsonic-auth-")) {
      return NextResponse.json(
        { error: "Invalid state parameter format" },
        { status: 400 }
      );
    }

    const clientId = process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID;
    const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
    const redirectUri = process.env.NEXT_PUBLIC_LINKEDIN_REDIRECT_URI;

    if (!clientId || !clientSecret) {
      return NextResponse.json(
        { error: "LinkedIn OAuth credentials not configured" },
        { status: 500 }
      );
    }

    // Exchange authorization code for access token
    const tokenResponse = await fetch(
      "https://www.linkedin.com/oauth/v2/accessToken",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
        }),
      }
    );

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error("LinkedIn token exchange failed:", errorData);
      return NextResponse.json(
        { error: "Failed to exchange authorization code" },
        { status: 400 }
      );
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Get user profile information using OpenID Connect userinfo endpoint
    // This is the new LinkedIn OAuth 2.0 standard endpoint
    const profileResponse = await fetch(
      "https://api.linkedin.com/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!profileResponse.ok) {
      const errorText = await profileResponse.text();
      console.error("Failed to fetch LinkedIn profile:", {
        status: profileResponse.status,
        statusText: profileResponse.statusText,
        error: errorText,
      });

      // Fallback: Create user with minimal data
      const fallbackUser = {
        id: `linkedin-${Date.now()}`,
        firstName: "LinkedIn",
        lastName: "User",
        email: `user-${Date.now()}@linkedin.com`,
        profilePicture: null,
        accessToken,
        connectedAt: new Date().toISOString(),
        isDemoMode: false,
        platform: "linkedin",
        note: "Profile data unavailable - using fallback",
      };

      return NextResponse.json({
        success: true,
        user: fallbackUser,
        message: "Authenticated with LinkedIn (limited profile data)",
        warning: "Could not fetch full profile data",
      });
    }

    const profileData = await profileResponse.json();
    console.log("LinkedIn profile data received:", {
      hasData: !!profileData,
      fields: Object.keys(profileData),
    });

    // OpenID Connect userinfo response includes:
    // sub (user ID), given_name, family_name, email, picture
    // No need for separate email API call!

    // Create user object with fallbacks
    const user = {
      id: profileData.sub || `linkedin-${Date.now()}`,
      linkedinId: profileData.sub,
      firstName:
        profileData.given_name || profileData.name?.split(" ")[0] || "LinkedIn",
      lastName:
        profileData.family_name ||
        profileData.name?.split(" ").slice(1).join(" ") ||
        "User",
      email: profileData.email || `user-${Date.now()}@linkedin.com`,
      profilePicture: profileData.picture || null,
      accessToken,
      connectedAt: new Date().toISOString(),
      isDemoMode: false,
      platform: "linkedin",
    };

    // Here you could save the user to your database
    // await saveUserToDatabase(user);

    return NextResponse.json({
      success: true,
      user,
      accessToken, // Include access token in response
      linkedinId: profileData.sub,
      message: "Successfully authenticated with LinkedIn",
    });
  } catch (error) {
    console.error("LinkedIn callback error:", error);
    return NextResponse.json(
      { error: "Internal server error during authentication" },
      { status: 500 }
    );
  }
}
