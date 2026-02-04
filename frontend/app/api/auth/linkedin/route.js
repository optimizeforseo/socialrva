import { NextResponse } from "next/server";

export async function GET(request) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  // Handle OAuth errors
  if (error) {
    console.error("LinkedIn OAuth Error:", error, errorDescription);

    // Handle specific error types
    if (error === "unauthorized_scope_error") {
      return NextResponse.redirect(
        new URL(
          "/auth/error?type=scope&message=Please enable required permissions in your LinkedIn Developer App. Go to Products tab and add 'Sign In with LinkedIn' and 'Share on LinkedIn'.",
          request.url
        )
      );
    }

    if (error === "access_denied") {
      return NextResponse.redirect(
        new URL(
          "/auth/error?type=denied&message=You denied access to LinkedIn. Please try again and approve the permissions.",
          request.url
        )
      );
    }

    return NextResponse.redirect(
      new URL(
        `/auth/error?type=unknown&message=${encodeURIComponent(
          errorDescription || error
        )}`,
        request.url
      )
    );
  }

  if (!code) {
    return NextResponse.redirect(
      new URL(
        "/auth/error?type=no_code&message=No authorization code received from LinkedIn",
        request.url
      )
    );
  }

  try {
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
          client_id: process.env.LINKEDIN_CLIENT_ID,
          client_secret: process.env.LINKEDIN_CLIENT_SECRET,
          redirect_uri: process.env.LINKEDIN_REDIRECT_URI,
        }),
      }
    );

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error("Token Exchange Error:", errorData);
      throw new Error(
        errorData.error_description || "Failed to exchange code for token"
      );
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Get user profile using OpenID Connect userinfo endpoint
    const profileResponse = await fetch(
      "https://api.linkedin.com/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!profileResponse.ok) {
      console.error("Profile fetch failed:", profileResponse.status);
      throw new Error("Failed to get user profile from LinkedIn");
    }

    const profile = await profileResponse.json();

    // Create user data object
    const userData = {
      id: profile.sub,
      email: profile.email,
      firstName: profile.given_name || "User",
      lastName: profile.family_name || "",
      profilePicture: profile.picture || null,
      accessToken: accessToken,
      isDemoMode: false,
      linkedInId: profile.sub,
      createdAt: new Date().toISOString(),
    };

    // Store in localStorage (client-side will handle this)
    const dashboardUrl = new URL("/dashboard", request.url);
    dashboardUrl.searchParams.set("user", JSON.stringify(userData));

    const response = NextResponse.redirect(dashboardUrl);

    // Also set as cookie for server-side access
    response.cookies.set("user", JSON.stringify(userData), {
      httpOnly: false, // Allow client-side access
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("LinkedIn Authentication Error:", error);
    return NextResponse.redirect(
      new URL(
        `/auth/error?type=auth_failed&message=${encodeURIComponent(
          error.message
        )}`,
        request.url
      )
    );
  }
}
