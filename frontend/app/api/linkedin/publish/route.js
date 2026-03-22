import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { content, userId, accessToken } = await request.json();

    if (!content) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    // Development mode with no token - mock publish
    if (!accessToken || accessToken === 'dev_mock_token_not_real') {
      console.log("📝 Mock LinkedIn publish (no real token):", {
        userId,
        contentPreview: content.substring(0, 100) + "...",
      });

      return NextResponse.json({
        success: true,
        postId: "mock_post_" + Date.now(),
        message: "Post published successfully (mock - connect LinkedIn for real posts)",
        mock: true,
      });
    }

    // Production - real LinkedIn API call
    const clientId = process.env.LINKEDIN_CLIENT_ID;
    const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return NextResponse.json(
        { error: "LinkedIn OAuth not configured" },
        { status: 500 }
      );
    }

    // Get user profile to get LinkedIn URN
    const profileRes = await fetch("https://api.linkedin.com/v2/userinfo", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!profileRes.ok) {
      return NextResponse.json(
        { error: "Invalid or expired access token. Please re-authenticate." },
        { status: 401 }
      );
    }

    const profile = await profileRes.json();
    const authorUrn = `urn:li:person:${profile.sub}`;

    // Publish post to LinkedIn
    const publishRes = await fetch(
      "https://api.linkedin.com/v2/ugcPosts",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "X-Restli-Protocol-Version": "2.0.0",
        },
        body: JSON.stringify({
          author: authorUrn,
          lifecycleState: "PUBLISHED",
          specificContent: {
            "com.linkedin.ugc.ShareContent": {
              shareCommentary: { text: content },
              shareMediaCategory: "NONE",
            },
          },
          visibility: {
            "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
          },
        }),
      }
    );

    if (!publishRes.ok) {
      const err = await publishRes.json();
      throw new Error(err.message || "LinkedIn publish failed");
    }

    const result = await publishRes.json();

    return NextResponse.json({
      success: true,
      postId: result.id,
      message: "Post published successfully to LinkedIn",
    });
  } catch (error) {
    console.error("LinkedIn publish error:", error);

    if (error.message?.includes("token")) {
      return NextResponse.json(
        { error: "Access token expired. Please re-authenticate with LinkedIn." },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Failed to publish to LinkedIn. Please try again." },
      { status: 500 }
    );
  }
}
