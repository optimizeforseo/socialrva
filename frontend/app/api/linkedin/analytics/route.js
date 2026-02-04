import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const accessToken = searchParams.get("accessToken");
    const userId = searchParams.get("userId");

    if (!accessToken || !userId) {
      return NextResponse.json(
        { error: "Access token and userId are required" },
        { status: 400 }
      );
    }

    // Fetch profile statistics
    const statsResponse = await fetch(
      `https://api.linkedin.com/v2/networkSizes/urn:li:person:${userId}?edgeType=CompanyFollowedByMember`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    let followers = 0;
    if (statsResponse.ok) {
      const statsData = await statsResponse.json();
      followers = statsData.firstDegreeSize || 0;
    }

    // Note: LinkedIn's API has limited analytics access
    // Most analytics require specific permissions and are only available for organization pages
    // For personal profiles, we can only get basic connection counts

    return NextResponse.json({
      success: true,
      data: {
        followers,
        connections: followers, // For personal profiles, these are the same
        profileViews: null, // Requires additional permissions
        postImpressions: null, // Requires additional permissions
        engagement: null, // Requires additional permissions
        note: "Full analytics require LinkedIn Marketing Developer Platform access",
      },
    });
  } catch (error) {
    console.error("LinkedIn analytics fetch error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch LinkedIn analytics",
        note: "Using demo data instead",
      },
      { status: 500 }
    );
  }
}
