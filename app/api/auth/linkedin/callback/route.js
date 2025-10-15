import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { code, state } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: "Authorization code is required" },
        { status: 400 }
      );
    }

    // Verify state parameter
    if (!state || !state.startsWith("socialsonic-auth-")) {
      return NextResponse.json(
        { error: "Invalid state parameter" },
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

    // Get user profile information
    const profileResponse = await fetch("https://api.linkedin.com/v2/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!profileResponse.ok) {
      console.error("Failed to fetch LinkedIn profile");
      return NextResponse.json(
        { error: "Failed to fetch user profile" },
        { status: 400 }
      );
    }

    const profileData = await profileResponse.json();

    // Get user email
    const emailResponse = await fetch(
      "https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    let email = null;
    if (emailResponse.ok) {
      const emailData = await emailResponse.json();
      if (emailData.elements && emailData.elements.length > 0) {
        email = emailData.elements[0]["handle~"].emailAddress;
      }
    }

    // Create user object
    const user = {
      id: profileData.id,
      firstName: profileData.localizedFirstName || "LinkedIn",
      lastName: profileData.localizedLastName || "User",
      email: email || `${profileData.id}@linkedin.com`,
      profilePicture: profileData.profilePicture?.displayImage || null,
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
