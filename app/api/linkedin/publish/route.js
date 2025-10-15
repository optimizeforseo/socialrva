import { NextResponse } from "next/server";
import linkedinService from "../../../services/linkedinService";

export async function POST(request) {
  try {
    const { content, userId, accessToken } = await request.json();

    if (!content || !userId || !accessToken) {
      return NextResponse.json(
        { error: "Content, userId, and accessToken are required" },
        { status: 400 }
      );
    }

    // Validate the access token first
    const isValidToken = await linkedinService.validateToken(accessToken);
    if (!isValidToken) {
      return NextResponse.json(
        { error: "Invalid or expired access token. Please re-authenticate." },
        { status: 401 }
      );
    }

    // Create the LinkedIn post
    const result = await linkedinService.createPost(
      accessToken,
      content,
      userId
    );

    return NextResponse.json({
      success: true,
      postId: result.id,
      message: "Post published successfully to LinkedIn",
    });
  } catch (error) {
    console.error("LinkedIn publish error:", error);

    // Handle specific LinkedIn API errors
    if (error.message.includes("Invalid access token")) {
      return NextResponse.json(
        {
          error: "Access token expired. Please re-authenticate with LinkedIn.",
        },
        { status: 401 }
      );
    }

    if (error.message.includes("Rate limit")) {
      return NextResponse.json(
        { error: "LinkedIn API rate limit exceeded. Please try again later." },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: "Failed to publish to LinkedIn. Please try again." },
      { status: 500 }
    );
  }
}
