import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: "Authorization code is required" },
        { status: 400 }
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
          code: code,
          client_id: process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID,
          client_secret: process.env.LINKEDIN_CLIENT_SECRET,
          redirect_uri: `${process.env.NEXTAUTH_URL}/auth/callback`,
        }),
      }
    );

    if (!tokenResponse.ok) {
      throw new Error("Failed to exchange code for token");
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Get user profile information
    const profileResponse = await fetch(
      "https://api.linkedin.com/v2/people/~:(id,firstName,lastName,profilePicture(displayImage~:playableStreams))",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!profileResponse.ok) {
      throw new Error("Failed to fetch user profile");
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
      email = emailData.elements?.[0]?.["handle~"]?.emailAddress;
    }

    // Create user object
    const user = {
      id: profileData.id,
      firstName: profileData.firstName?.localized?.en_US || "",
      lastName: profileData.lastName?.localized?.en_US || "",
      email: email,
      profilePicture:
        profileData.profilePicture?.displayImage?.elements?.[0]
          ?.identifiers?.[0]?.identifier,
      accessToken: accessToken,
      connectedAt: new Date().toISOString(),
    };

    // Here you would typically save the user to your database
    // For now, we'll just return the user data

    return NextResponse.json({
      success: true,
      user: user,
    });
  } catch (error) {
    console.error("LinkedIn auth error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}
