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

    // Note: LinkedIn's API has very limited analytics access for personal profiles
    // Most analytics require LinkedIn Marketing Developer Platform access
    // We'll fetch what we can and use demo data for unavailable metrics

    let profileData = {};
    let connectionCount = 0;

    // Fetch basic profile info
    try {
      const profileResponse = await fetch("https://api.linkedin.com/v2/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (profileResponse.ok) {
        profileData = await profileResponse.json();
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }

    // Fetch connection count
    try {
      const connectionsResponse = await fetch(
        `https://api.linkedin.com/v2/networkSizes/urn:li:person:${userId}?edgeType=CompanyFollowedByMember`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (connectionsResponse.ok) {
        const connectionsData = await connectionsResponse.json();
        connectionCount = connectionsData.firstDegreeSize || 0;
      }
    } catch (error) {
      console.error("Error fetching connections:", error);
    }

    // Return available data with demo data for unavailable metrics
    return NextResponse.json({
      success: true,
      data: {
        profile: {
          firstName: profileData.localizedFirstName || profileData.firstName,
          lastName: profileData.localizedLastName || profileData.lastName,
          id: profileData.id,
        },
        stats: {
          followers: connectionCount,
          connections: connectionCount,
          // These require Marketing API access - using demo data
          impressions: null,
          engagementRate: null,
          profileViews: null,
          postViews: null,
        },
        note: "Full analytics require LinkedIn Marketing Developer Platform access. Showing available data with demo metrics.",
      },
    });
  } catch (error) {
    console.error("LinkedIn stats fetch error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch LinkedIn stats",
        note: "Using demo data instead",
      },
      { status: 500 }
    );
  }
}
