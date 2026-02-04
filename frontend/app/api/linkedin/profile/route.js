import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const accessToken = searchParams.get("accessToken");

    if (!accessToken) {
      return NextResponse.json(
        { error: "Access token is required" },
        { status: 400 }
      );
    }

    // Fetch basic profile information
    const profileResponse = await fetch("https://api.linkedin.com/v2/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!profileResponse.ok) {
      throw new Error("Failed to fetch LinkedIn profile");
    }

    const profileData = await profileResponse.json();

    // Fetch profile picture
    let profilePicture = null;
    try {
      const pictureResponse = await fetch(
        "https://api.linkedin.com/v2/me?projection=(id,profilePicture(displayImage~:playableStreams))",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (pictureResponse.ok) {
        const pictureData = await pictureResponse.json();
        const elements =
          pictureData.profilePicture?.["displayImage~"]?.elements;
        if (elements && elements.length > 0) {
          // Get the largest image
          const largestImage = elements[elements.length - 1];
          profilePicture = largestImage.identifiers?.[0]?.identifier || null;
        }
      }
    } catch (error) {
      console.error("Error fetching profile picture:", error);
    }

    // Fetch email address
    let email = null;
    try {
      const emailResponse = await fetch(
        "https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (emailResponse.ok) {
        const emailData = await emailResponse.json();
        email = emailData.elements?.[0]?.["handle~"]?.emailAddress || null;
      }
    } catch (error) {
      console.error("Error fetching email:", error);
    }

    return NextResponse.json({
      success: true,
      data: {
        id: profileData.id,
        firstName: profileData.localizedFirstName || profileData.firstName,
        lastName: profileData.localizedLastName || profileData.lastName,
        profilePicture,
        email,
      },
    });
  } catch (error) {
    console.error("LinkedIn profile fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch LinkedIn profile" },
      { status: 500 }
    );
  }
}
